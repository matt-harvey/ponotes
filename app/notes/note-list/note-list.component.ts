import { Component, OnInit } from '@angular/core';

import { Note } from '../shared/note';
import { NoteFormComponent } from '../note/note.component';
import { NoteService } from '../shared/note.service';

@Component({
  selector: 'pn-notes',
  template: `
    <pn-note-form [beingEdited]="true" [noteBeingMovedIndex]="noteBeingMovedIndex"></pn-note-form>

    <pn-note-form *ngFor="let note of notes; let i = index"
      (onMoveStarted)="onMoveStarted($event)" (onMoveEnded)="onMoveEnded($event)"
      [notes]="notes" [noteIndex]="i" [noteBeingMovedIndex]="noteBeingMovedIndex"
      [moveTargettable]="moveTargettableIndex(i)"></pn-note-form>

    <pn-note-form [moveTargetOnly]="true" (onMoveEnded)="onMoveEnded($event)"
      [notes]="notes" [noteIndex]="notes.length" [noteBeingMovedIndex]="noteBeingMovedIndex"
      [moveTargettable]="moveTargettableIndex(notes.length)"></pn-note-form>
  `,
  directives: [NoteFormComponent]
})
export class NotesComponent implements OnInit {
  private notes: Note[] = [];
  private currentNote: Note;
  private newNote = new Note();
  private moving = false;
  private noteBeingMovedIndex: number;

  constructor(private noteService: NoteService) { }

  ngOnInit() { this.getNotes(); }

  onMoveStarted(noteBeingMovedIndex: number) {
    this.moving = true;
    this.noteBeingMovedIndex = noteBeingMovedIndex;
  }

  onMoveEnded(newIndex: number) {
    if (typeof newIndex !== 'undefined') {
      this.noteService.moveNote(this.noteBeingMovedIndex, newIndex);
    }
    this.noteBeingMovedIndex = undefined;
    this.moving = false;
  }

  moveTargettableIndex(index: number) {
    return (
      this.moving &&
      index !== this.noteBeingMovedIndex &&
      index !== this.noteBeingMovedIndex + 1
    );
  }

  getNotes() {
    this.noteService.getNotes().then(notes => this.notes = notes);
  };

}

