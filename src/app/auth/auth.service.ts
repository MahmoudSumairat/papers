import { UserData } from './user.model';
import { AuthData } from './auth-data.model';
import { Store } from '@ngrx/store';
import * as fromRoot from "../app.reducer";
import * as Auth from "./auth.actions";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    private user : UserData;

    constructor(private store : Store<fromRoot.State>, private router : Router) {}

    registerUser(authData : AuthData) {
        this.user = {
            email : authData.email,
            password : authData.password,
            userId : Math.round(Math.random() * 1000).toString(),
            userName : authData.userName,
        }
        this.store.dispatch(new Auth.SetAuthenticated())
        this.router.navigate(['/content']);
    }

    loginUser(authData : AuthData) {
        this.user = {
            email : authData.email,
            password : authData.password,
            userId : Math.round(Math.random() * 1000).toString(),
            userName : authData.userName,
        }
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/content']);
    }

    logout() {
        this.user = null;
        this.store.dispatch(new Auth.SetUnauthenticated());
    }

    getUser() {
        return {...this.user};
    }

    isAuth() {
        return this.user != null;
    }
}