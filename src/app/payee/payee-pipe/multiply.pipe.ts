import { Pipe, PipeTransform } from '@angular/core';
import { round } from 'lodash';

@Pipe({
  name: 'multiply'
})
export class ExchangeRatePipe implements PipeTransform {
  
  transform(value: number, rate:any): any {
    //SGD * EXCHANGE RATE (3.07)  => MYR
    return (value * rate).toFixed(2);
  }
}
  @Pipe({
    name: 'divide'
  })
  export class ReverseExchangeRatePipe implements PipeTransform {
   
    transform(value: number, rate:any): any {
      return (value / rate).toFixed(2);
    }
}
