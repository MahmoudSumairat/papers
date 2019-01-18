import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Book } from "./book.model";
import { Store } from '@ngrx/store';
import * as fromRoot from "../../app.reducer";
import * as BookActions from "./book.actions";

@Injectable()
export class BookService {

    constructor(private db : AngularFirestore, private store : Store<fromRoot.State>) {}

    fetchAllBooks() {
        this.db.collection('allBooks').valueChanges().subscribe((books : Book[]) => {
            this.store.dispatch(new BookActions.SetAllBooks(books));
        })
    }
    
}