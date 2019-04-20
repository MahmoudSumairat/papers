import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatSnackBar } from "@angular/material";
import {
  state,
  trigger,
  style,
  transition,
  animate
} from "@angular/animations";

@Component({
  selector: "app-add-quote",
  templateUrl: "./add-quote.component.html",
  styleUrls: ["./add-quote.component.scss"],
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
export class AddQuoteComponent implements OnInit {
  constructor(private afs: AngularFirestore, private snackBar: MatSnackBar) {}

  ngOnInit() {}

  submitQuote(form: NgForm) { // UPLOAD THE QUOTE TO THE DATABASE
    this.afs
      .collection("quotes")
      .add({
        name: form.value.authorName,
        quote: form.value.quote
      })
      .then(() => {
        this.snackBar.open("Uploaded Successfully", "Ok", { duration: 2000 });
        form.reset();
      });
  }
}
