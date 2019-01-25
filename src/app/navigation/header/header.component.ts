import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { UserData } from "src/app/auth/user.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  user: UserData;
  toggleComDropdown: boolean = false;
  toggleMailDropdown: boolean = false;
  toggleNotiDropdown: boolean = false;
  toggleProDropdown: boolean = false;

  isAuth$: Observable<boolean>;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
    this.isAuth$.subscribe(data => console.log(data));
    this.user = this.authService.getUser();
  }

  onToggleComDropdown() {
    this.toggleComDropdown = !this.toggleComDropdown;
  }

  onToggleMailDropdown() {
    this.toggleMailDropdown = !this.toggleMailDropdown;
    this.toggleNotiDropdown = false;
    this.toggleProDropdown = false;
  }
  onToggleNotiDropdown() {
    this.toggleNotiDropdown = !this.toggleNotiDropdown;
    this.toggleMailDropdown = false;
    this.toggleProDropdown = false;
  }
  onToggleProDropdown() {
    this.toggleProDropdown = !this.toggleProDropdown;
    this.toggleMailDropdown = false;
    this.toggleNotiDropdown = false;
  }

  onLogout() {
    this.authService.logout();
  }
}
