import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { DatabaseService, LoggerService, PouchDB } from '../shared';
import { Tab } from './';

@Injectable()
export class TabService extends DatabaseService<Tab> {

  constructor(private loggerService: LoggerService) {
    super();
  }

  protected doGetDatabaseName(): string {
    return 'tabs';
  }

  protected doInitializeDatabase(db: PouchDB): void {
    db.createIndex({ index: { fields: ['name'] } }).catch(this.loggerService.logError);
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

}
