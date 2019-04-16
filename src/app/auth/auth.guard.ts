import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import * as fromRoot from "../app.reducer";
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class AuthGurad implements CanActivate {
    constructor(
        private authService : AuthService,
        private store : Store<fromRoot.State>,
        private router : Router,
        private snackBar : MatSnackBar
        ) {
            
        }
        
        canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot ) : any {
    let loginStatus = this.authService.getIsLoggedIn();
    let isAuthed : boolean;
    this.store.select(fromRoot.getIsAuth).subscribe(isAuth => {
        isAuthed = isAuthed
    })
    if(isAuthed || loginStatus) {
        return true;
    } else {
        setTimeout(() => {
            this.snackBar.open('You have to be logged in', 'OK', {duration : 2000});
        }, 500);
        this.router.navigate(['/login'])
        return
    }
}
}