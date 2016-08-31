export class Record {

  constructor(private _id?: string, private _rev?: string, private _deleted?: boolean) {
  }

  get id(): string {
    return this._id;
  }

  get rev(): string {
    return this._rev;
  }

  persisted(): boolean {
    return typeof this.id !== 'undefined';
  }

  toJSON(): Object {
    return this;
  }

}
