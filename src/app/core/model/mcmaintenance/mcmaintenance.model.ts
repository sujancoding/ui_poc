export class AddCounter{
    counterId !: string ;
    counterType !: string ;
    counterIp !: string;
    constructor(obj?:any){
      this.counterId = obj && obj.counterId || "";
      this.counterType = obj && obj.counterType || "";
      this.counterIp = obj && obj.counterIp || "";
    }
}

export class UpdateCounter{
    counterType !: string ;
    counterIp !: string;
    constructor(obj?:any){
      this.counterType = obj && obj.counterType || "";
      this.counterIp = obj && obj.counterIp || "";
    }
}

export class AddCurrency{
    currencyNo !: string ;
    currencyCode !: string ;
    currencyName !: string ;
    variancePercentage !: string;
    varianceRate !: string ;
    // added Units 
    units !: string ;
   // major !: string ;
   // minor !: string ;
    constructor(obj?:any){
        this.currencyNo = obj && obj.currencyNo || "" ;
        this.currencyCode = obj && obj.currencyCode || "" ;
        this.currencyName = obj && obj.currencyName || "" ;
        this.variancePercentage = obj && obj.variancePercentage || "" ;
        this.varianceRate = obj && obj.varianceRate || "" ;
        // added Units 
        this.units = obj && obj.units || "" ;
       // this.major = obj && obj.major || "" ;
       // this.minor = obj && obj.minor || "" ;
    }
}

export class UpdateCurrency{
    currencyCode !: string ;
    currencyName !: string ;
    variancePercentage !: string;
    varianceRate !: string ;
    // added Units 
    units!:string;
  //  major !: string ;
   // minor !: string ;
    constructor(obj?:any){
        this.currencyCode = obj && obj.currencyCode || "" ;
        this.currencyName = obj && obj.currencyName || "" ;
        this.variancePercentage = obj && obj.variancePercentage || "" ;
        this.varianceRate = obj && obj.varianceRate || "" ;
        // added Units 
        this.units = obj && obj.units || "" ;
      //  this.major = obj && obj.major || "" ;
       // this.minor = obj && obj.minor || "" ;
    }
}

export class UpdateInventory{
    counter !: string ;
    currentStock !: string ;
    dealStock !: string ;
    avgCost !: string ;
    constructor(obj?:any){
     this.counter = obj && obj.counter || 0 ;
     this.currentStock = obj && obj.currentStock || 0 ;
     this.dealStock = obj && obj.dealStock || 0 ;
     this.avgCost = obj && obj.avgCost || 0 ;
    }
}

export class UpdateCurrencyValue {
  currencyNo !: string ;
  activeCurrencyValue !: ActiveCurrencyValue[] ;
  inActiveCurrencyValue !: InActiveCurrencyValue[] ;

  constructor(obj?:any){
   this.currencyNo = obj && obj.currencyNo || "" ;
   this.activeCurrencyValue = obj && obj.activeCurrencyValue || [] ;
   this.inActiveCurrencyValue = obj && obj.inActiveCurrencyValue || [];

  }
}

export class ActiveCurrencyValue{
  ccyValue !: number ;
  constructor(obj?:any){
    this.ccyValue = obj && obj.ccyValue || 0 ;
  }
}

export class InActiveCurrencyValue{
  ccyValue !: number ;
  constructor(obj?:any){
    this.ccyValue = obj && obj.ccyValue || 0 ;
  }
}



// {
//   "currencyNo": "1",
//   "activeCurrencyValue": [
//     {
//       "ccyValue": "100"
//     },
//     {
//       "ccyValue": "200"
//     }
//   ],
//   "inActiveCurrencyValue": [
//     {
//       "ccyValue": "400"
//           },
//     {
//       "ccyValue": "500"
//           }
//   ]
// }



//Add counter
// "{
//     ""counterId"": ""2A"",
//     ""counterType"": ""R"" or ""W"",
//     ""counterIp"": ""159.170.0.100""
// }"

//Update counter
// {
//     "counterType": "R" or "W",
//     "counterIp": "159.170.0.100"
// }

//Add currency 
// {
//     "currencyNo": "1B",
//     "currencyCode": "USD",
//     "currencyName": "SINGAPORE DOLLAR",
//     "major": "DOLLAR",
//     "minor": "CENTS"
// }

//Update currency 
// {
//     "currencyCode":"NZD",
//     "currencyName":"NEW ZEALAND DOLLAR",
//     "major": "DOLLAR",
//     "minor": "CENTS"
// }



// {
//   "counter": "W",
//   "currentStock": 10000000.00,
//   "dealStock": 10000000.00,
//   "avgCost": 0.033105
// }