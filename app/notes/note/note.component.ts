import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer,
         ViewChild } from '@angular/core';

import { Button, Dialog } from 'primeng/primeng';

import { ExpandingTextarea } from '../../shared/expanding-textarea.component';
import { Note } from '../shared/note';
import { NoteService } from '../shared/note.service';

// TODO Apply "being-moved" class for a half a second or so to note that has just been moved.
@Component({
  selector: 'pn-note-form',
  templateUrl: 'app/notes/note/note.component.html',
  styleUrls: ['app/notes/note/note.component.css'],
  directives: [Button, Dialog, ExpandingTextarea]
})
export class NoteFormComponent implements OnInit {
  @Input()
  private notes: Note[] = [];

  @Input()
  private noteIndex: number;

  @Input()
  private beingEdited = false;

  @Input()
  private noteBeingMovedIndex: number;

  @Input()
  private moveTargettable = false;

  @Input()
  private newNote: Note;

  @Input()
  private moveTargetOnly = false;

  @Output()
  onMoveStarted = new EventEmitter<number>();

  @Output()
  onMoveEnded = new EventEmitter<number>();

  @Output()
  onNoteAdded = new EventEmitter();

  @Output()
  onNoteUpdated = new EventEmitter();

  @Output()
  onNoteDeleted = new EventEmitter();

  @ViewChild('contentInput')
  private contentInput: ElementRef;

  private oldContent: string;
  private showDeleteConfirmation = false;

  constructor(private renderer: Renderer, private noteService: NoteService) { }

  ngOnInit(): void {
    if (this.moveTargetOnly || (typeof this.noteIndex === 'undefined')) {
      this.newNote = new Note();
    }
  }

  get note(): Note {
    return this.newNote || this.notes[this.noteIndex];
  }

  private focusInput() {
    this.renderer.invokeElementMethod(this.contentInput.nativeElement, 'focus', []);
  }

  creatable(): boolean {
    return !this.moving() && !this.moveTargetOnly && !this.note.persisted();
  }

  deletable(): boolean {
    return !this.moving() && !this.beingEdited && this.note.persisted();
  }

  cancelable(): boolean {
    return !this.moving() && this.beingEdited && this.note.persisted();
  }

  editable(): boolean {
    return !this.moving() && !this.beingEdited && this.note.persisted();
  }

  updatable(): boolean {
    return !this.moving() && this.beingEdited && this.note.persisted();
  }

  movable(): boolean {
    return !this.moving() && this.note.persisted();
  }

  moving(): boolean {
    return typeof this.noteBeingMovedIndex !== 'undefined';
  }

  moveCancellable(): boolean {
    return this.noteBeingMoved();
  }

  noteBeingMoved(): boolean {
    return this.moving() && this.noteIndex === this.noteBeingMovedIndex;
  }

  onCreate(): void {
    const oldNote = this.note;
    this.newNote = new Note();
    this.noteService.addNote(oldNote).then(result => {
      this.onNoteAdded.emit(undefined);
      this.focusInput();
    }).catch(error => {
      this.newNote = oldNote;
      console.log(error);
    });
  }

  onEdit(): void {
    this.beingEdited = true;
    this.oldContent = this.note.content;
    this.focusInput();
  }

  onUpdate(): void {
    this.beingEdited = false;
    this.noteService.updateNote(this.note).then(result => {
      this.onNoteUpdated.emit(undefined);
    }).catch(error => {
      this.beingEdited = true;
      console.log(error);
    });
  }

  onCancel(): void {
    this.note.content = this.oldContent;
    this.beingEdited = false;
  }

  // TODO Have delete move to trash instead

  onDelete(): void {
    this.showDeleteConfirmation = true;
  }

  onDeleteCancelled(): void {
    this.showDeleteConfirmation = false;
  }

  onDeleteConfirmed(): void {
    this.noteService.deleteNote(this.note).then(result => {
      this.showDeleteConfirmation = false;
      this.onNoteDeleted.emit(undefined);
    });
  }

  onCancelMove(): void {
    this.onMoveEnded.emit(undefined);
  }

  onStartMove(): void {
    this.onMoveStarted.emit(this.noteIndex);
  }

  onSelectMoveTarget(): void {
    this.onMoveEnded.emit(this.noteIndex);
  }

}
