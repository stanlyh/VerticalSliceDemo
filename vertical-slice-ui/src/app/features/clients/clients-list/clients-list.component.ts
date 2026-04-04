import { Component, inject, signal, OnInit } from '@angular/core';
import { ClientsState } from '../clients.state';
import { Client } from '../models/client.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TableSkeletonComponent } from '../../../shared/components/table-skeleton/table-skeleton.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClientFormComponent } from '../client-form/client-form.component';

const ACCENT = '#06d6a0';

@Component({
  selector: 'app-clients-list',
  imports: [
    PageHeaderComponent, TableSkeletonComponent, DataTableComponent,
    ModalComponent, ConfirmDialogComponent, ClientFormComponent
  ],
  template: `
    <app-page-header title="Clientes" subtitle="Gestión de la cartera de clientes" [accent]="accent">
      <button actions (click)="openCreate()"
        style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;
               font-size:0.875rem;font-weight:600;border-radius:0.75rem;cursor:pointer;
               transition:background 0.15s;background:rgba(6,214,160,0.12);
               color:#06d6a0;border:1px solid rgba(6,214,160,0.3)"
        onmouseenter="this.style.background='rgba(6,214,160,0.22)'"
        onmouseleave="this.style.background='rgba(6,214,160,0.12)'">
        <svg style="width:1rem;height:1rem;flex-shrink:0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo cliente
      </button>
    </app-page-header>

    <app-table-skeleton [visible]="state.loading()" [cols]="['4rem', '14rem', '16rem']" />

    @if (!state.loading()) {
      <app-data-table [columns]="columns" [data]="state.items()"
        (edit)="onEdit($event)" (delete)="onDeleteRequest($event)" />
    }

    @if (!state.loading() && state.items().length > 0) {
      <div style="margin-top:1rem;display:flex;align-items:center;gap:0.5rem">
        <span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;
                     padding:0.125rem 0.5rem;border-radius:0.375rem;
                     color:#06d6a0;background:rgba(6,214,160,0.1)">TEAL</span>
        <span style="font-size:0.75rem;color:#334155">{{ state.items().length }} registro(s)</span>
      </div>
    }

    <app-modal [open]="modalOpen()" [title]="state.selected() ? 'Editar cliente' : 'Nuevo cliente'"
      (closed)="closeModal()">
      <app-client-form />
    </app-modal>

    <app-confirm-dialog [open]="confirmOpen()" [itemName]="pendingDelete()?.name ?? ''"
      (confirmed)="onDeleteConfirm()" (cancelled)="confirmOpen.set(false)" />
  `
})
export class ClientsListComponent implements OnInit {
  readonly state  = inject(ClientsState);
  readonly accent = ACCENT;

  modalOpen     = signal(false);
  confirmOpen   = signal(false);
  pendingDelete = signal<Client | null>(null);

  readonly columns: TableColumn<Client>[] = [
    { key: 'idClient', label: 'ID' },
    { key: 'name',     label: 'Nombre' },
    { key: 'email',    label: 'Correo electrónico' }
  ];

  ngOnInit(): void { this.state.loadAll(); }
  openCreate(): void { this.state.clearSelected(); this.modalOpen.set(true); }
  onEdit(c: Client): void { this.state.selectForEdit(c); this.modalOpen.set(true); }
  closeModal(): void { this.modalOpen.set(false); this.state.clearSelected(); }
  onDeleteRequest(c: Client): void { this.pendingDelete.set(c); this.confirmOpen.set(true); }
  onDeleteConfirm(): void {
    const id = this.pendingDelete()?.idClient;
    if (id !== undefined) this.state.remove(id);
    this.confirmOpen.set(false);
    this.pendingDelete.set(null);
  }
}
