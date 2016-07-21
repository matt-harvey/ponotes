import { Component, OnInit } from '@angular/core';

import { Note } from './note';
import { NoteFormComponent } from './note-form.component';
import { NoteService } from './note.service';

@Component({
  selector: 'my-notes',
  template: `
    <my-note-form [note]="newNote"></my-note-form>
    <my-note-form *ngFor="let note of notes"
      [notes]="notes" [note]="note"></my-note-form>
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

