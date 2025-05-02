export class OTPRq {
    otpRefNo!: string; // Reference Id from server
    otpToken!: string; // code to validate
}

export class ConsumerOTPRq{
    token !: string //OTP
    password !: string //Password
    applicant !: ConsumerOTPApplicant ; //applicant node
    productName !: string ; // hardcode as "TT,MC"
    controlFlowId !: string ; // hardcode as "1111111"
    applicationType !: string ; // I or C 

    constructor(obj?:any){
      this.token = obj && obj.token || "" ;
      this.password = obj && obj.password || "" ;
      this.applicant = obj && obj.applicant || "" ;
      this.productName = obj && obj.productName || "" ;
      this.controlFlowId = obj && obj.controlFlowId || "" ;
      this.applicationType = obj && obj.applicationType || "" ;
    }
}


export class ConsumerOTPApplicant {
    email !: ConsumerApplicantOTPEmail[] ;
    phone !: ConsumerApplicantOTPPhone[] ;

    constructor(obj?:any){
        this.email = obj && obj.email || [] ;
        this.phone = obj && obj.phone || [] ;
      }

}

export class ConsumerApplicantOTPEmail{
    emailAddress !: string ;
    isPreferredEmail !: string ;

    constructor(obj?:any){
        this.emailAddress = obj && obj.emailAddress || "" ;
        this.isPreferredEmail = obj && obj.isPreferredEmail || "" ;
      }

}

export class ConsumerApplicantOTPPhone{
    phoneNumber !: string ;
    phoneType !: string ;

    constructor(obj?:any){
        this.phoneNumber = obj && obj.phoneNumber || "" ;
        this.phoneType = obj && obj.phoneType || "" ;
      }
}

