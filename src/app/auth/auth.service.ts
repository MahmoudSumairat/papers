import { UserData } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Store } from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import * as Auth from "./auth.actions";
import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material";
import { Subscription } from 'rxjs';

@Injectable()
export class AuthService implements OnDestroy {
  private user: UserData;
  subsArr : Subscription[] = [];
  allowToSignIn : boolean = true;
  inLoginPage : boolean = true;
  loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');


  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar,
    
  ) {}

  registerUser(user, userID) {
    this.afs
      .collection("users")
      .doc(userID)
      .set({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        password: user.password
      })
      .then(() => {
        this.store.dispatch(new Auth.SetAuthenticated());
        this.snackBar.open("Registerd Successfully", 'OK', {duration : 2000});
        this.router.navigate(['/content']);
        this.user = {
          ...user,
          userID: userID
        };
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(this.user));
      });
  }

  loginUser(email: string, password: string) {
      this.allowToSignIn = true;
    this.subsArr.push(this.store
      .select(fromRoot.getAuthUsers)
      .pipe(
        map((users: UserData[]) => {
          return users.find(user => {
            return user.email === email;
          });
        })
      )
      .subscribe(data => {
          if(this.allowToSignIn) {
            if (data) {
                if (data.password === password && this.inLoginPage) {
                  this.router.navigate(["/content"]);
                  this.store.dispatch(new Auth.SetAuthenticated());
                  this.user = data;
                  setTimeout(() => {
                    this.snackBar.open(
                      "Welcome Back " + this.user.firstName + "!",
                      "Ok",
                      { duration: 2000 }
                    );
                  }, 500);
                  this.inLoginPage = false;
                  localStorage.setItem('loggedIn', 'true');
                  localStorage.setItem('user', JSON.stringify(this.user));
                } else if (data.password !== password && this.inLoginPage) {
                  this.snackBar.open("Incorrect Password, Please try again", "Ok", {
                    duration: 2000
                  });
                }
              } else {
                this.snackBar.open("No such a user", "Ok", { duration: 2000 });
              }


              
          }
      }));

  }

  logout() {
    this.router.navigate(["/login"]);
    this.store.dispatch(new Auth.SetUnauthenticated());
    this.user = null;
    this.allowToSignIn = false;
    this.inLoginPage = true;
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
  }

  getUser() {
    return { ...this.user };
  }

  updateUser(favQuotes) {
    this.user.favQuotes = favQuotes;
    console.log(this.user);
  }

  updateQuote(quote) {
    this.user.myQuote = quote;
  }



  ngOnDestroy() {
      this.subsArr.forEach(sub => sub.unsubscribe());
  }


  getIsLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn') || 'false');
  }

  getCurrenUser() {
    return JSON.parse(localStorage.getItem('user') || null )
  }

  setUser(user : UserData) {
    this.user = user;
  }

}
