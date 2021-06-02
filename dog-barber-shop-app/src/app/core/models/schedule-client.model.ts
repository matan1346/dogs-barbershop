import { BarberClient } from "./barber-client.model";

export enum ScheduleStatus{
  OK=0, NOT_LOGGED_IN=1,NOT_FOUND=2, NOT_BELONGS=3, ALREADY_TAKEN=4,UNKNOWN_ERROR=5
};

export interface ScheduleClient
{
  scheduleID: number;
  clientID: number;
  scheduleTime: Date;
  registeredRecord:  Date;
  client: BarberClient;
}
