import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      class="w-full py-4 rounded-xl font-bold text-primary-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shadow-lg hover:opacity-90 active:scale-[0.98]"
      [ngClass]="[
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        customBgClass
      ]"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  /**
   * Permite deshabilitar el botón
   */
  @Input() disabled = false;

  /**
   * Por defecto usamos el Dynamic Theming de Tailwind con la variable que inyectamos en CSS: bg-primary
   * que traduce internamente a bg-[hsl(var(--primary))].
   * También soportamos que el desarrollador pase `bg-[var(--su-propio-color)]` si lo desea.
   */
  @Input() customBgClass = 'bg-[hsl(var(--primary))]';

  /**
   * Evento emitido al hacer clic
   */
  @Output() onClick = new EventEmitter<MouseEvent>();
}
