import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BarberClient } from './core/models/barber-client.model';
import { AuthenticationService } from './core/services/authentication.service';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  // current authenticate user object
  authClient: BarberClient = null;

  // list of subscribers
  subscribersList: Subscription[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ){

  }

  ngOnInit(): void{
    // subscribe to authenticate user object
    this.subscribersList.push(this.authenticationService.getLoggedClient().subscribe( x => {
      this.authClient = x;
    }));
  }

  ngOnDestroy(): void{
    this.subscribersList.map(x => x.unsubscribe());
  }

  // perform logout from server
  async OnLogout(): Promise<void>{
    await this.authenticationService.Logout();
    this.notificationService.Success('You have been logged out');
  }
}
