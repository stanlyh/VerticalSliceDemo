import { Component, inject, signal, OnInit } from '@angular/core';
import { ProvidersState } from '../providers.state';
import { Provider } from '../models/provider.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TableSkeletonComponent } from '../../../shared/components/table-skeleton/table-skeleton.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProviderFormComponent } from '../provider-form/provider-form.component';

@Component({
  selector: 'app-providers-list',
  imports: [
    PageHeaderComponent,
    TableSkeletonComponent,
    DataTableComponent,
    ModalComponent,
    ConfirmDialogComponent,
    ProviderFormComponent
  ],
  template: `
    <!-- Header -->
    <app-page-header title="Proveedores" subtitle="Gestión del directorio de proveedores">
      <button
        actions
        (click)="openCreate()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm
               font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-150">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo proveedor
      </button>
    </app-page-header>

    <!-- Skeleton -->
    <app-table-skeleton
      [visible]="state.loading()"
      [cols]="['4rem', '14rem', '10rem']" />

    <!-- Table -->
    @if (!state.loading()) {
      <app-data-table
        [columns]="columns"
        [data]="state.items()"
        (edit)="onEdit($event)"
        (delete)="onDeleteRequest($event)" />
    }

    <!-- Create / Edit Modal -->
    <app-modal
      [open]="modalOpen()"
      [title]="state.selected() ? 'Editar proveedor' : 'Nuevo proveedor'"
      (closed)="closeModal()">
      <app-provider-form />
    </app-modal>

    <!-- Confirm Delete Dialog -->
    <app-confirm-dialog
      [open]="confirmOpen()"
      [itemName]="pendingDelete()?.name ?? ''"
      (confirmed)="onDeleteConfirm()"
      (cancelled)="confirmOpen.set(false)" />
  `
})
export class ProvidersListComponent implements OnInit {
  readonly state = inject(ProvidersState);

  modalOpen     = signal(false);
  confirmOpen   = signal(false);
  pendingDelete = signal<Provider | null>(null);

  readonly columns: TableColumn<Provider>[] = [
    { key: 'idProvider', label: 'ID' },
    { key: 'name',       label: 'Nombre' },
    { key: 'phone',      label: 'Teléfono' }
  ];

  ngOnInit(): void {
    this.state.loadAll();
  }

  openCreate(): void {
    this.state.clearSelected();
    this.modalOpen.set(true);
  }

  onEdit(provider: Provider): void {
    this.state.selectForEdit(provider);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.state.clearSelected();
  }

  onDeleteRequest(provider: Provider): void {
    this.pendingDelete.set(provider);
    this.confirmOpen.set(true);
  }

  onDeleteConfirm(): void {
    const id = this.pendingDelete()?.idProvider;
    if (id !== undefined) this.state.remove(id);
    this.confirmOpen.set(false);
    this.pendingDelete.set(null);
  }
}
