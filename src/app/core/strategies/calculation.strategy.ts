import { CreditInput, CreditBreakdown } from '../models/credit.model';

/**
 * Interfaz del Strategy Pattern para los motores de cálculo financiero.
 *
 * El "jefe" (CreditEngineService) trabajará siempre contra este contrato,
 * sin importar la implementación concreta que se le inyecte.
 * Mañana puedes agregar una GermanAmortizationStrategy o una
 * BulletPaymentStrategy sin tocar nunca al "jefe".
 */
export interface CalculationStrategy {
  /**
   * Calcula el desglose completo de un crédito.
   * @param input - Los parámetros del crédito solicitado.
   * @param monthlyInterestRate - Tasa de interés mensual en porcentaje (ej: 2.5 para 2.5%).
   * @param guaranteeFundPercentage - Porcentaje del fondo de garantía (ej: 10 para 10%).
   * @param digitalSignatureValue - Costo fijo de la firma digital.
   * @returns Un objeto CreditBreakdown con el desglose completo.
   */
  calculate(
    input: CreditInput,
    monthlyInterestRate: number,
    guaranteeFundPercentage: number,
    digitalSignatureValue: number
  ): CreditBreakdown;
}
