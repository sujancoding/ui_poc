export class ApplicationFulFillment{
   // id!: number;
    applicationId!: string;
    status!: string;

    constructor(obj?: any){
        this.applicationId = obj && obj.applicationId || ""
        this.status = obj && obj.status || ""
    }
}