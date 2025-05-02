import { AbstractControl, ValidatorFn } from '@angular/forms';

//This function will not allow inputs that start with the digit '0' and will return a validation error if it detects such an input.
export function forbiddenNumberValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = control.value != null && control.value.toString().startsWith('0');
    return forbidden ? {'forbiddenNumber': {value: control.value}} : null;
  };
}