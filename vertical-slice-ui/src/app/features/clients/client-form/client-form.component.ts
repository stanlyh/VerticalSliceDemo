import { Component, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClientsState } from '../clients.state';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

      <!-- Name -->
      <app-form-field label="Nombre" [control]="form.get('name')" [required]="true">
        <input
          formControlName="name"
          type="text"
          placeholder="Ej: Juan García"
          class="w-full px-3 py-2 border rounded-lg text-sm transition-colors
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-red-500]="form.get('name')?.invalid && form.get('name')?.touched"
          [class.border-gray-300]="!(form.get('name')?.invalid && form.get('name')?.touched)" />
      </app-form-field>

      <!-- Email -->
      <app-form-field label="Correo electrónico" [control]="form.get('email')" [required]="true">
        <input
          formControlName="email"
          type="email"
          placeholder="Ej: juan@empresa.com"
          class="w-full px-3 py-2 border rounded-lg text-sm transition-colors
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          [class.border-red-500]="form.get('email')?.invalid && form.get('email')?.touched"
          [class.border-gray-300]="!(form.get('email')?.invalid && form.get('email')?.touched)" />
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
          {{ state.selected() ? 'Guardar cambios' : 'Crear cliente' }}
        </button>
      </div>
    </form>
  `
})
export class ClientFormComponent {
  readonly state = inject(ClientsState);
  private fb     = inject(FormBuilder);

  form = this.fb.group({
    name:  ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor() {
    effect(() => {
      const selected = this.state.selected();
      if (selected) {
        this.form.patchValue({ name: selected.name, email: selected.email });
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

    const { name, email } = this.form.value;
    const selected = this.state.selected();

    if (selected) {
      this.state.edit({ idClient: selected.idClient, name: name!, email: email! });
    } else {
      this.state.create({ name: name!, email: email! });
    }
  }

  onCancel(): void {
    this.state.clearSelected();
    this.form.reset();
  }
}
