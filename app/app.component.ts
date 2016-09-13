import { Component } from '@angular/core';

// TODO Use relative URLs for templateUrl and styleUrls, for this and other components.
// To do this, need to use "moduleId: module.id" in decorator; but couldn't get this to
// work last time I tried.
@Component({
  selector: 'pn-app',
  template: '<pn-tabs></pn-tabs>'
})
export class AppComponent {
  title = 'Ponotes';
}
