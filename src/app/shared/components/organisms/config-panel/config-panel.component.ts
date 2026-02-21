import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ConfigurationService } from '../../../../core/services/configuration.service';
import { AppConfiguration } from '../../../../core/models/configuration.model';

@Component({
  selector: 'app-config-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-card border-r border-border/60 overflow-y-auto">

      <!-- ── Panel Header ── -->
      <div class="px-6 py-5 border-b border-border/60 bg-card/95 backdrop-blur sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-primary">Panel de Control</p>
            <h2 class="text-base font-bold text-foreground leading-tight">App Configuration</h2>
          </div>
        </div>
      </div>

      <!-- ── Form ── -->
      <div class="flex-1 p-6 space-y-8" *ngIf="config">

        <!-- Visuales -->
        <section class="space-y-5">
          <h3 class="text-xs font-black uppercase tracking-widest text-primary border-b border-border/40 pb-2">
            Visuales
          </h3>

          <!-- Color primario -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Color Primario</label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                [(ngModel)]="config.visual.primaryColorHex"
                (ngModelChange)="onConfigChange()"
                class="h-11 w-11 rounded-xl cursor-pointer border-0 bg-transparent p-0 shrink-0"
              />
              <input
                type="text"
                [(ngModel)]="config.visual.primaryColorHex"
                (ngModelChange)="onConfigChange()"
                placeholder="#3b82f6"
                class="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 transition-shadow"
              />
            </div>
          </div>

          <!-- Logo URL -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Logo URL</label>
            <!-- Previsualización en vivo -->
            <div *ngIf="config.visual.logoUrl" class="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/40">
              <img
                [src]="config.visual.logoUrl"
                alt="Vista previa logo"
                class="h-8 w-8 object-contain rounded-lg"
                (error)="onLogoError($event)"
              />
              <span class="text-xs text-foreground/50 truncate">{{ config.visual.logoUrl }}</span>
            </div>
            <input
              type="text"
              [(ngModel)]="config.visual.logoUrl"
              (ngModelChange)="onConfigChange()"
              placeholder="https://... (URL directa a .png/.svg)"
              class="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 transition-shadow"
            />
          </div>

          <!-- Bordes de botones -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Radio de Bordes (Botones)</label>
            <select
              [(ngModel)]="config.visual.buttonBorderRadius"
              (ngModelChange)="onConfigChange()"
              class="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2"
            >
              <option value="0px">Sharp — 0px</option>
              <option value="0.375rem">Slight — 6px</option>
              <option value="0.75rem">Medium — 12px</option>
              <option value="1.5rem">Large — 24px</option>
              <option value="9999px">Full Pill</option>
            </select>
          </div>
        </section>

        <!-- Financieras -->
        <section class="space-y-5">
          <h3 class="text-xs font-black uppercase tracking-widest text-primary border-b border-border/40 pb-2">
            Parámetros Financieros
          </h3>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Tasa Interés Mensual (%)</label>
            <input
              type="number"
              [(ngModel)]="config.financial.monthlyInterestRate"
              (ngModelChange)="onConfigChange()"
              step="0.1"
              min="0"
              class="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Fondo de Garantía (%)</label>
            <input
              type="number"
              [(ngModel)]="config.financial.guaranteeFundPercentage"
              (ngModelChange)="onConfigChange()"
              step="1"
              min="0"
              class="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Valor Firma Digital ($)</label>
            <input
              type="number"
              [(ngModel)]="config.financial.digitalSignatureValue"
              (ngModelChange)="onConfigChange()"
              class="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2"
            />
          </div>
        </section>

        <!-- Validaciones -->
        <section class="space-y-5 pb-10">
          <h3 class="text-xs font-black uppercase tracking-widest text-primary border-b border-border/40 pb-2">
            Reglas de Validación
          </h3>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Monto Mín.</label>
              <input
                type="number"
                [(ngModel)]="config.validation.minAmount"
                (ngModelChange)="onConfigChange()"
                class="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Monto Máx.</label>
              <input
                type="number"
                [(ngModel)]="config.validation.maxAmount"
                (ngModelChange)="onConfigChange()"
                class="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Plazo Máximo (Meses)</label>
            <input
              type="number"
              [(ngModel)]="config.validation.maxTermMonths"
              (ngModelChange)="onConfigChange()"
              class="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2"
            />
          </div>
        </section>

      </div>
    </div>
  `,
})
export class ConfigPanelComponent implements OnInit, OnDestroy {
  config!: AppConfiguration;
  private destroy$ = new Subject<void>();

  constructor(private configService: ConfigurationService) {}

  ngOnInit(): void {
    this.configService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cfg) => {
        this.config = JSON.parse(JSON.stringify(cfg));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onConfigChange(): void {
    this.configService.updateConfiguration(this.config);
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23888" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpath d="M21 15l-5-5L5 21"/%3E%3C/svg%3E';
  }
}
