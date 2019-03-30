import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { QuotesService } from '../quotes/quotes.service';

@Component({
  selector: 'app-my-quotes',
  templateUrl: './my-quotes.component.html',
  styleUrls: ['./my-quotes.component.scss']
})
export class MyQuotesComponent implements OnInit {
  quotes : {name : string, quote : string}[];

  constructor(
    private authService : AuthService,
    private quotesService : QuotesService


  ) { }

  ngOnInit() {
    this.quotes = this.authService.getUser().favQuotes;
  }

  removeQuote(quote) {
    this.quotesService.removeQuote(quote);
    this.quotes = this.authService.getUser().favQuotes;
  }

}
