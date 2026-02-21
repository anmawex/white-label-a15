import { Injectable } from '@angular/core';
import { CreditInput, CreditBreakdown, AmortizationRow } from '../models/credit.model';
import { CalculationStrategy } from './calculation.strategy';

/**
 * Implementación concreta del Strategy usando el sistema de
 * Amortización Francés (cuota fija, intereses decrecientes).
 *
 * Fórmula de cuota francesa:
 *   C = P * [i(1+i)^n] / [(1+i)^n - 1]
 *   Donde:
 *     C = Cuota mensual fija
 *     P = Principal (monto neto del crédito)
 *     i = Tasa de interés mensual (en decimal: 2.5% → 0.025)
 *     n = Número de períodos (meses)
 */
@Injectable({
  providedIn: 'root'
})
export class FrenchAmortizationStrategy implements CalculationStrategy {

  private readonly VAT_RATE = 0.19; // IVA Colombia

  calculate(
    input: CreditInput,
    monthlyInterestRatePct: number,
    guaranteeFundPct: number,
    digitalSignatureValue: number
  ): CreditBreakdown {
    const principal = input.requestedAmount;
    const n = input.termMonths;
    const i = monthlyInterestRatePct / 100; // Pasar de porcentaje a decimal
    const guaranteeRate = guaranteeFundPct / 100;
    const lifeInsuranceRate = input.lifeInsuranceRateMonthly / 100;

    // --- 1. Cuota Fija French System ---
    // Caso especial: si la tasa es 0, la cuota es simplemente P/n
    const monthlyPayment = i === 0
      ? principal / n
      : principal * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);

    // --- 2. Tabla de Amortización ---
    const amortizationTable: AmortizationRow[] = [];
    let balance = principal;
    let totalInterestAccum = 0;

    for (let period = 1; period <= n; period++) {
      const initialBalance = balance;
      const interestForPeriod = balance * i;
      const principalForPeriod = monthlyPayment - interestForPeriod;
      balance = balance - principalForPeriod;

      totalInterestAccum += interestForPeriod;

      amortizationTable.push({
        period,
        initialBalance: this.round(initialBalance),
        payment: this.round(monthlyPayment),
        principal: this.round(principalForPeriod),
        interest: this.round(interestForPeriod),
        finalBalance: this.round(Math.max(balance, 0)) // Evitar -0.000001 por redondeo
      });
    }

    // --- 3. Costos Adicionales ---
    // Aval/Garantía: se calcula sobre el monto total del crédito y se distribuye en la vida
    const guaranteeCost = principal * guaranteeRate;
    const guaranteeVat = guaranteeCost * this.VAT_RATE;

    // Seguro de vida deudor: se aplica mensualmente sobre el saldo insoluto (saldo al inicio de cada periodo)
    const lifeInsuranceCost = amortizationTable.reduce(
      (acc, row) => acc + (row.initialBalance * lifeInsuranceRate),
      0
    );

    // --- 4. Consolidación ---
    const totalCost =
      principal +
      totalInterestAccum +
      guaranteeCost +
      guaranteeVat +
      lifeInsuranceCost +
      digitalSignatureValue;

    return {
      netCapital: this.round(principal),
      monthlyPayment: this.round(monthlyPayment),
      totalInterest: this.round(totalInterestAccum),
      guaranteeCost: this.round(guaranteeCost),
      guaranteeVat: this.round(guaranteeVat),
      lifeInsuranceCost: this.round(lifeInsuranceCost),
      digitalSignatureValue: this.round(digitalSignatureValue),
      totalCost: this.round(totalCost),
      amortizationTable
    };
  }

  /** Redondea a 2 decimales para evitar errores de punto flotante */
  private round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
