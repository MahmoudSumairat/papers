import { UserData } from './user.model';
import { AuthData } from './auth-data.model';
import { Store } from '@ngrx/store';
import * as fromRoot from "../app.reducer";
import * as Auth from "./auth.actions";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {AngularFireAuth } from "@angular/fire/auth"; 

@Injectable()
export class AuthService {
    private user : UserData;

    constructor(private store : Store<fromRoot.State>, private router : Router,private afAuth : AngularFireAuth) {}

    registerUser(authData : AuthData) {
        this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(
              (result) => {
                this.store.dispatch(new Auth.SetAuthenticated())
                this.router.navigate(['/content']);
                this.user = {
                    userName : result.user.email
                }
              }  
        )
        .catch((error : Error) => console.log(error.message));
      
    }

    loginUser(authData : AuthData) {
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(
            (result) => {
                this.store.dispatch(new Auth.SetAuthenticated());
                this.router.navigate(['/content']);
                this.user = {
                    userName : result.user.email
                }
            }
        )
        .catch(
            (error : Error) => console.log(error.message)
        )
        
    }

    logout() {
        this.afAuth.auth.signOut();
        this.user = null;
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/']);
    }

    getUser() {
        return {...this.user};
    }

    isAuth() {
        return this.user != null;
    }
}