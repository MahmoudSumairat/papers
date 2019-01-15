import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './navigation/header/header.component';
import { ContentComponent } from './content/content.component';
import { MaterialModule } from './material.module';
import { AuthService } from './auth/auth.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from "./app.reducer";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    WelcomeComponent,
    HeaderComponent,
    ContentComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    StoreModule.forRoot(reducers)
  
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
