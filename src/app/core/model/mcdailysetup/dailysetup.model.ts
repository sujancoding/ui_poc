// {
//     "rates": [
//         {
//             "currencyCode": "USD",
//             "buyRate": "1.3410",
//             "sellRate": "1.3470"
//         }
//     ]
// }

export class MoneyChangerUpsertRate{
    rates !: MoneyChangerRates[] ;
    constructor(obj?:any){
        this.rates = obj && obj.rates || new MoneyChangerRates() ;
       }
}

export class MoneyChangerRates{
    ccyNo !: string;
    currencyCode !: string ;
    buyRate !: string ;
    sellRate !: string ;
    systemConventionBuyRate !: string ;
    systemConventionSellRate !: string ;
    displayOrder !: string; 
    todaysOffer !: string ;
    constructor(obj?:any){
     this.ccyNo = obj && obj.ccyNo || "" ;
     this.currencyCode = obj && obj.currencyCode || "" ;
     this.buyRate = obj && obj.buyRate || "" ;
     this.sellRate = obj && obj.sellRate || "" ;
     this.systemConventionBuyRate = obj && obj.systemConventionBuyRate || "" ;
     this.systemConventionSellRate = obj && obj.systemConventionSellRate || "" ;
     this.displayOrder = obj && obj.displayOrder || "" ;
     this.todaysOffer =  obj && obj.todaysOffer || "" ;
    }
}

export class NoteUpdateRq {
    note !: string ;
    constructor(obj?:any){
        this.note = obj && obj.note || "" ;
    }
}

// {
//     "rates": [
//         {
//             "currencyCode": "AUD",
//             "buyRate": "0.25",
//             "sellRate": "0.56",
//             "isTodaysOffer" : "true"
//         }
//     ]
// }

// {
//     "date": "2024-04-24T21:26:26.020321673",
//     "baseCurrency": "SGD",
//     "rates": [
//         {
//             "CCYCODE": "AUD",
//             "BUYRATE": 0.250000,
//             "SELLRATE": 0.560000,
//             "UNIT":"MYR50s"
//             "TODAYSOFFER": "true",
//             "UPDATEDBY": "USER",
//             "UPDATEDDATE": "2024-04-24T13:26:18"
//         }
//     ]
// }





