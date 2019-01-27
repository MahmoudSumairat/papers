import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Book } from "../home/book.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/auth/auth.service";
import { StarService } from "./star.service";

@Component({
  selector: "app-book-details",
  templateUrl: "./book-details.component.html",
  styleUrls: ["./book-details.component.scss"]
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  ratingLength: Observable<number>;
  selectedBook$: Observable<Book>;
  bookName: string = this.activatedRoute.snapshot.params["bookName"];
  userName = this.authService.getUser().userName;
  titleCondition: Observable<any>;
  subscriptions : Subscription[] = [];
  isAuth : boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore,
    private authService: AuthService,
    private starService: StarService,
  ) {}

  ngOnInit() {
    //Get the book from the array
    this.selectedBook$ = this.store.select(fromRoot.getAllBooks).pipe(
      map(bookArr => {
        return bookArr.find(book => book.bookName === this.bookName);
      })
    );

    this.subscriptions.push(this.store.select(fromRoot.getIsAuth).subscribe(data => this.isAuth = data));


    this.checkUser();

     this.subscriptions.push(this.store.select(fromRoot.getIsReviewed).subscribe(result => {
      if (result) {
          //Cacluate the average rating
          this.starService.calculateAverage(this.bookName);

          //Update the number of rendered stars
          this.ratingLength = this.starService.getnumOfRatings(this.bookName);
      }
    })
    )

  }
  creatDummyArray(value : number) {
    //Get A dummy array fomr star service
    return this.starService.creatStars(value)
  }

  checkUser() {
    //Check if the user has rated the book or not
  
    if (this.isAuth) {
      this.titleCondition = this.afs
        .collection("stars")
        .doc("book_review")
        .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
        .doc(this.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
        .valueChanges();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
