import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ThemeService } from '../../core/services/theme.service';
import { WhiteLabelWidgetComponent } from '../../shared/components/organisms/white-label-widget/white-label-widget.component';
import { ConfigPanelComponent } from '../../shared/components/organisms/config-panel/config-panel.component';
import { CreditSimulatorComponent } from '../../shared/components/organisms/credit-simulator/credit-simulator.component';
import { AmortizationTableComponent } from '../../shared/components/organisms/credit-simulator/amortization-table/amortization-table.component';

type PreviewTab = 'widget' | 'simulator' | 'amortization';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, WhiteLabelWidgetComponent, ConfigPanelComponent, CreditSimulatorComponent, AmortizationTableComponent],
  template: `
    <!-- ══ ROOT: full-screen split layout ══ -->
    <div class="h-screen flex flex-col bg-background text-foreground overflow-hidden transition-colors duration-500">

      <!-- ── TOP NAV BAR ── -->
      <nav class="h-14 shrink-0 flex items-center justify-between px-6 border-b border-border/60 bg-card/80 backdrop-blur z-20">
        <div class="flex items-center gap-3">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
          </span>
          <h1 class="text-sm font-black tracking-tight text-foreground">
            Mi <span class="text-primary">Approbe Lite</span>
            <span class="ml-2 text-xs font-normal text-foreground/40 tracking-widest uppercase">· Author View</span>
          </h1>
        </div>

        <button
          (click)="toggleTheme()"
          id="theme-toggle-btn"
          class="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border border-border hover:bg-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg *ngIf="(isDark$ | async) === false" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
          <svg *ngIf="isDark$ | async" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <span>{{ (isDark$ | async) ? 'Claro' : 'Oscuro' }}</span>
        </button>
      </nav>

      <!-- ── SPLIT BODY ── -->
      <div class="flex-1 flex min-h-0 overflow-hidden">

        <!-- ◀ IZQUIERDA: Panel de Configuración -->
        <aside class="w-80 shrink-0 overflow-y-auto border-r border-border/60">
          <app-config-panel></app-config-panel>
        </aside>

        <!-- ▶ DERECHA: Zona de Previsualización con Tabs -->
        <main class="flex-1 overflow-hidden flex flex-col bg-muted/30">

          <!-- Tab Bar -->
          <div class="shrink-0 flex items-center gap-1 px-6 pt-4 pb-0 border-b border-border/50 bg-muted/20">
            <button
              id="tab-widget"
              (click)="activeTab = 'widget'"
              class="px-5 py-2.5 text-sm font-bold rounded-t-xl border-x border-t transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              [class.bg-card]="activeTab === 'widget'"
              [class.border-border]="activeTab === 'widget'"
              [class.text-primary]="activeTab === 'widget'"
              [class.border-transparent]="activeTab !== 'widget'"
              [class.text-foreground]="activeTab !== 'widget'"
              [class.opacity-60]="activeTab !== 'widget'"
            >⚡ Widget</button>

            <button
              id="tab-simulator"
              (click)="activeTab = 'simulator'"
              class="px-5 py-2.5 text-sm font-bold rounded-t-xl border-x border-t transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              [class.bg-card]="activeTab === 'simulator'"
              [class.border-border]="activeTab === 'simulator'"
              [class.text-primary]="activeTab === 'simulator'"
              [class.border-transparent]="activeTab !== 'simulator'"
              [class.text-foreground]="activeTab !== 'simulator'"
              [class.opacity-60]="activeTab !== 'simulator'"
            >🧮 Simulador</button>

            <button
              id="tab-amortization"
              (click)="activeTab = 'amortization'"
              class="px-5 py-2.5 text-sm font-bold rounded-t-xl border-x border-t transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              [class.bg-card]="activeTab === 'amortization'"
              [class.border-border]="activeTab === 'amortization'"
              [class.text-primary]="activeTab === 'amortization'"
              [class.border-transparent]="activeTab !== 'amortization'"
              [class.text-foreground]="activeTab !== 'amortization'"
              [class.opacity-60]="activeTab !== 'amortization'"
            >📊 Tabla de Amortización</button>
          </div>

          <!-- Tab Content -->
          <div class="flex-1 overflow-y-auto">

            <!-- TAB: Widget -->
            <div *ngIf="activeTab === 'widget'" class="flex flex-col items-center justify-start p-10 gap-8">
              <div class="w-full max-w-sm">
                <app-white-label-widget></app-white-label-widget>
              </div>
              <div class="grid grid-cols-3 gap-3 w-full max-w-sm">
                <div class="rounded-2xl border border-border/50 bg-card p-4 text-center space-y-1">
                  <p class="text-xs font-black text-primary uppercase tracking-widest">RxJS</p>
                  <p class="text-[11px] text-foreground/50 leading-tight">combineLatest · BehaviorSubject</p>
                </div>
                <div class="rounded-2xl border border-border/50 bg-card p-4 text-center space-y-1">
                  <p class="text-xs font-black text-primary uppercase tracking-widest">Atomic</p>
                  <p class="text-[11px] text-foreground/50 leading-tight">Atoms · Molecules · Organisms</p>
                </div>
                <div class="rounded-2xl border border-border/50 bg-card p-4 text-center space-y-1">
                  <p class="text-xs font-black text-primary uppercase tracking-widest">CSS Vars</p>
                  <p class="text-[11px] text-foreground/50 leading-tight">Isolated scoped theming</p>
                </div>
              </div>
            </div>

            <!-- TAB: Simulador -->
            <div *ngIf="activeTab === 'simulator'" class="p-6">
              <app-credit-simulator></app-credit-simulator>
            </div>

            <!-- TAB: Tabla de Amortización -->
            <div *ngIf="activeTab === 'amortization'" class="p-6">
              <app-amortization-table></app-amortization-table>
            </div>

          </div>
        </main>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `]
})
export class HomeComponent {
  isDark$: Observable<boolean>;
  activeTab: PreviewTab = 'widget';

  constructor(private themeService: ThemeService) {
    this.isDark$ = this.themeService.isDarkMode$;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
