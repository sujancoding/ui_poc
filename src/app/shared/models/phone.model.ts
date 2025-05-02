import { AbstractControl, ValidationErrors } from "@angular/forms";

export class Phone {
    phoneType!: string;
    phoneNumber!: string;
    phoneCountryCode!: string;

    constructor(phoneType: string, phoneNumber: string, phoneCountryCode: string) {
        this.phoneType = phoneType;
        this.phoneNumber = phoneNumber;
        this.phoneCountryCode = phoneCountryCode;
    }

}

export function noWhitespaceValidator(control: AbstractControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? {'whitespace': true} : null;
  }

  export function removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }
  export function whitespaceValidator(control: AbstractControl) {
    const value = control.value;
  
    if (value && value.match("^[ .]+")) {
      // if the value consists of whitespace or fullstop at beginning of string , return an error object
      return { "isWhitespace": true };
    }
    // otherwise, return null (no error)
    return null;
    
  }
  export function nricIdValidator(control: AbstractControl) {
      const pattern = /^[SFTG]\d{7}[A-Z]$/;
      const isValid = pattern.test(control.value);
      if (!isValid && control.value != "") { // To validate NRIC id pattern
       
        return { 'validNRIC': true };
      }
      
      return null;
  }

 export function postalNumberValidator(control: AbstractControl){
    const value = control.value;
    const startsWithNum = /^[0-9]/.test(value)
    if (value && startsWithNum && value.length < 6) { // Postal code start with number and the length is less than 6 , return a error object
      console.log("The postal code value is" + value);
      
      return { "minLength": true };
      
      
    }
    // otherwise, return null (no error)
    return null;
    
  }

  //No whitespace allowed before and after a word
  export function noWhitespace(control: AbstractControl): ValidationErrors | null {
    if (control.value && /^\s|\s$/.test(control.value)) {
      return { 'whitespace': true };
    }
    return null;
  }
