import {Component, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {count} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  counter: WritableSignal<number> = signal(0);

  count() {
    this.counter.set(this.counter() + 1);
  }
}
