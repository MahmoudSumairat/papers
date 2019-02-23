import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../../app.reducer";
import { map } from "rxjs/operators";
import { StarService } from '../star.service';
import { Author } from '../../authors/author.model';

@Component({
  selector: "app-author",
  templateUrl: "./author.component.html",
  styleUrls: ["./author.component.scss"]
})
export class AuthorComponent implements OnInit {
  bookName = this.route.snapshot.params["bookName"];
  authorName;
  author$: Observable<Author>;
  aboutCharLimit = 420;
  seeMoreTitle = "...See More";

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private store: Store<fromRoot.State>,
    private starService : StarService
  ) {}

  ngOnInit() {
    this.store
      .select(fromRoot.getAllBooks)
      .pipe(
        map(bookArr => {
          return bookArr.find(book => book.bookName === this.bookName);
        })
      )
      .subscribe(book => {
        this.authorName = book.authorName;
      });
    this.author$ = this.store.select(fromRoot.getAuthors).pipe(
      map(data => {
        return data.find(author => author.name === this.authorName);
      })
    );
  }

  clickSeeMore() {
    if (this.aboutCharLimit === 420) {
      this.aboutCharLimit = -1;
      this.seeMoreTitle = "(less)";
    } else if (this.aboutCharLimit === -1) {
      this.aboutCharLimit = 420;
      this.seeMoreTitle = "...See More";
    }
  }

  creatStars(authorRating : number) {
   return this.starService.creatStars(authorRating);
  }
}
