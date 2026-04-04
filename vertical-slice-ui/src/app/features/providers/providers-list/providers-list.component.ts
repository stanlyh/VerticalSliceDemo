import { Component, inject, signal, OnInit } from '@angular/core';
import { ProvidersState } from '../providers.state';
import { Provider } from '../models/provider.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TableSkeletonComponent } from '../../../shared/components/table-skeleton/table-skeleton.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProviderFormComponent } from '../provider-form/provider-form.component';

const ACCENT = '#a855f7';

@Component({
  selector: 'app-providers-list',
  imports: [
    PageHeaderComponent, TableSkeletonComponent, DataTableComponent,
    ModalComponent, ConfirmDialogComponent, ProviderFormComponent
  ],
  template: `
    <app-page-header title="Proveedores" subtitle="Gestión del directorio de proveedores" [accent]="accent">
      <button actions (click)="openCreate()"
        style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;
               font-size:0.875rem;font-weight:600;border-radius:0.75rem;cursor:pointer;
               transition:background 0.15s;background:rgba(168,85,247,0.12);
               color:#a855f7;border:1px solid rgba(168,85,247,0.3)"
        onmouseenter="this.style.background='rgba(168,85,247,0.22)'"
        onmouseleave="this.style.background='rgba(168,85,247,0.12)'">
        <svg style="width:1rem;height:1rem;flex-shrink:0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo proveedor
      </button>
    </app-page-header>

    <app-table-skeleton [visible]="state.loading()" [cols]="['4rem', '14rem', '10rem']" />

    @if (!state.loading()) {
      <app-data-table [columns]="columns" [data]="state.items()"
        (edit)="onEdit($event)" (delete)="onDeleteRequest($event)" />
    }

    @if (!state.loading() && state.items().length > 0) {
      <div style="margin-top:1rem;display:flex;align-items:center;gap:0.5rem">
        <span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;
                     padding:0.125rem 0.5rem;border-radius:0.375rem;
                     color:#a855f7;background:rgba(168,85,247,0.1)">PÚRPURA</span>
        <span style="font-size:0.75rem;color:#334155">{{ state.items().length }} registro(s)</span>
      </div>
    }

    <app-modal [open]="modalOpen()" [title]="state.selected() ? 'Editar proveedor' : 'Nuevo proveedor'"
      (closed)="closeModal()">
      <app-provider-form />
    </app-modal>

    <app-confirm-dialog [open]="confirmOpen()" [itemName]="pendingDelete()?.name ?? ''"
      (confirmed)="onDeleteConfirm()" (cancelled)="confirmOpen.set(false)" />
  `
})
export class ProvidersListComponent implements OnInit {
  readonly state  = inject(ProvidersState);
  readonly accent = ACCENT;

  modalOpen     = signal(false);
  confirmOpen   = signal(false);
  pendingDelete = signal<Provider | null>(null);

  readonly columns: TableColumn<Provider>[] = [
    { key: 'idProvider', label: 'ID' },
    { key: 'name',       label: 'Nombre' },
    { key: 'phone',      label: 'Teléfono' }
  ];

  ngOnInit(): void { this.state.loadAll(); }
  openCreate(): void { this.state.clearSelected(); this.modalOpen.set(true); }
  onEdit(p: Provider): void { this.state.selectForEdit(p); this.modalOpen.set(true); }
  closeModal(): void { this.modalOpen.set(false); this.state.clearSelected(); }
  onDeleteRequest(p: Provider): void { this.pendingDelete.set(p); this.confirmOpen.set(true); }
  onDeleteConfirm(): void {
    const id = this.pendingDelete()?.idProvider;
    if (id !== undefined) this.state.remove(id);
    this.confirmOpen.set(false);
    this.pendingDelete.set(null);
  }
}
