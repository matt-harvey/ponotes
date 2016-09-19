import { Injectable } from '@angular/core';

interface Stringable {
  toString(): string;
}

@Injectable()
export class LoggerService {

  logError(error: Stringable): void {
    if (typeof console !== 'undefined') {
      if (typeof console.error === 'function') {
        console.error(error);
      } else if (typeof console.log === 'function') {
        console.log(`ERROR: ${error}`);
      }
    }
    alert(`ERROR:\n\n${error}`);
  }

}
