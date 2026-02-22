import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, timer } from 'rxjs';

import { CreditEngineService } from '../../../../core/services/credit-engine.service';
import { ConfigurationService } from '../../../../core/services/configuration.service';
import { CurrencyFormatPipe } from '../../../pipes/currency-format.pipe';
import { CreditInput } from '../../../../core/models/credit.model';
import { AppConfiguration } from '../../../../core/models/configuration.model';
import { InputComponent } from '../../atoms/input/input.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';

// Estados posibles del flujo de solicitud
type SubmitState = 'idle' | 'loading' | 'success';

@Component({
  selector: 'app-credit-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe, InputComponent, ButtonComponent, FormFieldComponent],
  template: `
    <div class="mt-20 flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-8 duration-700">
      
      <!-- Lado Izquierdo: Formulario de Control -->
      <div class="w-full lg:w-1/3 bg-card border border-border/80 rounded-[2rem] p-8 shadow-xl">
        <h3 class="text-2xl font-bold text-foreground mb-6">Simula tu Crédito</h3>
        
        <form class="space-y-6" *ngIf="localInput" (submit)="$event.preventDefault()">
          
          <!-- Input Monto (Usando Atomic Design MOLECULE + ATOM) -->
          <div class="space-y-3" *ngIf="config">
            <app-form-field label="¿Cuánto dinero necesitas?" [rightLabel]="(localInput.requestedAmount | currencyFormat) || ''" forId="requestedAmount">
              <app-input
                inputId="requestedAmount"
                name="requestedAmountInput"
                type="number"
                [min]="config.validation.minAmount"
                [max]="config.validation.maxAmount"
                step="50000"
                [(ngModel)]="localInput.requestedAmount"
                (ngModelChange)="onInputChange()">
              </app-input>
            </app-form-field>

            <input 
              type="range" 
              name="requestedAmountSlider"
              [min]="config.validation.minAmount" 
              [max]="config.validation.maxAmount" 
              step="500000"
              [(ngModel)]="localInput.requestedAmount"
              (ngModelChange)="onInputChange()"
              class="w-full accent-[hsl(var(--primary))] cursor-pointer hover:opacity-90 mt-2"
              aria-label="Ajustar monto solicitado"
            />

            <!-- Alertas de validación de monto -->
            <div *ngIf="localInput.requestedAmount < config.validation.minAmount" class="text-xs font-bold text-red-500 flex items-center gap-1.5 mt-2 animate-in slide-in-from-top-1 fade-in duration-200">
              <svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Monto mínimo permitido: {{ config.validation.minAmount | currencyFormat }}
            </div>
            <div *ngIf="localInput.requestedAmount > config.validation.maxAmount" class="text-xs font-bold text-red-500 flex items-center gap-1.5 mt-2 animate-in slide-in-from-top-1 fade-in duration-200">
              <svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              El límite máximo es: {{ config.validation.maxAmount | currencyFormat }}
            </div>
          </div>

          <!-- Input Plazo (Usando Atomic Design) -->
          <div class="space-y-3 mt-8" *ngIf="config">
            <app-form-field label="¿En cuántos meses pagarás?" [rightLabel]="localInput.termMonths + ' meses'" forId="termMonths">
              <app-input
                inputId="termMonths"
                name="termMonthsInput"
                type="number"
                min="1"
                [max]="config.validation.maxTermMonths"
                step="1"
                [(ngModel)]="localInput.termMonths"
                (ngModelChange)="onInputChange()">
              </app-input>
            </app-form-field>

            <input 
              type="range" 
              name="termMonthsSlider"
              min="1" 
              [max]="config.validation.maxTermMonths" 
              step="1"
              [(ngModel)]="localInput.termMonths"
              (ngModelChange)="onInputChange()"
              class="w-full accent-[hsl(var(--primary))] cursor-pointer hover:opacity-90 mt-2"
              aria-label="Ajustar plazo en meses"
            />

            <!-- Alertas de validación de plazo -->
            <div *ngIf="localInput.termMonths > config.validation.maxTermMonths" class="text-xs font-bold text-red-500 flex items-center gap-1.5 mt-2 animate-in slide-in-from-top-1 fade-in duration-200">
              <svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Plazo máximo permitido: {{ config.validation.maxTermMonths }} meses
            </div>
          </div>

          <!-- Input Seguro de Vida (Usando Atomic Design) -->
          <div class="mt-8">
            <app-form-field label="Seguro de vida (% saldo)" forId="lifeInsurance">
              <app-input
                inputId="lifeInsurance"
                name="lifeInsuranceInput"
                type="number"
                min="0"
                step="0.01"
                iconLeft="%"
                [(ngModel)]="localInput.lifeInsuranceRateMonthly"
                (ngModelChange)="onInputChange()">
              </app-input>
            </app-form-field>
          </div>

        </form>
      </div>

      <!-- Lado Derecho: El Breakdown o Pantalla de Estado -->
      <div class="flex-1">

        <!-- ─── ESTADO: ÉXITO ─────────────────────────────── -->
        <div
          *ngIf="submitState === 'success'"
          class="h-full bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] p-8 shadow-inner flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in-95 duration-500"
        >
          <!-- Checkmark animado -->
          <div class="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg class="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div class="space-y-2">
            <h3 class="text-2xl font-black text-foreground">¡Solicitud Enviada!</h3>
            <p class="text-foreground/60 text-sm max-w-xs">
              Tu solicitud de crédito por <strong class="text-emerald-600 dark:text-emerald-400">{{ localInput.requestedAmount | currencyFormat }}</strong>
              a <strong class="text-emerald-600 dark:text-emerald-400">{{ localInput.termMonths }} meses</strong> ha sido recibida exitosamente.
            </p>
            <p class="text-foreground/40 text-xs mt-4">
              Un asesor se comunicará contigo en menos de 24 horas.
            </p>
          </div>
          <button
            (click)="resetSubmit()"
            class="mt-4 px-6 py-2.5 rounded-xl border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:bg-emerald-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Nueva simulación
          </button>
        </div>

        <!-- ─── ESTADO: IDLE o LOADING (Breakdown) ─────────── -->
        <div 
          class="h-full bg-primary/5 border border-primary/20 rounded-[2rem] p-8 shadow-inner overflow-hidden relative"
          *ngIf="submitState !== 'success' && (creditEngine.breakdown$ | async) as tv"
        >
          <!-- Decoration -->
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- ─── OVERLAY DE CARGA ─────────────────────────── -->
          <div
            *ngIf="submitState === 'loading'"
            class="absolute inset-0 bg-card/80 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center gap-6 z-20 animate-in fade-in duration-300"
          >
            <!-- Spinner animado con CSS -->
            <div class="relative h-16 w-16">
              <div class="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
            </div>
            <div class="text-center space-y-1">
              <p class="text-foreground font-bold text-sm">Procesando solicitud...</p>
              <p class="text-foreground/50 text-xs">Validando con el motor de riesgo</p>
            </div>
            <!-- Barra de progreso animada con CSS de 6s -->
            <div class="w-48 h-1.5 bg-primary/20 rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full progress-bar-6s"></div>
            </div>
          </div>

          <div class="relative z-10 flex flex-col h-full">
            <h2 class="text-sm font-black uppercase text-primary tracking-widest mb-2">Desglose Financiero</h2>
            <h3 class="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-8">
              {{ tv.monthlyPayment | currencyFormat }} <span class="text-xl md:text-2xl text-foreground/50 font-medium">/ mes</span>
            </h3>

            <div class="bg-card/90 backdrop-blur rounded-2xl p-6 border border-border/50 flex-1 flex flex-col justify-center space-y-4">
              
              <div class="flex justify-between items-center pb-3 border-b border-border/50">
                <span class="text-foreground/70 font-medium">Capital Solicitado</span>
                <span class="text-foreground font-semibold">{{ tv.netCapital | currencyFormat }}</span>
              </div>

              <div class="flex justify-between items-center pb-3 border-b border-border/50">
                <span class="text-foreground/70 font-medium">Intereses Totales</span>
                <span class="text-foreground font-semibold">{{ tv.totalInterest | currencyFormat }}</span>
              </div>

              <div class="flex justify-between items-center pb-3 border-b border-border/50">
                <span class="text-foreground/70 font-medium">Fondo de Garantía (Aval)</span>
                <span class="text-foreground font-semibold">{{ tv.guaranteeCost | currencyFormat }}</span>
              </div>

              <div class="flex justify-between items-center pb-3 border-b border-border/50">
                <span class="text-foreground/70 font-medium">Seguro de Vida (Total)</span>
                <span class="text-foreground font-semibold">{{ tv.lifeInsuranceCost | currencyFormat }}</span>
              </div>

              <div class="flex justify-between items-center pb-3 border-b border-border/50">
                <span class="text-foreground/70 font-medium">IVA Garantía y Firma (Fijos)</span>
                <span class="text-foreground font-semibold">{{ tv.guaranteeVat + tv.digitalSignatureValue | currencyFormat }}</span>
              </div>

              <div class="flex justify-between items-center pt-4 mt-auto">
                <span class="text-lg text-foreground font-bold">Costo Real Total</span>
                <span class="text-2xl text-primary font-black">{{ tv.totalCost | currencyFormat }}</span>
              </div>

            </div>
            
            <div class="mt-8 w-full">
              <!-- app-button admite [disabled] directamente -->
              <app-button
                [disabled]="isInvalid() || submitState === 'loading'"
                (onClick)="onSubmit()"
              >
                <span *ngIf="submitState === 'idle'">Solicitar Ahora</span>
                <span *ngIf="submitState === 'loading'" class="flex items-center justify-center gap-2">
                  <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Procesando...
                </span>
              </app-button>
              <!-- Tooltip de validación bajo el botón -->
              <p *ngIf="isInvalid() && submitState === 'idle'" class="text-center text-xs text-red-500 font-bold mt-3">
                Corrige los errores del formulario para continuar
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    /* Barra de progreso que tarda exactamente 6 segundos en completarse */
    @keyframes progress {
      from { width: 0%; }
      to   { width: 100%; }
    }
    .progress-bar-6s {
      animation: progress 6s linear forwards;
    }
  `]
})
export class CreditSimulatorComponent implements OnInit, OnDestroy {
  public localInput!: CreditInput;
  public config!: AppConfiguration;
  public submitState: SubmitState = 'idle';

  private destroy$ = new Subject<void>();

  constructor(
    public creditEngine: CreditEngineService,
    private configService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.configService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cfg => this.config = cfg);

    this.creditEngine.creditInput$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CreditInput) => {
        this.localInput = JSON.parse(JSON.stringify(data));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInputChange(): void {
    this.creditEngine.updateCreditInput(this.localInput);
  }

  /** Validación de formulario: retorna true si CUALQUIER campo está fuera de rango */
  isInvalid(): boolean {
    if (!this.localInput || !this.config) return true;

    const amountOut =
      this.localInput.requestedAmount < this.config.validation.minAmount ||
      this.localInput.requestedAmount > this.config.validation.maxAmount;

    const termOut =
      this.localInput.termMonths < 1 ||
      this.localInput.termMonths > this.config.validation.maxTermMonths;

    return amountOut || termOut;
  }

  /**
   * Simula la solicitud de crédito usando RxJS nativo (sin librerías externas):
   * timer(6000) emite un único valor después de 6 segundos y completa.
   * Es equivalente a un mock de HttpClient.post() con un delay.
   */
  onSubmit(): void {
    if (this.isInvalid()) return;

    this.submitState = 'loading';

    // timer(6000): Observable de RxJS que emite 1 sola vez después de 6000ms
    timer(6000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.submitState = 'success';
      });
  }

  /** Resetea el estado para permitir una nueva simulación */
  resetSubmit(): void {
    this.submitState = 'idle';
  }
}
