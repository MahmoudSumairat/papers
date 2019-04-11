import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.scss'],
  animations : [
    trigger('navigateState', [
      state('navigateExist', style({
        opacity : 1, 
        transform : 'translateZ(0)'
      })),
      transition('void => *', [
        style({
          opacity : 0,
          transform : 'translateZ(-25px)'
        }),
        animate('.25s ease-out')
      ])
    ])
  ]
})
export class AddAuthorComponent implements OnInit {
  authorQuotes = {};
  authorQuotesArr = [];
  inputArr = [1];

  constructor(
    private afs : AngularFirestore,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit() {
  }


  submitAuthor(form : NgForm) {
    this.afs.collection('authors').doc(form.value.authorName.toLowerCase().replace(/ /g, '_')).set({
      name : form.value.authorName,
      about : form.value.about,
      born : form.value.place,
      birth : form.value.birth,
      death : form.value.death,
      bestBook : form.value.best,
      img : form.value.img,
      genre : form.value.genre.split(', '),
      quotes : this.authorQuotesArr
    }).then(() => {
      this.snackBar.open('Uploaded Successfully', "Ok", {duration : 2000});
      form.reset();
    })

    console.log(this.authorQuotes);
  }  

  insertQuote( input, i) {
    this.authorQuotesArr = [];
    this.authorQuotes[i] = input.value;
    console.log(this.authorQuotes);
    for (let i in this.authorQuotes) {
      this.authorQuotesArr.push(this.authorQuotes[i]);
    }

    console.log(this.authorQuotesArr);
  }

  addQuote() {
    this.inputArr.push(1);
  }

}
