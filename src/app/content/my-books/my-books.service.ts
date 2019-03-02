import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';
import * as BookDetails from "../book-details/book-details.actions";

@Injectable()
export class MyBooksService {
    constructor(
        private afs : AngularFirestore,
        private store : Store<fromRoot.State>
    ) {

    }

    removeTheBook(bookName : string, dist : string, username : string) {
        this.afs.collection(dist).doc('my-books').collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).doc(bookName.toLowerCase().replace(/ /g, "_")).delete();
     this.afs.collection(dist).doc('my-books').collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).valueChanges()
    .subscribe((data : any) => {
      switch(dist) {
        case 'read-books':
        this.store.dispatch(new BookDetails.SetReadBooks(data));
        break;
        case 'currently-reading':
        this.store.dispatch(new BookDetails.SetCurrentBooks(data));
        break;
        case 'want-to-read':
        this.store.dispatch(new BookDetails.SetWantBooks(data));
        break;
      }
    })
    }


    setDateRead(value, dist : string, userName : string, bookName : string) {
        this.afs.collection(dist).doc('my-books').collection(userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).doc(bookName.toLowerCase().replace(/ /g, "_"))
    .set({dateRead : new Date(value.value)}, {merge : true});
    }

    editDateRead(dist : string, userName : string, bookName : string) {
        this.afs.collection(dist).doc('my-books').collection(userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).doc(bookName.toLowerCase().replace(/ /g, "_"))
        .set({dateRead : null}, {merge : true});
    }
}