import { Component, OnInit } from '@angular/core';
import { BookService } from './book.service';
import * as fromRoot from "../../app.reducer";
import { Store } from "@ngrx/store";
import { Observable } from 'rxjs';
import { Book } from './book.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  allBooks$ : Observable<Book[]>;

  constructor(private bookService : BookService, private store : Store<fromRoot.State>) { }

  ngOnInit() {
    this.fetchAllBooks();
    this.allBooks$ = this.store.select(fromRoot.getAllBooks);
    
  }

  fetchAllBooks() {
    this.bookService.fetchAllBooks();
  }

}
