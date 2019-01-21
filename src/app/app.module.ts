import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './content/home/home.component';

import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './navigation/header/header.component';
import { ContentComponent } from './content/content.component';
import { MaterialModule } from './material.module';
import { AuthService } from './auth/auth.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from "./app.reducer";
import { environment } from "../environments/environment";
import { AuthModule } from './auth/auth.module';
import { BookService } from './content/home/book.service';
import { ContentModule } from './content/content.module';
import { BookDetailsComponent } from './content/book-details/book-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    WelcomeComponent,
    HeaderComponent,
    ContentComponent,
    BookDetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    StoreModule.forRoot(reducers),
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    ContentModule
  
  ],
  providers: [AuthService, BookService],
  bootstrap: [AppComponent]
})
export class AppModule { }
