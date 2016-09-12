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
    db.createIndex({ index: { fields: ['name'] } }).then(() => {
      this.getRecords().then((tabs: Tab[]) => {
        if (tabs.length === 0) {
          const defaultTab = new Tab({ name: 'Notes' });
          this.addRecord(defaultTab).catch((error: string) => {
            console.log(error);
          });
        }
      }).catch((error: string) => {
        console.log(error);
      });
    });
  }

  getRecords(): Promise<Tab[]> {
    return new Promise<Tab[]>(resolve => {
      this.database.find({
        selector: { name: { '$gte': '' } },
        sort: [{ name: 'asc' }]
      }).then((result: any) => {
        resolve(_.map(result.docs, doc => new Tab(doc)));
      }).catch((error: string) => {
        console.log(error);
      });
    });
  }

  // TODO This should be wrapped in an Angular2 promise, rather than having client
  // code see a PouchDB promise.
  addRecord(tab: Tab): any {
    return this.database.post(tab.toJSON()).catch((error: string) => {
      console.log(error);
    });
  }

}
