import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { TabPanel } from 'primeng/primeng';
import * as _ from 'lodash';

import { LoggerService } from '../shared';
import { Note, NoteListComponent, NoteService } from '../notes';
import { Tab, TabService } from './';

@Component({
  selector: 'pn-tabs',
  template: require('./tabs.component.html'),
  styles: [require('./tabs.component.css')]
})
export class TabsComponent implements OnInit {
  private tabs: Tab[] = [];
  private newTab: Tab;
  private selectedTabIndex = 0;
  private trash: Tab;

  constructor(
    private loggerService: LoggerService,
    private tabService: TabService,
    private noteService: NoteService
  ) {
    this.newTab = new Tab();
    this.trash = new Tab();
  }

  ngOnInit(): void {
    this.getTabs();
  }

  @ViewChildren(NoteListComponent) private noteLists: QueryList<NoteListComponent>;

  @ViewChild('trashPanel') private trashPanel: TabPanel;

  private onCreate(): void {
    let oldTab = this.newTab;

    // Capitalize first letter of tab name on saving.
    const oldName = oldTab.name;
    oldTab.name = oldName.charAt(0).toUpperCase() + oldName.slice(1);

    this.newTab = new Tab();
    this.tabService.addRecord(oldTab).then((result: any) => {
      const addedTabId = result.id;
      return this.getTabs().then((tabs: Tab[]) => {
        // For some reason this is necessary to tell PrimeNG TabView not to keep Trash tab
        // selected, in case it is selected when tab is added.
        this.trashPanel.selected = false;
        this.selectedTabIndex = _.findIndex(tabs, (tab: Tab) => tab.id === addedTabId);
      });
    }).catch((error: string) => {
      this.newTab = oldTab;
      this.loggerService.logError(error);
    });
  }

  private onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
    this.refreshNotes(this.selectedTabIndex);
  }

  private onTabDeleteConfirmation(tab: Tab): void {
    this.tabService.deleteRecord(tab)
      // Delete trashed notes originating in given tab. (Note, the deletion of non-trashed
      // notes belonging to this tab is not the responsibility of this method.)
      .then((result: any) => this.noteService.getRecords(false, tab.id))
      .then((notes: Note[]) => this.noteService.bulkDelete(notes))
      // refresh tabs
      .then((result: any) => {
        const upperIndex = Math.max(0, this.tabs.length - 2);
        this.selectedTabIndex = Math.min(this.selectedTabIndex, upperIndex);
        return this.getTabs();
      })
      // refresh trash
      .then((tabs: Tab[]) => this.refreshTrash())
      .catch(this.loggerService.logError);
  }

  private getTabs(): any {
    return this.tabService.getRecords().then((tabs: Tab[]) => {
      return this.tabs = tabs;
    }).catch(this.loggerService.logError);
  }

  private refreshNotes(tabIndex: number): any {
    return this.noteLists.toArray()[tabIndex].refreshNotes();
  }

  private refreshTrash(): any {
    return this.noteLists.last.refreshNotes();
  }
}
