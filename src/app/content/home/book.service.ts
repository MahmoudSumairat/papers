import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Book } from "./book.model";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import * as BookActions from "./book.actions";
import { map } from "rxjs/operators";

@Injectable()
export class BookService {
  constructor(
    private db: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {}

  fetchAllBooks() {
    this.db
      .collection("myBooks")
      .valueChanges()
      .pipe(
        map(books => {
          const dataArray = books.filter(user => user);
          return dataArray.sort((a: any, b: any) => b.avgRating - a.avgRating);
        })
      )
      .subscribe((books: Book[]) => {
        this.store.dispatch(new BookActions.SetAllBooks(books));
      });
  }

  fetchAuthors() {
    this.db
      .collection("authors")
      .valueChanges()
      .subscribe((authors: any[]) => {
        this.store.dispatch(new BookActions.SetAuthors(authors));
      });
  }

  
}
