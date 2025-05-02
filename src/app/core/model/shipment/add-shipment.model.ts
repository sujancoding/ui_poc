
//Date Model for Add Shipment Request Payload .

export class AddShipment{
    customerId !: string;
    shippedDate !: String;
    status !: string;
    flightNo !: string;
    referenceNumber !: string;
    destination !: string;
    address !: Address ;   
    contactDetails !: ContactDetails ;
    baggageDetail !: BaggageDetail[] ;
    deals !: Deals[] ;
    denomination !: Denomination[] ;
    shipmentType !: string;
    bankName !: string ;

    constructor(obj?:any){
        this.customerId = obj && obj.customerId || "" ;
        this.shippedDate = obj && obj.shippedDate || "" ;
        this.status = obj && obj.status || "" ;
        this.flightNo = obj && obj.flightNo || "" ;
        this.referenceNumber  = obj && obj.referenceNumber || "" ;
        this.destination = obj && obj.destination || "" ;
        this.address = obj && obj.address || new Address() ;
        this.contactDetails = obj && obj.contactDetails || new ContactDetails() ;
        this.baggageDetail = obj && obj.baggageDetail || null ;
        this.deals = obj && obj.deals || [] ;
        this.denomination = obj && obj.denomination || [];
        this.shipmentType = obj && obj.shipmentType || "";
        this.bankName = obj && obj.bankName || "";
    }

  }
  
export class Address {
    name !: string;
    unit !: string;
    block !: string;
    street !: string;
    city !: string;
    state !: string;
    country !: string;
    postalCode !: string;
    level !: string ;

    constructor(obj?:any){
     //write code here..
     this.name = obj && obj.name || "" ;
     this.level = obj && obj.level || "" ;
     this.unit = obj && obj.unit || "" ;
     this.block = obj && obj.block || "" ;
     this.street = obj && obj.street || "" ;
     this.city = obj && obj.city || "" ;
     this.state = obj && obj.state || "" ;
     this.country = obj && obj.country || "" ;
     this.postalCode = obj && obj.postalCode || "" ;
    }
}

export class ContactDetails {
    ctryCode  !: string;
    phoneNbr !: string;
    emailId  !: string;

    constructor(obj?:any){
     //write code here..
     this.ctryCode = obj && obj.ctryCode || "" ;
     this.phoneNbr = obj && obj.phoneNbr || "" ;
     this.emailId = obj && obj.emailId || "" ;
    }
}

export class BaggageDetail {
    number !: string;
    weight  !: string;
    dimension  !: string;
    constructor(obj?:any){
        this.number = obj && obj.number || "" ;
        this.weight = obj && obj.weight || "" ;
        this.dimension = obj && obj.dimension || "" ;
    }
}

export class Deals {
    dealItemId !: string;
    buySellInd !: string;
    ccyNo !: string;
    ccyCode !: string;
    amountL!: string;
    amount !: string;
    exchRateF !: string;
    exchRateL !: string;
    valueDate !: string;
    remarks !: string;
    multiplyDealAmount !: string ;

    constructor(obj?:any){
        this.dealItemId = obj && obj.dealItemId || "" ;
        this.buySellInd = obj && obj.buySellInd || "" ;
        this.ccyNo = obj && obj.ccyNo || "" ;
        this.ccyCode = obj && obj.ccyCode || "" ;
        this.amountL = obj && obj.amountL || "" ;
        this.amount = obj && obj.amount || "" ;
        this.exchRateF = obj && obj.exchRateF || "" ;
        this.exchRateL = obj && obj.exchRateL || "" ;
        this.valueDate = obj && obj.valueDate || "" ;
        this.remarks = obj && obj.remarks || "" ;
        this.multiplyDealAmount = obj && obj.multiplyDealAmount || "" ;
    }
}

export class Denomination {
    ccyNo !: string;
    ccyCode  !: string;
    count  !: number;
    ccyValue  !: number;
    amount  !: string;
    remarks  !: string;

    constructor(obj?:any){
        this.ccyNo = obj && obj.ccyNo || "" ;
        this.ccyCode = obj && obj.ccyCode || "" ;
        this.count = obj && obj.count || 0 ;
        this.ccyValue = obj && obj.ccyValue || 0 ;
        this.amount = obj && obj.amount || "" ;
        this.remarks = obj && obj.remarks || "" ;
    }
}