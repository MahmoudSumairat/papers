import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router, ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from 'rxjs';

export interface Star {
  userEmail: string;
  bookName: string;
  rating: number;
  
}

@Injectable()
export class StarService {
   private numberOfRatings : number;
   starArrayChange : Subject<number[]>;

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private router: Router,
    private route : ActivatedRoute
  ) {}

  setStar(value, bookName, user) {
    if (user.userName) {
      this.afs
        .collection("stars")
        .doc("book_review")
        .collection(bookName.toLowerCase().replace(/ /g, "_"))
        .doc(user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
        .set({
          value
        })
        .then(() => {})
        .catch(() => {
          console.log("error");
        });
    } else {
      this.router.navigate(["/login"]);
    }
  }

     //We get the the array from the database and calculate the average
     calculateAverage(bookName : string) {
      return this.afs
      .collection("stars")
      .doc("book_review")
      .collection(bookName.toLowerCase().replace(/ /g, "_"))
      .valueChanges()
      .pipe(
        map(data => {
          const ratings = data.map(object => object.value);
          this.numberOfRatings = ratings.length;
          return ratings.reduce((accum, value) => accum + value) / ratings.length
        })
      ).subscribe((data) => {
        this.afs.collection('myBooks').doc(bookName.toLocaleLowerCase().replace(/ /g,'_')).update({
          avgRating : data
        }).then(() => {console.log('Updated')}).catch((error) => console.log('what the fuck'));
      })
    }

    renderStars(bookName) {
      return this.afs.collection('myBooks').doc(bookName.toLowerCase().replace(/ /g, "_")).valueChanges()
    }
    


    getnumOfRatings() {
      const temp = this.numberOfRatings;
      return temp;
    }
}
