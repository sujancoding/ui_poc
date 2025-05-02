export class DocumentInquiry{
    documentName!:string;
    documentId!:string;
    documentType!:string;
    documentData!:string;

    constructor(obj?:any){
     this.documentName = obj && obj.documentName || "";
     this.documentId =  obj && obj.documentId || "";
     this.documentType =  obj && obj.documentType || "";
     this.documentData =  obj && obj.documentData || "";
    }
}
//Corporate Update Document (Customer) 
export class DocumentUpdateCustomer {
    customerType !: string;
    documentData !: string;
    documentTypeId !: string; 
    documentName !: string;
    associateId !: string ;
    documentId !: string ;

    constructor(obj?:any){
    this.customerType = obj && obj.customerType || "";
    this.documentData =  obj && obj.documentData || "";
    this.documentTypeId = obj && obj.documentTypeId || "";
    this.documentName =  obj && obj.documentName || "";
    this.associateId = obj && obj.associateId || "";
    this.documentId = obj && obj.documentId || "";
    }
}

//Consumer Update Document (Customer) 
export class DocumentUpdateConsumer {
    customerType !: string;
    documentData !: string;
    documentTypeId !: string; 
    documentName !: string;
    documentId !: string ;

    constructor(obj?:any){
    this.customerType = obj && obj.customerType || "";
    this.documentData =  obj && obj.documentData || "";
    this.documentTypeId = obj && obj.documentTypeId || "";
    this.documentName =  obj && obj.documentName || "";
    this.documentId = obj && obj.documentId || "" ;
    }
}