import { Component, input, output } from '@angular/core';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  formatter?: (value: unknown) => string;
}

@Component({
  selector: 'app-data-table',
  template: `
    @if (data().length === 0) {
      <div style="border-radius:1rem;padding:3rem;text-align:center;
                  background:#0d1635;border:1px solid rgba(255,255,255,0.06)">
        <svg style="width:3rem;height:3rem;display:block;margin:0 auto 0.75rem;color:#1e3a5f"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
               M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <p style="font-weight:500;color:#334155;margin:0">No hay registros</p>
        <p style="font-size:0.875rem;color:#1e3a5f;margin:0.25rem 0 0">
          Crea el primero usando el botón "Nuevo"
        </p>
      </div>
    } @else {
      <div style="border-radius:1rem;overflow:hidden;border:1px solid rgba(255,255,255,0.06)">
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#0a1128;border-bottom:1px solid rgba(255,255,255,0.06)">
                @for (col of columns(); track col.key) {
                  <th style="padding:0.75rem 1.5rem;text-align:left;font-size:0.7rem;
                             font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#475569">
                    {{ col.label }}
                  </th>
                }
                <th style="padding:0.75rem 1.5rem;text-align:right;font-size:0.7rem;
                           font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#475569">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              @for (row of data(); track $index) {
                <tr style="background:#0d1635;border-bottom:1px solid rgba(255,255,255,0.04);
                           transition:background 0.1s"
                    onmouseenter="this.style.background='#111d42'"
                    onmouseleave="this.style.background='#0d1635'">
                  @for (col of columns(); track col.key) {
                    <td style="padding:1rem 1.5rem;white-space:nowrap;font-size:0.875rem;color:#cbd5e1">
                      {{ col.formatter ? col.formatter(row[col.key]) : row[col.key] }}
                    </td>
                  }
                  <td style="padding:1rem 1.5rem;white-space:nowrap;text-align:right">
                    <div style="display:flex;align-items:center;justify-content:flex-end;gap:0.25rem">
                      <!-- Edit -->
                      <button
                        (click)="edit.emit(row)"
                        title="Editar"
                        style="padding:0.375rem;border-radius:0.375rem;border:none;cursor:pointer;
                               background:transparent;color:#475569;transition:color 0.15s,background 0.15s"
                        onmouseenter="this.style.color='#93c5fd';this.style.background='rgba(147,197,253,0.08)'"
                        onmouseleave="this.style.color='#475569';this.style.background='transparent'">
                        <svg style="width:1rem;height:1rem;display:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                               m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <!-- Delete -->
                      <button
                        (click)="delete.emit(row)"
                        title="Eliminar"
                        style="padding:0.375rem;border-radius:0.375rem;border:none;cursor:pointer;
                               background:transparent;color:#475569;transition:color 0.15s,background 0.15s"
                        onmouseenter="this.style.color='#ef4444';this.style.background='rgba(239,68,68,0.08)'"
                        onmouseleave="this.style.color='#475569';this.style.background='transparent'">
                        <svg style="width:1rem;height:1rem;display:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858
                               L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `
})
export class DataTableComponent<T extends object> {
  readonly columns = input.required<TableColumn<T>[]>();
  readonly data    = input.required<T[]>();
  readonly edit    = output<T>();
  readonly delete  = output<T>();
}
