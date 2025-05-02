
export class DailyExchangeRateSetup{
  date	!: string;
  baseCurrency	!: string;
  rates !: Rates[];

  constructor(obj?:any){
    this.date = obj && obj.date || "";
    this.baseCurrency = obj && obj.baseCurrency || "";
    this.rates =  obj && obj.rates || new Rates();
  }
}

export class Rates{
  CCYCODE	!: string;
  EXCHRATE !: string;

  constructor(obj?:any){
     this.CCYCODE = obj && obj.CCYCODE || "";
     this.EXCHRATE = obj && obj.EXCHRATE || "";
  }
}

export class PostExchangeRateSetup{
  rates !: ExchangeRates[];

  constructor(obj?:any){
    this.rates =  obj && obj.rates || new ExchangeRates();
  }
}

export class ExchangeRates{
  currencyCode !: string;
  rate !: string;

  constructor(obj?:any){
    this.currencyCode = obj && obj.currencyCode || "";
    this.rate = obj && obj.rate || "";
  }
}