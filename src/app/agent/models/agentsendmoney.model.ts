export class AgentSendMoney {
    customerType !:string ;
    payeeId !:string;
    sendAmount !:string ;
    sendAmountF !: any ;  //newly added element on 15 Nov 2023 --> Backend collects FCY amount also .
    remarks !:string ;
    contracts !: Deal[];
    isMocked !: string ;
    sendCurrencyCode !: string ;
    originatedRemitter !: string ;
    purposeOfRemittance !: string ;
    forexBookingType !: string ; 
    sharingType !: string ;

    constructor(obj?:any){
      this.customerType = obj && obj.customerType || "";
      this.payeeId = obj && obj.payeeId || "";
      this.sendAmount = obj && obj.sendAmount || "";
      this.sendAmountF = obj && obj.sendAmountF || "" ; //newly added element on 15 Nov 2023 --> Backend collects FCY amount also .
      this.remarks = obj && obj.remarks || "";
      this.contracts = obj && obj.contracts || new Deal();
      this.isMocked = obj && obj.isMocked || "";
      this.sendCurrencyCode = obj && obj.sendCurrencyCode || "" ;
      this.originatedRemitter = obj && obj.originatedRemitter || "" ;
      this.purposeOfRemittance = obj && obj.purposeOfRemittance || "" ;
      this.forexBookingType = obj && obj.forexBookingType || "" ;
      this.sharingType = obj && obj.sharingType || "" ;
    }
}

export class Deal{
    id !: string;
    amount !: string;
    amountF !: string ;  //amountF --> corresponding FCY amount stored .
    constructor(obj?:any){
     this.id = obj && obj.id || "";
     this.amount = obj && obj.amount || "";
     this.amountF = obj && obj.amountF || "" ; //amountF --> corresponding FCY amount stored .
    }
}