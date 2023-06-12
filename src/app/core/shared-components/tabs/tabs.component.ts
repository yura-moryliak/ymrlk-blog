import {
  Component, inject, Input,
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

  @ViewChild('tabsViewContainer', { static: true, read: ViewContainerRef })
  tabsViewContainer!: ViewContainerRef;

  private router: Router = inject(Router);

  ngOnInit(): void {
    this.initActiveTab();
  }

  private initActiveTab(): void {
    const splitUrlList: string[] = this.router.url.split('/');
    const lastUrlSegment: string = splitUrlList[splitUrlList.length - 1];

    const foundTab: TabInterface | undefined = this.tabsList.find(
      (tab: TabInterface): boolean => tab.routerLink === lastUrlSegment
    );

    foundTab ?
      this.setActive(foundTab) :
      this.setActive(this.tabsList[0]);
  }

  setActive(tab: TabInterface): void {
    tab.isActive = true;
    this.tabsViewContainer.clear();
    this.tabsViewContainer.createComponent(tab.component);
  }
}
