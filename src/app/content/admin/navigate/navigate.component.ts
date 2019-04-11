import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss'],
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
export class NavigateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
