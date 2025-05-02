import { Applicant } from "src/app/shared/models/applicant.model";

export class RegisterUserRq {
    password!: string;
    applicationType!: string;
    applicant!: Applicant;
    productName!: string;
    otpRefNo!: string;
    customerType !: string ;

    constructor(applicationType: string, productName: string, applicant: Applicant,
        password: string,otpRefNo: string, customerType:string) {
        this.applicationType = applicationType;
        this.productName = productName;
        this.applicant = applicant;
        this.password = password;
        this.otpRefNo = otpRefNo;
        this.customerType = customerType  ;
    }
}

export class ConsumerRegisterInitiateRq{
    applicant !: ConsumerApplicant ;

    constructor(obj?:any){
      this.applicant = obj && obj.applicant || null ;
    }
}

export class ConsumerApplicant {
    email !: ConsumerApplicantEmail[] ;
    phone !: ConsumerApplicantPhone[] ;

    constructor(obj?:any){
        this.email = obj && obj.email || [] ;
        this.phone = obj && obj.phone || [] ;
      }

}

export class ConsumerApplicantEmail{
    emailAddress !: string ;

    constructor(obj?:any){
        this.emailAddress = obj && obj.emailAddress || "" ;
      }

}

export class ConsumerApplicantPhone{
    phoneNumber !: string ;

    constructor(obj?:any){
        this.phoneNumber = obj && obj.phoneNumber || "" ;
      }
}


// {
//     "applicant": {
//         "email": [
//             {
//                 "emailAddress": "dineshrahul@gmail.com"
//             }
//         ],
//         "phone": [
//             {  
//                 "phoneNumber": "98777210"
//             }
//         ]
//     }
// }



