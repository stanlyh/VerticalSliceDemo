import { Component, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProvidersState } from '../providers.state';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { phoneFormat } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'app-provider-form',
  imports: [ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

      <!-- Name -->
      <app-form-field label="Nombre" [control]="form.get('name')" [required]="true">
        <input
          formControlName="name"
          type="text"
          placeholder="Ej: Distribuidora Norte S.A."
          class="w-full px-3 py-2 border rounded-lg text-sm transition-colors
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-red-500]="form.get('name')?.invalid && form.get('name')?.touched"
          [class.border-gray-300]="!(form.get('name')?.invalid && form.get('name')?.touched)" />
      </app-form-field>

      <!-- Phone -->
      <app-form-field label="Teléfono" [control]="form.get('phone')" [required]="true">
        <input
          formControlName="phone"
          type="tel"
          placeholder="Ej: +54 9 11 1234-5678"
          class="w-full px-3 py-2 border rounded-lg text-sm transition-colors
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-red-500]="form.get('phone')?.invalid && form.get('phone')?.touched"
          [class.border-gray-300]="!(form.get('phone')?.invalid && form.get('phone')?.touched)" />
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
          {{ state.selected() ? 'Guardar cambios' : 'Crear proveedor' }}
        </button>
      </div>
    </form>
  `
})
export class ProviderFormComponent {
  readonly state = inject(ProvidersState);
  private fb     = inject(FormBuilder);

  form = this.fb.group({
    name:  ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, phoneFormat()]]
  });

  constructor() {
    effect(() => {
      const selected = this.state.selected();
      if (selected) {
        this.form.patchValue({ name: selected.name, phone: selected.phone });
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

    const { name, phone } = this.form.value;
    const selected = this.state.selected();

    if (selected) {
      this.state.edit({ idProvider: selected.idProvider, name: name!, phone: phone! });
    } else {
      this.state.create({ name: name!, phone: phone! });
    }
  }

  onCancel(): void {
    this.state.clearSelected();
    this.form.reset();
  }
}
