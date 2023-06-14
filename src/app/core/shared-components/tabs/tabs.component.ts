import {
  Component, ComponentRef, inject, Input, OnDestroy,
  OnInit, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

import {Subscription} from 'rxjs';

import {TabInterface} from './interfaces/tab.interface';

@Component({
  selector: 'ym-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class TabsComponent implements OnInit, OnDestroy {

  @Input() tabsList: TabInterface[] = [];
  @Input() isRouterLess = false;

  @ViewChild('tabsViewContainer', { static: true, read: ViewContainerRef })
  tabsViewContainer!: ViewContainerRef;

  isTabsAsSelectVisible = false;
  isTabsSelectOpened = false;
  activeTab!: TabInterface;

  private router: Router = inject(Router);
  private componentRef!: ComponentRef<any>;

  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.observeResize();
    this.initActiveTab();
  }

  setActive(selectedTab: TabInterface): void {

    if (selectedTab.id === this.activeTab?.id) {
      return;
    }

    this.tabsList.forEach((tabItem: TabInterface) => tabItem.isActive = false);
    selectedTab.isActive = true;
    this.activeTab = selectedTab;

    this.tabsViewContainer.clear();
    this.componentRef = this.tabsViewContainer.createComponent(selectedTab.component);

    if (selectedTab.data) {
      (this.componentRef.instance as any).data = selectedTab.data;
    }
  }

  toggleTabsSelect(): void {
    this.isTabsSelectOpened = !this.isTabsSelectOpened;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initActiveTab(): void {

    const isActiveTab: TabInterface | undefined = this.tabsList.find((tab: TabInterface) => tab.isActive);

    if (this.isRouterLess && isActiveTab) {
      this.setActive(isActiveTab ? isActiveTab : this.tabsList[0]);
      return;
    }

    const splitUrlList: string[] = this.router.url.split('/');
    const lastUrlSegment: string = splitUrlList[splitUrlList.length - 1];

    const foundTab: TabInterface | undefined = this.tabsList.find(
      (tab: TabInterface): boolean => tab.routerLink === lastUrlSegment
    );

    foundTab ?
      this.setActive(foundTab) :
      this.setActive(this.tabsList[0]);
  }

  private observeResize(): void {
    const breakpointsSubscription: Subscription = this.breakpointObserver.observe([Breakpoints.Handset]).subscribe({
      next: (state: BreakpointState) => this.isTabsAsSelectVisible = state.matches
    });

    this.subscriptions.add(breakpointsSubscription);
  }
}
