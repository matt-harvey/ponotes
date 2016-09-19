import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer,
         ViewChild } from '@angular/core';

import { ExpandingTextareaComponent, LoggerService } from '../shared';
import { Note, NoteService } from './';

@Component({
  selector: 'pn-note',
  template: require('./note.component.html'),
  styles: [require('./note.component.css')]
})
export class NoteComponent implements OnInit {
  @Input() private notes: Note[] = [];
  @Input() private tabId: string;
  @Input() private noteIndex: number;
  @Input() private beingEdited = false;
  @Input() private noteBeingMovedIndex: number;
  @Input() private moveTargettable = false;
  @Input() private moveEnding = false;
  @Input() private newNote: Note;
  @Input() private moveTargetOnly = false;

  @Output() private onMoveStarted = new EventEmitter<number>();
  @Output() private onMoveEnded = new EventEmitter<number>();
  @Output() private onNoteAdded = new EventEmitter<Note>();
  @Output() private onNoteUpdated = new EventEmitter<Note>();
  @Output() private onNoteTrash = new EventEmitter<Note>();
  @Output() private onNoteReinstate = new EventEmitter<Note>();
  @Output() private onNoteDelete = new EventEmitter<Note>();

  @ViewChild(ExpandingTextareaComponent) private contentInput: ExpandingTextareaComponent;

  private oldContent: string;

  constructor(
    private loggerService: LoggerService,
    private renderer: Renderer,
    private noteService: NoteService
  ) {
  }

  ngOnInit(): void {
    if (this.moveTargetOnly || (typeof this.noteIndex === 'undefined')) {
      this.newNote = new Note({ tabId: this.tabId });
    }
  }

  get note(): Note {
    return this.newNote || this.notes[this.noteIndex];
  }

  private focusInput() {
    this.contentInput.focus();
  }

  private activelyMoving() {
    return this.moving() && !this.moveEnding;
  }

  private creatable(): boolean {
    return !this.activelyMoving() && !this.moveTargetOnly && !this.note.persisted();
  }

  private trashable(): boolean {
    return !this.activelyMoving() && !this.beingEdited && this.note.persisted() && this.note.active;
  }

  private cancelable(): boolean {
    return !this.activelyMoving() && this.beingEdited && this.note.persisted();
  }

  private editable(): boolean {
    return !this.activelyMoving() && !this.beingEdited && this.note.persisted() && this.note.active;
  }

  private updatable(): boolean {
    return !this.activelyMoving() && this.beingEdited && this.note.persisted();
  }

  private movable(): boolean {
    return !this.activelyMoving() && this.note.persisted() && this.note.active;
  }

  private moving(): boolean {
    return typeof this.noteBeingMovedIndex !== 'undefined';
  }

  private moveCancellable(): boolean {
    return this.noteBeingMoved();
  }

  private reinstatable(): boolean {
    return !this.note.active;
  }

  private deletable(): boolean {
    return !this.note.active;
  }

  private noteBeingMoved(): boolean {
    return this.moving() && this.noteIndex === this.noteBeingMovedIndex;
  }

  private onCreate(): void {
    const oldNote = this.note;
    this.newNote = new Note({ tabId: this.tabId });
    this.noteService.addRecord(oldNote).then((result: any) => {
      this.onNoteAdded.emit(oldNote);
      this.focusInput();
    }).catch((error: string) => {
      this.newNote = oldNote;
      this.loggerService.logError(error);
    });
  }

  private onEdit(): void {
    this.beingEdited = true;
    this.oldContent = this.note.content;
    this.focusInput();
  }

  private onUpdate(): void {
    this.beingEdited = false;
    this.noteService.updateRecord(this.note).then((result: any) => {
      this.onNoteUpdated.emit(this.note);
    }).catch((error: string) => {
      this.beingEdited = true;
      this.loggerService.logError(error);
    });
  }

  private onCancel(): void {
    this.note.content = this.oldContent;
    this.beingEdited = false;
  }

  private onTrash(): void {
    this.onNoteTrash.emit(this.note);
  }

  private onCancelMove(): void {
    this.onMoveEnded.emit(undefined);
  }

  private onStartMove(): void {
    this.onMoveStarted.emit(this.noteIndex);
  }

  private onSelectMoveTarget(): void {
    this.onMoveEnded.emit(this.noteIndex);
  }

  private onReinstate(): void {
    this.onNoteReinstate.emit(this.note);
  }

  private onDelete(): void {
    this.onNoteDelete.emit(this.note);
  }

}
