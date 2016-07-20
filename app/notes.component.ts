import { Component, OnInit } from '@angular/core';

import { Note } from './note';
import { NoteFormComponent } from './note-form.component';
import { NoteService } from './note.service';

@Component({
  selector: 'my-notes',
  template: `
    <my-note-form [note]="newNote" [editable]="true"></my-note-form>

    <my-note-form *ngFor="let note of notes" [note]="note" (click)="onSelect(note)"
      [class.selected]="note === currentNote"></my-note-form>
  `,
  directives: [NoteFormComponent]
})
export class NotesComponent implements OnInit {
  notes: Note[];
  currentNote: Note;
  newNote = new Note();

  constructor(private noteService: NoteService) { }

  ngOnInit() { this.getNotes(); }

  onSelect(note: Note) { this.currentNote = note; }

  getNotes() {
    this.noteService.getNotes().then(notes => this.notes = notes);
  };

}

