import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { DatabaseService } from '../../shared/database.service';
import { Tab } from './tab';
import { PouchDB } from '../../shared/pouch';

@Injectable()
export class TabService extends DatabaseService<Tab> {

  protected doGetDatabaseName(): string {
    return 'tabs';
  }

  protected doInitializeDatabase(db: PouchDB): void {
    db.createIndex({ index: { fields: ['sortOrder'] } }).then(() => {
      this.getRecords().then((tabs: Tab[]) => {
        if (tabs.length === 0) {
          // TODO Do we need to set tab sort order here?
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
        selector: { sortOrder: { '$exists': true, $gte: 0 } },
        sort: [{ sortOrder: 'desc' }]
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
    tab.sortOrder = this.makeSortOrder();
    return this.database.post(tab.toJSON()).catch((error: string) => {
      console.log(error);
      tab.sortOrder = undefined;
    });
  }

  // TODO This should be wrapped in an Angular2 promise, rather than having client
  // code see a PouchDB promise.
  moveRecord(tab: Tab, newPredecessor: Tab, newSuccessor: Tab) {
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
    const oldSortOrder = tab.sortOrder;
    tab.sortOrder = (newPredecessorSortOrder + newSuccessorSortOrder) / 2;
    return this.database.put(tab.toJSON()).catch((error: string) => {
      console.log(error);
      tab.sortOrder = oldSortOrder;
    });
  }

  private makeSortOrder() {
    return new Date().valueOf();
  }

}
