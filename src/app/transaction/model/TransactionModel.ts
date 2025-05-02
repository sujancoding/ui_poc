export class ValidateCurrencyCode {
    boolean !: Boolean;
    country !: string;
    constructor(obj?: any) {
        this.boolean = obj && obj.boolean || "";
        this.country = obj && obj.country || "";
    }
}




export class Agent {
    id!: number;
    agentId!: string
    name!: string;
    status!: string;
    mobileNumber!: string;
    country?: string;
    actions?: Boolean;

    constructor(obj?: any) {

        this.agentId = obj && obj.agentId || "";
        this.name = obj && obj.name || "";
        this.status = obj && obj.status || "";
        this.mobileNumber = obj && obj.mobileNumber || "";
        this.country = obj && obj.country || "";
        this.actions = obj && obj.actions || "";
    }
}

export class AgentSettlement {
    accountDetails!: AccountDetails[];
}

export class AccountDetails {
    agentId !: string;
    accountName  !: string;
    accounttNo  !: string;
    credit !: number;
    debit  !: number;
    constructor(obj?: any) {
        this.agentId = obj && obj.agentId || "";
        this.accountName = obj && obj.accountName || "";
        this.accounttNo = obj && obj.accounttNo || "";
        this.credit = obj && obj.credit || "";
        this.debit = obj && obj.debit || "";
    }
}

export class NewSettlement {

    amount !: string;
    mode !: string ; // collection 'C' or Payout 'P'
    remarks !: string;// added remarks for post agent settelment

    constructor(obj?: any) {
        this.amount = obj && obj.amount || "";
        this.mode = obj && obj.mode || "";
        this.remarks = obj && obj.remarks || "";// added remarks for post agent settelment
    }
}

export class AgentSettlementHistory {
    data !: Data[];
}
export class Data {
    SETTLEMENTID !: string;
    AGENTID !: string;
    AGENTNAME !: string;
    AGENTACCTNUMBER !: string;
    AMOUNTSETTLED !: number;
    CHANNEL !: string;
    SETTLEDBY !: string;
    CREATEDDATE !: string;

    constructor(obj?:any){
        this.SETTLEMENTID = obj && obj.SETTLEMENTID || "";
        this.AGENTID =  obj && obj.AGENTID || "";
        this.AGENTNAME = obj && obj.AGENTNAME || "";
        this.AGENTACCTNUMBER = obj && obj.AGENTACCTNUMBER || "";
        this.AMOUNTSETTLED = obj && obj.AMOUNTSETTLED || "";
        this.CHANNEL = obj && obj.CHANNEL || "";
        this.SETTLEDBY = obj && obj.SETTLEDBY || "";
        this.CREATEDDATE = obj && obj.CREATEDDATE || "";
    }
}


export class SelectDeal {
    dealId!: string
    dealOn!: string;
    dealBalance!: string;
    rate!: string;
    amountToUse!: string;

    constructor(obj?: any) {

        this.dealId = obj && obj.dealId || "";
        this.dealOn = obj && obj.dealOn || "";
        this.dealBalance = obj && obj.dealBalance || "";
        this.rate = obj && obj.rate || "";
        this.amountToUse = obj && obj.amountToUse || "";
    }
}

export class AgentTable {
    txnId!: string
    customer!: string;
    amountRemitted!: string;
    txnDate!: string;
    checked?: boolean;
    view?: Boolean;

    constructor(obj?: any) {

        this.txnId = obj && obj.txnId || "";
        this.customer = obj && obj.customer || "";
        this.amountRemitted = obj && obj.amountRemitted || "";
        this.txnDate = obj && obj.txnDate || "";
        this.view = obj && obj.view || "";
        this.checked = obj && obj.checked || "";
    }
}

export class ResetAccountDetails {
    outStandingBalance !: number;
    openingBalance  !: number;
    credit !: number;
    debit  !: number;
    constructor(obj?: any) {
        this.outStandingBalance = obj && obj.outStandingBalance || 0.00 ;
        this.openingBalance = obj && obj.openingBalance || 0.00;
        this.credit = obj && obj.credit || 0.00  ;
        this.debit = obj && obj.debit || 0.00 ;
    }
}
