import { Record } from '../../shared/record';
import * as _ from 'lodash';

export class Tab extends Record {

  name = '';
  sortOrder: number;

  constructor(attributes: Object = {}) {
    super(attributes['_id'], attributes['_rev'], attributes['_deleted']);
    _.each(['name', 'sortOrder'], key => {
      if (key in attributes) {
        this[key] = attributes[key];
      }
    });
  }

  valid(): boolean {
    return this.name.length !== 0;
  }

}
