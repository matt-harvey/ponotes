import { Component } from '@angular/core';

import { NotesComponent } from './notes.component';
import { NoteService } from './note.service';

@Component({
  selector: 'pn-app',
  template: `
    <h1>{{title}}</h1>
    <pn-notes></pn-notes>
  `,
  styles: [`
    h1 {
      color: hsla(220, 50%, 30%, 1);
      text-transform: uppercase;
      letter-spacing: 0.5em;
      font-family: geneva, arial, sans-serif;
    }
  `],
  directives: [NotesComponent],
  providers: [NoteService]
})
export class AppComponent {
  title = 'Ponotes';
}
