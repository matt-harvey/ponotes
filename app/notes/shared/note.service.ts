import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { Note } from './note';

@Injectable()
export class NoteService {

  private notes: Note[];

  constructor() { this.load(); }

  getNotes(): Promise<Note[]> {
    // We could just do `return Promise.resolve(NOTES);`, but instead we
    // simulate a slow-ish connection...
    return new Promise<Note[]>(resolve => {
      setTimeout(() => {
        resolve(this.notes);
      }, 500);
    });
  }

  addNote(note: Note): Promise<number> {
    return new Promise<number>(resolve => {
      note.id = this.notes.length + 1;
      this.notes.unshift(note);
      // simulate a slow-ish connection
      setTimeout(() => {
        this.saveAll();
        resolve(note.id);
      }, 500);
    });
  }

  deleteNote(note: Note): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      _.remove(this.notes, n => n.id === note.id);
      // simulate a slow-ish connection
      setTimeout(() => {
        this.saveAll();
        resolve(true);
      }, 500);
    });
  }

  private load() {
    // TODO Let Note class deal with loading/dumping JSON.
    const data = JSON.parse(localStorage.getItem('notes') || '[]');
    this.notes = _.map(data, obj => new Note(obj['content'], obj['id']));
  }

  saveAll() {
    // TODO Let Note class deal with loading/dumping JSON.
    const data = _.map(this.notes, note => ({ content: note['content'], id: note['id'] }));
    localStorage.setItem('notes', JSON.stringify(data));
  }

  // indexes must be positive and in range
  moveNote(originalIndex: number, moveBeforeIndex: number) {
    // TODO Not very performant.

    if (moveBeforeIndex === originalIndex) {
      return;
    }
    const movingFromAfter = (originalIndex > moveBeforeIndex);
    let newIndex = (movingFromAfter ? moveBeforeIndex : moveBeforeIndex - 1);
    this.notes.splice(newIndex, 0, this.notes.splice(originalIndex, 1)[0]);
    this.saveAll();
  }

}
