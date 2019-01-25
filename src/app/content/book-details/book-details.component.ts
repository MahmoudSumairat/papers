import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Book } from "../home/book.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/auth/auth.service";
import { StarService } from './star.service';

@Component({
  selector: "app-book-details",
  templateUrl: "./book-details.component.html",
  styleUrls: ["./book-details.component.scss"]
})
export class BookDetailsComponent implements OnInit {
  i: number;
  starRating;
  ratingLength;
  output: number[] = [];
  selectedBook$: Observable<Book>;
  avgRating: Observable<any>;
  bookName: string = this.activatedRoute.snapshot.params["bookName"];
  userName = this.authService.getUser().userName;
  myRating: Observable<any>;
  titleCondition : Observable<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private afs: AngularFirestore,
    private authService: AuthService,
    private starService : StarService
  ) {}

  ngOnInit() {
    //Get the book from the array
    this.selectedBook$ = this.store.select(fromRoot.getAllBooks).pipe(
      map(bookArr => {
        return bookArr.find(book => book.bookName === this.bookName);
      })
    );

    
    //Update the avgRating field in the appropriate document
    this.starService.calculateAverage(this.bookName)


    //Get the number of ratings from starService
    this.ratingLength = this.starService.getnumOfRatings();
    


    //Push a dummy data to output array to render the rating stars
    this.starService.renderStars(this.bookName).subscribe((data : any) => {
      this.starRating = data.avgRating;
      this.output = [];
      for (this.i = this.starRating; this.i >= 1; this.i--) {
        this.output.push(1);
      }
    })
  

    if(this.userName) {
      this.titleCondition = this.afs
      .collection("stars")
      .doc("book_review")
      .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
      .doc(this.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
      .valueChanges(); 
    }
  
  }

  
}
