import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { ProtectedPageComponent } from './protected-page/protected-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ProtectedPageComponent,
    RegistrationPageComponent,
    MapComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    LeafletModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
