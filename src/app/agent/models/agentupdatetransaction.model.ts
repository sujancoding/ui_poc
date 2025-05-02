export class TransactionStatusUpdate{
    transactionId !: string;
    documentData !: string;

    constructor(obj?:any){
        this.transactionId = obj && obj.transactionId || "";
        this.documentData = obj && obj.documentData || "";
    }
}