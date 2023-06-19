import {ChangeDetectorRef, Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'ym-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
})
export class AvatarComponent {

  @Input() set source(src: string) {
    src !== '' ? this.src = src : this.src = 'assets/images/user-avatar.png';
  }
  @Input() alt = '';
  @Input() width = 100;
  @Input() height = 100;
  @Input() isRounded = true;
  @Input() fitToMinScale = false;

  src!: string;

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
}
