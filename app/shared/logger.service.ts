import { Injectable } from '@angular/core';

interface Stringable {
  toString(): string;
}

@Injectable()
export class LoggerService {

  // TODO IMPORTANT Make this do different things depending on what environment we're in.
  logError(error: Stringable): void {
    alert(`Something went wrong!\n\n${error}`);
  }
}
