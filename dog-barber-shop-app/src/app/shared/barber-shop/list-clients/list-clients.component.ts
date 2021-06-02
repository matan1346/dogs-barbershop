import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BarberClient } from 'src/app/core/models/barber-client.model';
import { ScheduleClient, ScheduleStatus } from 'src/app/core/models/schedule-client.model';
import { APIService } from 'src/app/core/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { EditScheduleComponent } from '../edit-schedule/edit-schedule.component';
import { ViewScheduleComponent } from '../view-schedule/view-schedule.component';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent implements OnInit {

  // schedule list from server
  scheduleList: ScheduleClient[] = null;
  // current user object
  authClient: BarberClient= null;
  // display columns
  displayedColumns: string[] = ['scheduleID', 'Name', 'time', 'registered','actions'];

  constructor(
    private apiService: APIService,
    private authenticationService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog
    ) { }

  async ngOnInit(): Promise<void> {

    // subscribe to authenticate user if current user object is logged in
    this.authenticationService.getLoggedClient().subscribe(x => {
      this.authClient = x;
    })

    // load list of schedules via server
    await this.apiService.loadListSchedules();
    // subscribe to schedule server list
    this.apiService.getSchedulesList().subscribe(schList => {
      this.scheduleList = schList;
    })
  }

  // action button - create - open dialog for create new schedule
  CreateScheduleClient(): void{
    // use edit component for dialog
    let dialogRef = this.dialog.open(EditScheduleComponent);
    let instance = dialogRef.componentInstance;

    // set the create mode in edit component to be true
    instance.dialogModeCreate.next(true);
    // set user in edit component to be authClient
    instance.dialogUser.next(this.authClient);
    // set schedule item in edit component to be blank (new item)
    instance.dialogSchedule.next({scheduleID: 0, clientID: 0, scheduleTime: null, registeredRecord: null, client: this.authClient});
  }

  // action button - view - open dialog for view selected schedule
  ViewClient(client: ScheduleClient): void{
    // use view component for dialog
    let dialogRef = this.dialog.open(ViewScheduleComponent);
    let instance = dialogRef.componentInstance;
    // set schedule item in view component to be loaded for view
    instance.dialogSchedule.next(client);
  }

  // action button - edit - open dialog for edit selected schedule
  EditScheduleClient(client: ScheduleClient): void{
    // use edit component for dialog
    let dialogRef = this.dialog.open(EditScheduleComponent);
    let instance = dialogRef.componentInstance;

    // set schedule item in edit component loaded for update
    instance.dialogSchedule.next(client);
    // set user in edit component to be authClient
    instance.dialogUser.next(this.authClient);
    // set the create mode in edit component to be false
    instance.dialogModeCreate.next(false);
  }

  // action button - edit - perform delete from server by scheduleID
  async DeleteScheduleClient(client: ScheduleClient): Promise<void> {
    // perform delete
    let res = await this.apiService.DeleteSchedule(client.scheduleID);
    // get status message text
    let statusMessage = this.apiService.getResonseText(res);
    // print the status message
    console.log('delete schedule status: ' + statusMessage);

    // if status is ok -> navigate to list clients
    if(res == ScheduleStatus.OK){
      this.router.navigate(['list-clients']);
    }
  }
}
