import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ScheduleClient } from 'src/app/core/models/schedule-client.model';
import { APIService } from 'src/app/core/services/api.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  size: string;
}


@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.scss']
})
export class ViewScheduleComponent implements OnInit {

  //tiles for grid template
  tiles: Tile[] =[];

  // set for schedule current object from dialog if needed
  dialogSchedule: BehaviorSubject<ScheduleClient> = new BehaviorSubject<ScheduleClient>(null);
  // current schedule client object
  scheduleClient: ScheduleClient = {scheduleID: 0, clientID: 0, scheduleTime: null, registeredRecord: null, client: null};

  constructor(
    private apiService: APIService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    // subscribe to schedule item from dialog if needed
    this.dialogSchedule.subscribe( x => {
      this.scheduleClient = x;
      // if schedule exist -> set tiles
      if(x)
      {
        this.tiles = [
          {text: this.scheduleClient.client.firstName, cols: 4, rows: 1, color: 'lightblue', size: '30pt'},
          {text: 'Schedule Time: ' + formatDate(this.scheduleClient.scheduleTime,'dd/MM/yyyy HH:mm','en'), cols: 2, rows: 1, color: '#7bb6ff', size: '15pt'},
          {text: 'Register Date: ' + formatDate(this.scheduleClient.registeredRecord,'dd/MM/yyyy HH:mm','en'), cols: 2, rows: 1, color: 'rgb(65 173 236)', size: '15pt'},
        ]
      }
      else // else -> set tiles to be null
        this.tiles = null;
    });


    // subscribe to activated param schedule id, if exist than use its value to get schedule item
    this.activatedRoute.params.subscribe(p => {
      // if schedule id exists as param
      if(p.hasOwnProperty('schedule_id'))
      {
        this.scheduleClient.scheduleID = p['schedule_id'];
        // subscribe to schedule list and get the specific schedule item filtered by scheudle id
        this.apiService.getSchedulesList().subscribe( x => {
        let index = x.findIndex(s => s.scheduleID == this.scheduleClient.scheduleID);
        // if index was not found -> than naigate to list clients
        if(index < 0)
        {
          console.log("schedule id " + this.scheduleClient.scheduleID + 'doesnot exist');
          this.router.navigate(['list-clients']);
        }
        else // else -> update current schedule object
          this.dialogSchedule.next(x[index]);
        });
      }
    })
  }
}
