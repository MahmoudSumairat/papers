import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../authors/author.model';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";
import { Book } from '../home/book.model';
import { StarService } from '../book-details/star.service';
import { BookService } from '../home/book.service';
import { AuthorsService } from '../authors/authors.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/auth/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.scss'],
  animations : [
    trigger('authorDetailsState', [
      state('exist', style({
        opacity : 1,
        transform : 'translateZ(0)'
      })),
      transition('void => *' , [
        style({
          opacity: 0,
          transform : 'translateZ(-25px)'
        }),
        animate('.25s ease-out')
      ]),
   
    ] ),
  ]
})
export class AuthorDetailsComponent implements OnInit {

    authorName : string = this.route.snapshot.params['authorName'];
    author : Observable<any>  ;
    aboutCharLimit = 600;
    limitTitlte = '...See More'
    authorBooks : Observable<any>;
    ratingsLength : Observable<any>;
    isLoading$ : Observable<boolean>;
    user = this.authService.getUser();
    

  constructor(
    private afs : AngularFirestore,
    private route : ActivatedRoute,
    private starSerivice : StarService,
    private router : Router,
    private bookService : BookService,
    private authorsService : AuthorsService,
    private store : Store<fromRoot.State>,
    private authService : AuthService,
    private title : Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Authors - ' + this.authorName)
    this.user = this.authService.getUser();
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.author = this.afs.collection('authors').doc(this.authorName.toLowerCase().replace(/ /g, '_')).valueChanges()
    this.authorBooks = this.afs.collection('myBooks').valueChanges().pipe(map(data => {
      const arr = data.filter((book : Book) => {
        return book.authorName === this.authorName;
      })

      return arr;
    } ))

    this.bookService.fetchAllBooks();
    this.authorsService.fetchAuthors();

    this.ratingsLength = this.starSerivice.getnumOfAuthorRatings(this.authorName);
    }

    creatStars(avgRating : number) {
      console.log(this.starSerivice.creatStars(avgRating).starArr)
      return this.starSerivice.creatStars(avgRating);
    }


    onSeeMore() {
      if(this.aboutCharLimit === 600) {
        this.aboutCharLimit = -1;
        this.limitTitlte = '(less)';
      } else {
        this.aboutCharLimit = 600;
        this.limitTitlte = '...See More'
      }
    }

    goToBook(bookName : string) {
      this.router.navigate(['content/books', bookName])
    }

    
    removeThisAuthor(book : Book) {
      this.afs.collection('authors').doc(book.bookName.toLowerCase().replace(/ /g, '_')).delete().then(() => {
          this.router.navigate(['/content']);
      })  
    }

}
