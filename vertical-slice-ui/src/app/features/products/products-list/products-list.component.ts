import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductsState } from '../products.state';
import { Product } from '../models/product.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TableSkeletonComponent } from '../../../shared/components/table-skeleton/table-skeleton.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-products-list',
  imports: [
    PageHeaderComponent,
    TableSkeletonComponent,
    DataTableComponent,
    ModalComponent,
    ConfirmDialogComponent,
    ProductFormComponent
  ],
  template: `
    <!-- Header -->
    <app-page-header title="Productos" subtitle="Gestión del catálogo de productos">
      <button
        actions
        (click)="openCreate()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm
               font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-150">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo producto
      </button>
    </app-page-header>

    <!-- Skeleton -->
    <app-table-skeleton
      [visible]="state.loading()"
      [cols]="['4rem', '14rem', '8rem']" />

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
      [title]="state.selected() ? 'Editar producto' : 'Nuevo producto'"
      (closed)="closeModal()">
      <app-product-form />
    </app-modal>

    <!-- Confirm Delete Dialog -->
    <app-confirm-dialog
      [open]="confirmOpen()"
      [itemName]="pendingDelete()?.name ?? ''"
      (confirmed)="onDeleteConfirm()"
      (cancelled)="confirmOpen.set(false)" />
  `
})
export class ProductsListComponent implements OnInit {
  readonly state = inject(ProductsState);

  modalOpen     = signal(false);
  confirmOpen   = signal(false);
  pendingDelete = signal<Product | null>(null);

  readonly columns: TableColumn<Product>[] = [
    { key: 'idProduct', label: 'ID' },
    { key: 'name',      label: 'Nombre' },
    { key: 'price',     label: 'Precio', formatter: v => `$${Number(v).toLocaleString('es-AR')}` }
  ];

  ngOnInit(): void {
    this.state.loadAll();
  }

  openCreate(): void {
    this.state.clearSelected();
    this.modalOpen.set(true);
  }

  onEdit(product: Product): void {
    this.state.selectForEdit(product);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.state.clearSelected();
  }

  onDeleteRequest(product: Product): void {
    this.pendingDelete.set(product);
    this.confirmOpen.set(true);
  }

  onDeleteConfirm(): void {
    const id = this.pendingDelete()?.idProduct;
    if (id !== undefined) this.state.remove(id);
    this.confirmOpen.set(false);
    this.pendingDelete.set(null);
  }
}
