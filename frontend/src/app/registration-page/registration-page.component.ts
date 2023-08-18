import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent {

  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  fullName:string = '';
  gender: string = 'male';
  dateOfBirth: string = '';
  email: string = '';
  phoneNumber: string = '';
  isPasswordVisible: boolean = false;


  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar){}
  
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  isValidNumber(num: string): boolean {
    const numRegex = /^\d{10}$/;
    return numRegex.test(num);
  }

  register() {

    // Validate password and confirm password
    if (this.password !== this.confirmPassword) {
      this.snackbar.open('Passwords do not match. Please enter the same password in both fields.','Close');
      return;
    }

    if (this.email == '' || this.isValidEmail(this.email)==false) {
      this.snackbar.open('Invalid email address.','Close');
      return;
    }

    if (this.phoneNumber == '' || this.isValidNumber(this.phoneNumber)==false) {
      this.snackbar.open('Invalid number.','Close');
      return;
    }

    console.log(this.dateOfBirth);
    const currentDate = new Date();
    const selectedDate = new Date(this.dateOfBirth);

    if(selectedDate > currentDate){
      this.snackbar.open('Invalid date of birth.','Close');
      return;
    }

    this.authService.register(this.username, this.password, this.fullName, this.gender, this.dateOfBirth, this.email, this.phoneNumber)
      .subscribe((response: any) => {
        if (response.success) {
          console.log("Register page Token", response.token);
          this.authService.saveToken(response.token);
          this.snackbar.open("Successfully registered!!",'Close');

          this.router.navigate(['/protected-page']);

        } else {
          this.snackbar.open('Already in database. Please choose a different username.', 'Close');
        }
      }, (error) => {
        this.snackbar.open(error.error.message,'Close');
      });
  }



  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
