import 'es6-shim';
import 'es6-promise';
import 'zone.js/dist/zone';
import 'reflect-metadata';
import '@angular/compiler';
import '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import 'rxjs';

// 'BRUNCH_ENVIRONMENT' is a special token replaced by environment-brunch plugin during the
// build, with the current Brunch environment.
if ('production' === 'BRUNCH_ENVIRONMENT') {
  enableProdMode();
}
