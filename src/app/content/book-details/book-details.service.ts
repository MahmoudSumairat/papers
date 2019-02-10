import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { AngularFirestore } from "@angular/fire/firestore";
import { Book } from "../home/book.model";
import * as bookDetails from "../book-details/book-details.actions";
@Injectable()
export class BookDetailsSerice {
  constructor(
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore
  ) {}

  readThisBook(book: Book, username: string, bookName: string) {
    this.afs
      .collection("favourites")
      .doc(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
      .collection("read-books")
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .set(book)
      .then(resolve => {
        this.afs
          .collection("favourites")
          .doc(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
          .collection("read-books")
          .valueChanges()
          .subscribe((data: Book[]) => {
            this.store.dispatch(new bookDetails.SetReadBooks(data));
          });
      });
  }

  currentlyReadingThisBook(book: Book, username: string, bookName: string) {
    this.afs
      .collection("favourites")
      .doc(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
      .collection("currently-reading")
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .set(book)
      .then(resolve => {
        this.afs
          .collection("favourites")
          .doc(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
          .collection("currently-reading")
          .valueChanges()
          .subscribe((data: Book[]) => {
            this.store.dispatch(new bookDetails.SetReadBooks(data));
          });
      });
  }

  wantToReadThisBook(book: Book, username: string, bookName: string) {
    this.afs
      .collection("favourites")
      .doc(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
      .collection("want-to-read")
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .set(book)
      .then(resolve => {
        this.afs
          .collection("favourites")
          .doc(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
          .collection("want-to-read")
          .valueChanges()
          .subscribe((data: Book[]) => {
            this.store.dispatch(new bookDetails.SetReadBooks(data));
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
    this.afs
      .collection("favourites")
      .doc(username.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
      .collection(dist)
      .doc(bookName.toLowerCase().replace(/ /g, "_"))
      .delete().then(() => {
          switch(dist) {
              case 'read-books':
              this.store.dispatch(new bookDetails.SetReadBooks(newArray))
              this.store.dispatch(new bookDetails.SetCurrentBooks(null))
              this.store.dispatch(new bookDetails.SetWantBooks(null))
              console.log('read state')
              return
              case 'currently-reading':
              this.store.dispatch(new bookDetails.SetReadBooks(null))
              this.store.dispatch(new bookDetails.SetCurrentBooks(newArray))
              this.store.dispatch(new bookDetails.SetWantBooks(null))
              console.log('current state')
              return
              case 'want-to-read':
              this.store.dispatch(new bookDetails.SetReadBooks(null))
              this.store.dispatch(new bookDetails.SetCurrentBooks(null))
              this.store.dispatch(new bookDetails.SetWantBooks(newArray))
              console.log('want state')
              return
              default:
              return
          }
          
      })
  }
}
