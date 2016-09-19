import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

import { LoggerService } from '../shared';
import { Note, NoteComponent, NoteService } from './';
import { Tab, TabService } from '../tabs';

// TODO The code for communicating between NoteListComponent and NoteComponent --
// especially when it comes to managing state around moving notes -- feels overly
// convoluted. I should probably use some combination of Flux/Redux/Immutable.js/RxJS
// to manage state nicely.

@Component({
  selector: 'pn-note-list',
  template: require('./note-list.component.html'),
  styles: [require('./note-list.component.css')]
})
export class NoteListComponent implements OnInit {
  private notes: Note[] = [];
  private currentNote: Note;
  private newNote = new Note();
  private moving = false;
  private moveEnding = false;
  private noteBeingMovedIndex: number;
  private showReinstateConfirmation = false;
  private showTrashConfirmation = false;
  private showTrashEmptyConfirmation = false;
  private showNoteReinstateConfirmation = false;
  private showNoteDeleteConfirmation = false;
  private showTabDeleteConfirmation = false;
  private reinstateTarget = '';

  @Input() private showActiveNotes = true;
  @Input() private newTab = false;
  @Input() private tab: Tab;

  @Output() private onTabDeleteConfirmation = new EventEmitter<Tab>();

  constructor(
    private loggerService: LoggerService,
    private noteService: NoteService,
    private tabService: TabService
  ) {
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
    const reset = () => {
      this.noteBeingMovedIndex = undefined;
      this.moving = false;
      this.moveEnding = false;
    };
    if (typeof newIndex !== 'undefined' && newIndex !== this.noteBeingMovedIndex) {
      const movedNote = this.notes[this.noteBeingMovedIndex];
      const newPredecessor = (newIndex === 0 ? undefined : this.notes[newIndex - 1]);
      const newSuccessor = this.notes[newIndex];
      this.noteService.moveRecord(movedNote, newPredecessor, newSuccessor).then(result => {
        return this.getNotes();
      }).then((result: any) => {
         this.noteBeingMovedIndex = _.findIndex(this.notes, note => note.id === movedNote.id);
         this.moving = false;
         this.moveEnding = true;
      }).catch((error: string) => {
        return this.getNotes();
      }).catch(this.loggerService.logError);
      setTimeout(reset, 750);
    } else {
      reset();
    }
  }

  private onTabDelete(): void {
    this.showTabDeleteConfirmation = true;
  }

  private onTabDeleteConfirmed(): void {
    this.noteService.bulkDelete(this.notes).then((result: any) => {
      this.onTabDeleteConfirmation.emit(this.tab);
      this.showTabDeleteConfirmation = false;
    }).catch(this.loggerService.logError);
  }

  private onTabDeleteCancelled(): void {
    this.showTabDeleteConfirmation = false;
  }

  refreshNotes(): void {
    this.getNotes().catch(this.loggerService.logError);
  }

  private moveTargettableIndex(index: number): boolean {
    return (
      this.moving &&
      index !== this.noteBeingMovedIndex &&
      index !== this.noteBeingMovedIndex + 1
    );
  }

  private getNotes(): Promise<any> {
    return this.noteService.getRecords(this.showActiveNotes, this.tab.id).then((notes: Note[]) => {
      this.notes = notes;
    });
  };

  private onNoteAdded(note: Note): void {
    this.refreshNotes();
  }

  private onNoteUpdated(note: Note): void {
    this.refreshNotes();
  }

  private onNoteTrash(note: Note): void {
    this.currentNote = note;
    this.showTrashConfirmation = true;
  }

  private onNoteReinstate(note: Note): void {
    this.currentNote = note;
    this.tabService.getRecord(note.tabId).then((tabDoc: Object) => {
      this.reinstateTarget = new Tab(tabDoc).name;
      this.showReinstateConfirmation = true;
    }).catch(this.loggerService.logError);
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
      return this.getNotes();
    }).catch(this.loggerService.logError);
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
      return this.getNotes();
    }).then((result: any) => {
      this.showTrashEmptyConfirmation = false;
    }).catch(this.loggerService.logError);
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
      this.loggerService.logError(error);
    });
  }

}
