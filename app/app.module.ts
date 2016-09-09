import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { Button, Dialog, TabPanel, InputText, TabView } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { ExpandingTextareaComponent } from
  './shared/expanding-textarea/expanding-textarea.component';
import { NoteFormComponent } from './notes/note/note.component';
import { NoteListComponent } from './notes/note-list/note-list.component';
import { NoteService } from './notes/shared/note.service';
import { TabsComponent } from './tabs/tabs/tabs.component';
import { TabService } from './tabs/shared/tab.service';

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
    NoteFormComponent,
    NoteListComponent,
    TabPanel,
    TabView,
    TabsComponent,
  ],
  providers: [
    NoteService,
    TabService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
