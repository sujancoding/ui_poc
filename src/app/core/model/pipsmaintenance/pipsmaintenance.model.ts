
export class UpdatePips{
    pipsData !: PipsData[];
    constructor(obj:any){
     this.pipsData = obj && obj.pipsData || "";
    }

}


export class PipsData{   
    ccyPair !: string;
    marginRate !: string;
    pips !: number;
    constructor(obj: any){
     this.ccyPair = obj && obj.ccyPair || "";
     this.marginRate = obj && obj.marginRate || "";
     this.pips = obj && obj.pips || "";
    }

}
