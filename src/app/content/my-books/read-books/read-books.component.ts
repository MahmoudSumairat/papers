import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from "@ngrx/store";
import * as fromRoot from '../../../app.reducer';
import { Observable } from 'rxjs';
import { Book } from '../../home/book.model';
import { StarService } from '../../book-details/star.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserData } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-read-books',
  templateUrl: './read-books.component.html',
  styleUrls: ['./read-books.component.scss'],
})
export class ReadBooksComponent implements OnInit {

  readBooks$ : Observable<Book[]>;


  constructor(
    private store : Store<fromRoot.State>,
    private afs : AngularFirestore,
    private authService : AuthService

  ) { }

  ngOnInit() {
    this.readBooks$ = this.store.select(fromRoot.getReadBooks);
  }


 


}
