let PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

export const Pouch = PouchDB;
