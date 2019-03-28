import { Component, OnInit, ViewChild } from "@angular/core";
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
  toggleProDropdown: boolean = false;
  isAuth$: Observable<boolean>;
  @ViewChild('dropdownDiv') dropdownDiv;
  @ViewChild('dropdownItem') dropdownItem;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
    this.isAuth$.subscribe(data => console.log(data));
    this.user = this.authService.getUser();
  }




  onToggleProDropdown() {
    this.toggleProDropdown = !this.toggleProDropdown;

  }

  onLogout() {
    this.authService.logout();
  }
}
