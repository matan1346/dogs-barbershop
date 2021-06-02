import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // login form
  loginForm: FormGroup;

  // usernme field
  userName: string;
  // password field
  password: string;

  constructor(
    private formBuild: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
    ) { }

  ngOnInit(): void {

    // setting login form with data
    this.loginForm = this.formBuild.group({
      userName: [this.userName, Validators.required],
      password: [this.password, Validators.required]
    });
  }

  // Action Button - submot login - perform submit into database via server, if credntials are valid -> set user current object
  async OnLogin(): Promise<void>{
    // if form is
    if(this.loginForm.invalid)
      return;

    // load credntials to json
    let loginDetails: {userName: string, password: string};
    loginDetails = this.loginForm.value;
    // perform login request to server
    let ans = await this.authenticationService.Login(loginDetails);
    // if true -> logged successfully
    if(ans){
      this.router.navigate(['list-clients']);
    }
    else{
      // else, username or password are wrong
      alert("Username or password are incorrect, please try again");
    }
  }
}
