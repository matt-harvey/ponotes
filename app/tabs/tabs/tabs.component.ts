import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { TabPanel, InputText, TabView } from 'primeng/primeng';

import { Button } from 'primeng/primeng';

import { Note } from '../../notes/shared/note';
import { NoteListComponent } from '../../notes/note-list/note-list.component';
import { NoteService } from '../../notes/shared/note.service';
import { Tab } from '../../tabs/shared/tab';
import { TabService } from '../../tabs/shared/tab.service';

// TODO Shouldn't have all the NoteLists' Notes in memory all at once.

@Component({
  selector: 'pn-tabs',
  templateUrl: 'app/tabs/tabs/tabs.component.html',
  styleUrls: ['app/tabs/tabs/tabs.component.css'],
  directives: [Button, InputText, NoteListComponent, TabPanel, TabView],
  providers: [NoteService, TabService]
})
export class TabsComponent implements OnInit {
  private tabs: Tab[] = [];
  private newTab: Tab;
  private trash: Tab;

  constructor(private tabService: TabService, private noteService: NoteService) {
    this.newTab = new Tab();
    this.trash = new Tab();
  }

  ngOnInit(): void {
    this.getTabs();
  }

  @ViewChildren(NoteListComponent)
  private noteLists: QueryList<NoteListComponent>;

  private onCreate(): void {
    const oldTab = this.newTab;
    this.newTab = new Tab();
    this.tabService.addRecord(oldTab).then((result: any) => {
      return this.getTabs();
    }).catch((error: string) => {
      this.newTab = oldTab;
      console.log(error);
    });
  }

  private onTabChange(event: any): void {
    this.refreshNotes(event.index);
  }

  private onTabDeleteConfirmation(tab: Tab): void {
    this.tabService.deleteRecord(tab)
      // Delete trashed notes originating in given tab. (Note, the deletion of non-trashed
      // notes belonging to this tab is not the responsibility of this method.)
      .then((result: any) => this.noteService.getRecords(false, tab.id))
      .then((notes: Note[]) => this.noteService.bulkDelete(notes))
      // refresh tabs
      .then((result: any) => this.getTabs())
      // refresh trash
      .then((result: any) => this.refreshTrash())
      .catch((error: string) => { console.log(error); });
  }

  private getTabs(): any {
    return this.tabService.getRecords().then((tabs: Tab[]) => {
      this.tabs = tabs;
    });
  }

  private refreshNotes(tabIndex: number): any {
    return this.noteLists.toArray()[tabIndex].refreshNotes();
  }

  private refreshTrash(): any {
    return this.noteLists.last.refreshNotes();
  }
}
