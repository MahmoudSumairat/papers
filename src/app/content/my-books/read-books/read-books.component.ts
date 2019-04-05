import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from "@ngrx/store";
import * as fromRoot from '../../../app.reducer';
import { Observable } from 'rxjs';
import { Book } from '../../home/book.model';
import { StarService } from '../../book-details/star.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserData } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-read-books',
  templateUrl: './read-books.component.html',
  styleUrls: ['./read-books.component.scss'],
})
export class ReadBooksComponent implements OnInit {

  readBooks$ : Observable<Book[]>;
  booksPerPage  = 6;
  startingIndex = 0;
  endingIndex = this.booksPerPage;
  navigatablePages = 4;
  theFirstPage = 0;
  theLastPage = this.navigatablePages;
  currentPage = 1;
  numOfPages : number;


  constructor(
    private store : Store<fromRoot.State>,
    private afs : AngularFirestore,
    private authService : AuthService

  ) { }

  ngOnInit() {
    this.readBooks$ = this.store.select(fromRoot.getReadBooks).pipe(map((books) => {
      this.numOfPages = Math.ceil(books.length/this.booksPerPage);
      return books
    }))


    
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
      this.theFirstPage = this.currentPage - this.navigatablePages;

    } else {
      console.log('no you dont');
    }
  }

  getNumOfPages() {
    console.log(this.numOfPages)
    const pagesArr = [];
     for(let i = 1; i <= this.numOfPages; i++ ) {
        pagesArr.push(i);
    }

    return pagesArr;
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
