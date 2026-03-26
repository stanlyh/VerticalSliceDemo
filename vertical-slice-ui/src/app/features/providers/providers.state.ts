import { Injectable, inject, signal, computed } from '@angular/core';
import { ProvidersService } from './providers.service';
import { Provider, CreateProviderDto, EditProviderDto } from './models/provider.model';

@Injectable({ providedIn: 'root' })
export class ProvidersState {
  private service = inject(ProvidersService);

  private _items    = signal<Provider[]>([]);
  private _loading  = signal(false);
  private _selected = signal<Provider | null>(null);

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

  create(dto: CreateProviderDto): void {
    this._loading.set(true);
    this.service.create(dto).subscribe({
      next: () => this.loadAll(),
      error: () => this._loading.set(false)
    });
  }

  edit(dto: EditProviderDto): void {
    this._loading.set(true);
    this.service.edit(dto).subscribe({
      next: () => {
        this._items.update(items =>
          items.map(i => i.idProvider === dto.idProvider ? { ...i, ...dto } : i)
        );
        this._loading.set(false);
        this.clearSelected();
      },
      error: () => this._loading.set(false)
    });
  }

  remove(idProvider: number): void {
    this.service.delete(idProvider).subscribe({
      next: () => this._items.update(items =>
        items.filter(i => i.idProvider !== idProvider)
      )
    });
  }

  selectForEdit(provider: Provider): void {
    this._selected.set(provider);
  }

  clearSelected(): void {
    this._selected.set(null);
  }
}
