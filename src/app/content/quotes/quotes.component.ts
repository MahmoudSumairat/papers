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
import { trigger, style, state, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
  animations: [
    trigger('quoteState', [
      state('exist', style({
        transform : 'translateY(0)',
        opacity : 1
      })),
      transition('void => *', [
        style({
          transform : 'translateY(30px)',
          opacity : 0
        }),
        animate(200)
      ]),
      
    ]),
    trigger('pageState', [
      state('navigatable', style({
        transform : 'scale(1)'
      })),
      transition("void => *", [
        style({
         transform : 'scale(0)' 
        }),
        animate(200)
      ] ),
  
    ])
  ]
})

export class QuotesComponent implements OnInit {


  quotes$ : Observable<{name : string, quote : string, id? : string, likes? : []}[]>;
  user : UserData;
  divsArr = [];
  quotesArr = [];
  searchValue : string;
  quotesPerPage : number = 10;
  startingIndex = 0;
  endingIndex = this.quotesPerPage;
  pagesArr = [];
  numOfPages : number;
  currentPage : number = 1;
  theFirstPage : number = 0;
  navigatablePages : number = 4;
  theLastPage : number = this.navigatablePages;
  showPagination = true;
  isLoading$ : Observable<boolean>;
  
  constructor(
    private afs : AngularFirestore,
    private store : Store<fromRoot.State>,
    private quoteSerivce : QuotesService,
    private authService : AuthService,
    private router : Router

  ) { }


  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.quotes$ = this.store.select(fromRoot.getQuotes).pipe(map(quotes => {
      this.numOfPages = Math.ceil(quotes.length/this.quotesPerPage);
      console.log(quotes.length);
      return quotes
    }))
    this.quoteSerivce.fetchQuotes();
    this.user = this.authService.getUser();
    this.quoteSerivce.inputChanged.subscribe(data => {
      
      this.searchValue = data
      
      if(this.searchValue) {
        this.startingIndex = 0;
        this.endingIndex = undefined;
        this.showPagination = false;
       
      } else {
        this.startingIndex = this.currentPage * this.quotesPerPage - this.quotesPerPage;
        this.endingIndex = this.currentPage * this.quotesPerPage;
        this.showPagination = true;
    
      }

    });
   


  
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

  
  nextQuotes(quotes) {
    console.log(this.numOfPages);
    if(this.endingIndex <= quotes.length && quotes.length >= this.quotesPerPage) {
      this.startingIndex += this.quotesPerPage;
      this.endingIndex += this.quotesPerPage;
      this.currentPage = Math.ceil(this.endingIndex/this.quotesPerPage);

      if(this.currentPage >= this.navigatablePages && this.theLastPage < this.numOfPages) {
        this.theFirstPage++;
        this.theLastPage++;
      }
    } else {
      console.log('no you dont');
    }
    
  }
  
  previuosQuotes(quotes) {
    if(this.startingIndex > 0 && quotes.length >= this.quotesPerPage) {
      this.startingIndex -= this.quotesPerPage;
      this.endingIndex -= this.quotesPerPage;
      
      this.currentPage = Math.ceil(this.endingIndex/this.quotesPerPage);

      if(this.theFirstPage > 0) {
        this.theFirstPage--;
        this.theLastPage--;
      }
    } else {
      console.log('no you dont');
    } 
  }


  firstPage(books) {
    if(this.startingIndex > 0 && books.length >= this.quotesPerPage) {
      this.startingIndex = 0;
      this.endingIndex = this.quotesPerPage;
      this.currentPage = Math.ceil(this.endingIndex/this.quotesPerPage);
      this.theFirstPage = 0;
      this.theLastPage = this.navigatablePages;


    } else {
      console.log('no you dont');
    }
  }

  lastPage(books) {
    if(this.endingIndex <= books.length && books.length >= this.quotesPerPage) {
      this.startingIndex = this.quotesPerPage * Math.ceil(books.length / this.quotesPerPage  ) - this.quotesPerPage;
      this.endingIndex = this.quotesPerPage * Math.ceil(books.length / this.quotesPerPage );
      this.currentPage = Math.ceil(this.endingIndex/this.quotesPerPage);
      this.theLastPage = this.currentPage;
      this.theFirstPage = this.currentPage - this.navigatablePages;

    } else {
      console.log('no you dont');
    }
  }

  getNumOfPages() {
    this.pagesArr = [];
     for(let i = 1; i <= this.numOfPages; i++ ) {
        this.pagesArr.push(i);
    }

    return this.pagesArr;
  }


  goToPage(pageNo : number) {
    if(pageNo < this.currentPage && this.currentPage >= this.navigatablePages ) {
      if(this.theFirstPage > 0) {
        this.theFirstPage--;
        this.theLastPage--;
        console.log('something')
      } else {
        console.log('no you dont');
      }
    } else if(pageNo > this.currentPage && pageNo >= this.navigatablePages)  {
      console.log('something')
      if(this.theLastPage < this.numOfPages) {
        this.theFirstPage++;
        this.theLastPage++;
      }
    } 
    console.log(this.currentPage);
    console.log(this.theFirstPage, this.theLastPage);
    this.startingIndex = pageNo * this.quotesPerPage - this.quotesPerPage;
    this.endingIndex = pageNo * this.quotesPerPage;
    this.currentPage = pageNo;
    
  }
  

}
