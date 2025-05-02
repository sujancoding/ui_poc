export class RegisterCorporateRq{
    password !: string;
    corporate !: Corporate;
    productName !: string;
    controlFlowId !: string;
    customerType !: string ;
    constructor(obj?:any){
    this.password = obj && obj.password || "";
    this.corporate = obj && obj.corporate || new Corporate();
    this.productName = obj && obj.productName || "";
    this.controlFlowId = obj && obj.controlFlowId || "";
    this.customerType = obj && obj.customerType || "" ;
    }
}

export class Corporate{
    orgId !: string;
    associate !: Associate;
    constructor(obj?:any){
       this.orgId = obj && obj.orgId || "";
       this.associate = obj && obj.associate || new Associate();
    }
}

export class Associate{
    jobTitle !: string;
    email !: CorporateEmail ;
    phone !: CorporatePhone ;
    constructor(obj?:any){
     this.jobTitle = obj && obj.jobTitle || "";
     this.email = obj && obj.email || new CorporateEmail();
     this.phone = obj && obj.phone || new CorporatePhone();
    }
}

export class CorporateEmail {
    emailAddress !: string;
    constructor(obj?:any){
      this.emailAddress = obj && obj.emailAddress || "";
    }
}

export class CorporatePhone{
    phoneNumber !: string;
    phoneCountryCode !: string;
    constructor(obj?:any){
     this.phoneNumber = obj && obj.phoneNumber || "";
     this.phoneCountryCode = obj && obj.phoneCountryCode || "";
    }
}