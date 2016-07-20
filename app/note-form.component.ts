import { Component, ElementRef, Input, Renderer, ViewChild } from '@angular/core';
import { Button, InputTextarea } from 'primeng/primeng';

import { Note } from './note';
import { NoteService } from './note.service';

// TODO Have distinct background colours on buttons depending on label.
@Component({
  selector: 'my-note-form',
  template: `
    <div class="wrapper">
      <textarea #contentInput class="js-content-input" autofocus
        pInputTextarea autoResize="autoResize" [rows]=3 [cols]=60
        [readonly]="note.persisted() && !beingEdited" [(ngModel)]="note.content"></textarea>
      <div class="button-wrapper">
        <button *ngIf="creatable()" pButton type="button" (click)="onCreate()" label="Add"
          [disabled]="!note.valid()" icon="fa-plus"></button>
        <button *ngIf="editable()" pButton type="button" (click)="onEdit()" label="Edit"
          (click)="onEdit()" icon="fa-pencil"></button>
        <button *ngIf="updatable()" pButton type="button" (click)="onUpdate()" label="Save"
          [disabled]="!note.valid()" icon="fa-save"></button>
        <button *ngIf="deletable()" pButton type="button" (click)="onDelete()"
          label="Delete" icon="fa-trash-o"></button>
        <button *ngIf="cancelable()" pButton type="button" (click)="onCancel()"
          label="Cancel" icon="fa-ban"></button>
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
      padding-top: 0.1em;
      vertical-align: top;
    }
    .button-wrapper button {
      font-size: 0.9em;
      width: 6.75em;
      margin-bottom: 0.25em;
    }
    .button-wrapper button span {
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
    button {
      display: block;
      margin: 0 0 0.25em 0.5em;
    }
    textarea {
      padding: 0.5em;
      resize: none;
      width: 100%;
    }
  `],
  directives: [Button, InputTextarea]
})
export class NoteFormComponent {
  @Input()
  private note: Note;

  private oldContent: string;

  @Input()
  private beingEdited = false;

  @ViewChild('contentInput')
  private contentInput: ElementRef;

  constructor(private renderer: Renderer, private noteService: NoteService) { }

  private focusInput() {
    this.renderer.invokeElementMethod(this.contentInput.nativeElement, 'focus', []);
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

  onCreate(): void {
    var oldNote = this.note;
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
    this.noteService.deleteNote(this.note);
  }
}
