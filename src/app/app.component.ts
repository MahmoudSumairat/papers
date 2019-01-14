import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isNav : boolean = true;

  onNav() {
    this.isNav = !this.isNav;
    console.log(this.isNav);
  }
}
