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
import { BookDetailsComponent } from "./content/book-details/book-details.component";
import { StarsReviewComponent } from "./content/book-details/stars-review/stars-review.component";
import { StarService } from "./content/book-details/star.service";
import { MyBooksComponent } from "./content/my-books/my-books.component";
import { ReviewsComponent } from "./content/book-details/reviews/reviews.component";
import { AuthorComponent } from "./content/book-details/author/author.component";
import { BookDetailsService } from "./content/book-details/book-details.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReadBooksComponent } from "./content/my-books/read-books/read-books.component";
import { CurrentlyReadingComponent } from "./content/my-books/currently-reading/currently-reading.component";
import { WantToReadComponent } from "./content/my-books/want-to-read/want-to-read.component";
import { BookComponent } from "./content/my-books/book/book.component";
import { AuthGurad } from "./auth/auth.guard";
import { AuthorsComponent } from "./content/authors/authors.component";
import { AuthorsService } from "./content/authors/authors.service";
import { MyBooksService } from "./content/my-books/my-books.service";
import { AuthorDetailsComponent } from "./content/author-details/author-details.component";
import { ContentModule } from "./content/content.module";
import { QuotesComponent } from "./content/quotes/quotes.component";
import { QuotesService } from "./content/quotes/quotes.service";
import { MyQuotesComponent } from "./content/my-quotes/my-quotes.component";
import { ProfileComponent } from "./content/profile/profile.component";
import { FilterPipe } from "./content/filter.pipe";
import { AdminComponent } from "./content/admin/admin.component";
import { AddBookComponent } from "./content/admin/add-book/add-book.component";
import { AddAuthorComponent } from "./content/admin/add-author/add-author.component";
import { AddQuoteComponent } from "./content/admin/add-quote/add-quote.component";
import { UsersComponent } from "./content/admin/users/users.component";
import { NavigateComponent } from "./content/admin/navigate/navigate.component";
import { AdminGuard } from "./content/admin/admin.guard";
import { FooterComponent } from "./navigation/footer/footer.component";

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
    AuthorComponent,
    ReadBooksComponent,
    CurrentlyReadingComponent,
    WantToReadComponent,
    BookComponent,
    AuthorsComponent,
    AuthorDetailsComponent,
    QuotesComponent,
    ProfileComponent,
    MyQuotesComponent,
    FilterPipe,
    AdminComponent,
    AddBookComponent,
    AddAuthorComponent,
    AddQuoteComponent,
    UsersComponent,
    NavigateComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    StoreModule.forRoot(reducers),
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    BrowserAnimationsModule,
    ContentModule
  ],
  providers: [
    AuthService,
    BookService,
    StarService,
    BookDetailsService,
    AuthGurad,
    AuthorsService,
    MyBooksService,
    QuotesService,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
