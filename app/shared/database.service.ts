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

  private makePromise(promiseable: NullaryFunction): Promise<any> {
    return new Promise<any>((resolve: Function, reject: Function) => {
      promiseable().then((result: Object) => {
        resolve(result);
      }).catch((error: string) => {
        reject(error);
      });
    });
  }

}
