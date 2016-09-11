import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

import { Note } from './note';
import { NoteComponent } from './note.component';
import { NoteService } from './note.service';
import { Tab } from '../tabs/tab';

// FIXME There need to be buttons to permanently delete notes, to empty the entire
// trash, and to reinstate Notes from the Trash to the NoteList they were in originally.

@Component({
  selector: 'pn-note-list',
  templateUrl: 'app/notes/note-list.component.html',
  styleUrls: ['app/notes/note-list.component.css']
})
export class NoteListComponent implements OnInit {
  private notes: Note[] = [];
  private currentNote: Note;
  private newNote = new Note();
  private moving = false;
  private noteBeingMovedIndex: number;
  private showReinstateConfirmation = false;
  private showTrashConfirmation = false;
  private showTrashEmptyConfirmation = false;
  private showNoteReinstateConfirmation = false;
  private showNoteDeleteConfirmation = false;
  private showTabDeleteConfirmation = false;

  @Input() private showActiveNotes = true;
  @Input() private newTab = false;
  @Input() private tab: Tab;

  @Output() private onTabDeleteConfirmation = new EventEmitter<Tab>();

  constructor(private noteService: NoteService) {
  }

  ngOnInit(): void {
    if (!this.newTab) {
      this.getNotes();
    }
  }

  private onMoveStarted(noteBeingMovedIndex: number): void {
    this.moving = true;
    this.noteBeingMovedIndex = noteBeingMovedIndex;
  }

  private onMoveEnded(newIndex?: number): void {
    if (typeof newIndex !== 'undefined' && newIndex !== this.noteBeingMovedIndex) {
      const noteBeingMoved = this.notes[this.noteBeingMovedIndex];
      const newPredecessor = (
        newIndex === 0 ?
        undefined :
        this.notes[newIndex - 1]
      );
      const newSuccessor = this.notes[newIndex];
      this.noteService.moveRecord(noteBeingMoved, newPredecessor, newSuccessor)
        .then((result: any) => {
          this.refreshNotes();
          this.noteBeingMovedIndex = undefined;
          this.moving = false;
        });
    } else {
      this.noteBeingMovedIndex = undefined;
      this.moving = false;
    }
  }

  private onTabDelete(): void {
    this.showTabDeleteConfirmation = true;
  }

  private onTabDeleteConfirmed(): void {
    this.noteService.bulkDelete(this.notes).then((result: any) => {
      this.onTabDeleteConfirmation.emit(this.tab);
      this.showTabDeleteConfirmation = false;
    }).catch((error: string) => {
      console.log(error);
    });
  }

  private onTabDeleteCancelled(): void {
    this.showTabDeleteConfirmation = false;
  }

  refreshNotes(): void {
    this.getNotes();
  }

  private moveTargettableIndex(index: number): boolean {
    return (
      this.moving &&
      index !== this.noteBeingMovedIndex &&
      index !== this.noteBeingMovedIndex + 1
    );
  }

  private getNotes(): void {
    this.noteService.getRecords(this.showActiveNotes, this.tab.id).then((notes: Note[]) => {
      this.notes = notes;
    });
  };

  private onNoteTrash(note: Note): void {
    this.currentNote = note;
    this.showTrashConfirmation = true;
  }

  private onNoteReinstate(note: Note): void {
    this.currentNote = note;
    this.showReinstateConfirmation = true;
  }

  private onReinstateCancelled(): void {
    this.showReinstateConfirmation = false;
  }

  private onReinstateConfirmed(): void {
    this.finalizeToggleActive(true);
  }

  private onNoteDelete(note: Note): void {
    this.currentNote = note;
    this.showNoteDeleteConfirmation = true;
  }

  private onDeleteCancelled(): void {
    this.showNoteDeleteConfirmation = false;
  }

  private onDeleteConfirmed(): void {
    this.noteService.deleteRecord(this.currentNote).then((result: any) => {
      this.showNoteDeleteConfirmation = false;
      this.refreshNotes();
    }).catch((error: string) => {
      console.log(error);
    });
  }

  private onTrashCancelled(): void {
    this.showTrashConfirmation = false;
  }

  private onTrashConfirmed(): void {
    this.finalizeToggleActive(false);
  }

  private onTrashEmpty(): void {
    this.showTrashEmptyConfirmation = true;
  }

  private onTrashEmptyConfirmed(): void {
    this.noteService.bulkDelete(this.notes).then((result: any) => {
      this.getNotes();
      this.showTrashEmptyConfirmation = false;
    }).catch((error: string) => {
      console.log(error);
    });
  }

  private onTrashEmptyCancelled(): void {
    this.showTrashEmptyConfirmation = false;
  }

  private finalizeToggleActive(active: boolean): void {
    const original: boolean = this.currentNote.active;
    _.remove(this.notes, this.currentNote);
    this.currentNote.active = !original;
    this.noteService.updateRecord(this.currentNote).then((result: any) => {
      this[active ? 'showReinstateConfirmation' : 'showTrashConfirmation'] = false;
    }).catch((error: string) => {
      this.currentNote.active = original;
      this.refreshNotes();
      console.log(error);
    });
  }

}
