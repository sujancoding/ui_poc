export class AddPayee{
    
    payeeInfo!: PayeeInfo;
    bankInfo!: BankInfo;
     constructor(obj?:any){
        this.payeeInfo = (obj && obj.payeeInfo) || new PayeeInfo();
        this.bankInfo = (obj && obj.bankInfo) || new BankInfo();
     }
}

export class PayeeInfo{
    name!: string;
    accountNumber!: string;
    phoneNo!: string;
    emailId!: string;
    currencyCode !: string;
    address!: Address;
    relationship!: string;
     constructor(obj?:any){
             this.name = obj && obj.name || "";
             this.accountNumber = obj && obj.accountNumber || "";
             this.relationship= obj && obj.relationship || "",
             this.phoneNo = obj && obj.phoneNo || "";
             this.emailId = obj && obj.emailId || "";
             this.currencyCode = obj && obj.currencyCode || "";
             this.address = (obj && obj.address) || new Address();
            
     }
}

export class Address{
    address!: string;
    state!: string;
    country!: string;
    constructor(obj?:any){
        this.address = obj && obj.address || "";
        this.state = obj && obj.state || "";
        this.country = obj && obj.country || "";
}
}

export class BankInfo{
    name!: string;
    branch!: string;
    swiftCode!: string;
    routingCode !: string;
    bankBranchType !: string;

    constructor(obj?:any){
        this.name = obj && obj.name || "";
        this.branch = obj && obj.branch || "";
        this.swiftCode = obj && obj.swiftCode || "";
        this.routingCode = obj && obj.routingCode || "" ;
        this.bankBranchType = obj && obj.bankBranchType || ""
}
}
