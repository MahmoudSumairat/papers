import { Component, OnInit } from "@angular/core";
import { BookService } from "./book.service";
import * as fromRoot from "../../app.reducer";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Book } from "./book.model";
import { Router } from "@angular/router";
import { StarService } from '../book-details/star.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BookDetailsService } from '../book-details/book-details.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  allBooks$: Observable<Book[]>;
  avgRating : Observable<number>;
  i : number;
  user = this.authService.getUser();
  isAuth : boolean;

  constructor(
    private bookService: BookService,
    private store: Store<fromRoot.State>,
    private router: Router,
    private starService : StarService,
    private authService : AuthService,
    private bookDetailsService : BookDetailsService
  ) {}

  ngOnInit() {
    this.fetchAllBooks();
    this.fetchAuthors();
    this.allBooks$ = this.store.select(fromRoot.getAllBooks);
    this.store.select(fromRoot.getIsAuth).subscribe(res => this.isAuth = res);
    this.fetchFavouriteBooks();
  }

  fetchAllBooks() {
    this.bookService.fetchAllBooks();
  }

  fetchAuthors() {
    this.bookService.fetchAuthors();
  }

  fetchFavouriteBooks() {
    const userID = this.user.userID
    if(this.isAuth) {
      this.bookDetailsService.fetchReadBooks(userID);
      this.bookDetailsService.fetchCurrentBooks(userID);
      this.bookDetailsService.fetchWantBooks(userID);
    }
  }

  loadBookDetails(bookName: string) {
    this.router.navigate(["/content/books", bookName]);
  }

  creatStars(number) {
    return {
      arr : this.starService.creatStars(number).starArr,
      i : this.starService.creatStars(number).i
    }
  }

  goToAuthor(authorName) {
    this.router.navigate(['content/authors', authorName])
  }
}
