import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { PouchDB } from './pouch';

interface RecordI {
  toJSON(): Object;
}

@Injectable()
export abstract class DatabaseService<RecordT extends RecordI> {

  // TODO Ensure syncing of records works OK when the application is open in two different
  // tabs.

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

  getRecord(id: string): any {
    return this.database.get(id);
  }

  // TODO This should be wrapped in an Angular2 promise, rather than having client
  // code see a PouchDB promise.
  updateRecord(record: RecordT): any {
    return this.database.put(record.toJSON());
  }

  // TODO This should be wrapped in an Angular2 promise, rather than having client
  // code see a PouchDB promise.
  deleteRecord(record: RecordT): any {
    return this.database.remove(record);
  }

  bulkDelete(records: RecordT[]): any {
    const markedRecords = _.map(records, (r: RecordT) => {
      return { _id: r['id'], _rev: r['rev'], _deleted: true };
    });
    return this.database.bulkDocs(markedRecords);
  }

}
