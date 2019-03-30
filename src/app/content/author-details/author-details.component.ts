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

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  styleUrls: ['./author-details.component.scss']
})
export class AuthorDetailsComponent implements OnInit {

    authorName : string = this.route.snapshot.params['authorName'];
    author : Observable<any>  ;
    aboutCharLimit = 600;
    limitTitlte = '...See More'
    authorBooks : Observable<any>;
    ratingsLength : Observable<any>

  constructor(
    private afs : AngularFirestore,
    private route : ActivatedRoute,
    private starSerivice : StarService,
    private router : Router,
    private bookService : BookService,
    private authorsService : AuthorsService
  ) { }

  ngOnInit() {
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

}
