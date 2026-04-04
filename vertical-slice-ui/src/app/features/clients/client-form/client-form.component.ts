import { Component, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClientsState } from '../clients.state';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

const INPUT_STYLE = `width:100%;padding:0.5rem 0.75rem;border-radius:0.5rem;font-size:0.875rem;
  background:#0a1128;color:#e2e8f0;border:1px solid rgba(255,255,255,0.12);
  outline:none;transition:border-color 0.15s;box-sizing:border-box`;

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex;flex-direction:column;gap:1rem">

      <app-form-field label="Nombre" [control]="form.get('name')" [required]="true">
        <input formControlName="name" type="text" placeholder="Ej: Juan García" [style]="inputStyle"
          onfocus="this.style.borderColor='rgba(6,214,160,0.5)'"
          onblur="this.style.borderColor='rgba(255,255,255,0.12)'" />
      </app-form-field>

      <app-form-field label="Correo electrónico" [control]="form.get('email')" [required]="true">
        <input formControlName="email" type="email" placeholder="Ej: juan@empresa.com" [style]="inputStyle"
          onfocus="this.style.borderColor='rgba(6,214,160,0.5)'"
          onblur="this.style.borderColor='rgba(255,255,255,0.12)'" />
      </app-form-field>

      <div style="display:flex;gap:0.75rem;justify-content:flex-end;padding-top:0.5rem">
        <button type="button" (click)="onCancel()"
          style="padding:0.5rem 1rem;font-size:0.875rem;font-weight:500;border-radius:0.5rem;
                 cursor:pointer;color:#94a3b8;background:rgba(255,255,255,0.04);
                 border:1px solid rgba(255,255,255,0.08);transition:background 0.15s"
          onmouseenter="this.style.background='rgba(255,255,255,0.08)'"
          onmouseleave="this.style.background='rgba(255,255,255,0.04)'">
          Cancelar
        </button>
        <button type="submit" [disabled]="form.invalid || state.loading()"
          style="padding:0.5rem 1rem;font-size:0.875rem;font-weight:600;border-radius:0.5rem;
                 cursor:pointer;background:rgba(6,214,160,0.15);color:#06d6a0;
                 border:1px solid rgba(6,214,160,0.3);transition:background 0.15s"
          onmouseenter="this.style.background='rgba(6,214,160,0.25)'"
          onmouseleave="this.style.background='rgba(6,214,160,0.15)'">
          {{ state.selected() ? 'Guardar cambios' : 'Crear cliente' }}
        </button>
      </div>
    </form>
  `
})
export class ClientFormComponent {
  readonly state  = inject(ClientsState);
  readonly inputStyle = INPUT_STYLE;
  private fb      = inject(FormBuilder);

  form = this.fb.group({
    name:  ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor() {
    effect(() => {
      const s = this.state.selected();
      if (s) this.form.patchValue({ name: s.name, email: s.email });
      else this.form.reset();
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, email } = this.form.value;
    const s = this.state.selected();
    if (s) this.state.edit({ idClient: s.idClient, name: name!, email: email! });
    else this.state.create({ name: name!, email: email! });
  }

  onCancel(): void { this.state.clearSelected(); this.form.reset(); }
}
