import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/auth/user.model';
import * as fromRoot from "../../../app.reducer";
import * as ui from "../../../shared/ui.actions";
import { Store } from '@ngrx/store';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations : [
    trigger('dialogBox', [
      state('exist', style({
        opacity : 1,
        transform : 'scale(1)'
        
      })),
      transition('void => *', [
        style({
          opacity : 0,
          transform : 'scale(.5)'
        }),
        animate('.25s ease-out')

      ] ),
      transition('* => void', [
        animate('.25s ease-out', style({
          opacity : 0,
          transform : 'scale(.5)'
        }))
      ])
    ]),
    trigger('userState', [
      state('userExist', style({
        opacity : 1, 
        transform : 'translateZ(0)'
      })),
      transition('void => *', [
        style({
          opacity : 0,
          transform : 'translateZ(-25px)'
        }),
        animate('.25s ease-out')
      ])
    ])
  ]
})
export class UsersComponent implements OnInit {
  users : UserData[];
  showSureBox$ : Observable<boolean>;
  currentUser : UserData;
  isLoading$ : Observable<boolean>

  constructor(
    private afs : AngularFirestore,
    private store : Store<fromRoot.State>
    

  ) { }

  ngOnInit() {
    this.store.dispatch(new ui.StartLoading())
    this.afs.collection('users').snapshotChanges().subscribe((data) => {
      const arr = data.map(item => {
        const itemObj: UserData = (<UserData>item.payload.doc.data());
        return {
          userID : item.payload.doc.id,
          ...itemObj
        
        };

      })
      this.store.dispatch(new ui.StopLoading())

      this.users = arr;
    })

    this.showSureBox$ = this.store.select(fromRoot.getSure);
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);


  }

  toggleDialog(cond, user) {
    cond === true ? this.store.dispatch(new ui.ShowSureBox()) : this.store.dispatch(new ui.HideSureBox());
    cond === true ? this.currentUser = user : this.currentUser = null;
  }

  removeUser() {
      this.afs.collection('users').doc(this.currentUser.userID).delete();
      this.store.dispatch(new ui.HideSureBox());
  }

}
