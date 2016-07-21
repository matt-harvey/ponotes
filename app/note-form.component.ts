
import { Component, ElementRef, Input, Renderer, ViewChild } from '@angular/core';
import { Button } from 'primeng/primeng';

import { ExpandingTextarea } from './expanding-textarea.component';
import { Note } from './note';
import { NoteService } from './note.service';

// TODO Have distinct background colours on buttons depending on label.
@Component({
  selector: 'pn-note-form',
  template: `
    <div class="wrapper">
      <textarea #contentInput autofocus="{{!note.persisted() || undefined}}" [rows]=1 [cols]=60
        pnExpandingTextarea [readonly]="note.persisted() && !beingEdited"
        [(ngModel)]="note.content"></textarea>
      <div class="button-wrapper">
        <button *ngIf="creatable()" pButton type="button" (click)="onCreate()" title="Add"
          [disabled]="!note.valid()" icon="fa-plus"></button
        ><button *ngIf="editable()" pButton type="button" (click)="onEdit()" title="Edit"
          (click)="onEdit()" icon="fa-pencil"></button
        ><button *ngIf="updatable()" pButton type="button" (click)="onUpdate()" title="Save"
          [disabled]="!note.valid()" icon="fa-save"></button
        ><button *ngIf="deletable()" pButton type="button" (click)="onDelete()"
          title="Delete" icon="fa-trash-o"></button
        ><button *ngIf="cancelable()" pButton type="button" (click)="onCancel()"
          title="Cancel" icon="fa-ban"></button
        ><button *ngIf="movable()" pButton type="button" (click)="onMoveDown()" title="Down"
          [disabled]="!movableDown()" icon="fa-caret-down"></button
        ><button *ngIf="movable()" pButton type="button" (click)="onMoveUp()" title="Up"
          [disabled]="!movableUp()" icon="fa-caret-up"></button
        >
      </div>
    </div>
  `,
  styles: [`
    .wrapper {
      display: table;
      margin-bottom: 0.5em;
      width: 100%;
    }
    textarea,
    .button-wrapper {
      display: table-cell;
      min-width: 6em;
      padding-top: 0.2em;
      vertical-align: top;
    }
    button {
      display: block;
      margin: 0 0 0.25em 0.25em;
      width: 1.6em;
    }
    textarea {
      margin-right: 0.25em;
    }
    .button-wrapper button {
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
    .ui-inputtext.ui-state-focus[readonly] {
      box-shadow: none;
    }
    textarea {
      padding: 0.5em;
      resize: none;
      width: 100%;
    }
  `],
  directives: [Button, ExpandingTextarea]

})
export class NoteFormComponent {
  @Input()
  private note: Note;

  @Input()
  private notes: Note[] = [];

  @Input()
  private beingEdited = false;

  @ViewChild('contentInput')
  private contentInput: ElementRef;

  private oldContent: string;

  constructor(private renderer: Renderer, private noteService: NoteService) { }

  private focusInput() {
    this.renderer.invokeElementMethod(this.contentInput.nativeElement, 'focus', []);
  }

  private noteIndex() {
    return this.notes.indexOf(this.note);
  }

  creatable(): boolean {
    return !this.note.persisted();
  }

  deletable(): boolean {
    return !this.beingEdited && this.note.persisted();
  }

  cancelable(): boolean {
    return this.beingEdited && this.note.persisted();
  }

  editable(): boolean {
    return !this.beingEdited && this.note.persisted();
  }

  updatable(): boolean {
    return this.beingEdited && this.note.persisted();
  }

  movable(): boolean {
    return this.note.persisted();
  }

  movableDown(): boolean {
    return this.movable() && (this.noteIndex() !== this.notes.length - 1);
  }

  movableUp(): boolean {
    return this.movable() && (this.noteIndex() !== 0);
  }

  onCreate(): void {
    const oldNote = this.note;
    this.note = new Note();
    // TODO Handle error once .addNote might fail.
    this.noteService.addNote(oldNote).then(id => {
      if (id < 1) {
        // Adding of note was unsuccessful
        // TODO We probably want to display an error message here too.
        this.note = oldNote;
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

  onMoveDown(): void {
    const index = this.noteIndex();
    if (index === this.notes.length - 1) {
      return;
    }
    this.notes[index] = this.notes[index + 1];
    this.notes[index + 1] = this.note;
    this.noteService.saveAll();  // TODO Will become async at some point.
  }

  onMoveUp(): void {
    const index = this.noteIndex();
    if (index === 0) {
      return;
    }
    this.notes[index] = this.notes[index - 1];
    this.notes[index - 1] = this.note;
    this.noteService.saveAll();  // TODO Will become async at some point.
  }
}
