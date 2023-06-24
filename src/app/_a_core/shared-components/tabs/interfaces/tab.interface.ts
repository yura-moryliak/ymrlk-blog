import {EventEmitter, Type} from '@angular/core';

export interface TabInterface {
  title: string;
  component: any;
  componentType?: Type<unknown>
  data?: any;
  id: string;
  routerLink?: string;
  isActive?: boolean;
  onLeave?: EventEmitter<void>;
}
