import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CreditEngineService } from '../../../../core/services/credit-engine.service';
import { ConfigurationService } from '../../../../core/services/configuration.service';
import { CurrencyFormatPipe } from '../../../pipes/currency-format.pipe';
import { CreditInput } from '../../../../core/models/credit.model';
import { AppConfiguration } from '../../../../core/models/configuration.model';
import { InputComponent } from '../../atoms/input/input.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';

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
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Monto mínimo permitido: {{ config.validation.minAmount | currencyFormat }}
            </div>
            <div *ngIf="localInput.requestedAmount > config.validation.maxAmount" class="text-xs font-bold text-red-500 flex items-center gap-1.5 mt-2 animate-in slide-in-from-top-1 fade-in duration-200">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
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
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
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

      <!-- Lado Derecho: El Breakdown (Televisor Mágico) -->
      <!-- Uso .async para suscribirse de forma segura y evitar memory leaks -->
      <div 
        class="flex-1 bg-primary/5 border border-primary/20 rounded-[2rem] p-8 shadow-inner overflow-hidden relative"
        *ngIf="creditEngine.breakdown$ | async as tv">
        
        <!-- Decoration -->
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

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
            <app-button (onClick)="onSubmit()">
              Solicitar Ahora
            </app-button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class CreditSimulatorComponent implements OnInit, OnDestroy {
  public localInput!: CreditInput;
  public config!: AppConfiguration;
  private destroy$ = new Subject<void>();

  constructor(
    public creditEngine: CreditEngineService,
    private configService: ConfigurationService
  ) {}

  ngOnInit(): void {
    // Escuchamos el config para los mínimos y máximos de la UI
    this.configService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cfg => this.config = cfg);

    // Rota la referencia para tener binding bidireccional local
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
    // Cuando el usuario mueve un slider o escribe, enviamos al "jefe" 
    // la nueva copia profunda para que dispare combineLatest y recálcule en tiempo real.
    this.creditEngine.updateCreditInput(this.localInput);
  }

  onSubmit(): void {
    console.log('Crédito Solicitado:', this.localInput);
    alert('¡Solicitud enviada con éxito!');
  }
}
