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
import { QuotesService } from '../quotes/quotes.service';
import { AuthorsService } from '../authors/authors.service';
import { map } from 'rxjs/operators';

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
  searchValue : string;
  booksPerPage : number = 12;
  startingIndex = 0;
  endingIndex = this.booksPerPage;
  showBooks : boolean = false;
  pagesArr = [];
  numOfPages : number;
  currentPage : number = 1;
  theFirstPage : number = 0;
  navigatablePages : number = 4;
  theLastPage : number = this.navigatablePages;
  showPagination = true;
  

  constructor(
    private bookService: BookService,
    private store: Store<fromRoot.State>,
    private router: Router,
    private starService : StarService,
    private authService : AuthService,
    private bookDetailsService : BookDetailsService,
    private quotesSerivice : QuotesService,
    private authorsService : AuthorsService
  ) {}

  ngOnInit() {
    
    this.fetchAllBooks();
    this.fetchAuthors();
    this.store.select(fromRoot.getIsAuth).subscribe(res => this.isAuth = res);
    this.fetchFavouriteBooks();
    this.fetchQuotes();
    setTimeout(() => {
      this.showBooks = true;
    }, 1)
    this.allBooks$ = this.store.select(fromRoot.getAllBooks).pipe(map((books) => { 
      this.numOfPages = Math.ceil(books.length/this.booksPerPage);
     
    return books}))
    this.bookService.inputChanged.subscribe(data => {
      this.searchValue = data
      this.showBooks = false;
      
      if(this.searchValue) {
        this.startingIndex = 0;
        this.endingIndex = undefined;
        this.showPagination = false;
        setTimeout(() => {

          this.showBooks = true;
        }, 4)
      } else {
        this.startingIndex = this.currentPage * this.booksPerPage - this.booksPerPage;
        this.endingIndex = this.currentPage * this.booksPerPage;
        this.showPagination = true;
        setTimeout(() => {
          this.showBooks = true;

        }, 4)
      }
    });

  }

  fetchQuotes() {
    this.quotesSerivice.fetchQuotes();
  }

  fetchAllBooks() {
    this.bookService.fetchAllBooks();
  }

  fetchAuthors() {
    this.authorsService.fetchAuthors();
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

  nextBooks(books) {
    console.log(this.numOfPages);
    if(this.endingIndex <= books.length && books.length >= this.booksPerPage) {
      this.startingIndex += this.booksPerPage;
      this.endingIndex += this.booksPerPage;
      this.currentPage = Math.ceil(this.endingIndex/this.booksPerPage);

      if(this.currentPage >= this.navigatablePages && this.theLastPage < this.numOfPages) {
        this.theFirstPage++;
        this.theLastPage++;
      }
    } else {
      console.log('no you dont');
    }
    
  }
  
  previuosBooks(books) {
    if(this.startingIndex > 0 && books.length >= this.booksPerPage) {
      this.startingIndex -= this.booksPerPage;
      this.endingIndex -= this.booksPerPage;
      
      this.currentPage = Math.ceil(this.endingIndex/this.booksPerPage);

      if(this.theFirstPage > 0) {
        this.theFirstPage--;
        this.theLastPage--;
      }
    } else {
      console.log('no you dont');
    } 
  }


  firstPage(books) {
    if(this.startingIndex > 0 && books.length >= this.booksPerPage) {
      this.startingIndex = 0;
      this.endingIndex = this.booksPerPage;
      this.currentPage = Math.ceil(this.endingIndex/this.booksPerPage);
      this.theFirstPage = 0;
      this.theLastPage = this.navigatablePages;


    } else {
      console.log('no you dont');
    }
  }

  lastPage(books) {
    if(this.endingIndex <= books.length && books.length >= this.booksPerPage) {
      this.startingIndex = this.booksPerPage * Math.ceil(books.length / this.booksPerPage  ) - this.booksPerPage;
      this.endingIndex = this.booksPerPage * Math.ceil(books.length / this.booksPerPage );
      this.currentPage = Math.ceil(this.endingIndex/this.booksPerPage);
      this.theLastPage = this.currentPage;
      if(this.currentPage < this.navigatablePages) {
        this.theFirstPage = 0;
      } else {
        this.theFirstPage = this.currentPage - this.navigatablePages;
      }

    } else {
      console.log('no you dont');
    }
  }

  getNumOfPages() {
    this.pagesArr = [];
     for(let i = 1; i <= this.numOfPages; i++ ) {
        this.pagesArr.push(i);
    }

    return this.pagesArr;
  }


  goToPage(pageNo : number) {
    if(pageNo < this.currentPage && this.currentPage >= this.navigatablePages ) {
      if(this.theFirstPage > 0) {
        this.theFirstPage--;
        this.theLastPage--;
        console.log('something')
      } else {
        console.log('no you dont');
      }
    } else if(pageNo > this.currentPage && pageNo >= this.navigatablePages)  {
      console.log('something')
      if(this.theLastPage < this.numOfPages) {
        this.theFirstPage++;
        this.theLastPage++;
      }
    } 
    console.log(this.currentPage);
    console.log(this.theFirstPage, this.theLastPage);
    this.startingIndex = pageNo * this.booksPerPage - this.booksPerPage;
    this.endingIndex = pageNo * this.booksPerPage;
    this.currentPage = pageNo;
    
  }


  
}
