import { EmailId } from "../ApplicationInquiry/Application-Inquiry";
import {  CompanyPhone, CorporateAddress, CorporateAssociate, CorporateProfile, UpdateAssociateAddress } from "../Company Profile/company-profile";

export class CorporateApplicationInquiry{
     isApplicant!: string;
     applicationId!: string;
     applicationType!: string;
     status!: string;
     createdBy!: string;
     createdDate!: string;
     updatedBy!: string;
     updatedDate!: string;
     corporate !: CorporateInquiry;
     document !: CorporateDocumentInquiry[];
     
     constructor(obj?:any){
      this.isApplicant = obj && obj.isApplicant || "";
      this.applicationId = obj && obj.applicationId || "";
      this.applicationType = obj && obj.applicationType || "";
      this.status = obj && obj.status || "";
      this.createdBy = obj && obj.createdBy || "";
      this.createdDate = obj && obj.createdDate || "";
      this.updatedBy = obj && obj.updatedBy || "";
      this.updatedDate = obj && obj.updatedDate || "";
      this.corporate = obj && obj.corporate || new CorporateInquiry();
      this.document = obj && obj.document || null ;

     }
}

export class CorporateInquiry {
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
     email !: EmailId ;
     associate !: AssociateGroups;

     
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
     this.email = obj && obj.email || null ;
     this.associate = obj && obj.associate || null ;	
      
 }
}
export class CorporateDocumentInquiry{
     docId!:	string;
     docTypeId!:	string;
     docName!:string;
     status!: string;
 }

 export class AssociateGroups{
     owner !: AssociateGroupDetails[] ;
     runner !: AssociateGroupDetails[] ;
     dealer !: AssociateGroupDetails[] ;
     constructor(obj?:any){
       this.owner = obj && obj.owner || null;
       this.runner = obj && obj.runner || null;
       this.dealer = obj && obj.dealer || null;
    
    }
 }

 export class AssociateGroupDetails{
    associateId !: string ;
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
    passportIssueDate !: string;
    overseasId !: string;
    phoneCountryCode !: string ;
    status !: string ;
    address !: UpdateAssociateAddress[] ;

    constructor(obj?:any){
     this.associateId = obj && obj.associateId || null ;
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
     this.phoneCountryCode = obj && obj.phoneCountryCode || null ;
     this.status = obj && obj.status || null ;
     this.address = obj && obj.address || null ;
    }
 }

  //  "associate": {
    //     "owner": [
    //         {
    //             "associateId": "7e165fa27f5a",
    //             "name": "",
    //             "jobTitle": "OWNER",
    //             "dob": "",
    //             "gender": "",
    //             "idNumber": "",
    //             "passportNumber": "",
    //             "passportExpiry": "",
    //             "nationality": "",
    //             "emailId": "testcorporate011@yahoo.com",
    //             "phoneNo": "10010671",
    //             "phoneCountryCode": "91",
    //             "passportIssueDate": "",
    //             "overseasId": ""
    //         }
    //     ]
    // },