import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-between items-center w-full">
      <label [for]="forId" class="text-sm font-semibold text-foreground/80 cursor-pointer">
        <ng-content></ng-content>
      </label>
      <span *ngIf="rightText" class="text-sm font-bold text-primary">
        {{ rightText }}
      </span>
    </div>
  `
})
export class LabelComponent {
  /**
   * El ID del input con el que se asociará (Accesibilidad).
   */
  @Input() forId: string = '';

  /**
   * Texto opcional a la derecha (Ej: "50,000 COP").
   */
  @Input() rightText: string = '';
}
