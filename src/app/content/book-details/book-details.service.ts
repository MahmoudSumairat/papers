import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { AngularFirestore } from "@angular/fire/firestore";
import { Book } from "../home/book.model";
import * as bookDetails from "../book-details/book-details.actions";
import { Router } from '@angular/router';
@Injectable()
export class BookDetailsService {
  constructor(
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore,
    private router : Router
  ) {}

  readThisBook(book: Book, userID: string, bookName: string, finishedReading = false) {
    this.afs
      .collection("read-books")
      .doc('my-books')
      .collection(userID)
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .set({...book,
          dateAdded : new Date(),
          dateRead : finishedReading ? new Date() : null
      })
      .then(() => {
        this.afs
          .collection("read-books")
          .doc('my-books')
          .collection(userID)
          .valueChanges()
          .subscribe((data: Book[]) => {
            this.store.dispatch(new bookDetails.SetReadBooks(data));
          });
      });
  }

  currentlyReadingThisBook(book: Book, userID : string, bookName: string) {
    this.afs
      .collection("currently-reading")
      .doc('my-books')
      .collection(userID)
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .set({...book,
        dateAdded : new Date()
      })
      .then(resolve => {
        this.afs
          .collection("currently-reading")
          .doc('my-books')
          .collection(userID)
          .valueChanges()
          .subscribe((data: Book[]) => {
            this.store.dispatch(new bookDetails.SetCurrentBooks(data));
          });
      });
  }

  wantToReadThisBook(book: Book, userID: string, bookName: string) {
    this.afs
      .collection("want-to-read")
      .doc('my-books')
      .collection(userID)
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .set({...book,
        dateAdded : new Date()
      })
      .then(resolve => {
        this.afs
          .collection("want-to-read")
          .doc('my-books')
          .collection(userID)
          .valueChanges()
          .subscribe((data: Book[]) => {
            this.store.dispatch(new bookDetails.SetWantBooks(data));
          });
      });
  }

  undoChanges(
    booksArray: Book[],
    bookName: string,
    userID: string,
    dist: string
  ) {
      const newArray = booksArray.filter(book => book.bookName !== bookName);
      this.afs.collection(dist).doc('my-books').collection(userID)
      .doc(bookName.toLowerCase().replace(/ /g, '_')).delete().then(() => {
        switch(dist) {
          case 'read-books':
         
          this.store.dispatch(new bookDetails.SetReadBooks(newArray))

          return
          case 'currently-reading':
          this.store.dispatch(new bookDetails.SetCurrentBooks(newArray))
          return
          case 'want-to-read':

          this.store.dispatch(new bookDetails.SetWantBooks(newArray))
          return
          default:
          return
      
      
  }
      })

        
  }

  fetchReadBooks(userID : string) {
    this.afs.collection('read-books').doc('my-books').collection(userID).valueChanges()
    .subscribe((booksArr : Book[]) => {
      if(booksArr) {
        this.store.dispatch(new bookDetails.SetReadBooks(booksArr))
      }
    })
  }

  fetchCurrentBooks(userID : string) {
    this.afs.collection('currently-reading').doc('my-books').collection(userID).valueChanges()
    .subscribe((booksArr : Book[]) => {
      if(booksArr) {
        this.store.dispatch(new bookDetails.SetCurrentBooks(booksArr))
      }
    })
  }

  fetchWantBooks(userID : string) {
    this.afs.collection('want-to-read').doc('my-books').collection(userID).valueChanges()
    .subscribe((booksArr : Book[]) => {
      if(booksArr) {
        this.store.dispatch(new bookDetails.SetWantBooks(booksArr))
      }
    })
  }


  removeThisBook(book : Book) {
    this.afs.collection('myBooks').doc(book.bookName.toLowerCase().replace(/ /g, '_')).delete().then(() => {
        this.router.navigate(['/content']);
    })  
  }

  
}
