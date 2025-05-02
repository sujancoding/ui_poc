import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appCommaSeparatedRateInput]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommaSeparatedRateInputDirective),
      multi: true,
    },
  ],
})
export class CommaSeparatedRateInputDirective implements ControlValueAccessor {
  private innerValue: string | null = '';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event.target.value']) onInput(value: string | null): void {
    if (value !== null) {
      // Remove non-numeric and non-decimal characters
      const numericValue = value.replace(/[^0-9.]/g, '');
      const parts = numericValue.split('.');

      // Format the integer part with a thousands separator (comma)
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

       // Allow only one decimal point and 5 decimal places before decimal
       if (parts.length >= 1) {
        parts[0] = parts[0].slice(0, 6); // Allow only 5 decimal places
      }

      const formattedValue = parts.join('.');
      this.innerValue = formattedValue;
      this.onChange(formattedValue);
      this.el.nativeElement.value = formattedValue;
    } else {
      this.innerValue = null;
      this.onChange(null);
      this.el.nativeElement.value = '';
    }
  }

  // Implement ControlValueAccessor methods
  writeValue(value: any): void {
    if (value !== null) {
      this.el.nativeElement.value = value;
      this.innerValue = value;
    } else {
      this.el.nativeElement.value = '';
      this.innerValue = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};
}