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

  protected doInitializeDatabase(db: PouchDB): Promise<any> {
    return db.createIndex({ index: { fields: ['name'] } });
  }

  getRecords(): Promise<Tab[]> {
    const selector = { name: { '$gte': '' } };
    const order = [{ name: 'asc' }];
    return this.getDatabase().then((database: PouchDB) => {
      return database.find({ selector: selector, sort: order });
    }).then((result: any) => {
      return _.map(result.docs, doc => new Tab(doc));
    });
  }

}
