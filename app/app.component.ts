import { Component } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'pn-app',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'Ponotes';

  constructor() {
  }
}
