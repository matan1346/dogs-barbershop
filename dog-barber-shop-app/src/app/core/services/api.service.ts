import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ScheduleClient, ScheduleStatus } from '../models/schedule-client.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  // schedlue list
  private scheduleClientsList = new BehaviorSubject<ScheduleClient[]>(null);
  constructor(private http: HttpClient) { }

  // getting schedules list as observable
  getSchedulesList() : Observable<ScheduleClient[]>{
    return this.scheduleClientsList.asObservable();
  }

  // load schedules list from database
  async loadListSchedules(): Promise<void> {
    let scheduleList = await this.http.get<ScheduleClient[]>(environment.serverURL + 'schedule').toPromise();
    this.scheduleClientsList.next(scheduleList);
  }

  // create new schedule appointment via server
  async PutSchedule(scheduleDetail: {ClientID: number, ScheduleTime: Date}): Promise<ScheduleStatus> {
    let res = await this.http.put<ScheduleStatus>(environment.serverURL + 'schedule/create', scheduleDetail).toPromise();
    await this.loadListSchedules();
    return res;
  }

  // update an exisiting schedule appointment via server
  async EditSchedule(scheduleDetail: {ClientID: number, ScheduleTime: Date}): Promise<ScheduleStatus> {
    let res = await this.http.post<ScheduleStatus>(environment.serverURL + 'schedule/edit', scheduleDetail).toPromise();
    await this.loadListSchedules();
    return res;
  }

  // delete an exisiting schedule appointment via server
  async DeleteSchedule(scheduleID: number): Promise<ScheduleStatus> {
    let res = await this.http.delete<ScheduleStatus>(environment.serverURL + 'schedule/delete/' + scheduleID).toPromise();
    await this.loadListSchedules();
    return res;
  }

  // get response message of schedule actions
  getResonseText(status: ScheduleStatus): string{
    let message ="Unknown error";
    switch(status){
      case ScheduleStatus.OK:
        message = "success";
        break;
      case ScheduleStatus.NOT_LOGGED_IN:
        message = "not logged in";
        break;
      case ScheduleStatus.NOT_FOUND:
        message = 'not found';
        break;
      case ScheduleStatus.NOT_BELONGS:
        message = 'not belongs to user';
        break;
      case ScheduleStatus.ALREADY_TAKEN:
        message = 'time already taken';
        break;
    }
    return message;
  }

}
