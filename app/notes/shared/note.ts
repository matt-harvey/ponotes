import * as _ from 'lodash';

export class Note {

  content = '';
  sortOrder: number;
  private _id: string;
  private _rev: string;

  constructor(attributes: Object = {}) {
    this.content = (attributes['content'] || '');
    _.each(['sortOrder', '_id', '_rev'], key => {
      if (key in attributes) {
        this[key] = attributes[key];
      }
    });
  }

  get id(): string {
    return this._id;
  }

  persisted(): boolean {
    return typeof this.id !== 'undefined';
  }

  valid(): boolean {
    return this.content.length !== 0;
  }

  toJSON(): Object {
    return this;
  }

}
