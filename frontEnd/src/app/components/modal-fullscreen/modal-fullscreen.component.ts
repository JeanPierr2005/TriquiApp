import { Component, input } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  animateChild,
  query,
} from '@angular/animations';

@Component({
  selector: 'app-modal-fullscreen',
  standalone: true,
  imports: [],
  templateUrl: './modal-fullscreen.component.html',
  styleUrl: './modal-fullscreen.component.scss',
  animations: [
    trigger('animateChildren', [
      transition('* => void', [query('@*', [animateChild()])]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ translate: '400px' }),
        animate('0.5s ease-in-out', style({ translate: 0 })),
      ]),
      transition(':leave', [
        style({ translate: 0 }),
        animate('0.5s ease-out', style({ translate: '-400px' })),
      ]),
    ]),
    trigger('inOutAnimation2', [
      transition(':enter', [
        style({ translate: '400px' }),
        animate('0.5s 0.1s ease-in-out', style({ translate: 0 })),
      ]),
      transition(':leave', [
        style({ translate: 0 }),
        animate('0.5s 0.1s ease-out', style({ translate: '-400px' })),
      ]),
    ]),
  ],
})
export class ModalFullscreenComponent {
  show = input.required<boolean>();
}
