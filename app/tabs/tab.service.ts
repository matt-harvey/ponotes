import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { DatabaseService } from '../shared/database.service';
import { LoggerService } from '../shared/logger.service';
import { Tab } from './tab';
import { PouchDB } from '../shared/pouch';

@Injectable()
export class TabService extends DatabaseService<Tab> {

  constructor(private loggerService: LoggerService) {
    super();
  }

  protected doGetDatabaseName(): string {
    return 'tabs';
  }

  protected doInitializeDatabase(db: PouchDB): void {
    db.createIndex({ index: { fields: ['name'] } }).catch((error: string) => {
      this.loggerService.logError(error);
    });
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
