export class AdminTransactionReceipt {
    CUSTOMER_ID !: string ;
    PAYEE_ID !: string ;
    EXCHANGE_RATE !: string ;
    AMOUNT_IN_SGD !: string ;
    AMOUNT_IN_FCY !: string ;
    BASE_CURRENCY !: string ;
    FOREIGN_CURRENCY !: string ;
    ADMIN_FEE  !: string ;
    PURPOSE  !: string ;
    SHARINGTYPE !: string ;

    constructor(obj ?: any){
      this.CUSTOMER_ID = obj && obj.CUSTOMER_ID || "" ;
      this.PAYEE_ID = obj && obj.PAYEE_ID || "" ;
      this.EXCHANGE_RATE = obj && obj.EXCHANGE_RATE || "" ;
      this.AMOUNT_IN_SGD = obj && obj.AMOUNT_IN_SGD || "" ;
      this.AMOUNT_IN_FCY = obj && obj.AMOUNT_IN_FCY || "" ;
      this.BASE_CURRENCY = obj && obj.BASE_CURRENCY || "" ;
      this.FOREIGN_CURRENCY = obj && obj.FOREIGN_CURRENCY || "" ;
      this.ADMIN_FEE = obj && obj.ADMIN_FEE || "" ;
      this.PURPOSE = obj && obj.PURPOSE || "" ;
      this.SHARINGTYPE = obj && obj.SHARINGTYPE || "" ;

    }
}

export class SharingTypeArray {
  shared !: string ;
  our !: string ;
  they !: string ;
}