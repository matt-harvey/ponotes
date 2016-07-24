import { Component } from '@angular/core';

import { NotesComponent } from './notes/note-list/note-list.component';
import { NoteService } from './notes/shared/note.service';

@Component({
  selector: 'pn-app',
  template: `
    <h1>{{title}}</h1>
    <pn-notes></pn-notes>
  `,
  styles: [`
    h1 {
      color: hsla(220, 50%, 30%, 1);
      font-family: cursive, geneva, arial, sans-serif;
    }
  `],
  directives: [NotesComponent],
  providers: [NoteService]
})
export class AppComponent {
  title = 'Ponotes';
}
