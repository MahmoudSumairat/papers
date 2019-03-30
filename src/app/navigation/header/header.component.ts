import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { Observable, Subject } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { UserData } from "src/app/auth/user.model";
import { Router } from '@angular/router';
import { BookService } from 'src/app/content/home/book.service';

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

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private router : Router,
    private booksService : BookService
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
    this.isAuth$.subscribe(data => console.log(data));
    this.user = this.authService.getUser();
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
    this.booksService.inputChanged.next(input.value);
  }
}
