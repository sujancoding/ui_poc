export class RecentTransaction{
    photos!:string;
    moneySent!: string;
    name!: string;
    date!: string;
    status!: string;


    constructor(obj?:any){
        this.photos = obj && obj.photos || "";
        this.moneySent = obj && obj.moneySent || "";
        this.name = obj && obj.name || "";
        this.date = obj && obj.date || "";
        this.status = obj && obj.status || "" ;
    }
}