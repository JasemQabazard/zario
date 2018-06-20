import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passwordchange',
  templateUrl: './passwordchange.component.html',
  styleUrls: ['./passwordchange.component.css']
})
export class PasswordchangeComponent implements OnInit {

  form: FormGroup;
  message: string;
  messageClass: string;
  oldPasswordValid: boolean = false;
  oldPasswordMessage: string;
  username: string = undefined;
  user = {username: '', password: ''};
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
   }

  ngOnInit() {
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(name => { console.log(name); this.username = name; });
    console.log("user name: ", this.username);
  }

  createForm() {
    this.form= this.formBuilder.group({
      opassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      npassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])]
    })
  }

    // Function to validate password
    validatePassword(controls) {
      // Create a regular expression
      // const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
      const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      // Test password against regular expression
      if (regExp.test(controls.value)) {
        return null; // Return as valid password
      } else {
        return { 'validatePassword': true } // Return as invalid password
      }
    }
  
    passwordChangeSubmit() {
      this.user.username = this.username;
      this.user.password = this.form.get('npassword').value;
      this.authService.passwordChange(this.user).subscribe(
        data => {
          this.messageClass= "alert alert-success";
          this.message="Password Change Successfull";
          this.form.reset();
          this.username = undefined;
          this.authService.logOut();
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirect to Home page
          }, 2000);
      },
        error => {
          this.messageClass = "alert alert-danger";
          this.message = error;
          // "Unatherized User, Please use correct user name/ password";
        }
      );
    }

      // Function to check if username is available
  checkOldPassword() {
    this.user.username = this.username;
    this.user.password = this.form.get('opassword').value;
    console.log("user sent for old pass check", this.user);
    this.authService.checkOldPassword(this.user).subscribe(
      data => {
        this.messageClass= "";
        this.message=null;
      // Check if success true or success false was returned from API
        if (!data.success) {
          this.oldPasswordValid = false; // Return username as invalid
          this.oldPasswordMessage = data.message; // Return error message
        } else {
          this.oldPasswordValid = true; // Return username as valid
        }
      }, 
      errormessage => {
        this.message = <any>errormessage;
        this.messageClass= "alert alert-danger";
      }
    );
  }

}
