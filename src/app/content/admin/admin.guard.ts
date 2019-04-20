import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';
import { UserData } from 'src/app/auth/user.model';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class AdminGuard implements CanActivate{
    
    
    
    constructor(
        private authService : AuthService,
        private store : Store<fromRoot.State>,
        private router : Router,
        private snackBar : MatSnackBar
    ) {

    }

   

canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot ) : any {
    // A GUARD THAT PROTECTS THE COMPOENENTS THAT NEED AN ADMIN
    const user = this.authService.getUser();
    let isAuthed : boolean;
    this.store.select(fromRoot.getIsAuth).subscribe(isAuth => {
     isAuthed = isAuth
    })

    if(isAuthed && user.isAdmin) { // CHECK IF THE USER IS SIGNED IN AND IF HE IS AN ADMIN
        return true;
    } else {
        this.router.navigate(['/content'])
        setTimeout(() => {
            this.snackBar.open('You have to be an admin', 'Ok', {duration : 2000});
        },   500)
        return
    }

}


}