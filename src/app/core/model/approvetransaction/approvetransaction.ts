export class ApproveTransaction{  //Deals
	agentId !: string;
	transactionIds !: [];
    deals !: DealInfo[];
    suspicious !: string;
    susRemarks !: string;
    agentCommPerTxn !: string;
    constructor(obj?:any){
     this.agentId = obj && obj.agentId || "";
     this.transactionIds = obj && obj.transactionIds || [];
     this.deals = obj && obj.deals || new DealInfo();
     this.suspicious = obj && obj.suspicious || "N";
     this.susRemarks = obj && obj.susRemarks || "";
     this.agentCommPerTxn = obj && obj.agentCommPerTxn || "0" ;
    }
	}

export class DealInfo{
	id !: string;
    amount !: string ;
    constructor(obj?:any){
        this.id = obj && obj.id || "";
        this.amount = obj && obj.amount || "";
       }
}

export class AgentApproveTransaction{  //Agent/Corporate
    agentId !: string ; 
    transactionIds !: string[];
    suspicious !: string;
    susRemarks !: string;
    
    constructor(obj?:any){
        this.agentId = obj && obj.agentId || "" ;
        this.transactionIds = obj && obj.transactionIds || [];
        this.suspicious = obj && obj.suspicious || "";
        this.susRemarks = obj && obj.susRemarks || "";
    }
} 

export class ApproveTransactionDbs{  //Consumer -> USD
    agentId !: string;
	transactionIds !: string[];
    contracts !: ContractInfo[];
    suspicious !: string ;
    susRemarks !: string;
    constructor(obj?:any){
     this.agentId = obj && obj.agentId || "";
     this.transactionIds = obj && obj.transactionIds || [];
     this.contracts = obj && obj.contracts || new ContractInfo();
     this.suspicious = obj && obj.suspicious || "N";
     this.susRemarks = obj && obj.susRemarks || "";
    } 
}

export class ContractInfo {
    contractId !: string;
    amount !: string;
    
    constructor(obj?:any){
        this.contractId = obj && obj.contractId || "";
        this.amount = obj && obj.amount || "";
      
       }
}

export class UpdateTransactionStatus {

    transactionId !: string ;
    documentData !: string ;
    paymentMode !: string;

    constructor(obj?:any){
     //write code here...
     this.transactionId= obj && obj.transactionId || "";
     this.documentData= obj && obj.documentData || "";
     this.paymentMode= obj && obj.paymentMode || "";
    }

    
}