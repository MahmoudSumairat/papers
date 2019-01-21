import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from "../../app.reducer";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Book } from '../home/book.model';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  selectedBook$ : Observable<Book>;

  constructor(private activatedRoute : ActivatedRoute, private store : Store<fromRoot.State>) { }

  ngOnInit() {
    // let bookName; 
    //  this.activatedRoute.params.subscribe((params : Params) => {
    //   bookName = params['bookName']
    // });
    this.selectedBook$ = this.store.select(fromRoot.getAllBooks)
    .pipe(map(bookArr => {
      return bookArr.find(book => book.bookName === this.activatedRoute.snapshot.params['bookName'])
    }));
    ;
  }

}
