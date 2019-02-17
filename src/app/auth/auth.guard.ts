import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import * as fromRoot from "../app.reducer";
import { Store } from '@ngrx/store';


@Injectable()
export class AuthGurad implements CanActivate {
    constructor(
        private authService : AuthService,
        private store : Store<fromRoot.State>,
        private router : Router
    ) {

    }

canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot ) : any {
    let isAuthed : boolean;
    this.store.select(fromRoot.getIsAuth).subscribe(isAuth => {
        if(isAuth) {
            isAuthed =  true;
        } else {
            this.router.navigate(['/login'])
            return
        }
    })
    return isAuthed
}
}