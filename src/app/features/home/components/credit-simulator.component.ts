import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CreditEngineService } from '../../../core/services/credit-engine.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { CreditInput } from '../../../core/models/credit.model';
import { InputComponent } from '../../../shared/components/atoms/input/input.component';
import { ButtonComponent } from '../../../shared/components/atoms/button/button.component';

@Component({
  selector: 'app-credit-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe, InputComponent, ButtonComponent],
  template: `
    <div class="mt-20 flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-8 duration-700">
      
      <!-- Lado Izquierdo: Formulario de Control -->
      <div class="w-full lg:w-1/3 bg-card border border-border/80 rounded-[2rem] p-8 shadow-xl">
        <h3 class="text-2xl font-bold text-foreground mb-6">Simula tu Crédito</h3>
        
        <form class="space-y-6" *ngIf="localInput" (submit)="$event.preventDefault()">
          
          <!-- Input Monto (Usando Atomic Design) -->
          <div class="space-y-3">
            <app-input
              inputId="requestedAmount"
              name="requestedAmountInput"
              type="number"
              min="100000"
              max="50000000"
              step="50000"
              label="¿Cuánto dinero necesitas?"
              [rightLabel]="(localInput.requestedAmount | currencyFormat) || ''"
              [(ngModel)]="localInput.requestedAmount"
              (ngModelChange)="onInputChange()">
            </app-input>

            <input 
              type="range" 
              name="requestedAmountSlider"
              min="100000" 
              max="50000000" 
              step="500000"
              [(ngModel)]="localInput.requestedAmount"
              (ngModelChange)="onInputChange()"
              class="w-full accent-[hsl(var(--primary))] cursor-pointer hover:opacity-90 mt-2"
              aria-label="Ajustar monto solicitado"
            />
          </div>

          <!-- Input Plazo (Usando Atomic Design) -->
          <div class="space-y-3 mt-8">
            <app-input
              inputId="termMonths"
              name="termMonthsInput"
              type="number"
              min="1"
              max="72"
              step="1"
              label="¿En cuántos meses pagarás?"
              [rightLabel]="localInput.termMonths + ' meses'"
              [(ngModel)]="localInput.termMonths"
              (ngModelChange)="onInputChange()">
            </app-input>

            <input 
              type="range" 
              name="termMonthsSlider"
              min="1" 
              max="72" 
              step="1"
              [(ngModel)]="localInput.termMonths"
              (ngModelChange)="onInputChange()"
              class="w-full accent-[hsl(var(--primary))] cursor-pointer hover:opacity-90 mt-2"
              aria-label="Ajustar plazo en meses"
            />
          </div>

          <!-- Input Seguro de Vida (Usando Atomic Design) -->
          <div class="mt-8">
            <app-input
              inputId="lifeInsurance"
              name="lifeInsuranceInput"
              type="number"
              min="0"
              step="0.01"
              iconLeft="%"
              label="Seguro de vida (% saldo)"
              [(ngModel)]="localInput.lifeInsuranceRateMonthly"
              (ngModelChange)="onInputChange()">
            </app-input>
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
  private destroy$ = new Subject<void>();

  constructor(public creditEngine: CreditEngineService) {}

  ngOnInit(): void {
    // Al igual que el Panel, rompemos la referencia al iniciar el componente 
    // para tener control bidireccional puro en este componente sin mutar la fuente.
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
