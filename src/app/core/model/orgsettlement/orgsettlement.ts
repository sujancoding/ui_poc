export class OrganisationSettlement{
    accountName !: string;
    plAccountName  !: string; 
    accountBalance !: number;
    plAccountBalance !: number;
    
    constructor(obj?:any){
     this.accountName = obj && obj.accountName || "";
     this.plAccountName = obj && obj.plAccountName || "";
     this.accountBalance = obj && obj.accountBalance || "";
     this.plAccountBalance = obj && obj.plAccountBalance || "";
    }
}
// added remarks in AssetAccountSettlement data model
export class AssetAccountSettlement {

    amount !: string;
    remarks !:string;
    mode !: string;

    constructor(obj?: any) {
        this.amount = obj && obj.amount || "";
        this.remarks = obj && obj.remarks || "";
        this.mode = obj && obj.mode || "" ;
    }
}