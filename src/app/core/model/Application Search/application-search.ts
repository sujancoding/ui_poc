export class ApplicationListings {
    records !: Records;
	constructor(obj?:any){
		this.records = obj && obj.records || null ;
	}
}
export class Records{
    NATIONALITY!: string;
    CREATEDDATE!: string;
	STATUS!: string;
	APPLICATIONTYPE!: string;
	APPLICANTID!: string;
	PHONENBR!: string;
	APPLICATIONID!: string;
	NAME!: string;
   
}