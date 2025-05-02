export class AddStaff{

    staffName !: string ;
    mobileNo !: string ;
    mobileCountryCode !: string ;
    emailId !: string ;
    password !: string ;
    idNumber !: string ;
    designation !: string ;
    roleId !: string ;
    address !: StaffAddress ;
    customerType !: string ;

    constructor(obj ?:any){
        this.staffName = obj && obj.staffName || "" ;
        this.mobileNo = obj && obj.mobileNo || "" ;
        this.mobileCountryCode = obj && obj.mobileCountryCode || ""  ;
        this.emailId  = obj && obj.emailId || "" ;
        this.password  = obj && obj.password || "" ;
        this.idNumber  = obj && obj.idNumber || "" ;
        this.designation  = obj && obj.designation || "" ;
        this.roleId = obj && obj.roleId || "" ;
        this.address  = obj && obj.address || new StaffAddress() ;
        this.customerType = obj && obj.customerType || "" ;
    }
}

export class StaffAddress{
    addressLine1 !: string ; //level
    addressLine2 !: string ; //unit
    addressLine3 !: string ; //building name
    addressLine4 !: string ; //street name
    country !: string ;
    postalCode !: string ;

    constructor(obj ?:any){
        this.addressLine1 = obj && obj.addressLine1 || "" ;
        this.addressLine2 = obj && obj.addressLine2 || "" ;
        this.addressLine3  = obj && obj.addressLine3 || "" ;
        this.addressLine4  = obj && obj.addressLine4 || "" ;
        this.country  = obj && obj.country || "" ;
        this.postalCode  = obj && obj.postalCode || "" ;
    }
}

export class UpdateStaff{

    staffName !: string ;
    mobileNo !: string ;
    emailId !: string ;
    idNumber !: string ;
    designation !: string ;
    address !: StaffAddress ;
    status !: string ;
    roleId !: string ;

    constructor(obj ?:any){
        this.staffName = obj && obj.staffName || "" ;
        this.mobileNo = obj && obj.mobileNo || "" ;
        this.emailId  = obj && obj.emailId || "" ;
        this.idNumber  = obj && obj.idNumber || "" ;
        this.designation  = obj && obj.designation || "" ;
        this.status = obj && obj.status || "" ;
        this.address  = obj && obj.address || new StaffAddress() ;
        this.roleId = obj && obj.roleId || "" ;
    }
}