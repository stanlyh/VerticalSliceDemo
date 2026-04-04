import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  imports: [ReactiveFormsModule],
  template: `
    <div style="display:flex;flex-direction:column;gap:0.375rem">
      <label style="font-size:0.7rem;font-weight:600;text-transform:uppercase;
                    letter-spacing:0.05em;color:#64748b">
        {{ label() }}
        @if (required()) {
          <span style="color:#ef4444;margin-left:0.125rem">*</span>
        }
      </label>
      <ng-content />
      @if (control() && control()!.invalid && control()!.touched) {
        <p style="font-size:0.75rem;color:#ef4444;display:flex;align-items:center;
                  gap:0.25rem;margin:0.125rem 0 0">
          <svg style="width:0.875rem;height:0.875rem;flex-shrink:0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ errorMessage() }}
        </p>
      }
    </div>
  `
})
export class FormFieldComponent {
  readonly label    = input.required<string>();
  readonly control  = input<AbstractControl | null>(null);
  readonly required = input<boolean>(false);

  errorMessage(): string {
    const ctrl = this.control();
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required'])       return 'Este campo es obligatorio.';
    if (ctrl.errors['minlength'])      return `Mínimo ${ctrl.errors['minlength'].requiredLength} caracteres.`;
    if (ctrl.errors['maxlength'])      return `Máximo ${ctrl.errors['maxlength'].requiredLength} caracteres.`;
    if (ctrl.errors['email'])          return 'Ingresa un correo electrónico válido.';
    if (ctrl.errors['positiveNumber']) return 'El valor debe ser mayor a 0.';
    if (ctrl.errors['phoneFormat'])    return 'Formato de teléfono inválido (ej: +54 9 11 1234-5678).';
    return 'Valor inválido.';
  }
}
