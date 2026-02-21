import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ConfigurationService } from '../../core/services/configuration.service';
import { AppConfiguration } from '../../core/models/configuration.model';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Settings Toggle Button -->
    <button 
      (click)="togglePanel()"
      class="fixed right-0 top-1/4 -translate-y-1/2 bg-card border border-border border-r-0 rounded-l-2xl p-4 shadow-2xl hover:bg-card/80 transition-all z-50 group flex flex-col items-center gap-2">
      <svg class="w-6 h-6 text-foreground group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span class="text-xs font-semibold text-foreground writing-vertical-lr tracking-wider">CONFIG</span>
    </button>

    <!-- Side Panel Overlay -->
    <div 
      *ngIf="isOpen" 
      (click)="closePanel()"
      class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-300">
    </div>

    <!-- Configuration Drawer -->
    <aside 
      class="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-500 ease-in-out overflow-y-auto"
      [class.translate-x-0]="isOpen"
      [class.translate-x-full]="!isOpen">
      
      <div class="flex flex-col h-full bg-card">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card/95 backdrop-blur z-10">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
               <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            <h2 class="text-xl font-bold text-foreground tracking-tight">App Configuration</h2>
          </div>
          <button (click)="closePanel()" class="p-2 rounded-full hover:bg-border/50 text-foreground/60 hover:text-foreground transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="flex-1 p-6 space-y-8" *ngIf="config">
          
          <!-- Visual Settings -->
          <section class="space-y-4">
            <h3 class="text-sm font-black uppercase text-primary tracking-widest border-b border-border/50 pb-2">Visuales</h3>
            
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Color Primario (Hex)</label>
              <div class="flex items-center gap-3">
                <input 
                  type="color" 
                  [(ngModel)]="config.visual.primaryColorHex"
                  (ngModelChange)="onConfigChange()"
                  class="h-12 w-12 rounded-lg cursor-pointer border-0 bg-transparent p-0">
                <input 
                  type="text" 
                  [(ngModel)]="config.visual.primaryColorHex"
                  (ngModelChange)="onConfigChange()"
                  class="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Logo URL</label>
              <input 
                type="text" 
                [(ngModel)]="config.visual.logoUrl"
                (ngModelChange)="onConfigChange()"
                placeholder="https://..."
                class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Radio de Bordes (Botones)</label>
              <select 
                [(ngModel)]="config.visual.buttonBorderRadius"
                (ngModelChange)="onConfigChange()"
                class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <option value="0px">Sharp (0px)</option>
                <option value="0.375rem">Slight (6px)</option>
                <option value="0.5rem">Medium (8px)</option>
                <option value="1rem">Large (16px)</option>
                <option value="9999px">Full Pill</option>
              </select>
            </div>
          </section>

          <!-- Financial Settings -->
          <section class="space-y-4">
            <h3 class="text-sm font-black uppercase text-primary tracking-widest border-b border-border/50 pb-2">Financieras</h3>
            
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Tasa de Interés Mensual (%)</label>
              <input 
                type="number" 
                [(ngModel)]="config.financial.monthlyInterestRate"
                (ngModelChange)="onConfigChange()"
                step="0.1"
                class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Fondo de Garantía (%)</label>
              <input 
                type="number" 
                [(ngModel)]="config.financial.guaranteeFundPercentage"
                (ngModelChange)="onConfigChange()"
                step="1"
                class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Valor Firma Digital ($)</label>
              <input 
                type="number" 
                [(ngModel)]="config.financial.digitalSignatureValue"
                (ngModelChange)="onConfigChange()"
                class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            </div>
          </section>

          <!-- Validation Settings -->
          <section class="space-y-4 pb-12">
            <h3 class="text-sm font-black uppercase text-primary tracking-widest border-b border-border/50 pb-2">Reglas de Validación</h3>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Monto Mínimo</label>
                <input 
                  type="number" 
                  [(ngModel)]="config.validation.minAmount"
                  (ngModelChange)="onConfigChange()"
                  class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-foreground">Monto Máximo</label>
                <input 
                  type="number" 
                  [(ngModel)]="config.validation.maxAmount"
                  (ngModelChange)="onConfigChange()"
                  class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Plazo Máximo (Meses)</label>
              <input 
                type="number" 
                [(ngModel)]="config.validation.maxTermMonths"
                (ngModelChange)="onConfigChange()"
                class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            </div>
          </section>

        </div>
      </div>
    </aside>
  `,
  styles: [`
    .writing-vertical-lr {
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
  `]
})
export class SettingsPanelComponent implements OnInit, OnDestroy {
  public isOpen = false;
  public config!: AppConfiguration;
  private destroy$ = new Subject<void>();

  constructor(private configService: ConfigurationService) {}

  ngOnInit(): void {
    // Deep copy to prevent direct mutation of the subject state before explicitly dispatching
    this.configService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe((latestConfig) => {
        // Only update local copy if panel is closed, else we overwrite user input
        if (!this.isOpen) {
          this.config = JSON.parse(JSON.stringify(latestConfig));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Sync fresh data when opening
      this.config = JSON.parse(JSON.stringify(this.configService.getConfigSnapshot()));
    }
  }

  closePanel(): void {
    this.isOpen = false;
  }

  onConfigChange(): void {
    // Dispatch the current local state to the core RxJS store
    this.configService.updateConfiguration(this.config);
  }
}
