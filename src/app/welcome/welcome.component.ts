import { Component, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import * as auth from "../auth/auth.actions";
import { UserData } from "../auth/user.model";
import { Title } from "@angular/platform-browser";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit, OnDestroy {
  @Output() isChanged = new EventEmitter();
  sub : Subscription;
  constructor(
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle("Welcome to papers");

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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
