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
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

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
  inputType = "password"; // TO SPECIFY THE PASSWORD INPUT TYPE

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle("Login to papers"); // CHANGE THE TITLE OF THE PAGE
    this.sub = this.afs // FETCH THE USERS FROM THE DATABASTE TO REGISTER FASTLY
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
        this.store.dispatch(new auth.SetUsers(arr)); // DISPATCH THE USERS THAT I FETCHED FROM THE DATABASE TO THE NGRX STORE
      });
  }

  onSubmit(f: NgForm) {
    // A FUNCTION TO SUBMIT THE FORM TO SIGN IN THE USER
    this.authService.loginUser(f.value.email, f.value.password); // INVOKE THE LOGIN METHOD FROM THE AUTHSERVICE
    f.reset(); // RESET THE FORM
  }

  goGuest() {
    // A FUNCTION THAT ALLOW THE USER TO ENTER THE APP LIKE A GUEST
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
    // REMOVE THE USER DATA THAT IS SAVED IN THE LOCAL STORAGE
    this.router.navigate(["/content"]);
    // GO TO THE CONTENT COMPONENT
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleInput() {
    // TOGGLE THE TYPE OF THE PASSWORD INPUT TO MAKE IT VISIBLE
    this.inputType === "password"
      ? (this.inputType = "text")
      : (this.inputType = "password");
  }
}
