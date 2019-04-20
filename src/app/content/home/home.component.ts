import { Component, OnInit, OnDestroy } from "@angular/core";
import { BookService } from "./book.service";
import * as fromRoot from "../../app.reducer";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { Book } from "./book.model";
import { Router } from "@angular/router";
import { StarService } from "../book-details/star.service";
import { AuthService } from "src/app/auth/auth.service";
import { BookDetailsService } from "../book-details/book-details.service";
import { QuotesService } from "../quotes/quotes.service";
import { AuthorsService } from "../authors/authors.service";
import { map } from "rxjs/operators";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { MyBooksService } from "../my-books/my-books.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [
    trigger("booksState", [
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
    ]),
    trigger("pageState", [
      state(
        "navigatable",
        style({
          transform: "scale(1)"
        })
      ),
      transition("void => *", [
        style({
          transform: "scale(0)"
        }),
        animate(200)
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  allBooks$: Observable<Book[]>;
  avgRating: Observable<number>;
  i: number;
  user = this.authService.getUser();
  isAuth: boolean;
  searchValue: string;
  booksPerPage: number = 12;
  startingIndex = 0;
  endingIndex = this.booksPerPage;
  showBooks: boolean = false;
  pagesArr = [];
  numOfPages: number;
  currentPage: number = 1;
  theFirstPage: number = 0;
  navigatablePages: number = 4;
  theLastPage: number = this.navigatablePages;
  showPagination = true;
  isLoading$: Observable<boolean>;
  tryAgain$: Observable<boolean>;
  subs : Subscription[] = [];

  constructor(
    private bookService: BookService,
    private store: Store<fromRoot.State>,
    private router: Router,
    private starService: StarService,
    private authService: AuthService,
    private bookDetailsService: BookDetailsService,
    private quotesSerivice: QuotesService,
    private authorsService: AuthorsService,
    private myBooksService: MyBooksService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle("Home"); // CHANGE THE TITLE OF THE PAGE
    this.isLoading$ = this.store.select(fromRoot.getIsLoading); // GET THE STATE OF THE LOADING WORD
    this.fetchAllBooks(); // FETCH ALL THE BOOKS 
    this.fetchAuthors(); // FETCH THE AUTHORS TO GET THEM FASTLY WHEN NAVIGATE TO THE AUTHORS COMPONENT
    this.subs.push(this.store.select(fromRoot.getIsAuth).subscribe(res => (this.isAuth = res)));
    setTimeout(() => {
      this.user = this.authService.getUser();
      this.fetchFavouriteBooks();
    }, 500);
    this.fetchQuotes();
    setTimeout(() => {
      this.showBooks = true;
    }, 1);
    this.allBooks$ = this.store.select(fromRoot.getAllBooks).pipe(
      map(books => {
        this.numOfPages = Math.ceil(books.length / this.booksPerPage);

        return books;
      })
    );
    this.subs.push(this.bookService.inputChanged.subscribe(data => {
      this.searchValue = data;
      this.showBooks = false;

      if (this.searchValue && this.searchValue.replace(/ /g, "").length) {
        this.startingIndex = 0;
        this.endingIndex = undefined;
        this.showPagination = false;
        setTimeout(() => {
          this.showBooks = true;
        }, 4);
      } else {
        this.startingIndex =
          this.currentPage * this.booksPerPage - this.booksPerPage;
        this.endingIndex = this.currentPage * this.booksPerPage;
        this.showPagination = true;
        setTimeout(() => {
          this.showBooks = true;
        }, 4);
      }
    }));
  }

  fetchQuotes() { // FETCH THE QUOTES TO GET THEM FASTLY
    this.quotesSerivice.fetchQuotes();
  }

  fetchAllBooks() {
    this.bookService.fetchAllBooks();
  }

  fetchAuthors() {
    this.authorsService.fetchAuthors();
  }

  fetchFavouriteBooks() { // FETCH MY BOOKS TO GET THEM FASTLY
    const userID = this.user.userID;
    if (this.isAuth) { // ONLY IF THERE IS A USER SIGNED IN
      this.myBooksService.fetchReadBooks(userID);
      this.myBooksService.fetchCurrentBooks(userID);
      this.myBooksService.fetchWantBooks(userID);
    }
  }

  loadBookDetails(bookName: string) { // GO TO BOOK DETAILS
    this.router.navigate(["/content/books", bookName]);
  }

  creatStars(number) {  // CREAT A DUMMY ARRAY TO RENDER AVG RATING STARS
    return {
      arr: this.starService.creatStars(number).starArr,
      i: this.starService.creatStars(number).i
    };
  }

  goToAuthor(authorName) { // NAVIGATE TO THE BOOK'S AUTHOR
    this.router.navigate(["content/authors", authorName]);
  }

  nextBooks(books) { // GO TO THE NEXT PAGE OF THE BOOKS
    if (this.endingIndex <= books.length && books.length >= this.booksPerPage) {
      this.startingIndex += this.booksPerPage;
      this.endingIndex += this.booksPerPage;
      this.currentPage = Math.ceil(this.endingIndex / this.booksPerPage);

      if (
        this.currentPage >= this.navigatablePages &&
        this.theLastPage < this.numOfPages
      ) {
        this.theFirstPage++;
        this.theLastPage++;
      }
    } else {
    }
  }

  previuosBooks(books) { // TO THE PREVIUOS PAGE OF THE BOOKS
    if (this.startingIndex > 0 && books.length >= this.booksPerPage) {
      this.startingIndex -= this.booksPerPage;
      this.endingIndex -= this.booksPerPage;

      this.currentPage = Math.ceil(this.endingIndex / this.booksPerPage);

      if (this.theFirstPage > 0) {
        this.theFirstPage--;
        this.theLastPage--;
      }
    } else {
    }
  }

  firstPage(books) { // TO THE FIRST PAGE OF THE BOOKS
    if (this.startingIndex > 0 && books.length >= this.booksPerPage) {
      this.startingIndex = 0;
      this.endingIndex = this.booksPerPage;
      this.currentPage = Math.ceil(this.endingIndex / this.booksPerPage);
      this.theFirstPage = 0;
      this.theLastPage = this.navigatablePages;
    } else {
    }
  }

  lastPage(books) { // TO THE LAST PAGE OF THE BOOKS
    if (this.endingIndex <= books.length && books.length >= this.booksPerPage) {
      this.startingIndex =
        this.booksPerPage * Math.ceil(books.length / this.booksPerPage) -
        this.booksPerPage;
      this.endingIndex =
        this.booksPerPage * Math.ceil(books.length / this.booksPerPage);
      this.currentPage = Math.ceil(this.endingIndex / this.booksPerPage);
      this.theLastPage = this.currentPage;
      if (this.currentPage < this.navigatablePages) {
        this.theFirstPage = 0;
      } else {
        this.theFirstPage = this.currentPage - this.navigatablePages;
      }
    } else {
    }
  }

  getNumOfPages() { 
    this.pagesArr = [];
    for (let i = 1; i <= this.numOfPages; i++) {
      this.pagesArr.push(i);
    }

    return this.pagesArr;
  }

  goToPage(pageNo: number) { // GO TO A SPECIFIC PAGE
    if (
      pageNo < this.currentPage &&
      this.currentPage >= this.navigatablePages
    ) {
      if (this.theFirstPage > 0) {
        this.theFirstPage--;
        this.theLastPage--;
      } else {
      }
    } else if (pageNo > this.currentPage && pageNo >= this.navigatablePages) {
      if (this.theLastPage < this.numOfPages) {
        this.theFirstPage++;
        this.theLastPage++;
      }
    }
    this.startingIndex = pageNo * this.booksPerPage - this.booksPerPage;
    this.endingIndex = pageNo * this.booksPerPage;
    this.currentPage = pageNo;
  }



  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
