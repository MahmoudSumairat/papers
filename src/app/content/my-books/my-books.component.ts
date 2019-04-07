import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
  animations :[
    trigger('myBooksState', [
      state('exist', style({
        opacity : 0,
        transform : 'translateY(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform : 'translateY(10px)'
        }),
        animate(200)
      ])
    ]),
    
  ]
})
export class MyBooksComponent implements OnInit {
  noBooks = false;
  booksDestination = 'read-books';
  isLoading$ : Observable<boolean>;
  @ViewChild('btnCursor') btnCursor;
  constructor(
      private store : Store<fromRoot.State>,
      private renderer : Renderer2

  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
  }


  navigateMyBooks(dest, btn) {
    // this.booksDestination = dest;
    const x = btn.getBoundingClientRect().x;
    const y = btn.getBoundingClientRect().y + btn.getBoundingClientRect().height - 2;
    const width = btn.getBoundingClientRect().width;
    this.renderer.setStyle(this.btnCursor.nativeElement, 'left', x + 'px' );
    this.renderer.setStyle(this.btnCursor.nativeElement, 'top', y + 'px' );
    this.renderer.setStyle(this.btnCursor.nativeElement, 'width', width + 'px' );

    this.booksDestination = dest;
    
  }

}
