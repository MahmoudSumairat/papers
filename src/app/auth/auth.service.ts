import { UserData } from './user.model';
import { AuthData } from './auth-data.model';
import { Store } from '@ngrx/store';
import * as fromRoot from "../app.reducer";
import * as Auth from "./auth.actions";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from "rxjs/operators";
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthService {
    private user : UserData;

    constructor(private store : Store<fromRoot.State>, private router : Router,private afs : AngularFirestore, private snackBar : MatSnackBar) {}

    registerUser(user, userID) {
        this.afs.collection('users')
        .doc(userID).set({
          email : user.email,
          firstName : user.firstName,
          lastName : user.lastName,
          gender : user.gender,
          password : user.password
        }).then(() => {
            this.store.dispatch(new Auth.SetAuthenticated());
            this.snackBar.open('Registerd Successfully');
            this.user = {
                ...user,
                userID : userID
            };
            
        })
    }

    loginUser(email : string, password : string) {
        this.store.select(fromRoot.getAuthUsers)
        .pipe(map((users : UserData[]) => {
            return users.find(user => {
                return user.email === email
            })
        }))
        .subscribe(data => {
          if(data) {
              if(data.password === password) {
                  this.router.navigate(['/content']);
                  this.store.dispatch(new Auth.SetAuthenticated());
                  this.user = data;
                  setTimeout(() => {
                      this.snackBar.open('Welcome Back ' + this.user.firstName + '!', 'Ok', {duration : 2000});
                  }, 500)
              } else {
                  console.log('password incorrect');
                  this.snackBar.open('Incorrect Password, Please try again', 'Ok', {duration : 2000});
                }
            } else {
                
                this.snackBar.open('No such a user', 'Ok', {duration : 2000});
          }

    })

    
    }

    logout() {
        this.router.navigate(['/login']);
        this.store.dispatch(new Auth.SetUnauthenticated());
  
    }

    getUser() {
        return {...this.user};
    }

  
}