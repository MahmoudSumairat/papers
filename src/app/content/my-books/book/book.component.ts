import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Book } from "../../home/book.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/auth/auth.service";
import { UserData } from "src/app/auth/user.model";
import { StarService } from "../../book-details/star.service";
import * as fromRoot from "../../../app.reducer";
import { Store } from "@ngrx/store";
import * as BookDetails from "../../book-details/book-details.actions";
import { Router } from "@angular/router";
import { BookDetailsService } from "../../book-details/book-details.service";
import { MyBooksService } from "../my-books.service";
import { MatSnackBar } from "@angular/material";
import * as ui from "../../../shared/ui.actions";
import { Observable, Subscription } from "rxjs";

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.scss"]
})
export class BookComponent implements OnInit, OnDestroy {
  @Input() book: Book;
  @Input() dist: string;
  ratingValue: number;
  user: UserData = this.authService.getUser();
  resArr: {
    starArr: number[];
    i;
  } = {
    starArr: [],
    i: 0
  };
  maxDate: Date;
  isLoadind$: Observable<boolean>;
  subs: Subscription[] = [];

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private starService: StarService,
    private store: Store<fromRoot.State>,
    private router: Router,
    private bookDetialsService: BookDetailsService,
    private myBooksService: MyBooksService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.subs.push(
        this.afs
          .collection("stars")
          .doc("book_review")
          .collection(this.book.bookName.toLowerCase().replace(/ /g, "_"))
          .doc(this.user.userID)
          .valueChanges()
          .subscribe((data: any) => {
            if (data) {
              this.ratingValue = data.value;
              this.resArr = this.creatStars(this.ratingValue);
            }
          })
      );
    }, 10);
    this.maxDate = new Date();
    this.isLoadind$ = this.store.select(fromRoot.getIsLoading);
  }

  creatStars(rating: number) {
    return this.starService.creatStars(rating);
  }

  removeBook() {
    // REMOVE THE BOOK FROM MY BOOKS
    this.myBooksService.removeTheBook(
      this.book.bookName,
      this.dist,
      this.user.userID
    );
  }

  navigateToBook(bookName: string) {
    // GO TO THE BOOK'S DETAILS
    this.router.navigate(["/content/books/" + bookName]);
  }

  inputChanged(value) {
    // SUBMIT THE DATE THAT THIS BOOK HAS BEEN READ
    this.myBooksService.setDateRead(
      value,
      this.dist,
      this.user.userID,
      this.book.bookName
    );
  }

  finishedReading() {
    // MOVE THE BOOK TO READ BOOKS
    this.removeBook();
    this.bookDetialsService.readThisBook(
      this.book,
      this.user.userID,
      this.book.bookName,
      true
    );
    this.snackBar.open("Added to read books", "OK", { duration: 1000 });
  }

  editDateRead() {
    // EDIT THE DATE THAT THIS BOOK HAS BEEN READ
    this.myBooksService.editDateRead(
      this.dist,
      this.user.userID,
      this.book.bookName
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
  
}
