import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as fromRoot from "../../app.reducer";
import { map } from "rxjs/operators";
import { Book } from '../home/book.model';
import { Author } from '../authors/author.model';
import { Observable } from 'rxjs';
import { QuotesService } from './quotes.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UserData } from 'src/app/auth/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})

export class QuotesComponent implements OnInit {


  quotes : Observable<{name : string, quote : string, id? : string, likes? : []}[]>;
  user : UserData;
  divsArr = [];
  quotesArr = [];
  
  constructor(
    private afs : AngularFirestore,
    private store : Store<fromRoot.State>,
    private quoteSerivce : QuotesService,
    private authService : AuthService,
    private router : Router

  ) { }


  ngOnInit() {
    this.quotes = this.store.select(fromRoot.getQuotes);
    this.quoteSerivce.fetchQuotes();
    this.user = this.authService.getUser();
    
   


  
  }

  likeQuote(quote) {
    if(this.user.userID) {
      this.quoteSerivce.likeQuote(quote, this.user);
      
    } else {
      this.router.navigate(['/login'])
    }
    
    setTimeout(() => {
      if(!this.divsArr.includes((<HTMLDivElement>document.querySelector('#div-' + quote.id)).id)) {
        this.divsArr.push((<HTMLDivElement>document.querySelector('#div-' + quote.id)).id);
        console.log('like state');
      } else {
        console.log('unlike state');
        this.divsArr = this.divsArr.filter(div => {
          return div !== (<HTMLDivElement>document.querySelector('#div-' + quote.id)).id;
        })
      }

      const newDivsArr = [];

      this.divsArr.forEach(id => {
        newDivsArr.push(<HTMLDivElement>document.querySelector('#' + id));
        console.log(id);
      })


      newDivsArr.forEach(div => {
        div.style.color = '#3498db';
      })
      console.log(this.divsArr)
      console.log(newDivsArr)
    }, 10);

  }

  checkQuote(quote) {
    if(quote.likes) {
      if(quote.likes.includes(this.user.userID)) {
        this.divsArr.push('div-' + quote.id);
        return '#3498db'
      } else {
        return '#0a0d0f';
      }
    } else {
      return '#0a0d0f';
    }
  }

  favQuote(quote, fav) { 
    if(this.user.userID) {
        this.quoteSerivce.favQuote(quote);
      this.checkFavQuote(quote, fav);
    
  } else {
    this.router.navigate(['/login']);
  }
  }

  checkFavQuote(currentQuote, fav) {
    this.user = this.authService.getUser();
    if(this.user.favQuotes.some(quote => quote.quote === currentQuote.quote)) {
      fav.style.color = '#daa520';
    } else {
      fav.style.color = '#0a0d0f';
    }
    
  }

  checkFavQuotesOnInit(currentQuote) {
    if(this.user.userID) {
      if(this.user.favQuotes) {
        if(this.user.favQuotes.some(quote => quote.quote === currentQuote.quote)) {
          return  '#daa520';
        } else {
          return  '#0a0d0f';
        }
      }
    } else {
      return '#0a0d0f';
    }
 
  }
  

}
