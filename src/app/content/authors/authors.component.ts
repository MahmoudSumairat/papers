import { Component, OnInit } from '@angular/core';
import { AuthorsService } from './authors.service';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {Author} from "./author.model";
import { StarService } from '../book-details/star.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

    allAuthors$ : Observable<Author[]>;


  constructor(
    private authorsService : AuthorsService,
    private store : Store<fromRoot.State>,
    private starsService : StarService,
    private router : Router
  ) { }

  ngOnInit() {
    this.authorsService.fecthAuthors();
    this.allAuthors$ = this.store.select(fromRoot.getAllAuthors);
    this.allAuthors$.subscribe(data => console.log(data));  

    
  }

  createStars(avgRating) {
    return this.starsService.creatStars(avgRating); 
  }

  onLoadBook(bookName) {
    this.router.navigate(['content/books', bookName])
  }

}
