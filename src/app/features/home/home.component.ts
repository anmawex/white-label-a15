import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';
import { CreditSimulatorComponent } from '../../shared/components/organisms/credit-simulator/credit-simulator.component';
import { AmortizationTableComponent } from '../../shared/components/organisms/credit-simulator/amortization-table/amortization-table.component';
import { WhiteLabelWidgetComponent } from '../../shared/components/organisms/white-label-widget/white-label-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CreditSimulatorComponent, AmortizationTableComponent, WhiteLabelWidgetComponent],
  template: `
    <div class="min-h-screen flex flex-col p-6 bg-background transition-colors duration-500 relative overflow-hidden">
      <!-- Decorative background blooms -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

      <div class="max-w-5xl w-full mx-auto flex-1 flex flex-col pt-20 z-10 relative">
        <!-- Header Section -->
        <header class="text-center space-y-6 animate-in slide-in-from-bottom-8 duration-700">
          <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-foreground drop-shadow-sm">
            Angular <span class="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">15</span>
          </h1>
          <p class="text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto font-medium">
            A professional boilerplate with Clean Architecture, TypeScript 4.8 strictness, pure RxJS states, and dynamic Tailwind styling.
          </p>
        </header>

        <!-- Interactive Theming Showcase -->
        <section class="mt-20 flex justify-center animate-in zoom-in-95 duration-700 delay-150 fill-mode-both">
          <div class="p-8 rounded-[2rem] bg-card border border-border/60 shadow-2xl backdrop-blur-md w-full max-w-3xl hover:border-border transition-colors duration-300">
            <div class="flex flex-col md:flex-row items-center justify-between gap-8">
              <div class="text-left space-y-3">
                <h2 class="text-3xl font-bold text-foreground">Premium Theming</h2>
                <div class="flex items-center gap-2">
                  <div class="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                  <p class="text-foreground/60 text-lg font-medium">
                    Currently actively running in <strong class="text-primary">{{ (isDark$ | async) ? 'Dark' : 'Light' }} Mode</strong>.
                  </p>
                </div>
              </div>
              <button 
                (click)="toggleTheme()"
                class="group px-8 py-4 rounded-full font-bold text-primary-foreground bg-primary hover:bg-primary/90 active:scale-95 transform transition-all duration-300 shadow-xl shadow-primary/20 flex items-center gap-3">
                <svg *ngIf="(isDark$ | async) === false" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <svg *ngIf="isDark$ | async" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Switch to {{ (isDark$ | async) ? 'Light' : 'Dark' }}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Feature Grid -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 mb-20 animate-in fade-in duration-1000 delay-300 fill-mode-both">
          
          <div class="group p-8 rounded-[2rem] border border-border/50 bg-card/50 hover:bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-foreground">Standalone Only</h3>
            <p class="text-foreground/60 leading-relaxed font-medium">Built without a single NgModule. Enjoy cleaner dependencies and faster loading times natively.</p>
          </div>

          <div class="group p-8 rounded-[2rem] border border-border/50 bg-card/50 hover:bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-foreground">RxJS State</h3>
            <p class="text-foreground/60 leading-relaxed font-medium">Purely driven by BehaviorSubjects and Observables. State is reactive, predictive, and safe without Signals.</p>
          </div>

          <div class="group p-8 rounded-[2rem] border border-border/50 bg-card/50 hover:bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-foreground">Clean Arch</h3>
            <p class="text-foreground/60 leading-relaxed font-medium">Feature-based directory approach. Core services, shared components, and dedicated feature modules.</p>
          </div>

        </section>

        <!-- El Simulador + Widget en columnas -->
        <div class="mt-20 flex flex-col xl:flex-row gap-10 items-start">

          <!-- Columna Izquierda: Simulador Full + Tabla -->
          <div class="flex-1 min-w-0 space-y-0">
            <app-credit-simulator></app-credit-simulator>
            <app-amortization-table></app-amortization-table>
          </div>

          <!-- Columna Derecha: El Widget White-Label (la prerevisualización) -->
          <div class="w-full xl:w-[360px] shrink-0 sticky top-6">
            <p class="text-xs font-black uppercase tracking-widest text-foreground/40 mb-4 text-center">⚡ Vista Previa White-Label Widget</p>
            <app-white-label-widget></app-white-label-widget>
          </div>

        </div>
    </div>
  `,
  styles: [`
    /* Custom simple animation utilities since they are missing from basic tailwind core */
    @keyframes slide-in-from-bottom-8 {
      0% { transform: translateY(2rem); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes zoom-in-95 {
      0% { transform: scale(0.95); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    .animate-in {
      animation-duration: 0.7s;
      animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }
    .slide-in-from-bottom-8 {
      animation-name: slide-in-from-bottom-8;
    }
    .zoom-in-95 {
      animation-name: zoom-in-95;
    }
    .fade-in {
      animation-name: fade-in;
    }
    .delay-150 {
      animation-delay: 150ms;
    }
    .delay-300 {
      animation-delay: 300ms;
    }
    .fill-mode-both {
      animation-fill-mode: both;
    }
  `]
})
export class HomeComponent {
  isDark$: Observable<boolean>;

  constructor(private themeService: ThemeService) {
    this.isDark$ = this.themeService.isDarkMode$;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
