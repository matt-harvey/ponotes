import { Component } from '@angular/core';

// TODO There is an error when first starting application: "Cannot sort on field
// 'name' when using default index".

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
