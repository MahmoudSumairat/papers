import { Injectable, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router, ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { UserData } from "src/app/auth/user.model";

export interface Star {
  userEmail: string;
  bookName: string;
  rating: number;
}

@Injectable()
export class StarService implements OnDestroy {
  private numberOfRatings: number;
  sub : Subscription[] = [];

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  setStar(value, bookName, user: UserData) { // SET THE RATING TO THE BOOK
    if (user) {
      this.afs
        .collection("stars")
        .doc("book_review")
        .collection(bookName.toLowerCase().replace(/ /g, "_"))
        .doc(user.userID)
        .set(
          {
            ID: user.userID,
            value
          },
          { merge: true }
        )
        .then(() => {})
        .catch(() => {
        });
    } else {
      this.router.navigate(["/login"]);
    }
  }

  setStarForAuthor(value, authorName, user: UserData) { // SET THE RATING TO THE AUTHOR
    if (user) {
      this.afs
        .collection("stars")
        .doc("author_review")
        .collection(authorName.toLowerCase().replace(/ /g, "_"))
        .doc(user.userID)
        .set(
          {
            ID: user.userID,
            value
          },
          { merge: true }
        )
        .then(() => {})
        .catch(() => {
        });
    } else {
      this.router.navigate(["/login"]);
    }
  }

  //We get the the array from the database and calculate the average
  calculateAverage(bookName: string) {
    this.sub.push(this.afs
      .collection("stars")
      .doc("book_review")
      .collection(bookName.toLowerCase().replace(/ /g, "_"))
      .valueChanges()
      .pipe(
        map(data => {
          let ratings = [];
          ratings = data.map(object => object.value);
          this.numberOfRatings = ratings.length;
          return (
            ratings.reduce((accum, value) => accum + value) / ratings.length
          ).toFixed(2);
        })
      )
      .subscribe(data => {
        this.afs
          .collection("myBooks")
          .doc(bookName.toLowerCase().replace(/ /g, "_"))
          .update({
            avgRating: data
          })
          .then(() => {
          })
      }));
  }

  calculateAverageForAuthor(authorName) { // CALCULATE THE AVG OF THE AUTHOR
    this.sub.push(this.afs
      .collection("stars")
      .doc("author_review")
      .collection(authorName.toLowerCase().replace(/ /g, "_"))
      .valueChanges()
      .pipe(
        map(data => {
          let ratings = [1, 2];
          ratings = data.map(object => object.value);
          this.numberOfRatings = ratings.length;
          return (
            ratings.reduce((accum, value) => accum + value) / ratings.length
          ).toFixed(2);
        })
      )
      .subscribe(data => {
        this.afs
          .collection("authors")
          .doc(authorName.toLowerCase().replace(/ /g, "_"))
          .set(
            {
              avgRating: data
            },
            { merge: true }
          )
          .then(() => {
          })
      }));
  }

  renderStars(bookName) {
    return this.afs
      .collection("myBooks")
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .valueChanges();
  }

  getnumOfRatings(bookName) {
    return this.afs
      .collection("stars")
      .doc("book_review")
      .collection(bookName.toLowerCase().replace(/ /g, "_"))
      .valueChanges()
      .pipe(
        map(data => {
          const ratings = data.map(object => object.value);
          return (this.numberOfRatings = ratings.length);
        })
      );
  }

  getnumOfAuthorRatings(authorName) {
    return this.afs
      .collection("stars")
      .doc("author_review")
      .collection(authorName.toLowerCase().replace(/ /g, "_"))
      .valueChanges()
      .pipe(
        map(data => {
          const ratings = data.map(object => object.value);
          return (this.numberOfRatings = ratings.length);
        })
      );
  }

  creatStars(number) {
    let i;
    const starArr = [];
    for (i = number; i >= 1; i--) {
      starArr.push(1);
    }

    return {
      starArr,
      i
    };
  }

  ngOnDestroy() {
    this.sub.forEach(subs => subs.unsubscribe());
  }
}
