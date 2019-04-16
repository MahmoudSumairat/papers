import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import * as auth from "../auth.actions";
import { UserData } from "../user.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [
    trigger("formState", [
      state(
        "exist",
        style({
          opacity: 1,
          transform: "translateZ(0)"
        })
      ),
      transition("void => *", [
        style({
          opacity: 0,
          transform: "translateZ(-25px)"
        }),
        animate(".25s ease-out")
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  sub: Subscription;
  inputType = 'password';

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore,
    private router : Router,
    private title : Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Login to papers');
    this.sub = this.afs
      .collection("users")
      .snapshotChanges()
      .subscribe(data => {
        const arr = data.map(item => {
          const itemObj: UserData = <UserData>item.payload.doc.data();
          return {
            userID: item.payload.doc.id,
            ...itemObj
          };
        });
        this.store.dispatch(new auth.SetUsers(arr));
      });
  }

  onSubmit(f: NgForm) {
    this.authService.loginUser(f.value.email, f.value.password);
    f.reset();
  }

  goGuest() {
    localStorage.removeItem('user');
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/content']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  toggleInput() {
      this.inputType === 'password' ? this.inputType = 'text' : this.inputType = 'password';
  }


}
