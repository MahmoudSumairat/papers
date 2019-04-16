import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { QuotesService } from '../quotes/quotes.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-quotes',
  templateUrl: './my-quotes.component.html',
  styleUrls: ['./my-quotes.component.scss'],
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
      ])
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
export class MyQuotesComponent implements OnInit {
  quotes : {name : string, quote : string}[];
  quotesPerPage : number = 10;
  startingIndex = 0;
  endingIndex = this.quotesPerPage;
  showBooks : boolean = false;
  pagesArr = [];
  numOfPages : number;
  currentPage : number = 1;
  theFirstPage : number = 0;
  navigatablePages : number = 4;
  theLastPage : number = this.navigatablePages;
  

  constructor(
    private authService : AuthService,
    private quotesService : QuotesService,
    private title : Title


  ) { }

  ngOnInit() {
    this.title.setTitle('My Quotes');
    this.quotes = this.authService.getUser().favQuotes;
    this.numOfPages = Math.ceil(this.quotes.length/this.quotesPerPage);

  }

  removeQuote(quote) {
    this.quotesService.removeQuote(quote);
    this.quotes = this.authService.getUser().favQuotes;
  }

  
  nextQuotes(books) {
    console.log(this.numOfPages);
    if(this.endingIndex <= books.length && books.length >= this.quotesPerPage) {
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
  
  previuosQuotes(books) {
    if(this.startingIndex > 0 && books.length >= this.quotesPerPage) {
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
