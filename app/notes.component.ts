import { Component, OnInit } from '@angular/core';

import { Note } from './note';
import { NoteFormComponent } from './note-form.component';
import { NoteService } from './note.service';

@Component({
  selector: 'pn-notes',
  template: `
    <pn-note-form [note]="newNote"></pn-note-form>
    <pn-note-form *ngFor="let note of notes"
      [notes]="notes" [note]="note"></pn-note-form>
  `,
  directives: [NoteFormComponent]
})
export class NotesComponent implements OnInit {
  notes: Note[];
  currentNote: Note;
  newNote = new Note();

  constructor(private noteService: NoteService) { }

  ngOnInit() { this.getNotes(); }

  getNotes() {
    this.noteService.getNotes().then(notes => this.notes = notes);
  };

}

