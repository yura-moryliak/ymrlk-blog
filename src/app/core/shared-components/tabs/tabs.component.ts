import {
  Component, ComponentRef, inject, Input,
  OnInit, ViewChild, ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

import {TabInterface} from './interfaces/tab.interface';

@Component({
  selector: 'ym-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class TabsComponent implements OnInit {

  @Input() tabsList: TabInterface[] = [];
  @Input() isRouterLess = false;

  @ViewChild('tabsViewContainer', { static: true, read: ViewContainerRef })
  tabsViewContainer!: ViewContainerRef;

  private router: Router = inject(Router);
  private componentRef!: ComponentRef<any>;

  ngOnInit(): void {
    this.initActiveTab();
  }

  setActive(selectedTab: TabInterface): void {
    this.tabsList.forEach((tabItem: TabInterface) => tabItem.isActive = false);
    selectedTab.isActive = true;

    this.tabsViewContainer.clear();
    this.componentRef = this.tabsViewContainer.createComponent(selectedTab.component);

    if (selectedTab.data) {
      (this.componentRef.instance as any).data = selectedTab.data;
    }
  }

  private initActiveTab(): void {

    if (this.isRouterLess) {
      this.setActive(this.tabsList[0]);
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
}
