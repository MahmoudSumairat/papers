import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from "../../app.reducer";
import * as auth from "../auth.actions";
import { UserData } from '../user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  sub : Subscription

  constructor(private authService : AuthService, private store : Store<fromRoot.State>, private afs : AngularFirestore) { }

  ngOnInit() {
   this.sub =  this.afs.collection('users').snapshotChanges().subscribe((data) => {
      const arr = data.map(item => {
        const itemObj: UserData = (<UserData>item.payload.doc.data());
        return {
          userID : item.payload.doc.id,
          ...itemObj
        
        };
      })
      this.store.dispatch(new auth.SetUsers(arr))
    })
  }

  onSubmit(f : NgForm) {
    this.authService.loginUser(f.value.email, f.value.password);
    f.reset();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
