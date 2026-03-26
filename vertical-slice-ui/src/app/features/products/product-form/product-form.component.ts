import { Component, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductsState } from '../products.state';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { positiveNumber } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

      <!-- Name -->
      <app-form-field label="Nombre" [control]="form.get('name')" [required]="true">
        <input
          formControlName="name"
          type="text"
          placeholder="Ej: Laptop Dell XPS"
          class="w-full px-3 py-2 border rounded-lg text-sm transition-colors
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-red-500]="form.get('name')?.invalid && form.get('name')?.touched"
          [class.border-gray-300]="!(form.get('name')?.invalid && form.get('name')?.touched)" />
      </app-form-field>

      <!-- Price -->
      <app-form-field label="Precio" [control]="form.get('price')" [required]="true">
        <input
          formControlName="price"
          type="number"
          placeholder="0"
          min="1"
          class="w-full px-3 py-2 border rounded-lg text-sm transition-colors
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-red-500]="form.get('price')?.invalid && form.get('price')?.touched"
          [class.border-gray-300]="!(form.get('price')?.invalid && form.get('price')?.touched)" />
      </app-form-field>

      <!-- Actions -->
      <div class="flex gap-3 justify-end pt-2">
        <button
          type="button"
          (click)="onCancel()"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                 rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button
          type="submit"
          [disabled]="form.invalid || state.loading()"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {{ state.selected() ? 'Guardar cambios' : 'Crear producto' }}
        </button>
      </div>
    </form>
  `
})
export class ProductFormComponent {
  readonly state = inject(ProductsState);
  private fb     = inject(FormBuilder);

  form = this.fb.group({
    name:  ['', [Validators.required, Validators.minLength(2)]],
    price: [null as number | null, [Validators.required, positiveNumber()]]
  });

  constructor() {
    // Patch form when an item is selected for editing
    effect(() => {
      const selected = this.state.selected();
      if (selected) {
        this.form.patchValue({ name: selected.name, price: selected.price });
      } else {
        this.form.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, price } = this.form.value;
    const selected = this.state.selected();

    if (selected) {
      this.state.edit({ idProduct: selected.idProduct, name: name!, price: price! });
    } else {
      this.state.create({ name: name!, price: price! });
    }
  }

  onCancel(): void {
    this.state.clearSelected();
    this.form.reset();
  }
}
