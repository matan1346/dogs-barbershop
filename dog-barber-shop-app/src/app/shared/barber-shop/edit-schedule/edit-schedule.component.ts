import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BarberClient } from 'src/app/core/models/barber-client.model';
import { ScheduleClient, ScheduleStatus } from 'src/app/core/models/schedule-client.model';
import { APIService } from 'src/app/core/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { BarberShopModule } from '../barber-shop.module';

export interface TimeSelect {
  display: string;
  value: number;
}

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent implements OnInit, OnDestroy {
  // form group of schedule form
  scheduleForm: FormGroup;
  // current user object
  authClient: BarberClient;
  // current schedule object
  scheduleClient: ScheduleClient = {scheduleID: 0, clientID: 0, scheduleTime: null, registeredRecord: null, client: null};

  // create mode is true when the component is used to create new schedule item, false -> edit existing schedule item
  createMode: boolean = false;

  // setters by dialogs
  dialogUser: BehaviorSubject<BarberClient> = new BehaviorSubject<BarberClient>(null);
  dialogSchedule: BehaviorSubject<ScheduleClient> = new BehaviorSubject<ScheduleClient>(null);
  dialogModeCreate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // list of subscribers
  subscribersList: Subscription[] = [];



  // hours available
  hours: TimeSelect[] = [
    {display: '08', value: 8},
    {display: '09', value: 9},
    {display: '10', value: 10},
    {display: '11', value: 11},
    {display: '12', value: 12},
    {display: '13', value: 13},
    {display: '14', value: 14},
    {display: '15', value: 15},
    {display: '16', value: 16},
  ];

  // minutes avialable
  minutes: TimeSelect[] = [
    {display: '00', value: 0},
    {display: '10', value: 10},
    {display: '20', value: 20},
    {display: '30', value: 30},
    {display: '40', value: 40},
    {display: '50', value: 50}
  ];


  constructor(
    private formBuild: FormBuilder,
    private authenticationService: AuthenticationService,
    private apiService: APIService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<EditScheduleComponent>,
    private notificationService: NotificationService
    ) { }

  ngOnInit(): void {

    // setting up the form with empty values
    this.scheduleForm = this.formBuild.group({
      scheduleDate: ['',Validators.required],
      selectTimeHour: ['', Validators.required],
      selectTimeMinute: ['', Validators.required]
    });

    // subscribe to dialog user changed current user
    this.subscribersList.push(this.dialogUser.subscribe( x => {
      this.authClient = x;
    }));

    // subscribe to dialog schedule changed current schedule
    this.subscribersList.push(this.dialogSchedule.subscribe( x => {
      this.scheduleClient = x;

      // if edit existing schedule mode -> set the date and time values in the form
      if(!this.createMode){
        let scheduleT =  formatDate(this.scheduleClient.scheduleTime,'HH:mm','en');
        let scheduleD =  this.scheduleClient.scheduleTime;

        // setting date picker
        //this.scheduleForm.controls['scheduleTime'].setValue(scheduleT);
        this.scheduleForm.controls['scheduleDate'].setValue(scheduleD);

        // setting hour and minute time
        let splitTime = scheduleT.split(':');
        this.scheduleForm.controls['selectTimeHour'].setValue(splitTime[0]);
        this.scheduleForm.controls['selectTimeMinute'].setValue(splitTime[1]);
      }
    }));

    // subscribe to dialog create mode changed create mode
    this.subscribersList.push(this.dialogModeCreate.subscribe(x => {
      this.createMode = x;
    }));

    // subscribe to authenticate of current user object logged in
    this.subscribersList.push(this.authenticationService.getLoggedClient().subscribe(x => {
      // if not logged in/ current user object is not set or null -> cannot edit or create without being logged in
      if(!x)
      {
        this.notificationService.Error('Cannot edit/create without login');
        this.router.navigate(['login']);
      }
      else{
        // else, if current user object is authenticate, than set the local user as authenticate user
        this.authClient = x;
      }
    }));

    // subcribe to activated params in the url, if schedule id exists -> than use its value to get schedule item
    this.subscribersList.push(this.activatedRoute.params.subscribe(p => {
      // if schedule id pram exists -> use its value to get schedule item
      if(p.hasOwnProperty('schedule_id'))
      {
        let scheduleID = p['schedule_id'];
        // subscribe to list of schedule items
        this.subscribersList.push(this.apiService.getSchedulesList().subscribe( x => {
          // search for specific index by schedule id
          let index = x.findIndex(s => s.scheduleID == scheduleID);
          // if schedule id was not found -> navigate to list clients
          if(index < 0)
          {
            this.notificationService.Error("schedule id " + scheduleID + 'does not exist');
            this.router.navigate(['list-clients']);
          }
          else // else -> update current schedule object
            this.dialogSchedule.next(x[index]);

        }));
      }
      else if(!this.scheduleClient) { // for dialog not reset to create mode
        this.dialogModeCreate.next(true);
      }
    }));
  }

  ngOnDestroy(): void{
    this.subscribersList.map(x => x.unsubscribe());
  }

  // getting the date time concat by date & time
  getDateTime(dateString, timeString): Date{
    // dateString : format = 2020-02-23 (yyyy-MM-dd)
    // timeString : format = 14:53 (HH:mm)
    let s =dateString + 'T' + timeString;
    return new Date(s);
 }

  // sending actions | create / update
  OnSend(): void{
    // if from is not valid -> return and do nothing
    if(!this.scheduleForm.valid)
      return;

    // build time  format -> HH:mm
    let selectedTime = this.scheduleForm.value.selectTimeHour + ':' + this.scheduleForm.value.selectTimeMinute;

    // getting Date object from datepicker with time
    let dateTime: Date = this.getDateTime(formatDate(this.scheduleForm.value.scheduleDate,'yyyy-MM-dd','en'), selectedTime);

    // call the correct action
    if(this.createMode)
      this.OnCreate(dateTime); // calling create schedule
    else
      this.OnUpdate(dateTime); // calling update scgedule
  }

  // create new schedule item via server, check before if logged in and scheduleTime is not already taken by others, if yes -> do not create
  async OnCreate(dateTime:Date): Promise<void>{
      // perform put schedule
      let res = await this.apiService.PutSchedule({ClientID: this.authClient.clientID, ScheduleTime: dateTime});
      // getting status message
      let statusMessage = this.apiService.getResonseText(res);

      // printing status to screen
      //console.log('create schedule status: ' + statusMessage);


      // if status is ok -> close dialog if need to/navigate
      if(res == ScheduleStatus.OK){
        this.notificationService.Success('New schedule has been added: ' + formatDate(dateTime, 'dd/MM/yyyy HH:mm', 'en'));
        if(this.dialogRef)
          this.dialogRef.close();
        this.router.navigate(['list-clients']);
      }
      else{
        this.notificationService.Error(statusMessage);
      }
  }

  // create new schedule item via server, check before if logged in and scheduleTime is not already taken by others, if yes -> do not create
  async OnUpdate(dateTime:Date): Promise<void>{
      // perform update schedule item
      let res = await this.apiService.EditSchedule({ClientID: this.scheduleClient.scheduleID, ScheduleTime: dateTime});
      // getting status message
      let statusMessage = this.apiService.getResonseText(res);

      // printing status to screen
      console.log('update schedule status: ' + statusMessage);

      // if status is ok -> close dialog if need to/navigate
      if(res == ScheduleStatus.OK){
        this.notificationService.Success('The time schedule has been updated to ' + formatDate(dateTime, 'dd/MM/yyyy HH:mm', 'en'));
        if(this.dialogRef)
          this.dialogRef.close();
        this.router.navigate(['list-clients']);
      }else{
        this.notificationService.Error(statusMessage);
      }
    }
}
