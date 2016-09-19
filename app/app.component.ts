import { Component } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'pn-app',
  template: require('./app.component.html')
})
export class AppComponent {
  title = 'Ponotes';

  private messages = [
    {
      severity: 'warn',
      summary: 'USE THIS APPLICATION AT YOUR OWN RISK',
      detail: `
        It is in development and is not intended for production use. It might lose or corrupt
        your data, or be taken down at any time without warning.\n\n
      `
    },
    {
     // TODO Make it so the user has an option not to show this message again.
      severity: 'warn',
      summary: 'NOTE',
      detail: `
        Your data in this application is stored locally in your browser and will not be
        sent or synced anywhere else. This is not safe place to store data over the long
        term. If you clear your browser data, YOU WILL LOSE YOUR DATA FOREVER. Do not use this
        application to store anything that you don't want to lose.\n\n
      `
    }
  ];

}
