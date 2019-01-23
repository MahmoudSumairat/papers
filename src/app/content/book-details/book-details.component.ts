import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from "../../app.reducer";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Book } from '../home/book.model';
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from 'src/app/auth/auth.service';
import { UserData } from 'src/app/auth/user.model';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  i : number;
  starRating;
  ratingLength;
  output : number[] = [];
  selectedBook$ : Observable<Book>;
  avgRating : Observable<any>;
  bookName : string =  this.activatedRoute.snapshot.params['bookName'];
  userName = this.authService.getUser().userName;
  myRating : Observable<any>;
  rateTitle : string = 'Rate this book';


  constructor(private activatedRoute : ActivatedRoute,
              private store : Store<fromRoot.State>, 
              private afs : AngularFirestore,
              private authService : AuthService
              ) { }

  ngOnInit() {
    this.selectedBook$ = this.store.select(fromRoot.getAllBooks)
    .pipe(map(bookArr => {
      return bookArr.find(book => book.bookName === this.bookName)
    }));
    
    this.avgRating = this.afs.collection('stars').doc('book_review').collection(this.bookName.toLowerCase().replace(/ /g, "_"))
    .valueChanges().pipe(map(data => {
      const ratings = data.map(object => object.value)
      this.ratingLength = ratings.length;
       return ratings.length ? (ratings.reduce((accum, value) =>  accum + value )) / ratings.length : 'Not Reviewd'
    }))

   this.avgRating.subscribe(data => {
     this.starRating = data;
     this.output = [];
     for(this.i = this.starRating; this.i >= 1; this.i--) {
        this.output.push(1);
     }
   });

   this.afs.collection('stars').doc('book_review').collection(this.bookName.toLowerCase().replace(/ /g, "_")).doc(this.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ''))
   .valueChanges()
   .subscribe(
     data => {
       if(data) {
         this.rateTitle = 'You rated this book'
       } else {
         this.rateTitle = 'Rate this book'
       }
     }
   )

 

  }


  

}
