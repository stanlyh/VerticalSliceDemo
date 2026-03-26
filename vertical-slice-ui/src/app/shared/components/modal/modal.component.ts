import { Component, input, output, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        (click)="closeModal()">

        <!-- Card -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-50 p-6
                 transition-all duration-200"
          (click)="$event.stopPropagation()">

          <!-- Header -->
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-lg font-semibold text-gray-900">{{ title() }}</h2>
            <button
              (click)="closeModal()"
              class="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400
                     hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Content slot -->
          <ng-content />
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  readonly open  = input.required<boolean>();
  readonly title = input.required<string>();
  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  closeModal(): void {
    this.closed.emit();
  }
}
