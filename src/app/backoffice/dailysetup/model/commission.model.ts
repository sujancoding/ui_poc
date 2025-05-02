

export class CommissionReq {
    rate !: Rate;
    ccy !: string;

    constructor(obj?:any){
     this.rate = obj && obj.rate || new Rate();
     this.ccy = obj && obj.ccy || "" ;
    }
}

export class Rate{
    individual !: SharingTypeRq[] ;
    corporate !: SharingTypeRq[] ;
    agent !: SharingTypeRq[] ;

    constructor(obj?:any){
        this.individual = obj && obj.individual || new SharingTypeRq();
        this.corporate = obj && obj.corporate || new SharingTypeRq();
        this.agent = obj && obj.agent || new SharingTypeRq();
       }
}

export class SharingTypeRq{
    org !: string ;
    bank !: string ;
    sharingType !: string ;

    constructor(obj?:any){
        this.org = obj && obj.org || "";
        this.bank = obj && obj.bank || "" ;
        this.sharingType = obj && obj.sharingType || "" ;
       }

}




 // {	
  //   rate:{	
  //   individual:{	
  //     org : 50,
  //     bank : 50,
  //     },
  //   corporate: {	
  //     org : 50,
  //     bank : 50,
  //     },
  //   agent: {	
  //     org : 50,
  //     bank : 50,
  //     }
  //   },	
  //   ccy: "USD"	
  //   }