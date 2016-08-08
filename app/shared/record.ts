export class Record {

  constructor(private _id?: string, private _rev?: string) {
  }

  get id(): string {
    return this._id;
  }

  persisted(): boolean {
    return typeof this.id !== 'undefined';
  }

  toJSON(): Object {
    return this;
  }

}
