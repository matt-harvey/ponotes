import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { Button, Dialog } from 'primeng/primeng';

import { Note } from '../shared/note';
import { NoteFormComponent } from '../note/note.component';
import { NoteService } from '../shared/note.service';

// FIXME There need to be buttons to permanently delete notes, to empty the entire
// trash, and to reinstate Notes from the Trash to the NoteList they were in originally.

@Component({
  selector: 'pn-note-list',
  templateUrl: 'app/notes/note-list/note-list.component.html',
  directives: [Button, Dialog, NoteFormComponent]
})
export class NoteListComponent implements OnInit {
  protected notes: Note[] = [];
  private currentNote: Note;
  private newNote = new Note();
  private moving = false;
  private noteBeingMovedIndex: number;
  private showReinstateConfirmation = false;
  private showTrashConfirmation = false;
  private showNoteReinstateConfirmation = false;
  private showDeleteConfirmation = false;

  @Input()
  private showActiveNotes: boolean;

  constructor(protected noteService: NoteService) {
  }

  ngOnInit() {
    this.getNotes();
  }

  onMoveStarted(noteBeingMovedIndex: number): void {
    this.moving = true;
    this.noteBeingMovedIndex = noteBeingMovedIndex;
  }

  onMoveEnded(newIndex?: number): void {
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

  refreshNotes(): void {
    this.getNotes();
  }

  moveTargettableIndex(index: number): boolean {
    return (
      this.moving &&
      index !== this.noteBeingMovedIndex &&
      index !== this.noteBeingMovedIndex + 1
    );
  }

  getNotes(): void {
    this.noteService.getNotes(this.showActiveNotes).then(notes => this.notes = notes);
  };

  onNoteTrash(note: Note): void {
    this.currentNote = note;
    this.showTrashConfirmation = true;
  }

  onNoteReinstate(note: Note): void {
    this.currentNote = note;
    this.showReinstateConfirmation = true;
  }

  onReinstateCancelled(): void {
    this.showReinstateConfirmation = false;
  }

  onReinstateConfirmed(): void {
    this.finalizeToggleActive(true);
  }

  onNoteDelete(note: Note): void {
    this.currentNote = note;
    this.showDeleteConfirmation = true;
  }

  onDeleteCancelled(): void {
    this.showDeleteConfirmation = false;
  }

  onDeleteConfirmed(): void {
    this.noteService.deleteNote(this.currentNote).then(result => {
      this.showDeleteConfirmation = false;
      this.refreshNotes();
    }).catch(error => {
      console.log(error);
    });
  }

  onTrashCancelled(): void {
    this.showTrashConfirmation = false;
  }

  onTrashConfirmed(): void {
    this.finalizeToggleActive(false);
  }

  private finalizeToggleActive(active: boolean): void {
    const original: boolean = this.currentNote.active;
    _.remove(this.notes, this.currentNote);
    this.currentNote.active = !original;
    this.noteService.updateNote(this.currentNote).then(result => {
      this[active ? 'showReinstateConfirmation' : 'showTrashConfirmation'] = false;
    }).catch(error => {
      this.currentNote.active = original;
      this.refreshNotes();
      console.log(error);
    });
  }

}

