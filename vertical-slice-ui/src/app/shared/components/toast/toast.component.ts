import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg
                    min-w-72 max-w-sm text-sm font-medium pointer-events-auto
                    animate-in slide-in-from-right-4 duration-300"
             [class]="colorClass(toast.type)">

          <!-- Icon -->
          <span class="shrink-0 mt-0.5 w-4 h-4" [innerHTML]="iconFor(toast.type)"></span>

          <!-- Message -->
          <span class="flex-1 leading-snug">{{ toast.message }}</span>

          <!-- Dismiss -->
          <button
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  // Full class strings required — Tailwind v4 cannot detect runtime-constructed class names
  colorClass(type: ToastType): string {
    if (type === 'error')   return 'bg-red-600 text-white';
    if (type === 'success') return 'bg-green-600 text-white';
    return 'bg-blue-600 text-white';
  }

  iconFor(type: ToastType): string {
    const icons: Record<ToastType, string> = {
      error: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>`,
      success: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>`,
      info: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                 d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
             </svg>`
    };
    return icons[type];
  }
}
