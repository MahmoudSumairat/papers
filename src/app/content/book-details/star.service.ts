import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserData } from 'src/app/auth/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

export interface Star {
    userEmail : string,
    bookName : string,
    rating : number
}

@Injectable()
export class StarService {
    constructor(private authService : AuthService,private afs : AngularFirestore, private router : Router) {}


   
    setStar(value, bookName, user) {
        if(user.userName) {
            this.afs.collection('stars').doc('book_review').collection(bookName.toLowerCase().replace(/ /g, "_")).doc(user.userName.replace(/@([^.@\s]+\.)+([^.@\s]+)/, '')).set({
                value
            })
            .then(respone => console.log(respone)).catch(() => {console.log('error')})
          } else {
            this.router.navigate(['/login']);
          }
    }
    
}