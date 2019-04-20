import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Book } from "./book.model";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import * as BookActions from "./book.actions";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import * as ui from "../../shared/ui.actions";

@Injectable()
export class BookService {
  inputChanged = new Subject<string>();
  inputValueChanged = new Subject<string>();
  constructor(
    private db: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {}

  fetchAllBooks() { // FETCH THE BOOKS FROM THE DATABASE
    this.store.dispatch(new ui.StartLoading()); // SHOW THE LOADING WORD
    this.db
      .collection("myBooks")
      .valueChanges()
      .pipe(
        map(books => {
          const dataArray = books.filter(user => user);
          return dataArray.sort((a: any, b: any) => b.avgRating - a.avgRating);
        })
      )
      .subscribe(
        (books: Book[]) => {
          this.store.dispatch(new BookActions.SetAllBooks(books));
          this.store.dispatch(new ui.StopLoading());
        },
        error => {
          this.store.dispatch(new ui.ShowTryAgain());
        }
      );
  }
}
