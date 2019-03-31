import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';
import * as quotes from "./quotes.actions";
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { UserData } from 'src/app/auth/user.model';
import * as Auth from "../../auth/auth.actions";
import { Subject } from 'rxjs';

@Injectable()
export class QuotesService {

    inputChanged = new Subject<string>();
    constructor(private afs : AngularFirestore, private store : Store<fromRoot.State>, private authService : AuthService) {

    }

    fetchQuotes() {
        this.afs.collection('quotes').snapshotChanges().pipe(map((data) => {
            return data.map(quotes => {
                return {
                    id : quotes.payload.doc.id,
                    ...quotes.payload.doc.data()
                }
            })
        })).subscribe((data :any) => {
            
            this.store.dispatch(new quotes.SetQuotes(data))
        })
    }

    likeQuote(quote , user) {
          if(quote.likes) {
                if(!quote.likes.includes(user.userID)) {
                const newLikes = [
                    ...quote.likes,
                    user.userID
                ]
                this.afs.collection('quotes').doc(quote.id).set({
                    likes : newLikes
                }, {merge : true})
            } else {
                const newLikes = quote.likes.filter(id => {
                    return id !== user.userID
                })
                this.afs.collection('quotes').doc(quote.id).set({
                    likes : newLikes
                }, {merge : true})
            }
        } else {
            const newLikes = [user.userID]
            this.afs.collection('quotes').doc(quote.id).set({
                likes : newLikes
            }, {merge : true})
        }
    }

    favQuote( quote) {
        const theUser = this.authService.getUser()
        const currentQuote = {
            name : quote.name,
            quote : quote.quote
        };
        if(theUser.favQuotes) {
 
            if(!theUser.favQuotes.some(someQuote =>someQuote.quote === quote.quote) ) {
                const quotesArr = [...theUser.favQuotes, {quote : quote.quote, name : quote.name}];
                this.afs.collection('users').doc(theUser.userID).set({
                    favQuotes : quotesArr
                }, {merge : true});
                console.log('the array is defined and does not include this quote');
                this.authService.updateUser(quotesArr);

            } else {
                const quotesArr = theUser.favQuotes.filter(theQuote => {
                    return theQuote.quote !== quote.quote
                });
                this.afs.collection('users').doc(theUser.userID).set({
                    favQuotes : quotesArr
                }, {merge : true});
                console.log('the array is defined and includes this quote');
                this.authService.updateUser(quotesArr);

                
            }
        } else {
            const quotesArr = [{quote : quote.quote, name : quote.name}];
            
            this.afs.collection('users').doc(theUser.userID).set({
                favQuotes  : quotesArr
            }, {merge : true});
            console.log('the array is not defined');
            this.authService.updateUser(quotesArr);

        }
        
        
    }

    removeQuote(quote) {
        const theUser = this.authService.getUser();
        const quotesArr = theUser.favQuotes.filter(theQuote => {
            return theQuote !== quote
        })

        this.afs.collection('users').doc(theUser.userID).set({
            favQuotes : quotesArr
        }, {merge : true});
        this.authService.updateUser(quotesArr);
    }
}