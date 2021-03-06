import { Component, OnInit } from "@angular/core";
import * as fromRoot from "../../../app.reducer";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Book } from "../../home/book.model";
import { map } from "rxjs/operators";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { Title } from "@angular/platform-browser";
import { MyBooksService } from "../my-books.service";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-currently-reading",
  templateUrl: "./currently-reading.component.html",
  styleUrls: ["./currently-reading.component.scss"],
  animations: [
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
export class CurrentlyReadingComponent implements OnInit {
  currentBooks$: Observable<Book[]>;
  booksPerPage = 6;
  startingIndex = 0;
  endingIndex = this.booksPerPage;
  navigatablePages = 4;
  theFirstPage = 0;
  theLastPage = this.navigatablePages;
  currentPage = 1;
  numOfPages: number;
  user = this.authService.getUser();
  isLoading$: Observable<boolean>;

  constructor(
    private store: Store<fromRoot.State>,
    private title: Title,
    private myBooksService: MyBooksService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading); // GET THE STATE OF THE LOADING WORD

    if (this.user) {
      this.myBooksService.fetchCurrentBooks(this.user.userID); // FETCH THE CURRENLTY READING BOOKS IF THERE IS A USER SIGNED IN
    }
    this.title.setTitle("My Books - Currently Reading");
    this.currentBooks$ = this.store.select(fromRoot.getCurrentBooks).pipe(
      map(books => {
        this.numOfPages = Math.ceil(books.length / this.booksPerPage);

        return books;
      })
    );
  }

  nextBooks(books) {
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

  previuosBooks(books) {
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

  firstPage(books) {
    if (this.startingIndex > 0 && books.length >= this.booksPerPage) {
      this.startingIndex = 0;
      this.endingIndex = this.booksPerPage;
      this.currentPage = Math.ceil(this.endingIndex / this.booksPerPage);
      this.theFirstPage = 0;
      this.theLastPage = this.navigatablePages;
    } else {
    }
  }

  lastPage(books) {
    if (this.endingIndex <= books.length && books.length >= this.booksPerPage) {
      this.startingIndex =
        this.booksPerPage * Math.ceil(books.length / this.booksPerPage) -
        this.booksPerPage;
      this.endingIndex =
        this.booksPerPage * Math.ceil(books.length / this.booksPerPage);
      this.currentPage = Math.ceil(this.endingIndex / this.booksPerPage);
      this.theLastPage = this.currentPage;
      this.theFirstPage = this.currentPage - this.navigatablePages;
    } else {
    }
  }

  getNumOfPages() {
    const pagesArr = [];
    for (let i = 1; i <= this.numOfPages; i++) {
      pagesArr.push(i);
    }

    return pagesArr;
  }

  goToPage(pageNo: number) {
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
}
