import { Component, ElementRef, Input, Renderer, ViewChild } from '@angular/core';
import { Button, InputTextarea } from 'primeng/primeng';

import { Note } from './note';
import { NoteService } from './note.service';

// TODO Use font awesome on button labels, and have distinct background colours
// on buttons depending on label.
@Component({
  selector: 'my-note-form',
  template: `
    <div class="wrapper">
      <textarea #contentInput class="js-content-input" autofocus
        pInputTextarea autoResize="autoResize" [rows]=3 [cols]=60
        [readonly]="!editable" [(ngModel)]="note.content"></textarea>
      <div class="button-wrapper">
        <button pButton type="button" (click)="onEditOrSave()"
          [disabled]="!note.valid()" label="{{saveButtonLabel()}}"></button>
        <button *ngIf="note.persisted()" pButton type="button" (click)="onCancelOrDelete()"
          label="{{deleteButtonLabel()}}"></button>
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
      vertical-align: top;
    }
    .button-wrapper button {
      min-width: 5.75em;
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
  private editable = false;

  @ViewChild('contentInput')
  private contentInput: ElementRef;

  constructor(private renderer: Renderer, private noteService: NoteService) { }

  private focusInput() {
    this.renderer.invokeElementMethod(this.contentInput.nativeElement, 'focus', []);
  }

  saveButtonLabel(): string {
    if (this.editable) {
      return (this.note.persisted() ? 'Save' : 'Add');
    }
    return 'Edit';
  }

  deleteButtonLabel(): string {
    return (this.editable ? 'Cancel' : 'Delete');
  }

  onEditOrSave(): void {
    if (this.note.persisted()) {
      // TODO Update properly with this.noteService.
      this.noteService.saveAll();  // TODO Will become async at some point.
      this.editable = !this.editable;
      if (this.editable) {
        this.oldContent = this.note.content;  // save old content so we can undo if needed
        this.focusInput();
      }
    } else {
      var oldNote = this.note;
      this.note = new Note();
      // TODO Handle error once .addNote might fail.
      this.noteService.addNote(oldNote).then(id => {
        if (id < 1) {
          // Adding of note was unsuccessful
          // TODO We probably want to display an error message here too.
          this.note = oldNote;
        }
      });
    }
  }

  onCancelOrDelete(): void {
    if (this.editable) {
      this.note.content = this.oldContent;
      this.editable = false;
    } else {
      this.noteService.deleteNote(this.note);
    }
  }
}
