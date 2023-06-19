import {Component, QueryList, ViewChildren} from '@angular/core';

import {LoaderComponent} from './loader.component';
import {LoaderPriorityEnum} from './enums/loader-priority.enum';

@Component({
  template: ``
})
export abstract class LoaderInitializerComponent {

  @ViewChildren(LoaderComponent, { read: LoaderComponent })
  loadersQueryList!: QueryList<LoaderComponent>;

  isLoading = false;

  showLoader(): void {
    this.show();
  }

  hideLoader(): void {
    this.hide();
  }

  showSecondaryLoader(): void {
    this.show(LoaderPriorityEnum.Secondary);
  }

  hideSecondaryLoader(): void {
    this.hide(LoaderPriorityEnum.Secondary);
  }

  private show(priority: LoaderPriorityEnum = LoaderPriorityEnum.Primary): void {
    setTimeout(() => {
      this.loadersQueryList.forEach((loader: LoaderComponent): void => {
        loader.show(priority)
      });
    });

    this.setIsLoading();
  }

  private hide(priority: LoaderPriorityEnum = LoaderPriorityEnum.Primary): void {

    setTimeout((): void => {
      this.loadersQueryList.forEach((loader: LoaderComponent): void => loader.hide(priority));

      this.setIsLoading();
    });
  }

  private setIsLoading(): void {
    this.isLoading = this.loadersQueryList.some((loader: LoaderComponent) => loader.showLoader);
  }

}
