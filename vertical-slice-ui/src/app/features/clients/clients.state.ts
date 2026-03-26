import { Injectable, inject, signal, computed } from '@angular/core';
import { ClientsService } from './clients.service';
import { Client, CreateClientDto, EditClientDto } from './models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientsState {
  private service = inject(ClientsService);

  private _items    = signal<Client[]>([]);
  private _loading  = signal(false);
  private _selected = signal<Client | null>(null);

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

  create(dto: CreateClientDto): void {
    this._loading.set(true);
    this.service.create(dto).subscribe({
      next: () => this.loadAll(),
      error: () => this._loading.set(false)
    });
  }

  edit(dto: EditClientDto): void {
    this._loading.set(true);
    this.service.edit(dto).subscribe({
      next: () => {
        this._items.update(items =>
          items.map(i => i.idClient === dto.idClient ? { ...i, ...dto } : i)
        );
        this._loading.set(false);
        this.clearSelected();
      },
      error: () => this._loading.set(false)
    });
  }

  remove(idClient: number): void {
    this.service.delete(idClient).subscribe({
      next: () => this._items.update(items =>
        items.filter(i => i.idClient !== idClient)
      )
    });
  }

  selectForEdit(client: Client): void {
    this._selected.set(client);
  }

  clearSelected(): void {
    this._selected.set(null);
  }
}
