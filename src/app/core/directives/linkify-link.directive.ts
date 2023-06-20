import {AfterViewInit, Directive, ElementRef, inject, Input} from '@angular/core';

@Directive({
  selector: '[ymLinkifyLink]',
  standalone: true
})
export class LinkifyLinkDirective implements AfterViewInit {

  @Input({ required: true }) className!: string;

  private elRef: ElementRef<HTMLElement> = inject(ElementRef);

  ngAfterViewInit(): void {
    const anchorsList: Array<HTMLAnchorElement> = Array.from(this.elRef.nativeElement.querySelectorAll('a'));
    anchorsList.forEach((anchor: HTMLAnchorElement) => anchor.className = this.className);
  }

}
