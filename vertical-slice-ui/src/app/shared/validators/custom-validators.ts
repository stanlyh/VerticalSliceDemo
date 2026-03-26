import { AbstractControl, ValidatorFn } from '@angular/forms';

export function positiveNumber(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = Number(control.value);
    if (control.value === null || control.value === '') return null;
    return value > 0 ? null : { positiveNumber: true };
  };
}

export function phoneFormat(): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const valid = /^\+?[\d\s\-]{7,15}$/.test(control.value);
    return valid ? null : { phoneFormat: true };
  };
}
