import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appCommaSeparatedInput]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommaSeparatedInputDirective),
      multi: true,
    },
  ],
})
export class CommaSeparatedInputDirective implements ControlValueAccessor {
  private innerValue: string | null = '';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event.target.value']) onInput(value: string | null): void {
    if (value !== null) {
      // Remove non-numeric and non-decimal characters
      const numericValue = value.replace(/[^0-9.]/g, '');
      const parts = numericValue.split('.');

      // Format the integer part with a thousands separator (comma)
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      // Allow only one decimal point and two decimal places
      if (parts.length > 1) {
        parts[1] = parts[1].slice(0, 2); // Allow only two decimal places
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
