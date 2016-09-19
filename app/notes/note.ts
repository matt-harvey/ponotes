import { Record } from '../shared';
import * as _ from 'lodash';

export class Note extends Record {

  active = true;
  content = '';
  sortOrder: number;
  tabId: string;

  constructor(attributes: Object = {}) {
    super(attributes['_id'], attributes['_rev'], attributes['_deleted']);
    _.each(['active', 'content', 'sortOrder', 'tabId'], key => {
      if (key in attributes) {
        this[key] = attributes[key];
      }
    });
  }

  valid(): boolean {
    return (
      typeof this.content === 'string' && this.content.length !== 0 &&
      typeof this.tabId === 'string' && this.tabId.length !== 0
    );
  }

}
