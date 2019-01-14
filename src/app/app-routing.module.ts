import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes : Routes = [
    {path : '', component : WelcomeComponent},
    {path : 'home', component : HomeComponent},
    {path : 'login', component : LoginComponent},
    {path : 'signup', component : SignupComponent}
]

@NgModule({
    imports : [
        RouterModule.forRoot(routes)    
    ],
    exports : [
        RouterModule
    ]
})
export class AppRoutingModule {

}