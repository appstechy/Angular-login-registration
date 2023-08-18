import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar){}

  isUserLoggedIn(): boolean{
    return this.authService.isUserLoggedIn();
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['login']);
    this.snackbar.open("Successfully logged out!!", "Close")
  }
}
