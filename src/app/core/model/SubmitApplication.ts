export class SubmitApplication{
    applicationId!: string;
    applicantId !: string ;
    constructor(obj?:any){
        this.applicationId = obj && obj.applicationId || "";
        this.applicantId = obj && obj.applicantId || "" ;
    }
}