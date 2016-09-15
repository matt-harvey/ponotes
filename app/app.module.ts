import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { Button, Dialog, TabPanel, InputText, TabView } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { LoggerService } from './shared/logger.service';
import { ExpandingTextareaComponent } from './shared/expanding-textarea.component';
import { NoteComponent } from './notes/note.component';
import { NoteListComponent } from './notes/note-list.component';
import { NoteService } from './notes/note.service';
import { TabsComponent } from './tabs/tabs.component';
import { TabService } from './tabs/tab.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
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
    TabsComponent,
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
