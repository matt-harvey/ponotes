import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { TabPanel, TabView } from 'primeng/primeng';

import { NoteListComponent } from '../../notes/note-list/note-list.component';
import { NoteService } from '../../notes/shared/note.service';
import { Tab } from '../../tabs/shared/tab';
import { TabService } from '../../tabs/shared/tab.service';

// TODO Shouldn't have all the NoteLists' Notes in memory all at once.

@Component({
  selector: 'pn-tabs',
  templateUrl: 'app/tabs/tabs/tabs.component.html',
  styleUrls: ['app/tabs/tabs/tabs.component.css'],
  directives: [NoteListComponent, TabPanel, TabView],
  providers: [NoteService, TabService]
})
export class TabsComponent implements OnInit {
  private tabs: Tab[] = [];

  constructor(private tabService: TabService) {
  }

  ngOnInit(): void {
    this.getTabs();
  }

  @ViewChildren(NoteListComponent)
  private noteLists: QueryList<NoteListComponent>;

  private newTab(): Tab {
    return new Tab();
  }

  private onTabChange(event: any): void {
    this.noteLists.toArray()[event.index].refreshNotes();
  }

  private getTabs(): void {
    this.tabService.getRecords().then((tabs: Tab[]) => {
      this.tabs = tabs;
    });
  }
}
