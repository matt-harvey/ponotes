export class Note {

  constructor(public content: string = '', public id: number = 0) { }

  persisted(): boolean {
    return typeof this.id === 'number' && this.id > 0;
  }

  valid(): boolean {
    return this.content.length !== 0;
  }
}
