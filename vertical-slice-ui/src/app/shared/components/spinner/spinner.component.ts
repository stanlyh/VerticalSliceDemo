import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    @if (visible()) {
      @if (fullPage()) {
        <div class="fixed inset-0 bg-white/70 z-30 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3">
            <div class="w-10 h-10 border-4 border-blue-100 border-t-blue-600
                        rounded-full animate-spin"></div>
            <p class="text-sm text-gray-500">Cargando...</p>
          </div>
        </div>
      } @else {
        <div class="flex items-center justify-center py-12">
          <div class="w-8 h-8 border-4 border-blue-100 border-t-blue-600
                      rounded-full animate-spin"></div>
        </div>
      }
    }
  `
})
export class SpinnerComponent {
  readonly visible = input.required<boolean>();
  readonly fullPage = input<boolean>(false);
}
