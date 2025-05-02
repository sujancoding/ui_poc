export class SubmitDocument{
    id!: number;
    documentIds: string;
    applicationId : string ;
    applicantId : string ;


    constructor(obj?: any){
      this.documentIds = obj && obj.documentIds || "";
      this.applicationId = obj && obj.applicationId || "";
      this.applicantId = obj && obj.applicantId || "";
    }
}


export interface PeriodicElement{
  img: string;
  Applicationid: string;
  Applicantid: string;
  Name: string;
  Status: string;
  Nationality: string;
  MobileNumber: string;
  Creationdate: string;
  Actions: string;
}