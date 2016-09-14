import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { DatabaseService } from '../shared/database.service';
import { Tab } from './tab';
import { PouchDB } from '../shared/pouch';

@Injectable()
export class TabService extends DatabaseService<Tab> {

  protected doGetDatabaseName(): string {
    return 'tabs';
  }

  protected doInitializeDatabase(db: PouchDB): void {
    // TODO Async... wrap in Promises and handle???
    db.createIndex({ index: { fields: ['name'] } });
  }

  getRecords(): Promise<Tab[]> {
    return new Promise<Tab[]>((resolve: Function, reject: Function) => {
      this.database.find({
        selector: { name: { '$gte': '' } },
        sort: [{ name: 'asc' }]
      }).then((result: any) => {
        resolve(_.map(result.docs, doc => new Tab(doc)));
      }).catch((error: string) => {
        reject(error);
      });
    });
  }

  addRecord(tab: Tab): Promise<any> {
    return new Promise<any>((resolve: Function, reject: Function) => {
      this.database.post(tab.toJSON()).then((result: any) => {
        resolve(result);
      }).catch((error: string) => {
        reject(error);
      });
    });
  }

}
