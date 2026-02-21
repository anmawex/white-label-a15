import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditEngineService } from '../../../../core/services/credit-engine.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-amortization-table',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  template: `
    <div class="mt-12 w-full animate-in fade-in duration-1000 delay-300">
      <div 
        *ngIf="creditEngine.breakdown$ | async as tv"
        class="bg-card w-full rounded-[2rem] border border-border/80 shadow-xl overflow-hidden p-6 md:p-8">
        
        <h3 class="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <div class="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          Tabla de Amortización Mensual
        </h3>

        <!-- Responsive container para el scrolling de la tabla (Vercel Guidelines: overflow handling) -->
        <div class="w-full overflow-x-auto rounded-xl border border-border/50">
          <table class="w-full text-sm text-left font-tabular-nums text-foreground/80">
            <thead class="text-xs uppercase bg-primary/5 text-foreground/60">
              <tr>
                <th scope="col" class="px-6 py-4 font-black">Periodo (Mes)</th>
                <th scope="col" class="px-6 py-4 font-black text-right whitespace-nowrap">Saldo Inicial</th>
                <th scope="col" class="px-6 py-4 font-black text-right">Cuota Fija</th>
                <th scope="col" class="px-6 py-4 font-black text-right">Amortización (A. Capital)</th>
                <th scope="col" class="px-6 py-4 font-black text-right text-primary">Abono Interés</th>
                <th scope="col" class="px-6 py-4 font-black text-right whitespace-nowrap">Saldo Final</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/30 font-medium">
              <!-- Renderizamos las rows sin virtualization ya que el max es 72 meses (por debajo de the 50-item Vercel rule "virtua" consideration) -->
              <tr 
                *ngFor="let row of tv.amortizationTable" 
                class="hover:bg-primary/5 transition-colors duration-200">
                <td class="px-6 py-4 text-center font-bold">{{ row.period }}</td>
                <td class="px-6 py-4 text-right">{{ row.initialBalance | currencyFormat }}</td>
                <td class="px-6 py-4 text-right">{{ row.payment | currencyFormat }}</td>
                <td class="px-6 py-4 text-right">{{ row.principal | currencyFormat }}</td>
                <td class="px-6 py-4 text-right text-primary font-bold">{{ row.interest | currencyFormat }}</td>
                <td class="px-6 py-4 text-right">{{ row.finalBalance | currencyFormat }}</td>
              </tr>
            </tbody>
            <tfoot class="font-bold bg-primary/5 text-foreground">
              <tr>
                <td class="px-6 py-4" colspan="2">Totales Acumulados</td>
                <td class="px-6 py-4 text-right">—</td>
                <td class="px-6 py-4 text-right">{{ tv.netCapital | currencyFormat }}</td>
                <td class="px-6 py-4 text-right text-primary">{{ tv.totalInterest | currencyFormat }}</td>
                <td class="px-6 py-4 text-right">—</td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </div>
  `,
  // Aplicamos tabular-nums (Vercel Guidelines) específico para la tabla 
  // que previene que los números brinquen por el ancho disímil entre dígitos.
  styles: [`
    .font-tabular-nums {
      font-variant-numeric: tabular-nums;
    }
  `]
})
export class AmortizationTableComponent {
  constructor(public creditEngine: CreditEngineService) {}
}
