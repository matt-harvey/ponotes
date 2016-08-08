import { Component } from '@angular/core';

import { TabsComponent } from './tabs/tabs/tabs.component';

// TODO Use relative URLs for templateUrl and styleUrls, for this and other components.
// To do this, need to use "moduleId: module.id" in decorator; but couldn't get this to
// work last time I tried.
@Component({
  selector: 'pn-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  directives: [TabsComponent]
})
export class AppComponent {

  title = 'Ponotes';

}
