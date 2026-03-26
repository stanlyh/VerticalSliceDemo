import { Injectable, inject, signal, computed } from '@angular/core';
import { ProductsService } from './products.service';
import { Product, CreateProductDto, EditProductDto } from './models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsState {
  private service = inject(ProductsService);

  private _items    = signal<Product[]>([]);
  private _loading  = signal(false);
  private _selected = signal<Product | null>(null);

  readonly items    = this._items.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly selected = this._selected.asReadonly();
  readonly isEmpty  = computed(() => this._items().length === 0);

  loadAll(): void {
    this._loading.set(true);
    this.service.getAll().subscribe({
      next: items => this._items.set(items),
      error: () => {},
      complete: () => this._loading.set(false)
    });
  }

  create(dto: CreateProductDto): void {
    this._loading.set(true);
    this.service.create(dto).subscribe({
      next: () => this.loadAll(),
      error: () => this._loading.set(false)
    });
  }

  edit(dto: EditProductDto): void {
    this._loading.set(true);
    this.service.edit(dto).subscribe({
      next: () => {
        this._items.update(items =>
          items.map(i => i.idProduct === dto.idProduct ? { ...i, ...dto } : i)
        );
        this._loading.set(false);
        this.clearSelected();
      },
      error: () => this._loading.set(false)
    });
  }

  remove(idProduct: number): void {
    this.service.delete(idProduct).subscribe({
      next: () => this._items.update(items =>
        items.filter(i => i.idProduct !== idProduct)
      )
    });
  }

  selectForEdit(product: Product): void {
    this._selected.set(product);
  }

  clearSelected(): void {
    this._selected.set(null);
  }
}
