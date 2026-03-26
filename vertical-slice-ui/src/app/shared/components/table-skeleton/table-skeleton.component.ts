import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-skeleton',
  template: `
    @if (visible()) {
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <!-- Header -->
        <div class="bg-gray-50 px-6 py-3 flex gap-6 border-b border-gray-200">
          @for (col of cols(); track $index) {
            <div class="h-3 bg-gray-200 rounded animate-pulse"
                 [style.width]="col"></div>
          }
          <div class="h-3 bg-gray-200 rounded animate-pulse w-16 ml-auto"></div>
        </div>
        <!-- Rows -->
        <div class="bg-white divide-y divide-gray-100">
          @for (row of rows(); track $index) {
            <div class="px-6 py-4 flex gap-6 items-center">
              @for (col of cols(); track $index) {
                <div class="h-3.5 bg-gray-100 rounded animate-pulse"
                     [style.width]="col"
                     [style.animation-delay]="($index * 80) + 'ms'"></div>
              }
              <div class="flex gap-2 ml-auto">
                <div class="w-7 h-7 bg-gray-100 rounded-md animate-pulse"></div>
                <div class="w-7 h-7 bg-gray-100 rounded-md animate-pulse"></div>
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
