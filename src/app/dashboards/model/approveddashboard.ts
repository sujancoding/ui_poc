import { DocumentDetails } from "src/app/core/model/transactiondocumentinquiry/transactiondocumentinquiry.model";

export class TransactionHistory{
	transactionData !: TransactionData[];
	payeeData !: PayeeData[];

    constructor(obj?:any){
     this.transactionData = obj && obj.transactionData || new TransactionData();
     this.payeeData = obj && obj.payeeData ||  new PayeeData();
    }
}

export class TransactionData {
	TRANSACTIONID !: string;
	CUSTOMERTYPE !:string;
	ORGACCTNBR !:string;
	CUSTACCTNBR !:string;
	PAYEEID !:string;
	ACCOUNTTITLE !: string;
	AMOUNTSENT !:number;
	AGENTEXCHRATE !:string;
	AGENTACCTNBR !:string;
	CHANNEL !:string;
	AMOUNTRECEIVED !:string;
	ORGEXCHRATE !:number;
	AMOUNTPROFITLOSS !:string;
	TXNSTATUS !:string;
	CUSTOMERID !:string;
	STATUS !:string;
	NAME !:string;
	ADDRESS !:string;
	PHONENBR !:string;
	EMAILID !:string;
	BANKNAME !:string;
	BRANCHNAME !:string;
	ACCOUNTNBR !:string;
	SWIFTCODE !:string;
	STATE !:string;
	COUNTRY !:string;
	REMARKS !:string;
	CREATEDBY !:string;
	CREATEDDATE !:string;
	UPDATEDBY !:string;
	UPDATEDDATE !:string;
	AUTHORIZEDBY !:string;
	AUTHORIZEDDATE !:string;
  COUNTRYCODE: any;
}

export class PayeeData {
	CUSTOMERID !:string;
	PAYEEID !:string;
	STATUS !:string;
	NAME !:string;
	ADDRESS !:string;
	PHONENBR !:string;
	EMAILID !:string;
	BANKNAME !:string;
	BRANCHNAME !:string;
	ACCOUNTNBR !:string;
	SWIFTCODE !:string;
	STATE !:string;
	COUNTRY !:string;
	
}

export class TransactionDeposit{
	
	data !: TransactionData[];
	documents !: TransactionDocumentDetails[];

	constructor(obj?:any){
       this.data = obj && obj.data || new TransactionData();
	   this.documents = obj && obj.documents || new TransactionDocumentDetails();
	}
}

export class TransactionDocumentDetails{
    CREATEDTIME!: string ;
    TRANSACTIONID !: string ;
    DOCUMENTNAME !: string ;
    CREATEDBY !: string ;
    constructor(obj ?: any){
      this.CREATEDTIME = obj && obj.CREATEDTIME || "";
      this.TRANSACTIONID = obj && obj.TRANSACTIONID || "";
      this.DOCUMENTNAME = obj && obj.DOCUMENTNAME || "";
      this.CREATEDBY = obj && obj.CREATEDBY || "";
    }
}