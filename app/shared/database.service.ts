import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { PouchDB } from './pouch';

interface RecordI {
  toJSON(): Object;
}

interface NullaryFunction {
  (): any;
}

@Injectable()
export abstract class DatabaseService<RecordT extends RecordI> {

  // TODO Handle/fix error that occurs when trying to update a note in one *browser* tab,
  // when that note has already been deleted in another *browser* tab. Issue is a
  // symptom of general issue of browser tabs not being synchronised.

  private _database: PouchDB;

  protected abstract doGetDatabaseName(): string;
  protected abstract doInitializeDatabase(db: PouchDB): void;

  protected get database() {
    if (typeof this._database === 'undefined') {
      this._database = new PouchDB(this.doGetDatabaseName(), { auto_compaction: true });
      this.doInitializeDatabase(this._database);
    }
    return this._database;
  }

  addRecord(record: RecordT): Promise<any> {
    return this.makePromise(() => this.database.post(record.toJSON()));
  }

  getRecord(id: string): Promise<any> {
    return this.makePromise(() => this.database.get(id));
  }

  updateRecord(record: RecordT): Promise<any> {
    return this.makePromise(() => this.database.put(record.toJSON()));
  }

  deleteRecord(record: RecordT): Promise<any> {
    return this.makePromise(() => this.database.remove(record));
  }

  bulkDelete(records: RecordT[]): Promise<any> {
    return this.makePromise(() => {
      const doomed = _.map(records, r => ({ _id: r['id'], _rev: r['rev'], _deleted: true }));
      return this.database.bulkDocs(doomed);
    });
  }

  // This may well be completely unnecessary, as PouchDB already uses a native Promise
  // provided these are available. However, we do this anyway -- explicitly
  // wrapping whatever-promiselike-thing-PouchDB-uses in a Promise -- so that we don't
  // have to worry about what PouchDB is in fact doing, and whether it's compatible with
  // whatever Promise object Angular 2 may assume is present.
  private makePromise(promiseable: NullaryFunction): Promise<any> {
    return new Promise<any>((resolve: Function, reject: Function) => {
      promiseable().then(resolve).catch(reject);
    });
  }

}
