export interface VisualConfig {
  primaryColorHex: string;
  logoUrl: string;
  buttonBorderRadius: string;
}

export interface FinancialConfig {
  monthlyInterestRate: number;
  guaranteeFundPercentage: number;
  digitalSignatureValue: number;
}

export interface ValidationRulesConfig {
  minAmount: number;
  maxAmount: number;
  maxTermMonths: number;
}

export interface AppConfiguration {
  visual: VisualConfig;
  financial: FinancialConfig;
  validation: ValidationRulesConfig;
}
