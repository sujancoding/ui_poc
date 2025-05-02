export class FxRatePricing {
    entityId!:string;
    entityName !:string;
    ccyPair !:string; 
    txnAmount !:string;
    dealtSide !:string ;
    txnCcy !: string ;
    tenor !:string ;
   startDate !:string ;
   endDate !:string ;
    constructor(obj?:any){
     this.entityId = obj && obj.entityId || "";
     this.entityName = obj && obj.entityName || "";
     this. ccyPair = obj && obj.ccyPair || "";
     this. txnAmount = obj && obj.txnAmount || "";
     this. dealtSide = obj && obj.dealtSide || "";
     this. txnCcy = obj && obj.txnCcy || "";
     this. tenor = obj && obj.tenor  || "";
    this.startDate = obj && obj.startDate || "" ;
    this.endDate = obj && obj.endDate || "" ;
}
}
export class BookContract{
    pricingId!:string;
    constructor(obj?:any){
        this.pricingId = obj && obj.pricingId || "";
    }
}

export class ReqSchema {
    
    // "{
    //     "entityId" : "A31001",
    //     "entityName"" :"AMEERSULTAN",
    //     "ccyPair" : "USDSGD",
    //     "txnAmount"" :"30",
    //     "dealtSide"" :"SELL",
    //     "txnCcy"" : "SGD",
    //     "tenor"" :"TODAY",
    //     "startDate"": "",
    //     "endDate"": ""
    // }"
    
    
}

export class ResponseSchema {
    "rate": 0.314 ;
    "pricingId": "202302312999" ;
    "ccyPair": "SGDJPY" ;
    "txnCcy": "SGD" ;
    "txnAmount": "100" ;
    "dealtSide": "SELL" ;
}