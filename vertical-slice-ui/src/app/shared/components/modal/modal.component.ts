import { Component, input, output, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        style="position:fixed;inset:0;z-index:40;display:flex;align-items:center;
               justify-content:center;padding:1rem;background:rgba(0,0,0,0.7);
               backdrop-filter:blur(4px)"
        (click)="closeModal()">

        <!-- Card -->
        <div
          style="position:relative;width:100%;max-width:32rem;z-index:50;padding:1.5rem;
                 border-radius:1rem;background:#0d1635;
                 border:1px solid rgba(255,255,255,0.1);
                 box-shadow:0 25px 50px rgba(0,0,0,0.6)"
          (click)="$event.stopPropagation()">

          <!-- Header -->
          <div style="display:flex;align-items:center;justify-content:space-between;
                      margin-bottom:1.5rem;padding-bottom:1rem;
                      border-bottom:1px solid rgba(255,255,255,0.06)">
            <h2 style="font-size:1rem;font-weight:600;color:white;margin:0">{{ title() }}</h2>
            <button
              (click)="closeModal()"
              style="padding:0.375rem;border-radius:50%;border:none;cursor:pointer;
                     background:transparent;color:#475569;transition:background 0.15s,color 0.15s"
              onmouseenter="this.style.background='rgba(255,255,255,0.06)';this.style.color='#e2e8f0'"
              onmouseleave="this.style.background='transparent';this.style.color='#475569'">
              <svg style="width:1.25rem;height:1.25rem;display:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  readonly open   = input.required<boolean>();
  readonly title  = input.required<string>();
  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  closeModal(): void {
    this.closed.emit();
  }
}
