import { Component, ViewChildren, QueryList } from '@angular/core';
import { TabPanel, TabView } from 'primeng/primeng';

import { NoteListComponent } from './notes/note-list/note-list.component';
import { NoteService } from './notes/shared/note.service';

// TODO Shouldn't have all the NoteLists' Notes in memory all at once.

// TODO Use relative URLs for templateUrl and styleUrls, for this and other components.
// To do this, need to use "moduleId: module.id" in decorator; but couldn't get this to
// work last time I tried.
@Component({
  selector: 'pn-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  directives: [NoteListComponent, TabPanel, TabView],
  providers: [NoteService]
})
export class AppComponent {

  @ViewChildren(NoteListComponent)
  private noteLists: QueryList<NoteListComponent>;

  title = 'Ponotes';

  private onTabChange(event: any): void {
    this.noteLists.toArray()[event.index].refreshNotes();
  }
}
