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
    private store: Store<fromRoot.State>,
    private router : Router
  ) {}

  user: UserData = this.authService.getUser();
  bookName: string = this.route.snapshot.params["bookName"];
  authorName: string = this.route.snapshot.params["authorName"];

  sub: Subscription;
  myValue = 0;
  isAuth : boolean;
  subscription : Subscription[] = [];
  isReviewed : boolean;

  onClick(value) {
    if(this.user.userID){
      if (this.bookName) {
        this.starService.setStar(value, this.bookName, this.user);
        this.starService.calculateAverage(this.bookName);
        this.store.dispatch(new bookDetails.SetStarReviewed());
        console.log('book state')
      } else if (this.authorName) {
        this.starService.setStarForAuthor(value, this.authorName, this.user);
        this.starService.calculateAverageForAuthor(this.authorName);
        console.log('author state')
      }
    } else {
      this.router.navigate(['/login']);
    }
 
  }

  ngOnInit() {
    this.subscription.push(this.store.select(fromRoot.getIsAuth).subscribe(data => {
      this.isAuth = data;
    }))

    this.subscription.push(this.store.select(fromRoot.getIsReviewed).subscribe(result => {
      this.isReviewed = result;
    }))

    this.getStarsValue();
    
  }

  getStarsValue() {
    if (this.isAuth) {
      if(this.bookName) {
        this.sub = this.afs
        .collection("stars")
        .doc("book_review")
        .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
        .doc(this.user.userID)
        .valueChanges()
        .subscribe((data: { value: number }) => {
          if(data) {
            if(data.value) {
              this.myValue = data.value
              this.store.dispatch(new bookDetails.SetStarReviewed());
            } else {
            }
          }
        });
      } else if (this.authorName) {
        this.sub = this.afs
        .collection("stars")
        .doc("author_review")
        .collection(this.authorName.toLowerCase().replace(/ /g, "_"))
        .doc(this.user.userID)
        .valueChanges()
        .subscribe((data: { value: number }) => {
          if(data) {
            if(data.value) {
              this.myValue = data.value
              this.store.dispatch(new bookDetails.SetStarReviewed());
            } else {
            }
          }
        });
      }
        
    }
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    })
  }
}
