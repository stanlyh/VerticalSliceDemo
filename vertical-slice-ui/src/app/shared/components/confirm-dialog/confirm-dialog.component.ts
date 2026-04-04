import { Component, input, output, HostListener } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        style="position:fixed;inset:0;z-index:50;display:flex;align-items:center;
               justify-content:center;padding:1rem;background:rgba(0,0,0,0.7);
               backdrop-filter:blur(4px)"
        (click)="onCancel()">

        <!-- Card -->
        <div
          style="width:100%;max-width:24rem;padding:1.5rem;border-radius:1rem;
                 background:#0d1635;border:1px solid rgba(239,68,68,0.2);
                 box-shadow:0 25px 50px rgba(0,0,0,0.6)"
          (click)="$event.stopPropagation()">

          <!-- Icon + Title -->
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem">
            <div style="width:2.5rem;height:2.5rem;border-radius:50%;display:flex;
                        align-items:center;justify-content:center;flex-shrink:0;
                        background:rgba(239,68,68,0.12)">
              <svg style="width:1.25rem;height:1.25rem;color:#ef4444" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667
                     1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0
                     L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 style="font-size:1rem;font-weight:600;color:white;margin:0">Confirmar eliminación</h3>
          </div>

          <p style="font-size:0.875rem;color:#64748b;margin:0 0 1.5rem 3.25rem">
            ¿Estás seguro de que deseas eliminar
            <strong style="color:white">{{ itemName() }}</strong>?
            Esta acción no se puede deshacer.
          </p>

          <!-- Actions -->
          <div style="display:flex;gap:0.75rem;justify-content:flex-end">
            <button
              (click)="onCancel()"
              style="padding:0.5rem 1rem;font-size:0.875rem;font-weight:500;border-radius:0.5rem;
                     cursor:pointer;transition:background 0.15s;color:#94a3b8;
                     background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08)"
              onmouseenter="this.style.background='rgba(255,255,255,0.08)'"
              onmouseleave="this.style.background='rgba(255,255,255,0.04)'">
              Cancelar
            </button>
            <button
              (click)="onConfirm()"
              style="padding:0.5rem 1rem;font-size:0.875rem;font-weight:500;border-radius:0.5rem;
                     cursor:pointer;transition:background 0.15s;color:white;border:none;
                     background:#ef4444"
              onmouseenter="this.style.background='#b91c1c'"
              onmouseleave="this.style.background='#ef4444'">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  readonly open      = input.required<boolean>();
  readonly itemName  = input<string>('este registro');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  @HostListener('document:keydown.escape')
  onCancel(): void {
    this.cancelled.emit();
  }

  onConfirm(): void {
    this.confirmed.emit();
  }
}
