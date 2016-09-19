import 'es6-shim';
import 'es6-promise';
import 'zone.js/dist/zone';
import 'reflect-metadata';
import '@angular/compiler';
import '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import 'rxjs';

// TODO Why did brunch skeleton project have quotes around 'BRUNCH_ENVIRONMENT'?
// Looks like an error.
if ('production' === 'BRUNCH_ENVIRONMENT') {
  enableProdMode();
}
