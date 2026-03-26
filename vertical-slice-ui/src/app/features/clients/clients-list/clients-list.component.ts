import { Component, inject, signal, OnInit } from '@angular/core';
import { ClientsState } from '../clients.state';
import { Client } from '../models/client.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TableSkeletonComponent } from '../../../shared/components/table-skeleton/table-skeleton.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-clients-list',
  imports: [
    PageHeaderComponent,
    TableSkeletonComponent,
    DataTableComponent,
    ModalComponent,
    ConfirmDialogComponent,
    ClientFormComponent
  ],
  template: `
    <!-- Header -->
    <app-page-header title="Clientes" subtitle="Gestión de la cartera de clientes">
      <button
        actions
        (click)="openCreate()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm
               font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-150">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo cliente
      </button>
    </app-page-header>

    <!-- Skeleton -->
    <app-table-skeleton
      [visible]="state.loading()"
      [cols]="['4rem', '14rem', '16rem']" />

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
      [title]="state.selected() ? 'Editar cliente' : 'Nuevo cliente'"
      (closed)="closeModal()">
      <app-client-form />
    </app-modal>

    <!-- Confirm Delete Dialog -->
    <app-confirm-dialog
      [open]="confirmOpen()"
      [itemName]="pendingDelete()?.name ?? ''"
      (confirmed)="onDeleteConfirm()"
      (cancelled)="confirmOpen.set(false)" />
  `
})
export class ClientsListComponent implements OnInit {
  readonly state = inject(ClientsState);

  modalOpen     = signal(false);
  confirmOpen   = signal(false);
  pendingDelete = signal<Client | null>(null);

  readonly columns: TableColumn<Client>[] = [
    { key: 'idClient', label: 'ID' },
    { key: 'name',     label: 'Nombre' },
    { key: 'email',    label: 'Correo electrónico' }
  ];

  ngOnInit(): void {
    this.state.loadAll();
  }

  openCreate(): void {
    this.state.clearSelected();
    this.modalOpen.set(true);
  }

  onEdit(client: Client): void {
    this.state.selectForEdit(client);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.state.clearSelected();
  }

  onDeleteRequest(client: Client): void {
    this.pendingDelete.set(client);
    this.confirmOpen.set(true);
  }

  onDeleteConfirm(): void {
    const id = this.pendingDelete()?.idClient;
    if (id !== undefined) this.state.remove(id);
    this.confirmOpen.set(false);
    this.pendingDelete.set(null);
  }
}
