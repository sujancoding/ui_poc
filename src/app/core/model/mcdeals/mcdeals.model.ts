

export class NewDealMoneyChanger{
    customerId !: string;
    customerType !: string;
    associateId !: string ;
    dealItems !: DealItemsMoneyChanger[] ;
    constructor(obj?:any){
        this.customerId = obj && obj.customerId || "" ;
        this.customerType = obj && obj.customerType || "" ;
        this.associateId = obj && obj.associateId || "" ;
        this.dealItems = obj && obj.dealItems || new DealItemsMoneyChanger() ;
    }
}

export class DealItemsMoneyChanger {
    buySellInd !: string ;
    ccyNo !: string;
    ccyCode !: string ;
    amountF !: string;
    exchangeRate !: string ;
    valueDate !: string;
    remarks !: string ;

    constructor(obj?:any){
        this.buySellInd = obj && obj.buySellInd || "" ;
        this.ccyNo = obj && obj.ccyNo || "" ;
        this.ccyCode = obj && obj.ccyCode || "" ;
        this.amountF = obj && obj.amountF || "" ;
        this.exchangeRate = obj && obj.exchangeRate || "" ;
        this.valueDate = obj && obj.valueDate || "" ;
        this.remarks = obj && obj.remarks || "" ;
    }

}

//UPDATE DEAL REQ PAYLOAD 
export class UpdateDealMc{
    customerId !: string ;
    customerType !: string ;
    dealItems !: UpdateDealItems[] ;
    constructor(obj?:any){
        this.customerId = obj && obj.customerId || "" ;
        this.customerType = obj && obj.customerType || "" ;
        this.dealItems = obj && obj.dealItems || new UpdateDealItems() ;
    }
}

export class UpdateDealItems {
    dealItemId !: string ;
    buySellInd !: string ;
    status !: string ;
    ccyNo !: string ;
    ccyCode !: string ;
    amountF !: string ;
    exchangeRate !: string ;
    valueDate !: string ;
    remarks !: string ;
    constructor(obj?:any){
        this.dealItemId = obj && obj.dealItemId || "" ;
        this.buySellInd = obj && obj.buySellInd || "" ;
        this.status = obj && obj.status || "" ;
        this.ccyNo = obj && obj.ccyNo || "" ;
        this.ccyCode = obj && obj.ccyCode || "" ;
        this.amountF = obj && obj.amountF || "" ;
        this.exchangeRate = obj && obj.exchangeRate || "" ;
        this.valueDate = obj && obj.valueDate || "" ;
        this.remarks = obj && obj.remarks || "" ;
    }

}

export class MultipleDealCancel {
    dealItems !: DealItems[] ;

    constructor(obj?:any){
     this.dealItems = obj && obj.dealItems || null ;
    }
}


export class DealItems {
    dealItemId !: string ;

    constructor(obj?:any){
        this.dealItemId = obj && obj.dealItemId || "" ;
    }
}
// {
//     "customerId": "C7e310fd42b",
//     "customerType": "C",
//     "valueDate": "2023-12-25",
//     "dealItems": [
//         {
//             "buySellInd": "B",
//             "ccyNo": "1C",
//             "ccyCode": "MYR",
//             "amountF": "303.03",
//             "exchangeRate": "0.033"
//         }
//     ]
// }

// {
//     "customerId": "I708755b278",
//     "customerType": "I",
//     "dealItems": [
//       {
//         "buySellInd": "S",
//         "ccyNo": "23",
//         "ccyCode": "EUR",
//         "amountF": "1000",
//         "exchangeRate": "1.43",
//         "valueDate": "2023-12-31",
//         "remarks": "test"
//       },
//       {
//         "buySellInd": "B",
//         "ccyNo": "1E",
//         "ccyCode": "USD",
//         "amountF": "1000",
//         "exchangeRate": "1.36",
//         "valueDate": "2023-12-31",
//         "remarks": "test"
//       },
//       {
//         "buySellInd": "B",
//         "ccyNo": "2L",
//         "ccyCode": "SGD",
//         "amountF": "70",
//         "exchangeRate": "1",
//         "valueDate": "2023-12-31",
//         "remarks": "tally"
//       }
//     ]
//   }