import { Component, OnInit } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import * as fromRoot from "../app.reducer";
import { Store } from '@ngrx/store';
import * as auth from "../auth/auth.actions";
import { UserData } from '../auth/user.model';

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"]
})
export class ContentComponent implements OnInit {
  constructor(
    private authService : AuthService,
    private store : Store<fromRoot.State>

  ) {}


  loggedInStatus = this.authService.getIsLoggedIn();
  currentUser  : UserData = this.authService.getCurrenUser();
  
  ngOnInit() {

    if(this.loggedInStatus) {
      this.store.dispatch(new auth.SetAuthenticated());
      this.authService.setUser(this.currentUser);
    } 
  }
}
