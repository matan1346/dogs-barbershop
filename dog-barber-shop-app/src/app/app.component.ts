import { Component, OnInit } from '@angular/core';
import { BarberClient } from './core/models/barber-client.model';
import { AuthenticationService } from './core/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // current authenticate user object
  authClient: BarberClient = null;

  constructor(
    private authenticationService: AuthenticationService
  ){

  }

  ngOnInit(): void{
    // subscribe to authenticate user object
    this.authenticationService.getLoggedClient().subscribe( x => {
      this.authClient = x;
    });
  }

  // perform logout from server
  OnLogout(): void{
    this.authenticationService.Logout();
  }
}
