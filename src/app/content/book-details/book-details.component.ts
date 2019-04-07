import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import * as bookDetails from "./book-details.actions";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Book } from "../home/book.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/auth/auth.service";
import { StarService } from "./star.service";
import { BookDetailsService } from './book-details.service';
import { BookService } from '../home/book.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: "app-book-details",
  templateUrl: "./book-details.component.html",
  styleUrls: ["./book-details.component.scss"],
  animations : [
    trigger('bookDetailsState', [
      state('exist', style({
        opacity : 1,
        transform : 'translateZ(0)'
      })),
      transition('void => *' , [
        style({
          opacity: 0,
          transform : 'translateZ(-25px)'
        }),
        animate('.25s ease-out')
      ]),
   
    ] ),
  ]
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  ratingLength: Observable<number>;
  selectedBook$: Observable<Book>;
  bookName: string = this.activatedRoute.snapshot.params["bookName"];
  user = this.authService.getUser()
  titleCondition: Observable<any>;
  subscriptions : Subscription[] = [];
  isAuth : boolean;
  readingTitle : string;
  wantToReadBooks : Book[];
  readBooks : Book[];
  currentBooks : Book[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore,
    private authService: AuthService,
    private starService: StarService,
    private bookDetailsService : BookDetailsService,
    private router : Router,
    private bookService : BookService
  ) {}

  ngOnInit() {
    //Get the book from the array
    this.selectedBook$ = this.store.select(fromRoot.getAllBooks).pipe(
      map(bookArr => {
        return bookArr.find(book => book.bookName === this.bookName);
      })
    );
    this.subscriptions.push(this.store.select(fromRoot.getIsAuth).subscribe(data => this.isAuth = data));
    this.checkReading();
    this.checkUser();
    this.starService.calculateAverage(this.bookName);
    this.ratingLength = this.starService.getnumOfRatings(this.bookName);
     this.subscriptions.push(this.store.select(fromRoot.getIsReviewed).subscribe(result => {
      if (result) {
          //Cacluate the average rating
          this.starService.calculateAverage(this.bookName);

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
        .doc(this.user.userID)
        .valueChanges();

       
    }
  }

  readBook(book) {
    if(this.isAuth){
      this.bookDetailsService.readThisBook(book, this.user.userID, this.bookName);
      this.readingTitle = 'You read this book'
    } else {
      this.router.navigate(['/login']);
    }
  }

  currentlyReadingBook(book) {
    if(this.isAuth){
      this.bookDetailsService.currentlyReadingThisBook(book, this.user.userID, this.bookName);
      this.readingTitle = 'You are currently reading  this book'
    } else {
      this.router.navigate(['/login']);
    }
  }


  wantToReadBook(book) {
    if(this.isAuth){
      this.bookDetailsService.wantToReadThisBook(book, this.user.userID, this.bookName);
      this.readingTitle = 'You want to read this book'
    } else {
      this.router.navigate(['/login']);
    }
  }
  

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.store.dispatch(new bookDetails.SetStarNotReviewed());
  }

  undo() {
    if(this.readBooks) {
      
      this.bookDetailsService.undoChanges(this.readBooks, this.bookName, this.user.userID, 'read-books');
      this.readBooks = null;
    } else if(this.currentBooks) {
      
      this.bookDetailsService.undoChanges(this.currentBooks, this.bookName, this.user.userID, 'currently-reading');
      this.currentBooks = null;
    } else if(this.wantToReadBooks) {
      
      this.bookDetailsService.undoChanges(this.wantToReadBooks, this.bookName, this.user.userID, 'want-to-read');
      this.wantToReadBooks= null;
      
    }
    this.readingTitle = null;
  }

  checkReading() {
    if(this.isAuth) {
      this.store.select(fromRoot.getReadBooks).subscribe((data : Book[]) => {
        if(data.find(book => book.bookName === this.bookName)) {
          this.readingTitle = 'You read this book';
          this.readBooks = data;

        }
      })
  
      this.store.select(fromRoot.getCurrentBooks).subscribe((data : Book[]) => {
         if(data.find(book => book.bookName === this.bookName)) {
          this.readingTitle = 'You are currently reading this book';
          this.currentBooks = data;

        }
      })
  
      this.store.select(fromRoot.getWantBooks).subscribe((data : Book[]) => {
         if(data.find(book => book.bookName === this.bookName)) {
          this.readingTitle = 'You want to read this book';
          this.wantToReadBooks = data;

        }
      })
    }
  }

  goToAuthor(authorName) {
    this.router.navigate(['content/authors', authorName])
  }


  findTheSameGenre(genre : string) {
    this.router.navigate(['/content']);
    setTimeout(() => {
      this.bookService.inputValueChanged.next(genre);
      this.bookService.inputChanged.next(genre);
    }, .5)
  }
}
