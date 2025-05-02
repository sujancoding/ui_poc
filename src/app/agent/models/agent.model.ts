export class AgentRemittance{
    txnId!: string;
    txnOn!: string;
    sender!: string;
    payeeAccountNo!: string;
    payeeName!:string;
    bankName!: string;
    swiftCode!: string;
    amount!: string;
    currency!: string;
    exchRate!: string;
    dealId!: string;
    status!: string;

    constructor(obj?:any){
       
        this.txnId = obj && obj.txnId || "";
        this.txnOn = obj && obj.txnOn || "";
        this.sender = obj && obj.sender || "" ;
        this.payeeAccountNo = obj && obj.payeeAccountNo || "" ;
        this.payeeName = obj && obj.payeeName || "" ;
        this.bankName = obj && obj.bankName || "" ;
        this.swiftCode = obj && obj.swiftCode || "" ;
        this.amount = obj && obj.amount || "";
        this.currency = obj && obj.currency || "";
        this.exchRate = obj && obj.exchRate || "";
        this.dealId = obj && obj.dealId || "";
        this.status = obj && obj.status || "";
    }
}

export class OrganizationRemittance{
    txnId!: string;
    txnOn!: string;
    sender!: string;
    payeeAccountNo!: string;
    payeeName!:string;
    bankName!: string;
    swiftCode!: string;
    amount!: string;
    currency!: string;
    exchRate!: string;
    dealId!: string;
    status!: string;

    constructor(obj?:any){
       
        this.txnId = obj && obj.txnId || "";
        this.txnOn = obj && obj.txnOn || "";
        this.sender = obj && obj.sender || "" ;
        this.payeeAccountNo = obj && obj.payeeAccountNo || "" ;
        this.payeeName = obj && obj.payeeName || "" ;
        this.bankName = obj && obj.bankName || "" ;
        this.swiftCode = obj && obj.swiftCode || "" ;
        this.amount = obj && obj.amount || "";
        this.currency = obj && obj.currency || "";
        this.exchRate = obj && obj.exchRate || "";
        this.dealId = obj && obj.dealId || "";
        this.status = obj && obj.status || "";
    }
}

export class Payee {
    payeeID!: string;
    payeeName!: string;
    accountNumber!: string;
    payeeAddress!: string;
    bankInfo!: string;

    constructor(obj?:any){
        this.payeeID = obj && obj.payeeID || "";
        this.payeeName = obj && obj.payeeName || "";
        this.accountNumber = obj && obj.accountNumber || "";
        this.payeeAddress = obj && obj.payeeAddress || "";
        this.bankInfo = obj && obj.bankInfo || "";

    }
}

export class RetrieveTransactionInquiry{
    data !: Data[] ;
}

export class Data{
    TRANSACTIONID !: string ;
    DEALID !: string ;
    CONTRACTID !: string ;
    AMOUNT !: string ;
    CREATEDBY !: string ;
    CREATEDTIME !: string ;
}

