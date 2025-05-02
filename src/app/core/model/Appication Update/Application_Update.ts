


//Application Update > BioInfo , SOW
export class ApplicationUpdate {
    applicationType!: string; 
    applicationId !: string ;  //newly added for MC purpose on 15 Dec 2023.
    applicantId !: string ;   //newly added for MC purpose on 15 Dec 2023.
    name!: Name;
    demographics!: Demographics;
    address!: Address[];
    sourceOfWealth!: SourceOfWealth;
    constructor(obj?: any) {
        this.applicationType = obj && obj.applicationType || "";
        this.applicationId = obj && obj.applicationId || "";
        this.applicantId = obj && obj.applicantId || "";
        this.name = obj && obj.name || null;
        this.demographics = obj && obj.demographics || null;
        this.address = obj && obj.address ||  null;
        this.sourceOfWealth = obj && obj.sourceOfWealth || null;

    }
}

export class Name {
    fullName!: string;
    constructor(obj?: any) {
        this.fullName = obj && obj.fullName || "";
    }
}

export class Demographics {
    gender!: string;
    dateOfBirth!: string;
    nationality!: string;
    idNumber!: string;
    validity!:string;
    passportNumber !: string ; //newly added on 01 feb 2024
    passportExpiry !: string ; //newly added on 01 feb 2024
    placeOfBirth !: string ;
    constructor(obj?: any) {
        this.gender = obj && obj.gender || null;
        this.dateOfBirth = obj && obj.dateOfBirth || "";
        this.nationality = obj && obj.nationality || "";
        this.idNumber = obj && obj.idNumber || "";
        this.validity = obj && obj.validity || null;
        this.passportNumber = obj && obj.passportNumber || "" ;
        this.passportExpiry = obj && obj.passportExpiry || null ;
        this.placeOfBirth = obj && obj.placeOfBirth || "" ;
    }
}

export class SourceOfWealth {
  
    employmentType!: string;
    officeName!:string;
    sourceOfIncome!:string;
    yearlyIncomeRange!:string;
    level!:string;
    unit!:string;
    block!: string;
    streetName!:string;
    city!: string;
    state!: string;
    country!:string;
    postalCode!: string;
    officeContactNumber!:string;
    //added designation
    designation!:string;

    constructor(obj?:any){
        this.employmentType = obj && obj.employmentType || ""
        this.officeName = obj && obj.officeName || ""
        this.sourceOfIncome = obj && obj.sourceOfIncome || ""
        this.yearlyIncomeRange = obj && obj.yearlyIncomeRange || ""
        this.level= obj && obj.level || ""
        this.unit= obj && obj.unit || ""
        this.block = obj && obj.block || "";
        this.streetName= obj && obj.streetName || "";
        this.city = obj && obj.city || "";
        this.state = obj && obj.state || "";
        this.country= obj && obj.country || "";
        this.postalCode = obj && obj.postalCode || "";
        this.officeContactNumber= obj && obj.officeContactNumber || ""
        //added designation
        this.designation = obj && obj.designation || ""
    }
}

export class Address {
    isprimary!: string;
    level!: string;
	unit!: string;
	block!: string;
	streetName!: string;
	city!: string;
	state!: string;
	country!: string;
	postalCode!: string;
    address!:string;

    
    constructor(obj?: any) {
    this.isprimary = obj && obj.isprimary || "";
    this.level = obj && obj.level || "";
    this.unit = obj && obj.unit || "";
    this.block = obj && obj.block || "";
    this.streetName = obj && obj.streetName || "";
    this.city = obj && obj.city || "";
    this.state = obj && obj.state || "";
    this.country = obj && obj.country || "";
    this.postalCode = obj && obj.postalCode || "";
    this.address = obj && obj.address || "";
 


    }
    
}


