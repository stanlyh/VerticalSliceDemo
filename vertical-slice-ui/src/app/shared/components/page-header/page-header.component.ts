import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="text-sm text-gray-500 mt-1">{{ subtitle() }}</p>
        }
      </div>
      <div>
        <ng-content select="[actions]" />
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
