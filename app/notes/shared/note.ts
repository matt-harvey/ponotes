export class Note {

  public sortOrder: number;

  constructor(
    public content: string = '',
    private _id: string = undefined,
    private _rev: string = undefined
  ) {
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

  static fromPOJO(object: Object): Note {
    let note = new Note(object['content'], object['_id'], object['_rev']);
    if (typeof object['sortOrder'] !== 'undefined') {
      note.sortOrder = object['sortOrder'];
    }
    return note;
  }
}
