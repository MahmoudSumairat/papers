import { Component, OnInit } from '@angular/core';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/auth/user.model';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Book } from 'src/app/content/home/book.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations : [
    trigger('profileState', [
      state('exist', style({
        opacity : 1,
        transform : 'translateZ(0)'
      })),
      transition('void => *' , [
        style({
          opacity: 0,
          transform : 'translateZ(-25px)'
        }),
        animate(250)
      ]),
   
    ] ),
  ]
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
    private afs : AngularFirestore,
    private title : Title
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.title.setTitle(this.user.firstName + ' ' + this.user.lastName);
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
