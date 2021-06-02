import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // register form
  registerForm: FormGroup;

  // username fiedl
  userName: string;
  // password field;
  password: string;
  // firstName field
  firstName: string;

  constructor(
    private formBuild: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {

    // setting register form with values
    this.registerForm = this.formBuild.group({
      userName: [this.userName, Validators.required],
      password: [this.password, Validators.required],
      firstName: [this.firstName, Validators.required]
    });
  }

  // Action Button - register - perform register, success only if username is not already exist
  async OnRegister(): Promise<void>{

    if(this.registerForm.invalid)
      return

    // set register data to JSON
    let registerDetails: {userName: string, password: string, firstName: string};
    registerDetails = this.registerForm.value;
    // perform register
    let ans = await this.authenticationService.Register(registerDetails);
    // if true -> registered success
    if(ans){
      this.router.navigate(['login']);
    }
    else{
      // else, username is already exists
      alert("Username is already exists, try another");
    }
  }
}
