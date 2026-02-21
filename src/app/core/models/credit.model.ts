/** Datos de entrada que el usuario captura para solicitar un crédito */
export interface CreditInput {
  /** Monto bruto solicitado en pesos colombianos */
  requestedAmount: number;
  /** Plazo en meses */
  termMonths: number;
  /** Valor del seguro de vida deudor mensual (porcentaje sobre el saldo) */
  lifeInsuranceRateMonthly: number;
}

/** Fila de la tabla de amortización para un periodo dado */
export interface AmortizationRow {
  period: number;
  initialBalance: number;
  payment: number;
  principal: number;
  interest: number;
  finalBalance: number;
}

/** Desglose completo de transparencia del crédito */
export interface CreditBreakdown {
  /** Capital neto desembolsado (lo que realmente recibe el deudor) */
  netCapital: number;
  /** Cuota mensual del sistema francés */
  monthlyPayment: number;
  /** Suma de todos los intereses pagados durante la vida del crédito */
  totalInterest: number;
  /** Costo total del fondo de garantía (Aval) durante el plazo */
  guaranteeCost: number;
  /** IVA del 19% aplicado sobre el costo de garantía (normativa colombiana) */
  guaranteeVat: number;
  /** Costo total del seguro de vida deudor durante el plazo */
  lifeInsuranceCost: number;
  /** Valor de la firma digital cobrado una sola vez */
  digitalSignatureValue: number;
  /** Costo total real del crédito (capital + todos los costos) */
  totalCost: number;
  /** Tabla de amortización periodo a periodo */
  amortizationTable: AmortizationRow[];
}
