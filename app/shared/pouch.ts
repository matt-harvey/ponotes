export interface PouchDB {
  new(name: string, options: Object): PouchDB;
  createIndex(options: Object): any;
  find(options: Object): any;
  post(record: Object): any;
  put(record: Object):  any;
  remove(record: Object): any;
  plugin(extension: string): any;
}

export let PouchDB: PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
