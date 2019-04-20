import { Component, OnInit } from "@angular/core";
import { AuthorsService } from "./authors.service";
import * as fromRoot from "../../app.reducer";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Author } from "./author.model";
import { StarService } from "../book-details/star.service";
import { Router } from "@angular/router";
import { BookService } from "../home/book.service";
import { map } from "rxjs/operators";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-authors",
  templateUrl: "./authors.component.html",
  styleUrls: ["./authors.component.scss"],
  animations: [
    trigger("authorState", [
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
          transform: "translateZ(-20px)"
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
export class AuthorsComponent implements OnInit {
  allAuthors$: Observable<Author[]>;
  searchValue: string;
  authorsPerPage: number = 8;
  startingIndex = 0;
  endingIndex = this.authorsPerPage;
  pagesArr = [];
  numOfPages: number;
  currentPage: number = 1;
  theFirstPage: number = 0;
  navigatablePages: number = 4;
  theLastPage: number = this.navigatablePages;
  showPagination = true;
  isLoading$: Observable<boolean>;
  showAuthors: boolean = true;

  constructor(
    private authorsService: AuthorsService,
    private store: Store<fromRoot.State>,
    private starsService: StarService,
    private router: Router,
    private bookService: BookService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle("Authors"); // CHANGE THE TITLE OF THE PAGE
    this.isLoading$ = this.store.select(fromRoot.getIsLoading); // GET THE STATE OF THE LAODING WORD
    this.allAuthors$ = this.store.select(fromRoot.getAllAuthors).pipe(
      map(authors => {
        this.numOfPages = Math.ceil(authors.length / this.authorsPerPage);
        if (!authors.length) { // THIS TRICK IS TO AVOID FETCHING THE AUTHORS TWICE
          this.authorsService.fetchAuthors();
        }

        return authors;
      })
    );
    this.bookService.fetchAllBooks();
    this.authorsService.inputChanged.subscribe(data => {
      this.searchValue = data;
      this.showAuthors = false;

      if (this.searchValue) { // IF THE SEARCH INPUT HAS A VALUE THEN I WILL REMOVE THE PAGINATION
        this.startingIndex = 0;
        this.endingIndex = undefined;
        this.showPagination = false;
        this.showAuthors = true;
      } else { // IF THE INPUT HAS NO VALUE I WILL REIMPLEMENT THE PAGINATION
        this.startingIndex =
          this.currentPage * this.authorsPerPage - this.authorsPerPage;
        this.endingIndex = this.currentPage * this.authorsPerPage;
        this.showPagination = true;
        this.showAuthors = true;
      }
    });
  }

  createStars(avgRating) { // CREATE A DUMMY STARTS ARRAY
    return this.starsService.creatStars(avgRating);
  }

  onLoadBook(bookName) { // GO TO THE BEST BOOK OF THE AUTHOR
    this.router.navigate(["content/books", bookName]);
  }

  goToAuthor(authorName: string) { // GO TO THE AUTHOR'S DETAILS
    this.router.navigate(["content/authors", authorName]);
  }

  nextAuthors(books) { // GO TO THE NEXT PAGE OF THE AUTHORS
    console.log(this.numOfPages);
    if (
      this.endingIndex <= books.length &&
      books.length >= this.authorsPerPage
    ) {
      this.startingIndex += this.authorsPerPage;
      this.endingIndex += this.authorsPerPage;
      this.currentPage = Math.ceil(this.endingIndex / this.authorsPerPage);

      if (
        this.currentPage >= this.navigatablePages &&
        this.theLastPage < this.numOfPages
      ) {
        this.theFirstPage++;
        this.theLastPage++;
      }
    } else {
      console.log("no you dont");
    }
  }

  previuosAuthors(books) { // GO TO THE PERVIUOS PAGE OF THE AUTHORS
    if (this.startingIndex > 0 && books.length >= this.authorsPerPage) {
      this.startingIndex -= this.authorsPerPage;
      this.endingIndex -= this.authorsPerPage;

      this.currentPage = Math.ceil(this.endingIndex / this.authorsPerPage);

      if (this.theFirstPage > 0 && this.currentPage >= this.navigatablePages) {
        this.theFirstPage--;
        this.theLastPage--;
      }
    } else {
      console.log("no you dont");
    }
  }

  firstPage(books) { // GO TO THE FIRST PAGE OF THE AUTHORS
    if (this.startingIndex > 0 && books.length >= this.authorsPerPage) {
      this.startingIndex = 0;
      this.endingIndex = this.authorsPerPage;
      this.currentPage = Math.ceil(this.endingIndex / this.authorsPerPage);
      this.theFirstPage = 0;
      this.theLastPage = this.navigatablePages;
    } else {
      console.log("no you dont");
    }
  }

  lastPage(books) { // GO TO THE LAST PAGE OF THE AUTHORS
    if (
      this.endingIndex <= books.length &&
      books.length >= this.authorsPerPage
    ) {
      this.startingIndex =
        this.authorsPerPage * Math.ceil(books.length / this.authorsPerPage) -
        this.authorsPerPage;
      this.endingIndex =
        this.authorsPerPage * Math.ceil(books.length / this.authorsPerPage);
      this.currentPage = Math.ceil(this.endingIndex / this.authorsPerPage);
      this.theLastPage = this.currentPage;
      if (this.currentPage < this.navigatablePages) {
        this.theFirstPage = 0;
      } else {
        this.theFirstPage = this.currentPage - this.navigatablePages;
      }
    } else {
      console.log("no you dont");
    }
  }

  getNumOfPages() { // GET THE NUMBER OF PAGES ACCORDING TO THE NUMBER OF AUTHORS
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
        console.log("something");
      } else {
        console.log("no you dont");
      }
    } else if (pageNo > this.currentPage && pageNo >= this.navigatablePages) {
      console.log("something");
      if (this.theLastPage < this.numOfPages) {
        this.theFirstPage++;
        this.theLastPage++;
      }
    }

    this.startingIndex = pageNo * this.authorsPerPage - this.authorsPerPage;
    this.endingIndex = pageNo * this.authorsPerPage;
    this.currentPage = pageNo;
  }
}
