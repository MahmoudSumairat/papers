import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StarService } from '../star.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/auth.service';
import { UserData } from 'src/app/auth/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from "rxjs/operators";
import { database } from 'firebase';

@Component({
  selector: 'app-stars-review',
  templateUrl: './stars-review.component.html',
  styleUrls: ['./stars-review.component.scss']
})
export class StarsReviewComponent implements OnInit {
  constructor(private afs : AngularFirestore,
              private authService : AuthService, 
              private route : ActivatedRoute,
              private starService : StarService
              ) {}

  user : UserData = this.authService.getUser();
  bookName : string = this.route.snapshot.params['bookName'];
  sub : Subscription;
  myValue;
onClick(value) {
  this.starService.setStar(value, this.bookName, this.user);
}

ngOnInit() {
  if(this.user.userName){
    this.sub = this.afs.collection('stars')
    .doc('book_review')
    .collection(this.bookName.toLowerCase().replace(/ /g, '_'))
    .doc(this.user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, ''))
    .valueChanges()
    .subscribe((data : {value : number}) => this.myValue = data.value);
  }
  
    
}




}