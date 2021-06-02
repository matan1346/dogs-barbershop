import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BarberClient } from 'src/app/core/models/barber-client.model';
import { ScheduleClient, ScheduleStatus } from 'src/app/core/models/schedule-client.model';
import { APIService } from 'src/app/core/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { EditScheduleComponent } from '../edit-schedule/edit-schedule.component';
import { ViewScheduleComponent } from '../view-schedule/view-schedule.component';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent implements OnInit, OnDestroy {

  // the filtered values
  filterValues = {};
  // filter select values
  filterSelectObj = [];
  // data source of the list to do filter
  dataSource = new MatTableDataSource();

  // current user object
  authClient: BarberClient= null;
  // display columns
  displayedColumns: string[] = ['scheduleID', 'Name', 'time', 'registered','actions'];

  // list of subscribers
  subscribersList: Subscription[] = [];

  constructor(
    private apiService: APIService,
    private authenticationService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private notificationService: NotificationService
    ) {

// Object to create Filter for
this.filterSelectObj = [
  {
    name: 'Schedule Time',
    columnProp: 'scheduleTimeShort',
    options: []
  }, {
    name: 'Name',
    columnProp: 'firstName',
    options: []
  }
]

    }

  async ngOnInit(): Promise<void> {

    // Overrride default filter behaviour of Material Datatable
    this.dataSource.filterPredicate = this.createFilter();


    // subscribe to authenticate user if current user object is logged in
    this.subscribersList.push(this.authenticationService.getLoggedClient().subscribe(x => {
      this.authClient = x;
    }));

    // load list of schedules via server
    await this.apiService.loadListSchedules();
    // subscribe to schedule server list
    this.subscribersList.push(this.apiService.getSchedulesList().subscribe(schList => {
      schList.map(m => {
        // for filter
        m['firstName'] = m.client.firstName;
        // for filter
        m['scheduleTimeShort'] = formatDate(m.scheduleTime, 'dd/MM/yyyy', 'en');
        return m;
      });
      this.dataSource.data = schList;

      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(schList, o.columnProp);
      });
    }));
  }

  ngOnDestroy(): void{
    this.subscribersList.map(x => x.unsubscribe());
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

    // if status is ok -> navigate to list clients
    if(res == ScheduleStatus.OK){
      this.notificationService.Success('The schedule has been deleted from the list');
      this.router.navigate(['list-clients']);
    }else{
      this.notificationService.Error(statusMessage);
    }
  }


  /*** Filters Sesttings ***/



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // Called on Filter change
  filterChange(filter, event) {
    //let filterValues = {}
    this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase()
    this.dataSource.filter = JSON.stringify(this.filterValues)
  }

  // Custom filter method fot Angular Material Datatable
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
              if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                found = true
              }
            });
          }
          return found
        } else {
          return true;
        }
      }
      return nameSearch()
    }
    return filterFunction
  }


  // Reset table filters
  resetFilters() {
    this.filterValues = {}
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = undefined;
    })
    this.dataSource.filter = "";
  }

  // Get Uniqu values from columns to build filter
  getFilterObject(fullObj, key) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }
}
