import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { AngularFirestore } from "@angular/fire/firestore";
import { Book } from "../home/book.model";
import * as bookDetails from "../book-details/book-details.actions";
@Injectable()
export class BookDetailsService {
  constructor(
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore,
  ) {}

  readThisBook(book: Book, username: string, bookName: string, finishedReading = false) {
    this.afs
      .collection("read-books")
      .doc('my-books')
      .collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .set({...book,
          dateAdded : new Date(),
          dateRead : finishedReading ? new Date() : null
      })
      .then(() => {
        this.afs
          .collection("read-books")
          .doc('my-books')
          .collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
          .valueChanges()
          .subscribe((data: Book[]) => {
            this.store.dispatch(new bookDetails.SetReadBooks(data));
          });
      });
  }

  currentlyReadingThisBook(book: Book, username: string, bookName: string) {
    this.afs
      .collection("currently-reading")
      .doc('my-books')
      .collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .set({...book,
        dateAdded : new Date()
      })
      .then(resolve => {
        this.afs
          .collection("currently-reading")
          .doc('my-books')
          .collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
          .valueChanges()
          .subscribe((data: Book[]) => {
            this.store.dispatch(new bookDetails.SetCurrentBooks(data));
          });
      });
  }

  wantToReadThisBook(book: Book, username: string, bookName: string) {
    this.afs
      .collection("want-to-read")
      .doc('my-books')
      .collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .set({...book,
        dateAdded : new Date()
      })
      .then(resolve => {
        this.afs
          .collection("currently-reading")
          .doc('my-books')
          .collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
          .valueChanges()
          .subscribe((data: Book[]) => {
            this.store.dispatch(new bookDetails.SetWantBooks(data));
          });
      });
  }

  undoChanges(
    booksArray: Book[],
    bookName: string,
    username: string,
    dist: string
  ) {
      const newArray = booksArray.filter(book => book.bookName !== bookName);
      this.afs.collection(dist).doc('my-books').collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
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

  fetchReadBooks(username : string) {
    this.afs.collection('read-books').doc('my-books').collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).valueChanges()
    .subscribe((booksArr : Book[]) => {
      if(booksArr) {
        this.store.dispatch(new bookDetails.SetReadBooks(booksArr))
      }
    })
  }

  fetchCurrentBooks(username : string) {
    this.afs.collection('currently-reading').doc('my-books').collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).valueChanges()
    .subscribe((booksArr : Book[]) => {
      if(booksArr) {
        this.store.dispatch(new bookDetails.SetCurrentBooks(booksArr))
      }
    })
  }

  fetchWantBooks(username : string) {
    this.afs.collection('want-to-read').doc('my-books').collection(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).valueChanges()
    .subscribe((booksArr : Book[]) => {
      if(booksArr) {
        this.store.dispatch(new bookDetails.SetWantBooks(booksArr))
      }
    })
  }

  
}
