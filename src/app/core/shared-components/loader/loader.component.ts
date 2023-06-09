import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Observable} from 'rxjs';

import {LoaderService} from './services/loader.service';

@Component({
  selector: 'ym-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule],
})
export class LoaderComponent implements OnInit {

  isLoading$!: Observable<boolean>;

  private loaderService: LoaderService = inject(LoaderService);

  ngOnInit(): void {
    this.isLoading$ = this.loaderService.isLoading$;
  }

}
