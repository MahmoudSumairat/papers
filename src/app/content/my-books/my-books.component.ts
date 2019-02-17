import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss']
})
export class MyBooksComponent implements OnInit {
  noBooks = false;
  booksDestination = 'read-books';
  @ViewChild('btnCursor') btnCursor;
  constructor(
      private store : Store<fromRoot.State>,
      private renderer : Renderer2

  ) { }

  ngOnInit() {
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
