export class AddAgent {
    agentName !: string ;
    email !: string ;
    phone !: string ;
    phoneCountryCode !: string ; 
    password !: string ;
    address !:  AgentAddress ;
    customerType !: string ; 

    constructor(obj ?:any){
        this.agentName = obj && obj.agentName || ""  ;
        this.email = obj && obj.email || ""  ;
        this.phone = obj && obj.phone || ""  ;
        this.phoneCountryCode = obj && obj.phoneCountryCode || "" ;
        this.password = obj && obj.password || ""  ;
        this.address = obj && obj.address || new AgentAddress()  ;
        this.customerType = obj && obj.customerType || "" ;
    }
}

export class AgentAddress {
    unit !: string ;
    block !: string ;
    buildingName !: string ;
    street !: string ;
    country !: string ;
    postalCode !: string ;

    constructor(obj ?:any){
        this.unit = obj && obj.unit || ""  ;
        this.block = obj && obj.block || ""  ;
        this.buildingName = obj && obj.buildingName || ""  ;
        this.street = obj && obj.street || ""  ;
        this.country = obj && obj.country || ""  ;
        this.postalCode = obj && obj.postalCode || ""  ;
    }

}

// "{
//     ""agentName"": ""FAST EXCHANGE TRADERS "",
//     ""email"": ""fastexchangetraders@gmail.com"",
//     ""phone"": ""11113337"",
//     ""password"": ""test12345"",
//     ""address"": {
//         ""unit"": ""2"",
//         ""block"": ""3"",
//         ""buildingName"": ""TEST BUILDING"",
//         ""street"": ""TEST STREET"",
//         ""country"": ""SINGAPORE"",
//         ""postalCode"": ""666666""
//     }
// }"

export class AgentUpdate{
    agentId !: string;
    companyName !: string;
    registrationNo !: string;
    emailId !: string;
    phoneNo !: string;
    type !: string;
    incorporationDate !: string;
    incorporationPlace !: string;
    remittanceLicense !: string;
    turnOver !: string;
    validFrom !: string;
    validTill !: string;
    issuingAuthority !: string;
    issuingCountry !: string;
    status !: string;
    address !: AgentProfileAddress;
    associate !: Associate[];

    constructor(obj:any){
       this.agentId = obj && obj.agentId || null;
       this.companyName = obj && obj.companyName || null;
       this.registrationNo = obj && obj.registrationNo || null;
       this.emailId = obj && obj.emailId || null;
       this.phoneNo = obj && obj.phoneNo || null;
       this.type = obj && obj.type || null;
       this.incorporationDate = obj && obj.incorporationDate || null;
       this.incorporationPlace = obj && obj.incorporationPlace || null;
       this.remittanceLicense = obj && obj.remittanceLicense || null;
       this.turnOver = obj && obj.turnOver || null;
       this.validFrom = obj && obj.validFrom || null;
       this.validTill = obj && obj.validTill || null;
       this.issuingAuthority = obj && obj.issuingAuthority || null;
       this.issuingCountry = obj && obj.issuingCountry || null;
       this.status = obj && obj.status || null;
       this.address = obj && obj.address || null;
       this.associate = obj && obj.associate || null ;


    }
}


export class AgentProfileAddress{
   level !: string;
   unit !: string;
   buildingNmae !: string;
   street !: string;
   country !: string;
   postalCode !: string;

   constructor(obj:any){
    this.level = obj && obj.level || "";
    this.unit = obj && obj.unit || "";
    this.buildingNmae = obj && obj.buildingNmae || "";
    this.street = obj && obj.street || "";
    this.country = obj && obj.country || "";
    this.postalCode = obj && obj.postalCode || "";


   }
}
// {
//     "agentId": "A31028",
//     "companyName": "TEST K TRADERS",
//     "registrationNo": "R12312311",
//     "type": "TEST",
//     "incorporationDate": "2023-08-21",
//     "incorporationPlace": "SINGAPORE",
//     "remittanceLicense": "N1234567T",
//     "turnOver": "20000",
//     "validFrom": "2023-08-21",
//     "validTill": "2027-07-20",
//     "issuingAuthority": "REMIT",
//     "issuingCountry": "SINGAPORE",
//     "address": {
//         "level": "1",
//         "unit": "4",
//         "buildingName": "TEST",
//         "street": "TEST STREET",
//         "country": "SINGAPORE",
//         "postalCode": "999999"
//     },
//     "associate" : null
// }

// {
//     "agentId": "A31028",
//     "companyName": null,
//     "registrationNo": null,
//     "type": null,
//     "incorporationDate": null,
//     "incorporationPlace": null,
//     "remittanceLicense": null,
//     "turnOver": null,
//     "validFrom": null,
//     "validTill": null,
//     "issuingAuthority": null,
//     "issuingCountry": null,
//     "address": null,
//     "associate": [
//         {
//             "associateId" : null,
//             "name" : "TEST OWNER",
//             "jobTitle" : "OWNER",
//             "dob" : "1987-02-1",
//             "gender" : "MALE",
//             "idNumber" : "N1234567T",
//             "nationality" : "INDIAN",
//             "emailId" : "test@gmail.com",
//             "phoneNo" : "11114445"
//         },
//         {
//             "associateId" : null,
//             "name" : "TEST RUNNER",
//             "jobTitle" : "RUNNER",
//             "dob" : "1987-07-10",
//             "gender" : "MALE",
//             "idNumber" : "N1234577T",
//             "nationality" : "INDIAN",
//             "emailId" : "testr@gmail.com",
//             "phoneNo" : "11114446"
//         }
//     ]
// }



export class Associate {
 
    associateId !: string;
    name !: string;
    jobTitle !: string;
    dob !: string;
    gender !: string;
    idNumber !: string;
    nationality !: string;
    emailId !: string;
    phoneNo !: string;

    constructor(obj:any){
        this.associateId = obj && obj.associateId || null ;
        this.name = obj && obj.name || "";
        this.jobTitle = obj && obj.jobTitle || "";
        this.dob = obj && obj.dob || "";
        this.gender = obj && obj.gender || "" ;
        this.idNumber = obj && obj.idNumber || "";
        this.nationality = obj && obj.nationality || "";
        this.emailId = obj && obj.emailId || "";
        this.phoneNo = obj && obj.phoneNo || "";




    }


    

}
// "{
//     "agentId": "A31028",
//     "companyName": null,
//     "registrationNo"": null,
//     "type": null,
//     "incorporationDate": null,
//     "incorporationPlace": null,
//     "remittanceLicense": null,
//     "turnOver": null,
//     "validFrom": null,
//     "validTill": null,
//     "issuingAuthority": null,
//     "issuingCountry": null,
//     "address": null,
//     "associate": [
//         {
//             "associateId" : null,
//             "name" : ""TEST OWNER"",
//             "jobTitle" : ""OWNER"",
//             "dob" : ""1987-02-1"",
//             "gender" : ""MALE"",
//             "idNumber" : ""N1234567T"",
//             "nationality" : ""INDIAN"",
//             "emailId" : ""test@gmail.com"",
//             "phoneNo" : ""11114445""
//         },
//         {
//             ""associateId"" : null,
//             ""name"" : ""TEST RUNNER"",
//             ""jobTitle"" : ""RUNNER"",
//             ""dob"" : ""1987-07-10"",
//             ""gender"" : ""MALE"",
//             ""idNumber"" : ""N1234577T"",
//             ""nationality"" : ""INDIAN"",
//             ""emailId"" : ""testr@gmail.com"",
//             ""phoneNo"" : ""11114446""
//         }
//     ]
// }"

export const AGENT_DOCUMENT_ID_MAPPER: any ={

    //key  : 'value'
    ACRA: '1005',  
    OWNER_NRIC:'1006' , 
    DEALER_NRIC: '1007',
    RUNNER_NRIC: '1008', 
};
export class AddAgentDocument{
    agentId !: string;
    associateId !: string;
    documentName !: string;
    documentId !: string;
    documentData !: string;

    constructor(obj:any){
        this.agentId = obj && obj.agentId || "";
        this.associateId = obj && obj.associateId || "";
        this.documentName = obj && obj.documentName || "";
        this.documentId = obj && obj.documentId || "";
        this.documentData = obj && obj.documentData || "";

    }
}

// "{
//     ""agentId"": ""A31033"",
//     ""associateId"" : ""A0109023f97"",
//     ""documentName"": ""RUNNER_NRIC"",
//     ""documentId"": """",
//     ""documentData"": ""data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4e/...
// }"


export class AgentMarginTierUpdate {
         accountNumber !: string ;
         accountStatus !: string ;
         marginTier !: string ;

         constructor(obj:any){
          this.accountNumber = obj && obj.accountNumber || "" ;
          this.accountStatus = obj && obj.accountStatus || "" ; 
          this.marginTier = obj && obj.marginTier || "" ; 
         }
    
}