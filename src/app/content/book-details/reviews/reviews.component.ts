import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import * as fromRoot from "../../../app.reducer";
import { Store } from "@ngrx/store";
import { UserData } from "src/app/auth/user.model";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { StarService } from '../star.service';

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.scss"]
})
export class ReviewsComponent implements OnInit {
  @ViewChild("reviewContent") reviewContent;
  bookName = this.route.snapshot.params["bookName"];
  user: UserData = this.authService.getUser();
  isAuth: boolean;
  reviews : Observable<any>;
  isReviewed : boolean;

  constructor(
    private renderer: Renderer2,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    private starService : StarService,
    private router : Router
  ) {}

  ngOnInit() {
    this.store.select(fromRoot.getIsAuth).subscribe(isAuth => {
      this.isAuth = isAuth;
    });

    this.store.select(fromRoot.getIsReviewed).subscribe(isReviewed => {
      this.isReviewed = isReviewed;
    });

    this.reviews = this.afs.collection("stars")
    .doc("book_review")
    .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
    .valueChanges()
    .pipe(map(dataArr => {

      const dataArray = dataArr.filter(user => user.review)
      return dataArray.sort((a,b) => b.value - a.value);
    }))
    
  }

  onSubmit(f: NgForm) {
    if (this.isAuth) {

      if(this.isReviewed) {
        this.afs
        .collection("stars")
        .doc("book_review")
        .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
        .doc(this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
        .set(
          {
            review: f.value.review
          },
          { merge: true }
        );
        this.onCancel(f);
      } else {
        alert('You have to rate the book!')
      }
    } else {
      this.router.navigate(['/login'])
    }
  }

  onCancel(f: NgForm) {
    this.renderer.setStyle(
      this.reviewContent.nativeElement,
      "height",
      "7.5rem"
    );
    f.reset();
  }

  onBlur() {
    this.renderer.setStyle(this.reviewContent.nativeElement, "height", "15rem");
  }


  creatStars(num : number) {
     return this.starService.creatStars(num)
  }
}
