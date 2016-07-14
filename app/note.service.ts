import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { Note } from './note';
import { NOTES } from './mock-notes';

@Injectable()
export class NoteService {
  getNotes(): Promise<Note[]> {
    // We could just do `return Promise.resolve(NOTES);`, but instead we
    // simulate a slow-ish connection...
    return new Promise<Note[]>(resolve =>
      setTimeout(() => resolve(NOTES), 500)
    );
  }
  
  addNote(note: Note): Promise<number> {
    return new Promise<number>(resolve => {
      note.id = NOTES.length + 1;
      NOTES.unshift(note);
      // simulate a slow-ish connection
      setTimeout(() => resolve(note.id), 500);
    });
  }

  deleteNote(note: Note): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      _.remove(NOTES, n => n.id === note.id);
      // simulate a slow-ish connection
      setTimeout(() => resolve(true), 500);
    });
  }

}
