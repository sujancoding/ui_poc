import { EmailAddress } from "../customerupdate/customerupdate";

export class CompanyProfile{
    applicationId !: string ;
    applicantId !: string ;
    corporate !: CorporateProfile;
    constructor(obj?:any){
     this.applicationId = obj && obj.applicationId || "";
     this.applicantId = obj && obj.applicantId || "";
      this.corporate = obj && obj.corporate || new CorporateProfile();
    }
     
}

export class CorporateProfile{
    corporateId !: string ;
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
    issuingCountry  !: string;
    natureOfBusiness !: string ;
    address !: CorporateAddress;
    phone !: CompanyPhone;
    associate !: CorporateAssociate[];
    email !: EmailAddress ;
    
constructor(obj?:any){	
    this.corporateId = obj && obj.corporateId || "";
    this.companyName = obj && obj.companyName || null;	
    this.registrationNo = obj && obj.registrationNo || null;
    this.registrationType = obj && obj.registrationType || null;
    this.incorporationDate = obj && obj.incorporationDate || null;
    this.incorporationPlace = obj && obj.incorporationPlace || null;
    this.license = obj && obj.license || null;
    this.turnOver = obj && obj.turnOver || null;
    this.validFrom = obj && obj.validFrom || null;
    this.validTill = obj && obj.validTill || null;
    this.issuingAuthority = obj && obj.issuingAuthority || null;
    this.issuingCountry = obj && obj.issuingCountry || null;
    this.natureOfBusiness = obj && obj.natureOfBusiness || null ;
    this.address = obj && obj.address || null;
    this.phone = obj && obj.phone || null;
    this.associate = obj && obj.associate || null ;	
    this.email = obj && obj.email || null ;	
	
}
}

export class CorporateAddress{
    level !: string;
    unit !: string;
    building !: string ;
    streetName !: string ;
    countryCode !: string ;
    postalCode !: string;

    constructor(obj?:any){
        this.level = obj && obj.level || "";
        this.unit = obj && obj.unit || "";
        this.building = obj && obj.building || null;
        this.streetName = obj && obj.streetName || null;
        this.countryCode = obj && obj.countryCode || null;
        this.postalCode = obj && obj.postalCode || null;
    }
}

export class CompanyPhone{
    phoneNumber !: string; 
    phoneCountryCode !: string; 
    constructor(obj?:any){
        this.phoneNumber = obj && obj.phoneNumber || null;
        this.phoneCountryCode = obj && obj.phoneCountryCode || null;  
    }
}

export class CorporateAssociate{
    associateId !: string ;
    jobTitle !: string;
    nationality !: string;
    emailId !: string;
    phoneNo !: string;
    dob !: string;
    gender !: string;
    idNumber !: string;
    name !: string;
    passportNumber !: string; //newly added on feb 1 2024
    passportExpiry !: string; //newly added on feb 1 2024
    passportIssueDate !: string;
    overseasId !: string;
    action !: string ;
    address !: UpdateAssociateAddress[] ;

    constructor(obj?:any){
     this.associateId = obj && obj.associateId || "" ;
     this.jobTitle = obj && obj.jobTitle || null;
     this.nationality = obj && obj.nationality || null;
     this.emailId = obj && obj.emailId || null;
     this.phoneNo = obj && obj.phoneNo || null;
     this.dob = obj && obj.dob || null;
     this.gender = obj && obj.gender || null;
     this.idNumber =  obj && obj.idNumber || null;
     this.name =  obj && obj.name || null;
     this.passportNumber =  obj && obj.passportNumber || null;
     this.passportExpiry =  obj && obj.passportExpiry || null;
     this.passportIssueDate = obj && obj.passportIssueDate || null ;
     this.overseasId = obj && obj.overseasId || null ;
     this.action = obj && obj.action || null ;
     this.address = obj && obj.address || null ;
    }
}

//update company profile starting main class.
export class UpdateCorporateProfile{
    customerType !: string ;
    corporate !: CorporateProfileCustomerUpdate ;
    constructor(obj?:any){
        this.customerType = obj && obj.customerType || "" ;
        this.corporate = obj && obj.corporate || new CorporateProfileCustomerUpdate();
    }
}

//update company associates main class
export class UpdateCorporate{
    customerType !: string ;
    corporate !: UpdateCorporateAssociates ;
    constructor(obj?:any){
        this.customerType = obj && obj.customerType || "" ;
        this.corporate = obj && obj.corporate || new UpdateCorporateAssociates();
    }
}


export class UpdateCorporateAssociates {
    corporateId !: string ;
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
    issuingCountry  !: string
    address !: CorporateAddress;
    phone !: CompanyPhone;
    associate !: UpdateAssociates[];
    
constructor(obj?:any){	
    this.corporateId = obj && obj.corporateId || "";
    this.companyName = obj && obj.companyName || null;	
    this.registrationNo = obj && obj.registrationNo || null;
    this.registrationType = obj && obj.registrationType || null;
    this.incorporationDate = obj && obj.incorporationDate || null;
    this.incorporationPlace = obj && obj.incorporationPlace || null;
    this.license = obj && obj.license || null;
    this.turnOver = obj && obj.turnOver || null;
    this.validFrom = obj && obj.validFrom || null;
    this.validTill = obj && obj.validTill || null;
    this.issuingAuthority = obj && obj.issuingAuthority || null;
    this.issuingCountry = obj && obj.issuingCountry || null;
    this.address = obj && obj.address || null;
    this.phone = obj && obj.phone || null;
    this.associate = obj && obj.associate || null ;	
	
}
}

export class UpdateAssociates{
    associateId  !: string;
    jobTitle !: string;
    nationality !: string;
    emailId !: string;
    phoneNo !: string;
    dob !: string;
    gender !: string;
    idNumber !: string;
    name !: string;
    passportNumber !: string; 
    passportExpiry !: string; 
    passportIssueDate !: string ;
    overseasId !: string ;
    address !: UpdateAssociateAddress[] ;

    constructor(obj?:any){
    this.associateId = obj && obj.associateId || null;
     this.jobTitle = obj && obj.jobTitle || null;
     this.nationality = obj && obj.nationality || null;
     this.emailId = obj && obj.emailId || null;
     this.phoneNo = obj && obj.phoneNo || null;
     this.dob = obj && obj.dob || null;
     this.gender = obj && obj.gender || null;
     this.idNumber =  obj && obj.idNumber || null;
     this.name =  obj && obj.name || null;
     this.passportNumber =  obj && obj.passportNumber || null;
     this.passportExpiry =  obj && obj.passportExpiry || null;
     this.passportIssueDate = obj && obj.passportIssueDate || null;
     this.overseasId = obj && obj.overseasId || null ;
     this.address = obj && obj.address || null ;
    }
}



export class CorporateProfileCustomerUpdate{
    corporateId !: string ;
    companyName !: string;
    aliasName !: string;
    riskRating !: string;
    registrationNo !: string;
    registrationType !: string;
    incorporationDate !: string;
    incorporationPlace !: string;
    license !: string;
    turnOver !: string;
    validFrom !: string;
    validTill !: string;
    issuingAuthority !: string;
    issuingCountry  !: string;
    natureOfBusiness !: string ;
    address !: CorporateAddress;
    phone !: CompanyPhone;
    associate !: CorporateAssociate[];
    email !: EmailAddress ;
    
constructor(obj?:any){	
    this.corporateId = obj && obj.corporateId || "";
    this.companyName = obj && obj.companyName || null;	
    this.aliasName = obj && obj.aliasName || null ;
    this.riskRating = obj && obj.riskRating || null ;
    this.registrationNo = obj && obj.registrationNo || null;
    this.registrationType = obj && obj.registrationType || null;
    this.incorporationDate = obj && obj.incorporationDate || null;
    this.incorporationPlace = obj && obj.incorporationPlace || null;
    this.license = obj && obj.license || null;
    this.turnOver = obj && obj.turnOver || null;
    this.validFrom = obj && obj.validFrom || null;
    this.validTill = obj && obj.validTill || null;
    this.issuingAuthority = obj && obj.issuingAuthority || null;
    this.issuingCountry = obj && obj.issuingCountry || null;
    this.natureOfBusiness = obj && obj.natureOfBusiness || null ;
    this.address = obj && obj.address || null;
    this.phone = obj && obj.phone || null;
    this.associate = obj && obj.associate || null ;	
    this.email = obj && obj.email || null ;	
	
}
}


export class UpdateAssociateAddress {
    level !: string ;
    unit !: string ;
    building !: string ;
    streetName !: string ;
    countryCode !: string ;
    postalCode !: string ;

    constructor(obj?:any){	
     this.level = obj && obj.level || "" ;
     this.unit = obj && obj.unit || "" ;
     this.building = obj && obj.building || "" ;
     this.streetName = obj && obj.streetName || "" ;
     this.countryCode = obj && obj.countryCode || "" ;
     this.postalCode = obj && obj.postalCode || "" ;
    }

}
