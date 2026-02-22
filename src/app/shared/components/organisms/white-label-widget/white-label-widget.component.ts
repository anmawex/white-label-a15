import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest, Subject, takeUntil } from 'rxjs';

import { ConfigurationService } from '../../../../core/services/configuration.service';
import { CreditEngineService } from '../../../../core/services/credit-engine.service';
import { CurrencyFormatPipe } from '../../../pipes/currency-format.pipe';
import { AppConfiguration } from '../../../../core/models/configuration.model';
import { CreditBreakdown, CreditInput } from '../../../../core/models/credit.model';
import { InputComponent } from '../../atoms/input/input.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';

@Component({
  selector: 'app-white-label-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe, InputComponent, FormFieldComponent],
  template: `
    <div
      class="w-full rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500"
      [style.--widget-primary]="widgetPrimary"
      [style.--widget-radius]="widgetRadius"
    >
      <!-- ══ HEADER ══ -->
      <div
        class="px-8 py-6 flex items-center gap-4"
        [style.background]="'hsl(var(--widget-primary))'">
        <img
          *ngIf="config?.visual?.logoUrl"
          [src]="config!.visual.logoUrl"
          alt="Logo entidad"
          width="40"
          height="40"
          class="h-10 w-10 object-contain rounded-lg bg-white/20 p-1"
        />
        <div>
          <p class="text-white/70 text-xs font-semibold uppercase tracking-widest">Simulador de Crédito</p>
          <h2 class="text-white text-xl font-black leading-tight">Tu cuota estimada</h2>
        </div>
      </div>

      <!-- ══ BODY ══ -->
      <div class="bg-card p-8 space-y-8">

        <!-- Cuota mensual destacada -->
        <div class="text-center" *ngIf="breakdown">
          <p class="text-foreground/50 text-sm font-semibold mb-1">Pagarías mensualmente</p>
          <div
            class="text-5xl font-black tracking-tighter transition-all duration-300"
            [style.color]="'hsl(var(--widget-primary))'">
            {{ breakdown.monthlyPayment | currencyFormat }}
          </div>
          <p class="text-foreground/40 text-xs mt-2">Sistema de amortización Francés</p>
        </div>

        <!-- ── Digitación de Monto ── -->
        <div class="space-y-3" *ngIf="localInput && config">
          <app-form-field label="¿Cuánto necesitas?" [rightLabel]="(localInput.requestedAmount | currencyFormat) || ''" forId="widgetAmount">
            <app-input
              inputId="widgetAmount"
              name="widgetAmountInput"
              type="number"
              [min]="config.validation.minAmount"
              [max]="config.validation.maxAmount"
              step="50000"
              [(ngModel)]="localInput.requestedAmount"
              (ngModelChange)="onSliderChange()">
            </app-input>
          </app-form-field>
          <!-- Alerta -->
          <div *ngIf="localInput.requestedAmount < config.validation.minAmount || localInput.requestedAmount > config.validation.maxAmount" class="text-xs font-bold text-red-500 mt-2">
            Rango permitido: {{ config.validation.minAmount | currencyFormat }} - {{ config.validation.maxAmount | currencyFormat }}
          </div>
        </div>

        <!-- ── Digitación de Plazo ── -->
        <div class="space-y-3" *ngIf="localInput && config">
          <app-form-field label="¿En cuántos meses?" [rightLabel]="localInput.termMonths + ' meses'" forId="widgetTerm">
             <app-input
              inputId="widgetTerm"
              name="widgetTermInput"
              type="number"
              min="1"
              [max]="config.validation.maxTermMonths"
              step="1"
              [(ngModel)]="localInput.termMonths"
              (ngModelChange)="onSliderChange()">
            </app-input>
          </app-form-field>
          <!-- Alerta -->
          <div *ngIf="localInput.termMonths > config.validation.maxTermMonths || localInput.termMonths < 1" class="text-xs font-bold text-red-500 mt-2">
            Plazo máximo permitido: {{ config.validation.maxTermMonths }} meses
          </div>
        </div>

        <!-- ── Desglose mini ── -->
        <div class="rounded-2xl border border-border/50 p-5 space-y-3 bg-muted/30" *ngIf="breakdown">
          <div class="flex justify-between text-sm">
            <span class="text-foreground/60">Capital</span>
            <span class="font-semibold text-foreground">{{ breakdown.netCapital | currencyFormat }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-foreground/60">Intereses totales</span>
            <span class="font-semibold text-foreground">{{ breakdown.totalInterest | currencyFormat }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-foreground/60">Costo del aval</span>
            <span class="font-semibold text-foreground">{{ breakdown.guaranteeCost | currencyFormat }}</span>
          </div>
          <div class="h-px bg-border/50"></div>
          <div class="flex justify-between text-sm font-bold">
            <span class="text-foreground">Costo Total</span>
            <span [style.color]="'hsl(var(--widget-primary))'">{{ breakdown.totalCost | currencyFormat }}</span>
          </div>
        </div>

        <!-- ── CTA Button ── -->
        <button
          type="button"
          [disabled]="isInvalid()"
          class="w-full py-4 font-black text-white text-sm uppercase tracking-widest
                 transition-all duration-200 shadow-lg
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          [ngClass]="isInvalid() ? 'opacity-50 cursor-not-allowed scale-100' : 'active:scale-[0.98] cursor-pointer hover:opacity-95'"
          [style.background]="isInvalid() ? 'hsl(var(--muted-foreground))' : 'hsl(var(--widget-primary))'"
          [style.borderRadius]="widgetRadius"
          [style.boxShadow]="isInvalid() ? 'none' : '0 8px 24px hsl(var(--widget-primary) / 0.35)'"
          [style.--tw-ring-color]="'hsl(var(--widget-primary))'"
        >
          {{ isInvalid() ? 'Corrige los errores' : 'Solicitar este Crédito' }}
        </button>

        <!-- Pie de transparencia -->
        <p class="text-center text-foreground/30 text-xs">
          Simulación no vinculante · Tasa nominal mensual
          <span *ngIf="config" [style.color]="'hsl(var(--widget-primary))'">
            {{ config.financial.monthlyInterestRate }}%
          </span>
        </p>
      </div>
    </div>
  `,
})
export class WhiteLabelWidgetComponent implements OnInit, OnDestroy {
  config: AppConfiguration | null = null;
  localInput: CreditInput | null = null;
  breakdown: CreditBreakdown | null = null;

  // Cuotas disponibles para selección rápida
  termOptions = [6, 12, 24, 36, 48, 60, 72];

  // CSS Custom Properties calculadas desde la config — inyectadas al host del widget
  widgetPrimary = '';
  widgetRadius  = '9999px';

  private destroy$ = new Subject<void>();

  constructor(
    private configService: ConfigurationService,
    private creditEngine: CreditEngineService,
    private elRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    // ── Escuchamos CONFIG + BREAKDOWN de forma combinada
    combineLatest([
      this.configService.config$,
      this.creditEngine.breakdown$,
      this.creditEngine.creditInput$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cfg, breakdown, input]) => {
        this.config    = cfg;
        this.breakdown = breakdown;

        // Copia segura de los inputs para el binding bidireccional local
        if (!this.localInput) {
          this.localInput = JSON.parse(JSON.stringify(input));
        }

        // ── INYECCIÓN DE CSS CUSTOM PROPERTIES ──────────────────────────────
        // Convertimos el HEX de la config a HSL y lo inyectamos directamente
        // como variable CSS en el elemento raíz del widget.
        // Esto desacopla COMPLETAMENTE el widget del sistema de theming global:
        // puede vivir incrustado en una página externa de un cliente (white-label)
        // sin heredar nada del host.
        const hsl = this.hexToHsl(cfg.visual.primaryColorHex);
        this.widgetPrimary = hsl;
        this.widgetRadius  = cfg.visual.buttonBorderRadius;

        // También lo escribimos directamente en el nativeElement para que
        // cualquier CSS interno del widget pueda consumirlo via var(--widget-primary)
        this.elRef.nativeElement.style.setProperty('--widget-primary', hsl);
        this.elRef.nativeElement.style.setProperty('--widget-radius',  cfg.visual.buttonBorderRadius);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSliderChange(): void {
    if (this.localInput) {
      this.creditEngine.updateCreditInput(this.localInput);
    }
  }

  setTerm(months: number): void {
    if (this.localInput) {
      this.localInput = { ...this.localInput, termMonths: months };
      this.creditEngine.updateCreditInput(this.localInput);
    }
  }

  // Conversión de HEX → HSL en el componente (sin depender del servicio global)
  private hexToHsl(hex: string): string {
    const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const full = hex.replace(shorthand, (_, r, g, b) => r+r+g+g+b+b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
    if (!result) return '221 83% 53%';

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h*360)} ${Math.round(s*100)}% ${Math.round(l*100)}%`;
  }

  isInvalid(): boolean {
    if (!this.localInput || !this.config) return true;
    
    const amountOut = this.localInput.requestedAmount < this.config.validation.minAmount || 
                      this.localInput.requestedAmount > this.config.validation.maxAmount;
    
    const termOut = this.localInput.termMonths < 1 || 
                    this.localInput.termMonths > this.config.validation.maxTermMonths;

    return amountOut || termOut;
  }
}
