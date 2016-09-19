import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { PouchDB } from './pouch';

interface RecordI {
  toJSON(): Object;
}

@Injectable()
export abstract class DatabaseService<RecordT extends RecordI> {

  // TODO Handle/fix error that occurs when trying to update a note in one *browser* tab,
  // when that note has already been deleted in another *browser* tab. Issue is a
  // symptom of general issue of browser tabs not being synchronised.

  private _database: PouchDB;

  protected abstract doGetDatabaseName(): string;
  protected abstract doInitializeDatabase(db: PouchDB): Promise<any>;

  protected getDatabase(): Promise<PouchDB> {
    if (typeof this._database === 'undefined') {
      this._database = new PouchDB(this.doGetDatabaseName(), { auto_compaction: true });
      return this.doInitializeDatabase(this._database).then((result: any) => this._database);
    } else {
      return Promise.resolve(this._database);
    }
  }

  addRecord(record: RecordT): Promise<any> {
    return this.getDatabase().then(database => database.post(record.toJSON()));
  }

  getRecord(id: string): Promise<any> {
    return this.getDatabase().then(database => database.get(id));
  }

  updateRecord(record: RecordT): Promise<any> {
    return this.getDatabase().then(database => database.put(record.toJSON()));
  }

  deleteRecord(record: RecordT): Promise<any> {
    return this.getDatabase().then(database => database.remove(record));
  }

  bulkDelete(records: RecordT[]): Promise<any> {
    const doomed = _.map(records, r => ({ _id: r['id'], _rev: r['rev'], _deleted: true }));
    return this.getDatabase().then(database => database.bulkDocs(doomed));
  }

}
