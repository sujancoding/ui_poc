import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appendZero]'
})
export class AppendZeroDirective {
  
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) 
  onInput(event: Event) {
    let inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // If the first character is a dot (.), prepend '0'
    if (value.startsWith('.')) {
      inputElement.value = '0' + value;
    }
  }
}
