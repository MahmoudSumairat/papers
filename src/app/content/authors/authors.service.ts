import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as fromRoot from "../../app.reducer";
import * as Authors from "./authors.actions";
import { Author } from './author.model';

@Injectable()
export class AuthorsService {

    constructor(
        private afs : AngularFirestore,
        private store : Store<fromRoot.State>

    ) {}

 
    fetchAuthors() {
        this.afs.collection('authors').valueChanges()
        .subscribe((authors : Author[]) => {
            this.store.dispatch(new Authors.SetAuthors(authors))
        })
    }
}