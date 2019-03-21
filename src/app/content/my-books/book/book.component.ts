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
import { BookDetailsService } from '../../book-details/book-details.service';
import { MyBooksService } from '../my-books.service';

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
    private router : Router,
    private bookDetialsService : BookDetailsService,
    private myBooksService : MyBooksService
  ) {
 
   }

  ngOnInit() {
    setTimeout(() => {
      this.afs.collection('stars').doc('book_review').collection(this.book.bookName.toLowerCase().replace(/ /g, "_")).doc(this.user.userID)
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

  removeBook() {
    this.myBooksService.removeTheBook(this.book.bookName, this.dist, this.user.userID);
  }


  navigateToBook(bookName : string) {
    this.router.navigate(['/content/books/' + bookName])
  }



  inputChanged(value) {
    this.myBooksService.setDateRead(value, this.dist, this.user.userID, this.book.bookName);
  }

  finishedReading() {
    this.removeBook();
    this.bookDetialsService.readThisBook(this.book, this.user.userID, this.book.bookName, true);
  }

  editDateRead() {
    this.myBooksService.editDateRead(this.dist, this.user.userID, this.book.bookName);
  }
}
