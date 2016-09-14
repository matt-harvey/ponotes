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

  getRecord(id: string): Promise<any> {
    return new Promise<any>((resolve: Function, reject: Function) => {
      this.database.get(id).then((doc: Object) => {
        resolve(doc);
      }).catch((error: string) => {
        reject(error);
      });
    });
  }

  updateRecord(record: RecordT): Promise<any> {
    return new Promise<any>((resolve: Function, reject: Function) => {
      this.database.put(record.toJSON()).then((result: any) => {
        resolve(result);
      }).catch((error: string) => {
        reject(error);
      });
    });
  }

  deleteRecord(record: RecordT): Promise<any> {
    return new Promise<any>((resolve: Function, reject: Function) => {
      this.database.remove(record).then((result: any) => {
        resolve(result);
      }).catch((error: string) => {
        reject(error);
      });
    });
  }

  bulkDelete(records: RecordT[]): Promise<any> {
    return new Promise<any>((resolve: Function, reject: Function) => {
      const markedRecords = _.map(records, (r: RecordT) => {
        return { _id: r['id'], _rev: r['rev'], _deleted: true };
      });
      this.database.bulkDocs(markedRecords).then((result: any) => {
        resolve(result);
      }).catch((error: string) => {
        reject(error);
      });
    });
  }

}
