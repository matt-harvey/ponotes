import { Component, OnInit } from '@angular/core';

import { Note } from '../shared/note';
import { NoteFormComponent } from '../note/note.component';
import { NoteService } from '../shared/note.service';

@Component({
  selector: 'pn-notes',
  templateUrl: 'app/notes/note-list/note-list.component.html',
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
    if (typeof newIndex !== 'undefined' && newIndex !== this.noteBeingMovedIndex) {
      const noteBeingMoved = this.notes[this.noteBeingMovedIndex];
      const newPredecessor = (
        newIndex === 0 ?
        undefined :
        this.notes[newIndex - 1]
      );
      const newSuccessor = this.notes[newIndex];
      this.noteService.moveNote(noteBeingMoved, newPredecessor, newSuccessor).then(result => {
        this.refreshNotes();
        this.noteBeingMovedIndex = undefined;
        this.moving = false;
      });
    } else {
      this.noteBeingMovedIndex = undefined;
      this.moving = false;
    }
  }

  refreshNotes() {
    this.getNotes();
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

