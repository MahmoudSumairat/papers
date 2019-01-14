import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  @Output() isChanged = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  onNivaigate() {
    this.isChanged.emit();
  }

}
