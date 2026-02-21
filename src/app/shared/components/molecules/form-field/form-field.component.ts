import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from '../../atoms/label/label.component';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, LabelComponent],
  template: `
    <div class="space-y-3">
      <!-- ÁTOMO 1: Etiqueta (Label) -->
      <app-label *ngIf="label" [forId]="forId" [rightText]="rightLabel">
        {{ label }}
      </app-label>
      
      <!-- SLOT MÁGICO para inyectar el ÁTOMO 2: (Input) -->
      <div class="relative">
        <ng-content></ng-content>
      </div>

      <!-- Helper text o error -->
      <p *ngIf="helperText" class="text-xs text-foreground/60">{{ helperText }}</p>
    </div>
  `
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() rightLabel: string = '';
  @Input() forId: string = '';
  @Input() helperText: string = '';
}
