import { Address, BaggageDetail, ContactDetails, Denomination } from "./add-shipment.model";

//write data model here ..
export class UpdateShipment{
    customerId !: string;
    status !: string;
    shippedDate !: string;
    flightNo !: string;
    referenceNumber !: string;
    destination !: string;
    address !: Address;
    contactDetails !: ContactDetails;
    baggageDetail !: BaggageDetail[];
    deals !: UpdateDeals[];
    denomination !: Denomination[];
    bankName !: string;
    shipmentType !: string;

    constructor(obj?:any){
        this.customerId = obj && obj.customerId || "" ;
        this.status = obj && obj.status || "" ;
        this.shippedDate = obj && obj.shippedDate || "" ;
        this.flightNo = obj && obj.flightNo || "" ;
        this.referenceNumber = obj && obj.referenceNumber || "" ;
        this.destination = obj && obj.destination || "" ;
        this.address = obj && obj.address || new Address() ;
        this.contactDetails = obj && obj.contactDetails || new ContactDetails() ;
        this.baggageDetail = obj && obj.baggageDetail || [] ;
        this.deals = obj && obj.deals || [] ;
        this.denomination = obj && obj.denomination || [];
        this.bankName = obj && obj.bankName || "" ;
        this.shipmentType = obj && obj.shipmentType || "" ;
    }

}



export class UpdateDeals{
    dealItemId !: string;
    buySellInd !: string;
    ccyNo !: string;
    ccyCode !: string;
    amountL !: string;
    amountF !: string;
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
        this.amountF = obj && obj.amountF || "" ;
        this.amount = obj && obj.amount || "" ;
        this.exchRateF = obj && obj.exchRateF || "" ;
        this.exchRateL = obj && obj.exchRateL || "" ;
        this.valueDate = obj && obj.valueDate || "" ;
        this.remarks = obj && obj.remarks || "" ;
        this.multiplyDealAmount = obj && obj.multiplyDealAmount || "" ;
    }
}




// {
//     "customerId": "Ce2ace57b31",
//     "status": "2",
//     "shippedDate": "2024-08-08 00:00:00.0",
//     "flightNo": "S543F34",
//     "flightName": "20",
//     "destination": "UAE",
//     "address": {
//         "name": "ANTONYDAS",
//         "level": "23",
//         "unit": "23",
//         "block": "B",
//         "street": "Mainless road",
//         "city": "",     
//         "state": "",      
//         "country": "India",
//         "postalCode": "620001"
//     },
//     "contactDetails": {
//         "ctryCode": "3245",
//         "phoneNbr": "9944672345",
//         "emailId": "leoprakash22@gmail.com"
//     },
//     "baggageDetail": [
//          {
//             "number": "1",
//             "weight": "88.00",         
//             "dimension": "17*92*23"
//         }
//     ],
//     "deals": [
//         {
//             "dealItemId": "37172319987801",
//             "exchRateF": "1.000000",  
//             "amountF": "2323.00"        
//         }
//     ]
// }