export class GenerateQR{
        productCode !: string;
        transactionId !: string;
        customerId !: string;
        amountLocal !: string;
        expireInMts !: string;
        
        constructor(obj?:any){
            this.productCode = obj && obj.productCode || "";
            this.transactionId = obj && obj.transactionId || "";
            this.customerId = obj && obj.customerId || "";
            this.amountLocal = obj && obj.amountLocal || "";
            this.expireInMts = obj && obj.expireInMts || "";
        }
}