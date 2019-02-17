import { Component, OnInit, Input } from '@angular/core';
import { Book } from '../../home/book.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/auth.service';
import { UserData } from 'src/app/auth/user.model';
import { StarService } from '../../book-details/star.service';
import * as fromRoot from "../../../app.reducer";
import { Store } from '@ngrx/store';
import * as BookDetails from "../../book-details/book-details.actions";
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @Input()book : Book;
  @Input() dist : string;
  ratingValue : number;
  user : UserData = this.authService.getUser();
  resArr : {
    starArr : number[],
    i
  } = {
    starArr  : [],
    i : 0
  };
  maxDate : Date;

  constructor(
    private afs : AngularFirestore,
    private authService : AuthService,
    private starService : StarService,
    private store : Store<fromRoot.State>,
    private router : Router
  ) {
 
   }

  ngOnInit() {
    setTimeout(() => {
      this.afs.collection('stars').doc('book_review').collection(this.book.bookName.toLowerCase().replace(/ /g, "_")).doc(this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
      .valueChanges().subscribe((data : any) => {
        if(data) {
          this.ratingValue = data.value;
          this.resArr = this.creatStars(this.ratingValue);
        }
        
      });
    }, 10);

    this.maxDate = new Date()
  }


  creatStars(rating : number) {
      return  this.starService.creatStars(rating);
  }

  removeBook(bookName : string) {
    this.afs.collection(this.dist).doc('my-books').collection(this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).doc(bookName.toLowerCase().replace(/ /g, "_")).delete();
    this.afs.collection(this.dist).doc('my-books').collection(this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).valueChanges()
    .subscribe((data : any) => {
      switch(this.dist) {
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


  navigateToBook(bookName : string) {
    this.router.navigate(['/content/books/' + bookName])
  }



  inputChanged(value) {
    this.afs.collection(this.dist).doc('my-books').collection(this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")).doc(this.book.bookName.toLowerCase().replace(/ /g, "_"))
    .set({dateRead : new Date(value.value)}, {merge : true});
  }
}
