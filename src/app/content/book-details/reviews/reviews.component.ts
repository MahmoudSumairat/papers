import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import * as fromRoot from "../../../app.reducer";
import * as bookDetails from "../book-details.actions";
import { Store } from "@ngrx/store";
import { UserData } from "src/app/auth/user.model";
import { Observable, merge, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { StarService } from "../star.service";

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent implements OnInit, OnDestroy {
  // This is for render the review box when blur
  @ViewChild("reviewContent") reviewContent;

  // Get the bookName from the URL
  bookName = this.route.snapshot.params["bookName"];
  // Get the user from the authService
  user: UserData = this.authService.getUser();
  // To check if the user is signed in or not
  isAuth: boolean;
  // To get the reviewes from the database
  reviews: Observable<any>;
  // To get the comment from the database
  comments: Observable<any>;
  // To check if the user reviewed in stars or not
  isReviewed: boolean;
  // To check if the comment box is shown or not
  boxShown = false;
  // To check if the comments is shown or not
  commentsShown = false;
  // To store the liked buttons spans IDs to change the text due to the firebase async tasks
  spanTextsIds = [];
  // To contorl speed of the like clicking
  likeFlag = true;

  subsArr: Subscription[] = [];

  constructor(
    private renderer: Renderer2,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private authService: AuthService,
    private store: Store<fromRoot.State>,
    private starService: StarService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get if the user is authenticated or not from the store
    this.subsArr.push(
      this.store.select(fromRoot.getIsAuth).subscribe(isAuth => {
        this.isAuth = isAuth;
      })
    );

    this.checkIsReviewed();

    // Get if the user is reviewed or not from the store

    setTimeout(() => {
      this.subsArr.push(
        this.store.select(fromRoot.getIsReviewed).subscribe(isReviewed => {
          this.isReviewed = isReviewed;
        })
      );
      console.log(this.isReviewed);
    }, 1000);

    // Fetch the reviewes from the database and get it as an Observable and use "async" pipe in the HTML template
    this.reviews = this.afs
      .collection("stars")
      .doc("book_review")
      .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
      .valueChanges()
      .pipe(
        map(dataArr => {
          const dataArray = dataArr.filter(user => user.review);
          return dataArray.sort((a, b) => b.value - a.value);
        })
      );

    // Fetch the comments from the database and get it as an Observable and use "async" pipe in the HTML template
    this.comments = this.afs
      .collection("stars")
      .doc("reviewes_comments")
      .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
      .valueChanges();
  }

  // Submit the reviewe and send it to the database
  onSubmit(f: NgForm) {
    if (this.isAuth) {
      // Check if the user is signed in or not
      if (this.isReviewed ) {
        if(f.value.review) {
          // Check if the user is reviewed or not
        this.afs
        .collection("stars") // Collection Stars in the database
        .doc("book_review") // Document Book Review in the collection Stars
        .collection(this.bookName.toLowerCase().replace(/ /g, "_")) // Select the collection that depends on the bookName that i got from the URL
        .doc(this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")) // Select the document that depends on the username that i got from the AuthService
        .set(
          // Set the content of the review in that document
          {
            review: f.value.review
          },
          { merge: true } // Allow to merge the doceumtn fields with this field
        );
      this.onCancel(f); // To reset the form and resize it to the initial size
        }
      } else {
        alert("You have to rate the book first"); // The user has not rated the book so he can't write a reviewe
      }
    } else {
      this.router.navigate(["/login"]); // The user has not signed in so he should go to the sign in page and sign in.
    }
  }

  onCancel(f: NgForm) {
    // To reset the form and resize it to the inital size
    this.renderer.setStyle(
      this.reviewContent.nativeElement,
      "height",
      "7.5rem"
    );
    f.reset();
  }

  onBlur() {
    // To keep the wanted height fixed when the user blurs
    this.renderer.setStyle(this.reviewContent.nativeElement, "height", "15rem");
  }

  creatStars(num: number) {
    // Create an array to render the stars that the user has rated
    return this.starService.creatStars(num);
  }

  onLike(
    // Send a like to the database
    username: string, // The name on the review that the user liked
    userLikes: string[] // The likes array of this review
  ) {
    if (this.likeFlag) {
      // Check if the button is available to click or not to aviod the setTimeOut function issues
      // Check if the selected button span innerText is Like which means that the user didn't click the like
      if (
        !this.spanTextsIds.includes(
          (<HTMLSpanElement>document.getElementById("btn-" + username)).id
        )
      ) {
        // Check if the spanTextIds array does not include the current span id so that means that the user has not clicked the like button
        if (this.isAuth) {
          // Check if the user is signed in or not

          if (userLikes) {
            // Check if the likes Array in the user document is defined or NOT
            const newArr = [
              ...userLikes,
              this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")
            ]; // Creat a brand new array contains the new user that liked this reviewe and the rest of the liked users
            this.afs
              .collection("stars") // Collection Stars in the database
              .doc("book_review") // Document Book Review in the collection Stars
              .collection(this.bookName.toLowerCase().replace(/ /g, "_")) // Select the collection that depends on the bookName that i got from the URL
              .doc(username) // Select the document that depends in the username that i passed in this function which is the review name
              .set(
                {
                  likes: newArr // Assigne the likes array to the new array that i created
                },
                { merge: true } // Allow to merge the document content with this array
              );
          } else {
            // If the likes array is NOT defined
            this.afs
              .collection("stars") // Collection Stars in the database
              .doc("book_review") // Document Book Review in the collection Stars
              .collection(this.bookName.toLowerCase().replace(/ /g, "_")) // Select the collection that depends on the bookName that i got from the URL
              .doc(username) // Select the document that depends on the username that i passed into this function
              .set(
                {
                  likes: [
                    this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "") // Initiate the likes array from scratch and assign the current user to it because he is the first one who liked this review
                  ]
                },
                { merge: true }
              ); // Allow to merge the current fields with this field
          }
        } else {
          // the user is not signed in so he should go to the sign in page and sign in
          this.router.navigate(["/login"]);
        }
      } else {
        const splicedArr = userLikes.filter(username => {
          return (
            username !==
            this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")
          ); // Remove the user that clicked on Unlike from the likes Array
        });
        this.afs
          .collection("stars")
          .doc("book_review")
          .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
          .doc(username)
          .set(
            {
              likes: splicedArr // Assigne the array that doesn't contain the current user to the likes array
            },
            { merge: true }
          );
      }

      setTimeout(() => {
        // I implemented this function because the valueChanges Observable send a new markup when the data changes so i should wait tell it finish and modify it so i can modify the newest markup

        // Initialze the newSpanTexts Array to get the newest markup references
        const newSpanTexts = [];

        // Again check if the user clicked like or not
        if (
          !this.spanTextsIds.includes(
            (<HTMLSpanElement>document.getElementById("btn-" + username)).id
          )
        ) {
          this.spanTextsIds.push(
            (<HTMLSpanElement>document.getElementById("btn-" + username)).id
          ); // Push the span id of the clicked button in the spanTextIds
          console.log("like state");
        } else {
          // Here the user has clikced the like button so he will click the unlike button
          this.spanTextsIds.splice(
            this.spanTextsIds.indexOf(
              (<HTMLSpanElement>document.getElementById("btn-" + username)).id
            ),
            1
          );
          console.log("unlike state");
        }

        // Loop over the spanTextIds and push the selected element by this ID into the newSpanTexts array
        this.spanTextsIds.forEach(spanId => {
          newSpanTexts.push(<HTMLSpanElement>document.getElementById(spanId));
        });

        console.log(this.spanTextsIds);
        console.log(newSpanTexts);
        // Loop over the newes elements and change the innerText of them into 'Unlike'
        newSpanTexts.forEach(span => {
          span.innerText = "Unlike";
        });

        this.likeFlag = false;
      }, 20);
    }

    setTimeout(() => {
      this.likeFlag = true;
    }, 300);
  }

  toggleCommentBox(commentBox) {
    console.log(commentBox);
    if (commentBox.style.display === "none") {
      this.renderer.setStyle(commentBox, "display", "block");
    } else {
      this.renderer.setStyle(commentBox, "display", "none");
    }
  }

  onSubmitComment(
    form: NgForm,
    username: string,
    comments: string[],
    commentBox
  ) {
    // Send the comment into the database
    if (this.isAuth) {
      // Check if the user is signed in

      if(form.value.comment) {
        if (comments) {
          const newCommentsArr = [
            ...comments,
            {
              name: this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""),
              comment: form.value.comment
            }
          ];
          this.afs
            .collection("stars") // Select collection Stars
            .doc("book_review") // Selects document Reviewes Comment
            .collection(this.bookName.toLowerCase().replace(/ /g, "_")) // Select the collection that depends on the bookName from the URL
            .doc(username) // Select the document that depends on the username from the arguments list
            .set(
              {
                comments: newCommentsArr
              },
              { merge: true } // Allow to merge the current fields with these fields
            );
        } else {
          this.afs
            .collection("stars") // Select collection Stars
            .doc("book_review") // Selects document Reviewes Comment
            .collection(this.bookName.toLowerCase().replace(/ /g, "_")) // Select the collection that depends on the bookName from the URL
            .doc(username) // Select the document that depends on the username from the arguments list
            .set(
              {
                comments: [
                  {
                    name: this.user.userName.replace(
                      /@([^.@\s]+\.)+([^.@\s]+)/,
                      ""
                    ),
                    comment: form.value.comment
                  }
                ]
              },
              { merge: true } // Allow to merge the current fields with these fields
            );
        }
      }
    } else {
      this.router.navigate(["/login"]); // The user is not signed in so he should go to tha sign in page and sign in
    }

    setTimeout(() => {
      console.log("sjsdsdj");
      this.toggleCommentBox(commentBox);
    }, 100);
  }

  // This function is for detect the liked button for the user that signs in
  getLikeOrUnlikeTitle(userLikes: string[], btn) {
    if (this.isAuth) {
      // Check if the user has signed in to show him his likes
      if (userLikes) {
        // Check if the userLikes array is defined or not
        if (
          userLikes.includes(
            this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, "")
          )
        ) {
          // If the username is included in the likes array that means he clicked the like button\
          if (!this.spanTextsIds.includes(btn.id)) {
            // Check if the spansTextIds array does not include the liked buttons
            this.spanTextsIds.push(btn.id); //Push the liked buttons into the spanTextIds array to make it logically liked button
          }
          return "Unlike"; // Return the string Unlike to appear in the UI when the button is liked
        } else {
          return "Like"; // The username is not included in the likes array so the user has not clicked the like button
        }
      }
    } else {
      // There are no user logged in so i show the like button to the guest
      return "Like";
    }
  }

  checkIsReviewed() {
    if (this.isAuth) {
      this.subsArr.push(
        this.afs
          .collection("stars")
          .doc("book_review")
          .collection(this.bookName.toLowerCase().replace(/ /g, "_"))
          .doc(this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ""))
          .valueChanges()
          .subscribe((data: { value: number }) => {
            if (data) {
              if (data.value) {
                console.log("hello");
                this.store.dispatch(new bookDetails.SetStarReviewed());
              } else {
                this.store.dispatch(new bookDetails.SetStarNotReviewed());
                console.log("not hello");
              }
            }
          })
      );
    }
  }

  onToggleComments(element) {
    console.log(element);
    if (element.style.display === "none") {
      this.renderer.setStyle(element, "display", "block");
    } else {
      this.renderer.setStyle(element, "display", "none");
    }
  }

  ngOnDestroy() {
    this.subsArr.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
