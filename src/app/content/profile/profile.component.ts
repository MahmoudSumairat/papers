import { Component, OnInit } from '@angular/core';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/auth/user.model';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Book } from 'src/app/content/home/book.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user : UserData  ;
  toggleQuoteInput : boolean = true;
  readBooks$ : Observable<Book[]>;
  wantBooks$ : Observable<Book[]>;
  currentBooks$ : Observable<Book[]>;


  constructor(
    private store : Store<fromRoot.State>,
    private authService : AuthService,
    private afs : AngularFirestore
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.readBooks$ = this.store.select(fromRoot.getReadBooks);
    this.currentBooks$ = this.store.select(fromRoot.getCurrentBooks);
    this.wantBooks$ = this.store.select(fromRoot.getWantBooks);

  }

  toggleQuote() {
    this.toggleQuoteInput = !this.toggleQuoteInput;
  }

  submitQuote(quote : HTMLTextAreaElement) {
    if(quote.value) {
      this.afs.collection('users').doc(this.user.userID).set({myQuote : quote.value}, {merge : true});
      this.authService.updateQuote(quote.value);
      this.user = this.authService.getUser();
      this.toggleQuote();
    } 
    
  }



 
}
