import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe que formatea números a moneda colombiana.
 * Cumple con la directriz "Locale & i18n" de Vercel Web Guidelines 
 * usando Intl.NumberFormat en lugar de formatos hardcodeados.
 */
@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  // Locale es-CO para Colombia, moneda COP
  private formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  transform(value: number | null | undefined): string {
    if (value == null) return '$ 0';
    return this.formatter.format(value);
  }
}
