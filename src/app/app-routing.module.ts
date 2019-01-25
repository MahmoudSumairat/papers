import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./content/home/home.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { ContentComponent } from "./content/content.component";
import { BookDetailsComponent } from "./content/book-details/book-details.component";

const routes: Routes = [
  { path: "", component: WelcomeComponent },
  {
    path: "content",
    component: ContentComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: ":bookName", component: BookDetailsComponent }
    ]
  },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
