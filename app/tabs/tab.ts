import { Record } from '../shared/record';
import * as _ from 'lodash';

export class Tab extends Record {

  name = '';

  constructor(attributes: Object = {}) {
    super(attributes['_id'], attributes['_rev'], attributes['_deleted']);
    if ('name' in attributes) {
      this.name = attributes['name'];
    }
  }

  valid(): boolean {
    return this.name.length !== 0;
  }

}
