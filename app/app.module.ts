import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { routing } from './app.routes';

import { Button, Dialog, TabPanel, InputText, MessagesModule, TabView } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ExpandingTextareaComponent, LoggerService } from './shared';
import { NoteComponent, NoteListComponent, NoteService } from './notes';
import { TabsComponent, TabService } from './tabs';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    MessagesModule,
  ],
  declarations: [
    AppComponent,
    Button,
    Dialog,
    ExpandingTextareaComponent,
    InputText,
    NoteComponent,
    NoteListComponent,
    TabPanel,
    TabView,
    TabsComponent
  ],
  providers: [
    LoggerService,
    NoteService,
    TabService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
