import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { CreditEngineService } from '../../../core/services/credit-engine.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { CreditInput } from '../../../core/models/credit.model';

@Component({
  selector: 'app-credit-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  template: `
    <div class="mt-20 flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-8 duration-700">
      
      <!-- Lado Izquierdo: Formulario de Control -->
      <div class="w-full lg:w-1/3 bg-card border border-border/80 rounded-[2rem] p-8 shadow-xl">
        <h3 class="text-2xl font-bold text-foreground mb-6">Simula tu Crédito</h3>
        
        <form class="space-y-6" *ngIf="localInput" (submit)="$event.preventDefault()">
          
          <!-- Input Monto -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label for="requestedAmount" class="text-sm font-semibold text-foreground/80 cursor-pointer">
                ¿Cuánto dinero necesitas?
              </label>
              <span class="text-sm font-bold text-primary">{{ localInput.requestedAmount | currencyFormat }}</span>
            </div>
            <!-- Focus Visible y Outline correctos según normativas de accesibilidad -->
            <input 
              id="requestedAmount"
              name="requestedAmountInput"
              type="number"
              min="100000"
              max="50000000"
              [(ngModel)]="localInput.requestedAmount"
              (ngModelChange)="onInputChange()"
              class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-shadow"
            />
            <input 
              type="range" 
              name="requestedAmountSlider"
              min="100000" 
              max="50000000" 
              step="500000"
              [(ngModel)]="localInput.requestedAmount"
              (ngModelChange)="onInputChange()"
              class="w-full accent-primary cursor-pointer hover:opacity-90"
              aria-label="Ajustar monto solicitado"
            />
          </div>

          <!-- Input Plazo -->
          <div class="space-y-3 mt-8">
            <div class="flex justify-between items-center">
              <label for="termMonths" class="text-sm font-semibold text-foreground/80 cursor-pointer">
                ¿En cuántos meses pagarás?
              </label>
              <span class="text-sm font-bold text-primary">{{ localInput.termMonths }} meses</span>
            </div>
            <input 
              id="termMonths"
              name="termMonthsInput"
              type="number"
              min="1"
              max="72"
              [(ngModel)]="localInput.termMonths"
              (ngModelChange)="onInputChange()"
              class="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-shadow"
            />
            <input 
              type="range" 
              name="plazoSlider"
              min="1" 
              max="72" 
              step="1"
              [(ngModel)]="localInput.termMonths"
              (ngModelChange)="onInputChange()"
              class="w-full accent-primary cursor-pointer hover:opacity-90"
              aria-label="Ajustar plazo en meses"
            />
          </div>

          <!-- Input Seguro de Vida -->
          <div class="space-y-3 mt-8">
            <div class="flex justify-between items-center">
              <label for="lifeInsurance" class="text-sm font-semibold text-foreground/80 cursor-pointer">
                Seguro de vida (% saldo)
              </label>
            </div>
            <div class="relative">
              <input 
                id="lifeInsurance"
                name="lifeInsuranceInput"
                type="number"
                step="0.01"
                min="0"
                [(ngModel)]="localInput.lifeInsuranceRateMonthly"
                (ngModelChange)="onInputChange()"
                class="w-full rounded-xl border border-input bg-background px-4 py-3 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-shadow"
              />
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
            </div>
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
          
          <button 
            type="button"
            class="mt-8 w-full py-4 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
            Solicitar Ahora
          </button>
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
}
