import { Address } from "../Appication Update/Application_Update";
import {  EmailId, Name, Phone } from "../ApplicationInquiry/Application-Inquiry";
import { Demographics } from "../Appication Update/Application_Update";
import { SourceOfWealth } from "../Appication Update/Application_Update";
import { Document } from "../ApplicationInquiry/Application-Inquiry";

export class CustomerInquiry{
    isCustomer!: string;
    customerId!: string;	
    customerType!: string;
    status!: string;
    createdBy!: string;
    createdDate!: string;
    updatedBy!:	string;
    updatedDate!: string;
    name!: CustomerInquiryName;
    email!: EmailId;
    demographics!: Demographics;
    phone!: Phone;
    sourceOfWealth!: SourceOfWealth;
    address!: Address[];
    document!: Document[];

    constructor(obj?:any){
       this.isCustomer = obj && obj.isCustomer || "";
       this.customerId = obj && obj.customerId || "";
       this.customerType = obj && obj.customerType || "";
       this.status = obj && obj.status || "";
       this.createdBy = obj && obj.createdBy || "";
       this.createdDate = obj && obj.createdDate || "";
       this.updatedBy = obj && obj.updatedBy || "";
       this.updatedDate = obj && obj.updatedDate || "";
       this.name = obj && obj.name || new CustomerInquiryName();
       this.email = obj && obj.email || new EmailId();
       this.demographics = obj && obj.demographics || new Demographics();
       this.phone = obj && obj.phone || new Phone();
       this.sourceOfWealth = obj && obj.sourceOfWealth || new SourceOfWealth();
       this.address = obj && obj.address || new Address();
       this.document = obj && obj.document || new Document(); 
    }
}

//Update customer basic profile model 
export class UpdateCustomerDatas {
    customerType !: string ;
    name !: CustomerName ;
    demographics !: Demographics ;
    email !: EmailUpdate[];
    phone !: PhoneNumberUpdate[] ;
    address !: Address[] ;
    riskRating !: string;
    sourceOfWealth!: SourceOfWealth;
    constructor(obj?: any) {
        this.customerType = obj && obj.customerType || "";
        this.name = obj && obj.name || null;
        this.demographics = obj && obj.demographics || null;
        this.email = obj && obj.email || null;
        this.phone = obj && obj.phone || null;
        this.address = obj && obj.address ||  null;
        this.sourceOfWealth = obj && obj.sourceOfWealth || null;
        this.riskRating = obj && obj.riskRating || null ;

    }
}

export class CustomerName {
    fullName!: string;
    aliasName !: string ;
    constructor(obj?: any) {
        this.fullName = obj && obj.fullName || "";
        this.aliasName = obj && obj.aliasName || "" ;
    }
}

export class EmailUpdate{
    emailAddress !: string ;
    constructor(obj?: any) {
        this.emailAddress = obj && obj.emailAddress || "";
    }
}

export class PhoneNumberUpdate{
    phoneNumber !: string ;
    constructor(obj?: any) {
        this.phoneNumber = obj && obj.phoneNumber || "";
    }
}

export class CustomerInquiryName{
        name!: string;
        aliasName !: string ;
        constructor(obj?: any){
            this.name = obj && obj.name || "";
            this.aliasName = obj && obj.aliasName || "";
        }
}

export class UpdateCustomerAccountsRq{
    customerId !: string ;
    accounts !: Accounts[] ;

    constructor(obj?:any){
     this.customerId = obj && obj.customerId || "" ;
     this.accounts = obj && obj.accounts || new Accounts() ;
    }
}

export class Accounts {
    accountNumber !: string ;
    status !: string ;
    productType !: string ;
    marginTier !: string ;

    constructor(obj?:any){
        this.accountNumber = obj && obj.accountNumber || "" ;
        this.status = obj && obj.status || 0 ;
        this.productType = obj && obj.productType || "" ;
        this.marginTier = obj && obj.marginTier || "" ;
       }

}