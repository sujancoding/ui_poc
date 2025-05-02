import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/shared/global.constant';
import { AddShipment } from '../model/shipment/add-shipment.model';
import { UpdateShipment } from '../model/shipment/update-shipment.model';




@Injectable({
  providedIn: 'root'
})
export class ShipmentMaintenanceService {


    constructor(private http: HttpClient) {

    }
    //error handling function is declared because we will not take the error message from response , we take only status code here (401)
    errorHandling(error: HttpErrorResponse) {
        return Observable.throw(error || "server issue");
    }

    //Add Shipment Service
    addShipment(reqPayload: AddShipment,customerId:string):Observable<any>{
      return this.http.post<any>(GlobalConstants.API_BASE_URL + GlobalConstants.ADD_SHIPMENT_API.replace("{customerId}",customerId) , reqPayload ).catch(this.errorHandling);
    }

    //Shipment Search API to write here below .. URI entry already done in global constants . And subscribe this service function in respective component .
    // in req params , map --> custName , shipmentId , dateGt and dateLt  .
    shipmentSearch(customerName:string, shipmentId:string, dateGt:any, dateLt:any):Observable<any[]>{
     //write code here .
     return this.http.get<any[]>(GlobalConstants.API_BASE_URL + GlobalConstants.SHIPMENT_SEARCH_API + "custName=" + customerName + "&shipmentId=" + shipmentId + "&dateGt=" + dateGt + "&dateLt=" + dateLt).catch(this.errorHandling);
    }

    //Shipment Inquiry API to write here below .. URI entry already done in global constants . And subscribe this service function in respective component .
    // In PATH VARIABLE , map --> shipmentId .
    shipmentInquiry(shipmentId:string):Observable<any>{
      //write code here .
      return this.http.get<any>(GlobalConstants.API_BASE_URL + GlobalConstants.SHIPMENT_INQUIRY_API.replace("{shipmentId}",shipmentId)).catch(this.errorHandling);
    }

     //Update Shipment Service
     updateShipment(reqPayload: UpdateShipment,shipmentId:string):Observable<any>{
      return this.http.put<any>(GlobalConstants.API_BASE_URL + GlobalConstants.SHIPMENT_UPDATE_API.replace("{shipmentId}",shipmentId) , reqPayload ).catch(this.errorHandling);
    }


     //shipment receipt download api 
     shipmentDownloadReceipt(shipmentId:string):Observable<any>{
      let receiptUri = GlobalConstants.SHIPMENT_RECEIPT_API.replace("{shipmentId}",shipmentId) ;
      return this.http.get(GlobalConstants.API_BASE_URL + receiptUri,{responseType:'arraybuffer'}).catch(this.errorHandling)
    }

     // In PATH VARIABLE , map --> customerId .
     // req params to include - ccyCode,customerId,type,status,dateGt, dateLt
     shipmentCustomerDetailInquiry(customerId:string, shipmentType:string):Observable<any>{
      return this.http.get<any>(GlobalConstants.API_BASE_URL + 
        GlobalConstants.SHIPMENT_CUSTOMER_DETAIL_INQUIRY_API.replace("{customerId}",customerId) + "shipmentType=" + shipmentType
      )
      .catch(this.errorHandling);
    }
    //BACKUP FOR ABOVE SERVICE FUNCTION
    // shipmentCustomerDetailInquiry(ccyCode:string, customerId:string, type:string, status:string, dateGt:any, dateLt:any):Observable<any>{
    //   return this.http.get<any>(GlobalConstants.API_BASE_URL + 
    //     GlobalConstants.SHIPMENT_CUSTOMER_DETAIL_INQUIRY_API.replace("{customerId}",customerId) + "?ccyCode=" + ccyCode + "&type=" + type + "&status=" + status +
    //     "&dateGt=" + dateGt + "&dateLt=" + dateLt
    //   )
    //   .catch(this.errorHandling);
    // }
}