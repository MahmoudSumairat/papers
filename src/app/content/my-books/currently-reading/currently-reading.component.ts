import { Component, OnInit } from '@angular/core';
import * as fromRoot from "../../../app.reducer";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Book } from '../../home/book.model';

@Component({
  selector: 'app-currently-reading',
  templateUrl: './currently-reading.component.html',
  styleUrls: ['./currently-reading.component.scss']
})
export class CurrentlyReadingComponent implements OnInit {

  currentBooks$ : Observable<Book[]>;
  constructor(
    private store : Store<fromRoot.State>,

  ) { }

  ngOnInit() {
    this.currentBooks$ = this.store.select(fromRoot.getCurrentBooks)
  }

}
