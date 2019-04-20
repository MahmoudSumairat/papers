import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { NgForm } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

@Component({
  selector: "app-add-book",
  templateUrl: "./add-book.component.html",
  styleUrls: ["./add-book.component.scss"],
  animations: [
    trigger("navigateState", [
      state(
        "navigateExist",
        style({
          opacity: 1,
          transform: "translateZ(0)"
        })
      ),
      transition("void => *", [
        style({
          opacity: 0,
          transform: "translateZ(-25px)"
        }),
        animate(".25s ease-out")
      ])
    ])
  ]
})
export class AddBookComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  submitBook(form: NgForm) {
    this.afs
      .collection("myBooks")
      .doc(form.value.bookName.replace(/ /g, "_").toLowerCase())
      .set({
        bookName: form.value.bookName,
        authorName: form.value.authorName,
        brief: form.value.brief,
        img: form.value.img,
        genres: form.value.genre.split(", ")
      })
      .then(() => {
        form.reset();
        this.matSnackBar.open("Uploaded Successfully", "Ok", {
          duration: 2000
        });
      });
  }
}
