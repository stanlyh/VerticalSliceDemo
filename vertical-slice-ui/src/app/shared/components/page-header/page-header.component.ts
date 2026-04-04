import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem">
      <div style="display:flex;align-items:center;gap:1rem">
        <!-- Colored accent bar -->
        <div style="width:4px;height:2.5rem;border-radius:2px;flex-shrink:0"
             [style.background]="accent()"></div>
        <div>
          <h1 style="font-size:1.5rem;font-weight:700;color:white;margin:0">{{ title() }}</h1>
          @if (subtitle()) {
            <p style="font-size:0.875rem;color:#64748b;margin:0.25rem 0 0">{{ subtitle() }}</p>
          }
        </div>
      </div>
      <div>
        <ng-content select="[actions]" />
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  readonly title    = input.required<string>();
  readonly subtitle = input<string>('');
  readonly accent   = input<string>('#3b82f6');
}
