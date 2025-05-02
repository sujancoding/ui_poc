export class TransactionDocumentInquiry {
    data !: DocumentDetails ;
    constructor(obj : any){
      this.data = obj && obj.data || new DocumentDetails() ;
    }
}

export class DocumentDetails{
    DOCUMENTDATA !: string ;
    CREATEDTIME!: string ;
    TRANSACTIONID !: string ;
    DOCUMENTNAME !: string ;
    CREATEDBY !: string ;
    constructor(obj ?: any){
      this.DOCUMENTDATA = obj && obj.DOCUMENTDATA || "" ;
      this.CREATEDTIME = obj && obj.CREATEDTIME || "";
      this.TRANSACTIONID = obj && obj.TRANSACTIONID || "";
      this.DOCUMENTNAME = obj && obj.DOCUMENTNAME || "";
      this.CREATEDBY = obj && obj.CREATEDBY || "";
    }
}

// "{
//     ""data"": [
//         {
//             ""DOCUMENTDATA"": ""/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIC",
//             ""CREATEDTIME"": ""2023-04-15 07:32:42"",
//             ""TRANSACTIONID"": ""191681539065"",
//             ""DOCUMENTNAME"": ""DEPOSITED SLIP"",
//             ""CREATEDBY"": ""TEST AGENT""
//         }
//     ]
// }"