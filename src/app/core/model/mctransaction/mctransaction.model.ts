
export class AddTransactionMoneyChanger{
    customerId !: string;
    associateId !: string ;
    suspicious !: string ;
    transactionItems !: TransactionItems[] ;

    constructor(obj?:any){
     this.customerId = obj && obj.customerId || "" ;
     this.associateId = obj && obj.associateId || "" ;
     this.suspicious = obj && obj.suspicious || "" ;
     this.transactionItems = obj && obj.transactionItems || new TransactionItems() ;
    }
}

export class TransactionItems{
    dealItemId !: string;
    buySellInd !: string;
    ccyNo !: string;
    amountF !: string;
    tallyFlag !: string;
    exchRate !: string ;
    remarks !: string ;

    constructor(obj?:any){
        this.dealItemId = obj && obj.dealItemId || "" ;
        this.buySellInd = obj && obj.buySellInd || "" ;
        this.ccyNo = obj && obj.ccyNo || "" ;
        this.amountF = obj && obj.amountF || "" ;
        this.tallyFlag = obj && obj.tallyFlag || "" ;
        this.exchRate = obj && obj.exchRate || "";
        this.remarks = obj && obj.remarks || "" ;

    }
}


//    {
//     "customerId": "C7e310fd42b",
//     "transactionItems": [
//         {
//             "dealItemId" : "37170296549101",
//             "buySellInd": "B",
//             "ccyNo": "1C",
//             "amountF": "303.03",
//             "tallyFlag": ""
//         }
//     ]
// }