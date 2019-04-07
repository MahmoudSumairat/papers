import { Component, OnInit } from '@angular/core';
import { AuthorsService } from './authors.service';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {Author} from "./author.model";
import { StarService } from '../book-details/star.service';
import { Router } from '@angular/router';
import { BookService } from '../home/book.service';
import { map } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
  animations : [
    trigger('authorState', [
      state('exist', style({
        opacity : 1,
        transform : 'translateZ(0)'
      })),
      transition('void => *', [
        style({
          opacity : 0,
          transform : 'translateZ(-20px)'
        }),
        animate('.25s ease-out')
      ])
    ]),
    trigger('pageState', [
      state('navigatable', style({
        transform : 'scale(1)'
      })),
      transition("void => *", [
        style({
         transform : 'scale(0)' 
        }),
        animate(200)
      ] ),
  
    ])
  ]
})
export class AuthorsComponent implements OnInit {

    allAuthors$ : Observable<Author[]>;
    searchValue : string;
    authorsPerPage : number = 8;
    startingIndex = 0;
    endingIndex = this.authorsPerPage;
    pagesArr = [];
    numOfPages : number;
    currentPage : number = 1;
    theFirstPage : number = 0;
    navigatablePages : number = 4;
    theLastPage : number = this.navigatablePages;
    showPagination = true;
    isLoading$ : Observable<boolean>;
    showAuthors : boolean = true;
    
    

  constructor(
    private authorsService : AuthorsService,
    private store : Store<fromRoot.State>,
    private starsService : StarService,
    private router : Router,
    private bookService : BookService
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.allAuthors$ = this.store.select(fromRoot.getAllAuthors).pipe(map((authors => {
      this.numOfPages = Math.ceil(authors.length/this.authorsPerPage);
      if(!authors.length) {
        this.authorsService.fetchAuthors();

      }

      return authors;

    })))
    this.bookService.fetchAllBooks();
    this.authorsService.inputChanged.subscribe(data => {
      this.searchValue = data
      this.showAuthors = false;

      if(this.searchValue) {
        this.startingIndex = 0;
        this.endingIndex = undefined;
        this.showPagination = false;
        this.showAuthors = true;
    
      } else {
        this.startingIndex = this.currentPage * this.authorsPerPage - this.authorsPerPage;
        this.endingIndex = this.currentPage * this.authorsPerPage;
        this.showPagination = true;
        this.showAuthors = true;
   
      }
    });
  
  }

  createStars(avgRating) {
    return this.starsService.creatStars(avgRating); 
  }

  onLoadBook(bookName) {
    this.router.navigate(['content/books', bookName])
  }


  goToAuthor(authorName : string) {
    this.router.navigate(['content/authors',authorName ])
  }

  
  nextAuthors(books) {
    console.log(this.numOfPages);
    if(this.endingIndex <= books.length && books.length >= this.authorsPerPage) {
      this.startingIndex += this.authorsPerPage;
      this.endingIndex += this.authorsPerPage;
      this.currentPage = Math.ceil(this.endingIndex/this.authorsPerPage);

      if(this.currentPage >= this.navigatablePages && this.theLastPage < this.numOfPages) {
        this.theFirstPage++;
        this.theLastPage++;
      }
    } else {
      console.log('no you dont');
    }
    
  }
  
  previuosAuthors(books) {
    if(this.startingIndex > 0 && books.length >= this.authorsPerPage) {
      this.startingIndex -= this.authorsPerPage;
      this.endingIndex -= this.authorsPerPage;
      
      this.currentPage = Math.ceil(this.endingIndex/this.authorsPerPage);

      if(this.theFirstPage > 0 && this.currentPage >= this.navigatablePages) {
        this.theFirstPage--;
        this.theLastPage--;
      }
    } else {
      console.log('no you dont');
    } 
  }


  firstPage(books) {
    if(this.startingIndex > 0 && books.length >= this.authorsPerPage) {
      this.startingIndex = 0;
      this.endingIndex = this.authorsPerPage;
      this.currentPage = Math.ceil(this.endingIndex/this.authorsPerPage);
      this.theFirstPage = 0;
      this.theLastPage = this.navigatablePages;


    } else {
      console.log('no you dont');
    }
  }

  lastPage(books) {
    if(this.endingIndex <= books.length && books.length >= this.authorsPerPage) {
      this.startingIndex = this.authorsPerPage * Math.ceil(books.length / this.authorsPerPage  ) - this.authorsPerPage;
      this.endingIndex = this.authorsPerPage * Math.ceil(books.length / this.authorsPerPage );
      this.currentPage = Math.ceil(this.endingIndex/this.authorsPerPage);
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
    this.startingIndex = pageNo * this.authorsPerPage - this.authorsPerPage;
    this.endingIndex = pageNo * this.authorsPerPage;
    this.currentPage = pageNo;
    
  }


  

}
