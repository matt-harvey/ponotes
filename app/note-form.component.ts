
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer,
         ViewChild } from '@angular/core';

import { Button } from 'primeng/primeng';

import { ExpandingTextarea } from './expanding-textarea.component';
import { Note } from './note';
import { NoteService } from './note.service';

// FIXME position of move target on multi-lines notes.
@Component({
  selector: 'pn-note-form',
  template: `
    <div class="wrapper">
      <textarea #contentInput autofocus="{{!note.persisted() || undefined}}" [rows]=1 [cols]=60
        pnExpandingTextarea [readonly]="note.persisted() && !beingEdited"
        [ngClass]="{'visibly-hidden': moveTargetOnly}"
        [(ngModel)]="note.content"></textarea>
      <div class="button-wrapper">
        <button *ngIf="creatable()" pButton type="button" (click)="onCreate()" title="Add"
          [disabled]="moving() || !note.valid()" icon="fa-plus"></button
        ><button *ngIf="editable()" pButton type="button" (click)="onEdit()" title="Edit"
          (click)="onEdit()" [disabled]="moving()" icon="fa-pencil"></button
        ><button *ngIf="updatable()" pButton type="button" (click)="onUpdate()" title="Save"
          [disabled]="moving() || !note.valid()" icon="fa-save"></button
        ><button *ngIf="deletable()" pButton type="button" (click)="onDelete()"
          [disabled]="moving()" title="Delete" icon="fa-trash-o"></button
        ><button *ngIf="cancelable()" pButton type="button" (click)="onCancel()"
          [disabled]="moving()" title="Cancel" icon="fa-ban"></button
        ><button *ngIf="movable()" pButton type="button" (click)="onStartMove()" title="Move"
          [disabled]="beingEdited" icon="fa-arrows-v"></button
        ><button *ngIf="moveTargettable" pButton type="button" (click)="onSelectMoveTarget()"
          class="button-wide"
          label="move here" title="move here" icon="fa-long-arrow-left"
          style="position: relative; top: -1.25em;"></button
        ><button *ngIf="moveCancellable()" pButton type="button" (click)="onCancelMove()"
          class="button-wide"
          label="cancel" title="cancel move" icon="fa-ban"></button
        >
      </div>
    </div>
  `,
  // TODO Styles are becoming rather bloated and disorganised.
  styles: [`
    .wrapper {
      display: table;
      margin-bottom: 0.125em;
      width: 100%;
    }
    textarea,
    .button-wrapper {
      display: table-cell;
      min-width: 9em;
      padding-top: 0.06em;
      vertical-align: top;
    }
    button {
      display: block;
      background: white;
      margin: 0 0 0.25em 0.25em;
      height: 2.36em;
      width: 1.8em;
    }
    button.button-wide {
      width: 8.5em;
    }
    :host >>> textarea {
      border-radius: 2px;
      margin-right: 0.25em !important;
      padding: 0.333em !important;
    }
    .button-wrapper button {
      border-radius: 2px;
      display: inline-block;
      font-size: 0.8em;
      margin: 0 0 0 0.25em;
    }
    .button-wrapper button >>> span {
      font-weight: normal;
    }
    .ui-inputtext {
      background-color: hsla(60, 75%, 97.5%, 1);
    }
    .ui-inputtext[readonly] {
      background-color: hsla(0, 0%, 100%, 1);
    }
    .ui-inputtext[readonly],
    .ui-inputtext.ui-state-focus[readonly] {
      box-shadow: none;
    }
    textarea {
      font-family: serif;
      padding: 0.5em;
      resize: none;
      width: 100%;
    }
    .visibly-hidden {
      visibility: hidden;
    }
  `],
  directives: [Button, ExpandingTextarea]

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

  @ViewChild('contentInput')
  private contentInput: ElementRef;

  private oldContent: string;

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
    return this.moving() && (this.noteIndex === this.noteBeingMovedIndex);
  }

  onCreate(): void {
    const oldNote = this.note;
    this.newNote = new Note();
    // TODO Handle error once .addNote might fail.
    this.noteService.addNote(oldNote).then(id => {
      if (id < 1) {
        // Adding of note was unsuccessful
        // TODO We probably want to display an error message here too.
        this.newNote = oldNote;
      } else {
        this.focusInput();
      }
    });
  }

  onEdit(): void {
    this.beingEdited = true;
    this.oldContent = this.note.content;
    this.focusInput();
  }

  onUpdate(): void {
    this.beingEdited = false;
    this.noteService.saveAll();  // TODO Will become async at some point.
  }

  onCancel(): void {
    this.note.content = this.oldContent;
    this.beingEdited = false;
  }

  onDelete(): void {
    // TODO Use a nicer, custom dialog, or better, don't use a dialog, but have delete be undoable.
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(this.note);
    }
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
