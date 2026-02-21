import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-3">
      <div class="flex justify-between items-center" *ngIf="label">
        <label [for]="inputId" class="text-sm font-semibold text-foreground/80 cursor-pointer">
          {{ label }}
        </label>
        <span *ngIf="rightLabel" class="text-sm font-bold text-primary">
          {{ rightLabel }}
        </span>
      </div>
      
      <div class="relative">
        <input 
          [id]="inputId"
          [name]="name"
          [type]="type"
          [min]="min"
          [max]="max"
          [step]="step"
          [placeholder]="placeholder"
          [disabled]="isDisabled"
          [(ngModel)]="value"
          (ngModelChange)="onModelChange($event)"
          (blur)="onBlur()"
          class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 transition-shadow"
          [ngClass]="{
            'pl-10': iconLeft,
            'opacity-50 cursor-not-allowed': isDisabled
          }"
        />
        <span *ngIf="iconLeft" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
          {{ iconLeft }}
        </span>
      </div>

      <!-- Helper text o error -->
      <p *ngIf="helperText" class="text-xs text-foreground/60">{{ helperText }}</p>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() inputId: string = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() rightLabel: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() min?: number | string;
  @Input() max?: number | string;
  @Input() step?: number | string;
  @Input() helperText: string = '';
  @Input() iconLeft: string = '';

  // ControlValueAccessor requirements
  value: any = '';
  isDisabled = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  onModelChange(val: any): void {
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouch();
  }

  writeValue(obj: any): void {
    if (obj !== undefined) {
      this.value = obj;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
