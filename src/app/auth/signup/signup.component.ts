import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import * as fromRoot from "../../app.reducer";
import { Store } from "@ngrx/store";
import * as auth from "../auth.actions";
import { UserData } from "../user.model";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
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
export class SignupComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore,
    private router: Router,
    private title : Title
  ) {}
  someID = "";
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  inputType = "password";

  ngOnInit() {
    this.title.setTitle('Creat an account');
    this.afs
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

  onSubmit(f: NgForm, maleRadio, femaleRadio) {
    this.someID = "";
    console.log(f.value);
    for (let i = 0; i < this.chars.length; i++) {
      this.someID += this.chars[Math.floor(Math.random() * this.chars.length)];
    }
    this.authService.registerUser(f.value, this.someID);
    console.log("rigesterd!");

    f.reset();
    maleRadio.classList.remove("radio-active");
    femaleRadio.classList.remove("radio-active");
  }

  onSelectMale(male, maleRadio, femaleRadio) {
    male.click();
    maleRadio.classList.add("radio-active");
    femaleRadio.classList.remove("radio-active");
    console.log("male state");
  }

  onSelectFemale(female, maleRadio, femaleRadio) {
    female.click();
    maleRadio.classList.remove("radio-active");
    femaleRadio.classList.add("radio-active");
    console.log("female state");
  }

  goGuest() {
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
    this.router.navigate(["/content"]);
  }

  toggleInput() {
    this.inputType === "password"
      ? (this.inputType = "text")
      : (this.inputType = "password");
  }
}
