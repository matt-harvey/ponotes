import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsComponent } from './tabs';

export const routes: Routes = [
  { path: '', component: TabsComponent, pathMatch: 'full' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
