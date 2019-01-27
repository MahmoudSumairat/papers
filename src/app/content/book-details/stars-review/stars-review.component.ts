import {
  Component,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { StarService } from "../star.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/auth/auth.service";
import { UserData } from "src/app/auth/user.model";
import { ActivatedRoute, Router } from "@angular/router";
import * as fromRoot from "../../../app.reducer";
import { Store } from "@ngrx/store";
import * as bookDetails from "../book-details.actions";

@Component({
  selector: "app-stars-review",
  templateUrl: "./stars-review.component.html",
  styleUrls: ["./stars-review.component.scss"]
})
export class StarsReviewComponent implements OnInit, OnDestroy {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private route: ActivatedRoute,
    private starService: StarService,
    private store: Store<fromRoot.State>
  ) {}

  user: UserData = this.authService.getUser();
  bookName: string = this.route.snapshot.params["bookName"];
  sub: Subscription;
  myValue;
  isAuth : boolean;
  subscription : Subscription;

  onClick(value) {
    this.starService.setStar(value, this.bookName, this.user);
    this.starService.calculateAverage(this.bookName);
    this.store.dispatch(new bookDetails.SetStarReviewed());
  }

  ngOnInit() {
    this.subscription = this.store.select(fromRoot.getIsAuth).subscribe(data => {
      this.isAuth = data;
    })

    if (this.isAuth) {
      this.sub = this.afs
        .collection("stars")
        .doc("book_review")
        .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
        .doc(this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
        .valueChanges()
        .subscribe((data: { value: number }) => (this.myValue = data.value));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
