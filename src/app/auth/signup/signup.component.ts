import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import * as fromRoot from "../../app.reducer";
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService : AuthService, private store : Store<fromRoot.State>) { }

  ngOnInit() {
  }

  onSubmit(f : NgForm) {
    this.authService.registerUser({
      email : f.value.email,
      password : f.value.password,
      userName : f.value.username
    });
    
  }
}
