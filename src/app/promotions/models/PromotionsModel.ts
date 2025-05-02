export class PromotionMaintenance{
    id!: number;
    promoId!: string;
    Description!: string;
    StartDate!: string;
    EndDate!: string;
    createdBy!: string;
    createdOn!: string;

    constructor(obj?:any){
       
        this.promoId = obj && obj.promoId || "";
        this.Description = obj && obj.Description || "" ;
        this.StartDate = obj && obj.StartDate || "";
        this.EndDate = obj && obj.EndDate || "";
        this.createdBy = obj && obj.createdBy || "";
        this.createdOn = obj && obj.createdOn || "";
    }
}