import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfiguration } from '../models/configuration.model';

const DEFAULT_CONFIG: AppConfiguration = {
  visual: {
    primaryColorHex: '#3b82f6', // Tailwind blue-500
    logoUrl: 'https://angular.io/assets/images/logos/angular/angular.svg',
    buttonBorderRadius: '9999px', // full rounded
  },
  financial: {
    monthlyInterestRate: 2.5,
    guaranteeFundPercentage: 10,
    digitalSignatureValue: 5000,
  },
  validation: {
    minAmount: 100000,
    maxAmount: 50000000,
    maxTermMonths: 72,
  }
};

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private configSubject = new BehaviorSubject<AppConfiguration>(DEFAULT_CONFIG);
  public config$: Observable<AppConfiguration> = this.configSubject.asObservable();

  constructor() {
    this.applyVisualChanges(DEFAULT_CONFIG.visual.primaryColorHex);
  }

  public updateConfiguration(newConfig: Partial<AppConfiguration>): void {
    const currentConfig = this.configSubject.getValue();
    const updatedConfig = { ...currentConfig, ...newConfig };
    this.configSubject.next(updatedConfig);
    
    if (newConfig.visual?.primaryColorHex) {
      this.applyVisualChanges(newConfig.visual.primaryColorHex);
    }
  }

  public getConfigSnapshot(): AppConfiguration {
    return this.configSubject.getValue();
  }

  private applyVisualChanges(hexColor: string): void {
    if (typeof document !== 'undefined') {
      const hslStr = this.hexToHsl(hexColor);
      document.documentElement.style.setProperty('--primary', hslStr);
    }
  }

  private hexToHsl(hex: string): string {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const parsedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(parsedHex);
    
    if (!result) return '221.2 83.2% 53.3%';

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }
}
