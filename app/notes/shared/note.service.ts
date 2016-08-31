import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { DatabaseService } from '../../shared/database.service';
import { Note } from './note';
import { PouchDB } from '../../shared/pouch';

@Injectable()
export class NoteService extends DatabaseService<Note> {

  // TODO At the moment, we have this service being called to create, update and move notes, after
  // which client code calls refresh to reload all of the notes it needs. This reloading of all the
  // notes might become a problem if there are ever a large number of notes. Also, there seems to be
  // a "PouchDB way" where you listen for changes and it updates things for you, whether the changes
  // occur locally or are received from a CouchDB instance that we're syncing with. This is probably
  // the better way in the long run. See
  // http://www.joshmorony.com/syncing-data-with-pouchdb-and-cloudant-in-ionic-2/.

  protected doGetDatabaseName(): string {
    return 'notes';
  }

  protected doInitializeDatabase(db: PouchDB): void {
    db.createIndex({ index: { fields: ['sortOrder', 'tabId'] } });
    db.createIndex({ index: { fields: ['sortOrder'] } });
  }

  getRecords(active: boolean, tabId?: string): Promise<Note[]> {
    return new Promise<Note[]>(resolve => {
      let selector = { sortOrder: { '$exists': true, $gte: 0 }, active: { $eq: active } };
      if (typeof tabId !== 'undefined') {
        selector['tabId'] = { $eq: tabId }
      };
      this.database.find({
        selector: selector,
        sort: [{ sortOrder: 'desc' }]
      }).then((result: any) => {
        resolve(_.map(result.docs, doc => new Note(doc)));
      }).catch((error: string) => {
        console.log(error);
      });
    });
  }

  // TODO This should be wrapped in an Angular2 promise, rather than having client
  // code see a PouchDB promise.
  addRecord(note: Note): any {
    note.sortOrder = this.makeSortOrder();
    return this.database.post(note.toJSON()).catch((error: string) => {
      console.log(error);
      note.sortOrder = undefined;
    });
  }

  // TODO This should be wrapped in an Angular2 promise, rather than having client
  // code see a PouchDB promise.
  moveRecord(note: Note, newPredecessor: Note, newSuccessor: Note) {
    // FIXME It is possible that in time, after enough moves, there is not enough
    // precision to accommodate a particular move, since the sortOrder attributes may
    // be too close together, given the limited precision of the number type, to
    // calculate distinctly their average. This problem can be overcome: see
    // http://stackoverflow.com/questions/2940329/how-to-move-an-element-in-a-sorted-list-and-keep-the-couchdb-write-atomic.
    const newSuccessorSortOrder = (newSuccessor ? newSuccessor.sortOrder : 0);
    const newPredecessorSortOrder = (
      newPredecessor ?
      newPredecessor.sortOrder :
      this.makeSortOrder()
    );
    const oldSortOrder = note.sortOrder;
    note.sortOrder = (newPredecessorSortOrder + newSuccessorSortOrder) / 2;
    return this.database.put(note.toJSON()).catch((error: string) => {
      console.log(error);
      note.sortOrder = oldSortOrder;
    });
  }

  private makeSortOrder() {
    return new Date().valueOf();
  }

}
