import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../home/book.model';
import * as fromRoot from '../../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-want-to-read',
  templateUrl: './want-to-read.component.html',
  styleUrls: ['./want-to-read.component.scss']
})
export class WantToReadComponent implements OnInit {

  wantBooks$ : Observable<Book[]>;


  constructor(
    private store : Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.wantBooks$ = this.store.select(fromRoot.getWantBooks)

    this.store.select(fromRoot.getWantBooks).subscribe(data => console.log(data));
  }

}
