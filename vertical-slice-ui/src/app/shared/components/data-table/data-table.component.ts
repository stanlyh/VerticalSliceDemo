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
      <div class="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
               M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <p class="text-gray-400 font-medium">No hay registros</p>
        <p class="text-gray-300 text-sm mt-1">Crea el primero usando el botón "Nuevo"</p>
      </div>
    } @else {
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                @for (col of columns(); track col.key) {
                  <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500
                             uppercase tracking-wider">
                    {{ col.label }}
                  </th>
                }
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500
                           uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              @for (row of data(); track $index) {
                <tr class="hover:bg-blue-50 transition-colors duration-100">
                  @for (col of columns(); track col.key) {
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ col.formatter ? col.formatter(row[col.key]) : row[col.key] }}
                    </td>
                  }
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-1">
                      <!-- Edit -->
                      <button
                        (click)="edit.emit(row)"
                        title="Editar"
                        class="p-1.5 rounded-md text-gray-400 hover:text-blue-600
                               hover:bg-blue-50 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
                               m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <!-- Delete -->
                      <button
                        (click)="delete.emit(row)"
                        title="Eliminar"
                        class="p-1.5 rounded-md text-gray-400 hover:text-red-600
                               hover:bg-red-50 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
