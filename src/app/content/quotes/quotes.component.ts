import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { map } from "rxjs/operators";
import { Book } from "../home/book.model";
import { Author } from "../authors/author.model";
import { Observable, Subscription } from "rxjs";
import { QuotesService } from "./quotes.service";
import { AuthService } from "src/app/auth/auth.service";
import { UserData } from "src/app/auth/user.model";
import { Router } from "@angular/router";
import {
  trigger,
  style,
  state,
  transition,
  animate
} from "@angular/animations";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-quotes",
  templateUrl: "./quotes.component.html",
  styleUrls: ["./quotes.component.scss"],
  animations: [
    trigger("quoteState", [
      state(
        "exist",
        style({
          transform: "translateY(0)",
          opacity: 1
        })
      ),
      transition("void => *", [
        style({
          transform: "translateY(30px)",
          opacity: 0
        }),
        animate(200)
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
export class QuotesComponent implements OnInit {
  quotes$: Observable<
    { name: string; quote: string; id?: string; likes?: [] }[]
  >;
  user: UserData;
  divsArr = [];
  quotesArr = [];
  searchValue: string;
  quotesPerPage: number = 10;
  startingIndex = 0;
  endingIndex = this.quotesPerPage;
  pagesArr = [];
  numOfPages: number;
  currentPage: number = 1;
  theFirstPage: number = 0;
  navigatablePages: number = 4;
  theLastPage: number = this.navigatablePages;
  showPagination = true;
  isLoading$: Observable<boolean>;
  subs : Subscription[] = [];

  constructor(
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>,
    private quoteSerivce: QuotesService,
    private authService: AuthService,
    private router: Router,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle("Quotes"); // CHANGE THE TITLE OF THE PAGE
    this.isLoading$ = this.store.select(fromRoot.getIsLoading); // GET THE STATE OF LOADING WORD
    this.quotes$ = this.store.select(fromRoot.getQuotes).pipe(
      map(quotes => {
        this.numOfPages = Math.ceil(quotes.length / this.quotesPerPage);
        return quotes;
      })
    ); //GET THE NUMBER OF PAGES
    this.quoteSerivce.fetchQuotes();
    this.user = this.authService.getUser();
    this.subs.push(this.quoteSerivce.inputChanged.subscribe(data => {
      this.searchValue = data;

      if (this.searchValue) {
        this.startingIndex = 0;
        this.endingIndex = undefined;
        this.showPagination = false;
      } else {
        this.startingIndex =
          this.currentPage * this.quotesPerPage - this.quotesPerPage;
        this.endingIndex = this.currentPage * this.quotesPerPage;
        this.showPagination = true;
      }
    }));
  }

  likeQuote(quote) { // LIKE THIS QUOTE
    if (this.user.userID) {
      this.quoteSerivce.likeQuote(quote, this.user);
    } else {
      this.router.navigate(["/login"]);
    }

    setTimeout(() => { // WE PUT THE SET TIME OUT FUNCTION BECAUSE WHEN THE LIKE IS SENT TO THE DATABASE IT RETURN A WHOLE NEW MARKUP SO WE SHOULD DO THE STYLING WORK AFTER THE NEW MARKUP HAS REACHED
      if (
        !this.divsArr.includes(
          (<HTMLDivElement>document.querySelector("#div-" + quote.id)).id
        )
      ) {
        this.divsArr.push(
          (<HTMLDivElement>document.querySelector("#div-" + quote.id)).id
        );
      } else {
        this.divsArr = this.divsArr.filter(div => {
          return (
            div !==
            (<HTMLDivElement>document.querySelector("#div-" + quote.id)).id
          );
        });
      }

      const newDivsArr = [];

      this.divsArr.forEach(id => {
        newDivsArr.push(<HTMLDivElement>document.querySelector("#" + id));
      });

      newDivsArr.forEach(div => {
        div.style.color = "#3498db";
      });
    }, 10);
  }

  checkQuote(quote) { // CHECK IF THE QUOTE IS LIKED OR NOT
    if (quote.likes) {
      if (quote.likes.includes(this.user.userID)) {
        this.divsArr.push("div-" + quote.id);
        return "#3498db";
      } else {
        return "#0a0d0f";
      }
    } else {
      return "#0a0d0f";
    }
  }

  favQuote(quote, fav) { // ADD THE QUOTE TO FAV QUOTE
    if (this.user.userID) {
      this.quoteSerivce.favQuote(quote);
      this.checkFavQuote(quote, fav);
    } else {
      this.router.navigate(["/login"]);
    }
  }

  checkFavQuote(currentQuote, fav) { // CHECK IF THE QUOTE IS FAV QUOTE OR NOT
    this.user = this.authService.getUser();
    if (this.user.favQuotes.some(quote => quote.quote === currentQuote.quote)) {
      fav.style.color = "#daa520";
    } else {
      fav.style.color = "#0a0d0f";
    }
  }

  checkFavQuotesOnInit(currentQuote) { // CHECK IF THIS QUOTE IS FAV QUOTE ON INIT
    if (this.user.userID) {
      if (this.user.favQuotes) {
        if (
          this.user.favQuotes.some(quote => quote.quote === currentQuote.quote)
        ) {
          return "#daa520";
        } else {
          return "#0a0d0f";
        }
      }
    } else {
      return "#0a0d0f";
    }
  }

  nextQuotes(quotes) { // TO THE NEXT PAGE OF QUOTES
    if (
      this.endingIndex <= quotes.length &&
      quotes.length >= this.quotesPerPage
    ) {
      this.startingIndex += this.quotesPerPage;
      this.endingIndex += this.quotesPerPage;
      this.currentPage = Math.ceil(this.endingIndex / this.quotesPerPage);

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

  previuosQuotes(quotes) { // TO THE PREVIUOS PAGE OF QUOTES
    if (this.startingIndex > 0 && quotes.length >= this.quotesPerPage) {
      this.startingIndex -= this.quotesPerPage;
      this.endingIndex -= this.quotesPerPage;

      this.currentPage = Math.ceil(this.endingIndex / this.quotesPerPage);

      if (this.theFirstPage > 0) {
        this.theFirstPage--;
        this.theLastPage--;
      }
    } else {
    }
  }

  firstPage(books) { // TO THE FIRTS PAGE OF QUOTES
    if (this.startingIndex > 0 && books.length >= this.quotesPerPage) {
      this.startingIndex = 0;
      this.endingIndex = this.quotesPerPage;
      this.currentPage = Math.ceil(this.endingIndex / this.quotesPerPage);
      this.theFirstPage = 0;
      this.theLastPage = this.navigatablePages;
    } else {
    }
  }

  lastPage(books) { // TO THE LAST PAGE OF QUOTES
    if (
      this.endingIndex <= books.length &&
      books.length >= this.quotesPerPage
    ) {
      this.startingIndex =
        this.quotesPerPage * Math.ceil(books.length / this.quotesPerPage) -
        this.quotesPerPage;
      this.endingIndex =
        this.quotesPerPage * Math.ceil(books.length / this.quotesPerPage);
      this.currentPage = Math.ceil(this.endingIndex / this.quotesPerPage);
      this.theLastPage = this.currentPage;
      this.theFirstPage = this.currentPage - this.navigatablePages;
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

  goToPage(pageNo: number) { // TO A SPECIFIC PAGE
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
    this.startingIndex = pageNo * this.quotesPerPage - this.quotesPerPage;
    this.endingIndex = pageNo * this.quotesPerPage;
    this.currentPage = pageNo;
  }
}
