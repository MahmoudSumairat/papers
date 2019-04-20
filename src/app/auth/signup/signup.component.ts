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
import { Title } from "@angular/platform-browser";

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
    private title: Title
  ) {}
  someID = ""; // AN EMPTY VARIABLE TO ASSIGNE IT TO THE RANDOM GENREATED ID
  chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // ALL THE CHARACTERS TO GENREATE A RANDOM ID
  inputType = "password"; // TO SPECIFY THE PASSWORD INPUT TYPE

  ngOnInit() {
    this.title.setTitle("Creat an account"); // CHANGE THE PAGE TITLE
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
        }); // FETCH THE USERS FROM THE DATABASE TO LOGIN FASTLY
        this.store.dispatch(new auth.SetUsers(arr)); // DISPATCH THE USERS TO THE NGRX STORE
      });
  }

  onSubmit(f: NgForm, maleRadio, femaleRadio) {
    // A FUNCTION THAT REGISTERS THE NEW USER
    this.someID = ""; // REASSIGNE THE EMPTY VARIABLE
    for (let i = 0; i < this.chars.length; i++) {
      // GENERATE A NEW RANDOM ID
      this.someID += this.chars[Math.floor(Math.random() * this.chars.length)]; // ADD A NEW RANDOM CHARACTER IN THE VARIABLE IN EVERY ITERATRION
    }
    this.authService.registerUser(f.value, this.someID); // INVOKE THE SIGNUP FUNCTION FROM THE AUTHSERVICE

    f.reset(); // RESET THE FORM

    // REMOVE THE STYLE OF THE CUSTOM RADIO INPUTS THAT SPEFICFY THE GENDER
    maleRadio.classList.remove("radio-active");
    femaleRadio.classList.remove("radio-active");
  }

  onSelectMale(male, maleRadio, femaleRadio) {
    // SELECT  MALE FROM THE RADIO INPUTS

    male.click();
    maleRadio.classList.add("radio-active");
    femaleRadio.classList.remove("radio-active");
  }

  onSelectFemale(female, maleRadio, femaleRadio) {
    // SELECT FEMALE FROM THE RADIO INPUTS
    female.click();
    maleRadio.classList.remove("radio-active");
    femaleRadio.classList.add("radio-active");
    console.log("female state");
  }

  goGuest() {
    // ENTER THE APP AS A USER
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
    this.router.navigate(["/content"]);
  }

  toggleInput() {
    // TOGGLE THE PASSWORD INPUT TYPE
    this.inputType === "password"
      ? (this.inputType = "text")
      : (this.inputType = "password");
  }
}
