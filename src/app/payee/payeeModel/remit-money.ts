

export class RemitMoney {
    customerType !: string
    payeeId  !: string
    sendAmount  !: string
    sendCurrencyCode !: string
    orgExchRate !: string
    remarks !: string
    isMocked !: Boolean;
    sendAmountF !: string ;
    amountEnteredIndicator !: string ;
    forexBookingType !: string ; //either D(Without contract) or C (With contract)
    sharingType !: string ;


    constructor(obj?: any) {
        this.customerType = obj && obj.customerType || "";
        this.payeeId = obj && obj.payeeId || "";
        this.sendAmount = obj && obj.sendAmount || "";
        this.sendCurrencyCode = obj && obj.sendCurrencyCode || "";
        this.orgExchRate = obj && obj.orgExchRate || "";
        this.remarks = obj && obj.remarks || "";
        this.isMocked = obj && obj.isMocked || "";
        this.sendAmountF = obj && obj.sendAmountF || "" ;
        this.amountEnteredIndicator = obj && obj.amountEnteredIndicator || "" ;
        this.forexBookingType = obj && obj.forexBookingType || "" ;
        this.sharingType = obj && obj.sharingType || "" ;
    }
}
export class PayeeList {
    data !: List[];

    constructor(obj?: any) {
        this.data = obj && obj.data || new List();
    }
}

export class List {
    CUSTOMERID!: string;
    PAYEEID!: string;
    STATUS!: string;
    NAME!: string;
    ADDRESS!: string;
    PHONENBR!: string;
    EMAILID!: string;
    BANKNAME!: string;
    BRANCHNAME!: string;
    ACCOUNTNBR!: string;
    SWIFTCODE!: string;
    STATE!: string;
    COUNTRY!: string;

    constructor(obj?: any) {
        this.CUSTOMERID = obj && obj.CUSTOMERID || "";
        this.PAYEEID = obj && obj.PAYEEID || "";
        this.STATUS = obj && obj.STATUS || "";
        this.NAME = obj && obj.NAME || "";
        this.ADDRESS = obj && obj.ADDRESS || "";
        this.PHONENBR = obj && obj.PHONENBR || "";
        this.EMAILID = obj && obj.EMAILID || "";
        this.BANKNAME = obj && obj.BANKNAME || "";
        this.BRANCHNAME = obj && obj.BRANCHNAME || "";
        this.ACCOUNTNBR = obj && obj.ACCOUNTNBR || "";
        this.SWIFTCODE = obj && obj.SWIFTCODE || "";
        this.STATE = obj && obj.STATE || "";
        this.COUNTRY = obj && obj.COUNTRY || "";
    }
}

