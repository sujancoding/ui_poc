
// ADD KYC MODEL (POST)
export class KycAdd {
    label !: string ;
    maxAmount !: string ;
    minAmount !: string ;
    maxFrequency !: string ;
    minFrequency !: string ;

    constructor(obj?:any){
      this.label = obj && obj.label || "" ;
      this.maxAmount = obj && obj.maxAmount || "" ;
      this.minAmount = obj && obj.minAmount || "" ;
      this.maxFrequency = obj && obj.maxFrequency || "" ;
      this.minFrequency = obj && obj.minFrequency || "" ;
    }
}


// UPDATE KYC MODEL (PUT)
export class KycUpdate {
    id !: string ;
    maxAmount !: string ;
    minAmount !: string ;
    maxFrequency !: string ;
    minFrequency !: string ;

    constructor(obj?:any){
      this.id = obj && obj.id || "" ;
      this.maxAmount = obj && obj.maxAmount || "" ;
      this.minAmount = obj && obj.minAmount || "" ;
      this.maxFrequency = obj && obj.maxFrequency || "" ;
      this.minFrequency = obj && obj.minFrequency || "" ;
    }
}


