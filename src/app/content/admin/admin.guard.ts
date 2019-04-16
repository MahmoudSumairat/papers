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
 
    const user = this.authService.getUser();
    let isAuthed : boolean;
    this.store.select(fromRoot.getIsAuth).subscribe(isAuth => {
     isAuthed = isAuth
    })

    if(isAuthed && user.isAdmin) {
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