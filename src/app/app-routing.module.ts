import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./content/home/home.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { ContentComponent } from "./content/content.component";
import { BookDetailsComponent } from "./content/book-details/book-details.component";
import { MyBooksComponent } from './content/my-books/my-books.component';
import { AuthGurad } from './auth/auth.guard';
import { AuthorsComponent } from './content/authors/authors.component';
import { AuthorDetailsComponent } from './content/author-details/author-details.component';
import { QuotesComponent } from './content/quotes/quotes.component';
import { ProfileComponent } from './content/profile/profile.component';
import { MyQuotesComponent } from './content/my-quotes/my-quotes.component';
import { AdminComponent } from './content/admin/admin.component';
import { AddBookComponent } from './content/admin/add-book/add-book.component';
import { AddAuthorComponent } from './content/admin/add-author/add-author.component';
import { AddQuoteComponent } from './content/admin/add-quote/add-quote.component';
import { UsersComponent } from './content/admin/users/users.component';
import { NavigateComponent } from './content/admin/navigate/navigate.component';
import { AdminGuard } from './content/admin/admin.guard';

const routes: Routes = [
  { path: "", component: WelcomeComponent },
  {
    path: "content",
    component: ContentComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: "books/:bookName", component: BookDetailsComponent },
      { path : "my-books", component : MyBooksComponent, canActivate : [AuthGurad] },
      { path : 'authors', component : AuthorsComponent },
      { path : 'authors/:authorName', component : AuthorDetailsComponent },
      { path : 'quotes', component : QuotesComponent },
      { path : 'profile', component : ProfileComponent, canActivate : [AuthGurad]},
      { path : 'my-quotes', component : MyQuotesComponent, canActivate : [AuthGurad] },
      { path : 'admin', component : AdminComponent, canActivate : [AdminGuard] , children : [
      { path : '', component : NavigateComponent },
      { path : 'add-book', component : AddBookComponent },
      { path : 'add-author', component : AddAuthorComponent },
      { path : 'add-quote', component : AddQuoteComponent },
      { path : 'users', component : UsersComponent }
      ] }
    ]
  },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
