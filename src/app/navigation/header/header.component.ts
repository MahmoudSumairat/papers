import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { Observable, Subject } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { UserData } from "src/app/auth/user.model";
import { Router } from '@angular/router';
import { BookService } from 'src/app/content/home/book.service';
import { AuthorsService } from 'src/app/content/authors/authors.service';
import { QuotesService } from 'src/app/content/quotes/quotes.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  user: UserData;
  toggleProDropdown: boolean = false;
  isAuth$: Observable<boolean>;
  @ViewChild('dropdownDiv') dropdownDiv;
  @ViewChild('dropdownItem') dropdownItem;
  @ViewChild('searchInput') searchInput : ElementRef;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private router : Router,
    private booksService : BookService,
    private authorsService : AuthorsService,
    private quotesService : QuotesService
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
    this.isAuth$.subscribe(data => console.log(data));
    this.user = this.authService.getUser();
    console.log(this.searchInput);
    this.booksService.inputValueChanged.subscribe(data => { 
      this.searchInput.nativeElement.value = data;
      this.searchInput.nativeElement.blur();
    });
    
    
  }




  onToggleProDropdown(profileBox, profileIcon) {
    if(profileBox.classList.contains('list-active')) {
      profileBox.classList.remove('list-active');
      profileIcon.classList.remove('account-item-active');
    } else {
      profileBox.classList.add('list-active');
      profileIcon.classList.add('account-item-active');
    }


  }

  onLogout() {
    this.authService.logout();
  }

  goToProfile(profileBox, profileIcon) {
    profileIcon.classList.remove('account-item-active');
    profileBox.classList.remove('list-active');
    this.router.navigate(['/content/profile']);
  }

  goToMyQuotes(profileBox, profileIcon) {
    profileIcon.classList.remove('account-item-active');
    profileBox.classList.remove('list-active');
    this.router.navigate(['/content/my-quotes']);
  }

  searchBooks(input : HTMLInputElement) {
    if(this.router.url === '/content') {
      this.booksService.inputChanged.next(input.value);
    } else if(this.router.url === '/content/authors') {
      this.authorsService.inputChanged.next(input.value);
    } else if(this.router.url === '/content/quotes') {
      this.quotesService.inputChanged.next(input.value);
    }
  }

  navigate(dist) {
    if(dist) {
      this.router.navigate(['/content', dist]);
      this.searchInput.nativeElement.value = '';
      this.booksService.inputChanged.next('');
      this.authorsService.inputChanged.next('');
      this.quotesService.inputChanged.next('');
      
    } else {
      this.router.navigate(['/content']);
      this.searchInput.nativeElement.value = '';
      this.booksService.inputChanged.next('');
      this.authorsService.inputChanged.next('');
      this.quotesService.inputChanged.next('');
    }
  }

  
}
