import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BarberClient } from '../models/barber-client.model';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // current authenticate user object
  private authClient : BehaviorSubject<BarberClient> = new BehaviorSubject<BarberClient>(null);
  // a flag represents if the user is logged in (authenticate with te server)
  private isAuthenticate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) {

    // in case the client perform a refresh, if there is a session that exist in the server -> authenticate the user
    if(!this.isAuthenticate.value)
      this.SetSession();

   }

  // getting the user object as observable
  getLoggedClient() : Observable<BarberClient>{
    return this.authClient.asObservable();
  }

  // getting if the user is authenticate as observable
  IsLoggedIn(): Observable<boolean>{
    return this.isAuthenticate.asObservable();
  }

  // perform login via username & password via server, if succeed -> set current user
  async Login(loginDetails: {userName: string,password: string}) : Promise<boolean> {

    let clientDetails: BarberClient = null;
    try{
      // perform login
      clientDetails = await this.http.post<BarberClient | null>(environment.serverURL + 'authentication/login', loginDetails).toPromise();
      // if no object -> than username or password are wrong
      if(clientDetails == null)
        return false;

      // else, the login has been succeed -> set current user
      this.authClient.next(clientDetails);
      this.isAuthenticate.next(true);
    }
    catch{
      // in case of error -> return false
      return false;
    }
    // logged in -> return true
    return true;
  }

  // perform register user name, password & first name into database via server
  async Register(registerDetails: {userName: string, password: string, firstName: string}) : Promise<boolean>{
    try{
      // perform register
      let res = await this.http.post<boolean>(environment.serverURL + 'authentication/register', registerDetails).toPromise();
      // return res true if succeed or false if the username is already taken
      return res;
    }
    catch{
      // in case of error -> return false
      return false;
    }
  }

  // perform logout -> sending a logout request for server (to perform logout in server also)
  async Logout(): Promise<void>{
    // perform logout
    await this.http.post<boolean>(environment.serverURL + 'authentication/logout', null).toPromise();
    // reset current user object to be null
    this.authClient.next(null);
    this.isAuthenticate.next(false);
  }

  // perform set seesion -> if session exists in server -> set current user object to save session  in service
  async SetSession(): Promise<void>{
    let clientDetails: BarberClient = null;
    // perform session
    clientDetails = await this.http.get<BarberClient | null>(environment.serverURL + 'authentication/session').toPromise();
    // set current user object after getting the session
    this.authClient.next(clientDetails);
    this.isAuthenticate.next(true);
  }

}
