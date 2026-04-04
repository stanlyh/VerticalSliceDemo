import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-skeleton',
  template: `
    @if (visible()) {
      <div style="border-radius:1rem;overflow:hidden;border:1px solid rgba(255,255,255,0.06)">
        <!-- Header -->
        <div style="background:#0a1128;padding:0.75rem 1.5rem;display:flex;gap:1.5rem;
                    border-bottom:1px solid rgba(255,255,255,0.06)">
          @for (col of cols(); track $index) {
            <div style="height:0.75rem;border-radius:0.25rem;background:#1e3a5f;animation:pulse 2s infinite"
                 [style.width]="col"></div>
          }
          <div style="height:0.75rem;border-radius:0.25rem;background:#1e3a5f;
                      animation:pulse 2s infinite;width:4rem;margin-left:auto"></div>
        </div>
        <!-- Rows -->
        <div style="background:#0d1635">
          @for (row of rows(); track $index) {
            <div style="padding:1rem 1.5rem;display:flex;gap:1.5rem;align-items:center;
                        border-bottom:1px solid rgba(255,255,255,0.04)">
              @for (col of cols(); track $index) {
                <div style="height:0.875rem;border-radius:0.25rem;background:#111d42;
                            animation:pulse 2s infinite"
                     [style.width]="col"
                     [style.animation-delay]="($index * 80) + 'ms'"></div>
              }
              <div style="display:flex;gap:0.5rem;margin-left:auto">
                <div style="width:1.75rem;height:1.75rem;border-radius:0.375rem;
                            background:#111d42;animation:pulse 2s infinite"></div>
                <div style="width:1.75rem;height:1.75rem;border-radius:0.375rem;
                            background:#111d42;animation:pulse 2s infinite"></div>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class TableSkeletonComponent {
  readonly visible = input.required<boolean>();
  readonly cols    = input<string[]>(['4rem', '12rem', '10rem']);
  readonly rows    = input<number[]>([1, 2, 3, 4, 5]);
}
