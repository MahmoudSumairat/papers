import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { HomeComponent } from "./content/home/home.component";

import { AppRoutingModule } from "./app-routing.module";
import { WelcomeComponent } from "./welcome/welcome.component";
import { HeaderComponent } from "./navigation/header/header.component";
import { ContentComponent } from "./content/content.component";
import { MaterialModule } from "./material.module";
import { AuthService } from "./auth/auth.service";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./app.reducer";
import { environment } from "../environments/environment";
import { AuthModule } from "./auth/auth.module";
import { BookService } from "./content/home/book.service";
import { ContentModule } from "./content/content.module";
import { BookDetailsComponent } from "./content/book-details/book-details.component";
import { StarsReviewComponent } from "./content/book-details/stars-review/stars-review.component";
import { StarService } from "./content/book-details/star.service";
import { MyBooksComponent } from './content/my-books/my-books.component';
import { ReviewsComponent } from './content/book-details/reviews/reviews.component';
import { AuthorComponent } from './content/book-details/author/author.component';
import { BookDetailsSerice } from './content/book-details/book-details.service';

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
    StarsReviewComponent,
    MyBooksComponent,
    ReviewsComponent,
    AuthorComponent
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
  providers: [AuthService, BookService, StarService, BookDetailsSerice],
  bootstrap: [AppComponent]
})
export class AppModule {}
