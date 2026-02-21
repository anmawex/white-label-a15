import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CalculationStrategy } from '../strategies/calculation.strategy';
import { FrenchAmortizationStrategy } from '../strategies/french-amortization.strategy';
import { ConfigurationService } from './configuration.service';
import { CreditInput, CreditBreakdown } from '../models/credit.model';

/**
 * CreditEngineService — el "Jefe" del patrón Strategy.
 *
 * Responsabilidades:
 *  - Mantener la estrategia de cálculo activa (intercambiable en runtime).
 *  - Mantener el estado del input del crédito como un BehaviorSubject.
 *  - Exponer el resultado calculado como un Observable reactivo que se
 *    recalcula automáticamente ante cualquier cambio en el input
 *    o en la configuración global (tasa de interés, fondo de garantía, etc).
 */
@Injectable({
  providedIn: 'root'
})
export class CreditEngineService {

  // La estrategia activa. Por defecto: Amortización Francesa.
  // Al tiparlo como la INTERFAZ y no la clase concreta, el servicio
  // no tiene acoplamiento con ninguna implementación específica.
  private strategy: CalculationStrategy;

  private readonly DEFAULT_INPUT: CreditInput = {
    requestedAmount: 5_000_000,
    termMonths: 24,
    lifeInsuranceRateMonthly: 0.3
  };

  // Estado del formulario de crédito como BehaviorSubject
  private creditInputSubject = new BehaviorSubject<CreditInput>(this.DEFAULT_INPUT);
  public creditInput$: Observable<CreditInput> = this.creditInputSubject.asObservable();

  /**
   * Observable derivado que combina el input del crédito con la configuración
   * global. Se recalcula automáticamente cuando cualquiera de los dos cambia.
   */
  public breakdown$: Observable<CreditBreakdown>;

  constructor(
    private configService: ConfigurationService,
    frenchStrategy: FrenchAmortizationStrategy
  ) {
    // Inyectamos la estrategia concreta por defecto vía el constructor.
    // En tests, es trivial pasar un mock que implemente CalculationStrategy.
    this.strategy = frenchStrategy;

    // combineLatest emite cada vez que CUALQUIERA de sus fuentes emite un nuevo valor.
    // Así el resultado siempre estará sincronizado con el estado global.
    this.breakdown$ = combineLatest([
      this.creditInput$,
      this.configService.config$
    ]).pipe(
      map(([input, appConfig]) =>
        this.strategy.calculate(
          input,
          appConfig.financial.monthlyInterestRate,
          appConfig.financial.guaranteeFundPercentage,
          appConfig.financial.digitalSignatureValue
        )
      )
    );
  }

  /**
   * Actualiza el input del crédito, lo que dispara automáticamente
   * un nuevo cálculo en el stream breakdown$.
   */
  public updateCreditInput(input: Partial<CreditInput>): void {
    const current = this.creditInputSubject.getValue();
    this.creditInputSubject.next({ ...current, ...input });
  }

  /**
   * Permite cambiar la estrategia de cálculo en tiempo de ejecución
   * (Strategy Pattern). Por ejemplo: pasar de amortización francesa
   * a alemana sin modificar este servicio.
   */
  public setStrategy(newStrategy: CalculationStrategy): void {
    this.strategy = newStrategy;
    // Disparar recálculo con la nueva estrategia usando el input actual
    const currentInput = this.creditInputSubject.getValue();
    this.creditInputSubject.next({ ...currentInput });
  }
}
