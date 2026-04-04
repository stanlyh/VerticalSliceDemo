import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductsState } from '../products.state';
import { Product } from '../models/product.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TableSkeletonComponent } from '../../../shared/components/table-skeleton/table-skeleton.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProductFormComponent } from '../product-form/product-form.component';

const ACCENT = '#f97316';

@Component({
  selector: 'app-products-list',
  imports: [
    PageHeaderComponent, TableSkeletonComponent, DataTableComponent,
    ModalComponent, ConfirmDialogComponent, ProductFormComponent
  ],
  template: `
    <app-page-header title="Productos" subtitle="Gestión del catálogo de productos" [accent]="accent">
      <button actions (click)="openCreate()"
        style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;
               font-size:0.875rem;font-weight:600;border-radius:0.75rem;cursor:pointer;
               transition:background 0.15s;background:rgba(249,115,22,0.12);
               color:#f97316;border:1px solid rgba(249,115,22,0.3)"
        onmouseenter="this.style.background='rgba(249,115,22,0.22)'"
        onmouseleave="this.style.background='rgba(249,115,22,0.12)'">
        <svg style="width:1rem;height:1rem;flex-shrink:0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo producto
      </button>
    </app-page-header>

    <app-table-skeleton [visible]="state.loading()" [cols]="['4rem', '14rem', '8rem']" />

    @if (!state.loading()) {
      <app-data-table [columns]="columns" [data]="state.items()"
        (edit)="onEdit($event)" (delete)="onDeleteRequest($event)" />
    }

    @if (!state.loading() && state.items().length > 0) {
      <div style="margin-top:1rem;display:flex;align-items:center;gap:0.5rem">
        <span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;
                     padding:0.125rem 0.5rem;border-radius:0.375rem;
                     color:#f97316;background:rgba(249,115,22,0.1)">NARANJA</span>
        <span style="font-size:0.75rem;color:#334155">{{ state.items().length }} registro(s)</span>
      </div>
    }

    <app-modal [open]="modalOpen()" [title]="state.selected() ? 'Editar producto' : 'Nuevo producto'"
      (closed)="closeModal()">
      <app-product-form />
    </app-modal>

    <app-confirm-dialog [open]="confirmOpen()" [itemName]="pendingDelete()?.name ?? ''"
      (confirmed)="onDeleteConfirm()" (cancelled)="confirmOpen.set(false)" />
  `
})
export class ProductsListComponent implements OnInit {
  readonly state  = inject(ProductsState);
  readonly accent = ACCENT;

  modalOpen     = signal(false);
  confirmOpen   = signal(false);
  pendingDelete = signal<Product | null>(null);

  readonly columns: TableColumn<Product>[] = [
    { key: 'idProduct', label: 'ID' },
    { key: 'name',      label: 'Nombre' },
    { key: 'price',     label: 'Precio', formatter: v => `$${Number(v).toLocaleString('es-AR')}` }
  ];

  ngOnInit(): void { this.state.loadAll(); }
  openCreate(): void { this.state.clearSelected(); this.modalOpen.set(true); }
  onEdit(p: Product): void { this.state.selectForEdit(p); this.modalOpen.set(true); }
  closeModal(): void { this.modalOpen.set(false); this.state.clearSelected(); }
  onDeleteRequest(p: Product): void { this.pendingDelete.set(p); this.confirmOpen.set(true); }
  onDeleteConfirm(): void {
    const id = this.pendingDelete()?.idProduct;
    if (id !== undefined) this.state.remove(id);
    this.confirmOpen.set(false);
    this.pendingDelete.set(null);
  }
}
