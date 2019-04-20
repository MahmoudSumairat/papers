import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import * as Authors from "./authors.actions";
import { Author } from "./author.model";
import { Subject } from "rxjs";
import * as ui from "../../shared/ui.actions";
import { map } from "rxjs/operators";

@Injectable()
export class AuthorsService {
  inputChanged = new Subject<string>();
  constructor(
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>
  ) {}

  fetchAuthors() { // FETCH THE AUTHORS FROM THE DATABASE
    this.store.dispatch(new ui.StartLoading());
    this.afs
      .collection("authors")
      .valueChanges()
      .pipe(
        map(books => {
          const dataArray = books.filter(user => user);
          return dataArray.sort((a: any, b: any) => b.avgRating - a.avgRating);
        })
      )
      .subscribe((authors: Author[]) => {
        this.store.dispatch(new Authors.SetAuthors(authors));
        this.store.dispatch(new ui.StopLoading());
      });
  }
}
