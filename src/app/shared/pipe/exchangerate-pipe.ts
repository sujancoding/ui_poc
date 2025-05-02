import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'forward'
  })
  export class ExchangeRateForward implements PipeTransform {
    
    transform(value: number, rate:any): number {
      //SGD * EXCHANGE RATE (3.07)  => MYR
      return value * rate;
    }
  }
    @Pipe({
      name: 'reverse'
    })
    export class ExchangeRateReverse implements PipeTransform {
     
      transform(value: number, rate:any): number {
        return value / rate;
      }
  }