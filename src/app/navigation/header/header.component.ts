import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { Observable, Subject, Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { UserData } from "src/app/auth/user.model";
import { Router } from "@angular/router";
import { BookService } from "src/app/content/home/book.service";
import { AuthorsService } from "src/app/content/authors/authors.service";
import { QuotesService } from "src/app/content/quotes/quotes.service";
import * as ui from "../../shared/ui.actions";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  animations: [
    trigger("profileBoxState", [
      state(
        "exist",
        style({
          opacity: 1,
          transform: "translateY(0)"
        })
      ),
      transition("void => *", [
        style({
          opacity: 0,
          transform: "translateX(-15px)"
        }),
        animate(".25s ease-out")
      ]),
      transition("* => void", [
        animate(
          ".25s ease-out",
          style({
            opacity: 0,
            transform: "translateX(-15px)"
          })
        )
      ])
    ]),
    trigger("iconState", [
      state(
        "exist",
        style({
          transform: "translateZ(0)",
          opacity: 1
        })
      ),
      transition("void => *", [
        style({
          transform: "translateZ(30px)",
          opacity: 0
        }),
        animate(200)
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  user: UserData;
  toggleProDropdown: boolean = false;
  isAuth$: Observable<boolean>;
  @ViewChild("dropdownDiv") dropdownDiv;
  @ViewChild("dropdownItem") dropdownItem;
  @ViewChild("searchInput") searchInput: ElementRef;
  showProfileBox: boolean;
  navIcon = "menu";
  searchIcon = "search";
  subs : Subscription[] = [];

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService,
    private router: Router,
    private booksService: BookService,
    private authorsService: AuthorsService,
    private quotesService: QuotesService
  ) {}

  ngOnInit() {
    this.store.select(fromRoot.getShow).subscribe(data => {
      this.showProfileBox = data;
    }); // GET THE STATE OF PROFIE BOX
    this.isAuth$ = this.store.select(fromRoot.getIsAuth); // GET THE STATE OF AUTHENTICATION
    this.user = this.authService.getUser();
    this.subs.push(this.booksService.inputValueChanged.subscribe(data => {
      this.searchInput.nativeElement.value = data;
      this.searchInput.nativeElement.blur();
    }));
  }

  onToggleProDropdown(profileIcon) { // TOGGLE THE PROFILE BOX
    // if(profileBox.classList.contains('list-active')) {
    //   profileBox.classList.remove('list-active');
    //   profileIcon.classList.remove('account-item-active');
    // } else {
    // profileBox.classList.add('list-active');
    // }
    if (this.showProfileBox) {
      profileIcon.classList.remove("account-item-active");
      this.store.dispatch(new ui.HideProfileBox());
    } else {
      profileIcon.classList.add("account-item-active");
      this.store.dispatch(new ui.ShowProfileBox());
    }
  }

  onLogout() { // LOGOUT THE USER
    this.authService.logout();
    this.store.dispatch(new ui.HideProfileBox()); // HIDE THE PROFILE BOX WHEN LOGOUT
  }

  goToProfile(profileIcon, navbar: HTMLElement) { // NAVIGATE TO PROFILE COMPONENT
    this.navIcon = "menu";
    if (profileIcon) {
      profileIcon.classList.remove("account-item-active");
    }
    navbar.classList.remove("active-res-nav");
    this.store.dispatch(new ui.HideProfileBox());
    this.router.navigate(["/content/profile"]);
  }

  goToMyQuotes(profileIcon, navbar: HTMLElement) { // NAVIGATE TO MY QUOTES COMPONENT
    this.navIcon = "menu";
    if (profileIcon) {
      profileIcon.classList.remove("account-item-active");
    }
    navbar.classList.remove("active-res-nav");
    this.store.dispatch(new ui.HideProfileBox());
    this.router.navigate(["/content/my-quotes"]);
  }

  goToAdminPage(profileIcon, navbar: HTMLElement) { // NAVIGATE TO ADMIN COMPONENT
    this.navIcon = "menu";
    if (profileIcon) {
      profileIcon.classList.remove("account-item-active");
    }
    navbar.classList.remove("active-res-nav");
    this.store.dispatch(new ui.HideProfileBox());
    this.router.navigate(["/content/admin"]);
  }

  searchBooks(input: HTMLInputElement) { // SEARCH FOR THE BOOK ACCORDING TO THE SEARCH WORDS
    if (this.router.url === "/content") {
      this.booksService.inputChanged.next(input.value);
    } else if (this.router.url === "/content/authors") {
      this.authorsService.inputChanged.next(input.value);
    } else if (this.router.url === "/content/quotes") {
      this.quotesService.inputChanged.next(input.value);
    }
  }

  navigate(dist, navbar: HTMLElement) { // NAVIGATE TO THE APP COMPONENTS
    if (dist) {
      this.router.navigate(["/content", dist]);
      this.searchInput.nativeElement.value = "";
      this.booksService.inputChanged.next("");
      this.authorsService.inputChanged.next("");
      this.quotesService.inputChanged.next("");
      navbar.classList.remove("active-res-nav");
      this.navIcon = "menu";
    } else {
      this.router.navigate(["/content"]);
      this.searchInput.nativeElement.value = "";
      this.booksService.inputChanged.next("");
      this.authorsService.inputChanged.next("");
      this.quotesService.inputChanged.next("");
      navbar.classList.remove("active-res-nav");
      this.navIcon = "menu";
    }
  }

  toggleResNav(navbar: HTMLElement, search: HTMLInputElement) { // TOGGLE RESPONSIVE NAV BAR
    this.navIcon === "menu"
      ? (this.navIcon = "clear")
      : (this.navIcon = "menu");
    search.classList.remove("active-res-search");
    this.searchIcon = "search";
    if (navbar.classList.contains("active-res-nav")) {
      navbar.classList.remove("active-res-nav");
    } else {
      navbar.classList.add("active-res-nav");
    }
  }

  toggleSearchRes(search: HTMLInputElement, navbar: HTMLElement) { // TOGGLE RESPONSIVE SEARCH INPUT
    this.searchIcon === "search"
      ? (this.searchIcon = "clear")
      : (this.searchIcon = "search");
    this.navIcon = "menu";
    navbar.classList.remove("active-res-nav");
    if (search.classList.contains("active-res-search")) {
      search.classList.remove("active-res-search");
    } else {
      search.classList.add("active-res-search");
    }
    search.focus();
  }
}
