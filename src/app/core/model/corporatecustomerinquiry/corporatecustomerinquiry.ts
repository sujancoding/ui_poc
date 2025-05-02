import { UpdateAssociateAddress } from "../Company Profile/company-profile";
import { CorporateDocumentInquiry } from "../corporateapplicationinquiry/corporateapplicationinquiry";

export class CorporateCustomerInquiry {
    isCustomer !: string;
    customerId !: string;
    customerType !: string;
    status !: string;
    createdBy !: string;
    createdDate !: string;
    updatedBy !: string;
    updatedDate !: string;
    orgId!: string;
    natureOfBusiness !: string ;
    companyName !: string;
    registrationNo !: string;
    registrationType !: string;
  incorporationDate !: string;
  incorporationPlace !: string;
  license !: string;
  turnOver !: string;
  validFrom !: string;
  validTill !: string;
  issuingAuthority !: string;
  issuingCountry !: string;
    name !: Name; 
    email !: Email;
    phone !: Phone;
    address !: Address[];
    associates !: Associates;
    document !: CorporateDocumentInquiry[];
}

export class Name {
    name !: string;
    aliasName !: string ;
    constructor(obj ?:any){
     this.name = obj && obj.name || "" ;
     this.aliasName = obj && obj.aliasName || "" ;
    }
}

export class Email {
    emailId !: string;
}

export class Phone {
    phoneNo !: string;
    phoneType !: string;
    phoneCountryCode !: string ;
}

export class Address {
    isprimary !: string;
    level !: string;
    unit !: string;
    block !: string;
    streetName !: string;
    city !: string;
    state !: string;
    country !: string;
    postalCode !: string;
}

export class Associates {
    owner !: AssociatesDetails[];
    runner !: AssociatesDetails[];
    dealer !: AssociatesDetails[];
}
export class AssociatesDetails {
    associateId !: string;
    jobTitle !: string;
    email !: string;
    phone !: string;
    idNumber !: string;
    nationality !: string;
    gender !: string;
    dob !: string;
    name !: string;
    passportNumber !: string; //newly added on feb 1 2024
    passportExpiry !: string; //newly added on feb 1 2024
    passportIssueDate !: string ;
    overseasId !: string;
    status !: string ;
    address !: UpdateAssociateAddress[] ;
}