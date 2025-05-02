import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { ApplicationFulFillment } from 'src/app/core/model/ApplicationFulFillment';
import { ApplicationService } from 'src/app/core/services/application.service';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { PayeeService } from 'src/app/payee/service/payee.service';
import { PayeeSearch } from '../../customer/model/customer.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogAdminComponent } from './errordialogadmin/error-dialog-admin.component';
import { CustomerStatusUpdate } from 'src/app/core/model/customersearch/customersearch';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  inactiveFlag : Boolean = false;
  rejectApplicant !: Boolean ;
  inactiveCustomerFlag !: Boolean;
  customerId : any;
  payeeId: any;
  status : any;
  action: any;
  payeeSearch : PayeeSearch = new PayeeSearch();
  customerInquiry : CustomerInquiry = new CustomerInquiry();
  activateCustomerFlag : Boolean = false;
  deactivateCustomerFlag : Boolean = false;
  InactivePayeeFlag : Boolean = false;
  activePayeeFlag : Boolean = false;
  loader : boolean = false;
  showConfirmButton : boolean = true;
  productCode !: string ;
  customerStatusReason : string = "" ;

  closeAll(){
    this.rejectApplicant = false;
    this.loader = true;
    this.applicationService.applicationFulFilment(this.Rejected()).subscribe(data => {
      console.log(data);
      this.rejectApplicant = true;
      this.loader = false;
      if(data !=  undefined){
        this.store.setItem('APPLICATION_REJECTED',data);
        this.dialogRef.closeAll();
      }
      
    },
     //error handling completed on 01-06-2023
  (error:any)=>{
    this.rejectApplicant = true;
    this.loader = false;
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }
  Rejected(): ApplicationFulFillment{
    let applicationId : any ;
    if(this.productCode == "MC"){
      applicationId = this.store.getItem('MC_IND_APPLICATION_ID') ? this.store.getItem('MC_IND_APPLICATION_ID') : "" ;
    }
    else if(this.productCode == ""){
      applicationId = this.store.getItem('APPLICATION_ID') ;
    }
    return new ApplicationFulFillment({
      "applicationId": applicationId,
      "status": "REJECTED"
    })
  }
  inactive(){ 
    this.showConfirmButton = false;
    this.loader = true ;
    this.customerId = this.store.getItem('CUSTOMER_ID')
    this.status = "0";
    this.customerSearchService.customerStatusUpdate(this.customerId , this.status,this.buildPayload()).subscribe( (data:any) => {
      this.customerInquiry = data;
      this.showConfirmButton = true;
      this.loader = false ;
      if(data != undefined){ 
        this.store.setItem('CUSTOMER_INACTIVATE', data)
      }
      this.dialogRef.closeAll();
    },
     (error:any)=>{
      this.showConfirmButton = true;
      this.loader = false ;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    })
  }

  buildPayload():CustomerStatusUpdate{
   return new CustomerStatusUpdate({
    remarks : this.customerStatusReason ? this.customerStatusReason : "" 
   })
  }

  closeActivationDialog(){
    this.showConfirmButton = false;
    this.loader = true ;
    this.customerId = this.store.getItem('CUSTOMER_ID');
    this.status = "1";
    this.customerSearchService.customerStatusUpdate(this.customerId , this.status,this.buildPayload()).subscribe( (data:any) => {
      this.customerInquiry = data;
      this.showConfirmButton = true;
      this.loader = false ;
      if(data != undefined){
        this.store.setItem('CUSTOMER_ACTIVATE', data)
      }
      this.dialogRef.closeAll();
    },
    (error:any)=>{
      this.showConfirmButton = true;
      this.loader = false ;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    })
  }

  closeInactiveDialog(){
    this.showConfirmButton = false;
    this.loader = true ;
    this.customerId = this.store.getItem('CUSTOMER_ID')
    this.payeeId = this.store.getItem('PAYEE_ID')
    this.action = "3"
    this.payeeService. payeeFulFilment(this.customerId,this.payeeId,this.action).subscribe( data => {
    this.payeeSearch = data;
    this.showConfirmButton = true;
    this.loader = false ;
    this.snackBar.open("Payee Successfully Deactivated !" , "Ok",{
      panelClass: "red-notification-snackbar",
      duration : 4000
    });
    },
     //error handling completed on 05-07-2023
     (error:any) =>{
      this.showConfirmButton = true;
      this.loader = false ;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
    )
    this.dialogRef.closeAll();
  }

  closeactiveDialog(){
    this.showConfirmButton = false;
    this.loader = true ;
    this.customerId = this.store.getItem('CUSTOMER_ID')
    this.payeeId = this.store.getItem('PAYEE_ID')
    this.action = "1"
    this.payeeService.payeeFulFilment(this.customerId,this.payeeId,this.action).subscribe( data => {
    this.payeeSearch = data;
    this.showConfirmButton = true;
    this.loader = false ;
    this.snackBar.open("Payee Successfully Activated !" , "Ok",{
      panelClass: "green-notification-snackbar",
      duration : 4000
    });
    },
     //error handling completed on 05-07-2023
     (error:any) =>{
      this.showConfirmButton = true;
      this.loader = false ;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
    )
    this.dialogRef.closeAll();

  }
  constructor(private dialogRef: MatDialog ,@Inject(MAT_DIALOG_DATA) public data: any, private applicationService: ApplicationService,
  private store: InMemoryCache , private customerSearchService: CustomerSearchService,private payeeService : PayeeService,private snackBar : MatSnackBar) { }

  ngOnInit(): void {

    if(this.data.rejectApplication){
      this.deactivateCustomerFlag = true;
      this.inactiveFlag = false;
      this.rejectApplicant = true;
      this.productCode = this.data.productCode ? this.data.productCode : "" ;
    }
    if(this.data.inactiveCustomer){
      this.inactiveCustomerFlag = true;
    }
    if(this.data.activeCustomer){
      this.activateCustomerFlag = true;
      this.deactivateCustomerFlag = false;
    }
    if(this.data.isPayeeReview){
      if(this.data.isPayeeReview == "INACTIVATE_PAYEE"){
        this.InactivePayeeFlag = true;
        this.deactivateCustomerFlag = false;
        this.rejectApplicant = false;
      }
      if(this.data.isPayeeReview == "ACTIVATE_PAYEE"){
       this.activePayeeFlag = true;
      }
    }
    
    if(this.data.inactiveCorporate){
      this.deactivateCustomerFlag = true;
      this.inactiveFlag = true;
      this.rejectApplicant = false; 
    }
    if(this.data.activeCorporate){
      this.activateCustomerFlag = true;
      this.deactivateCustomerFlag = false;
    }
  }

}

@Component({
  selector: 'app-approved-prospect',
  templateUrl:'./approved-prospect.component.html',
  styleUrls: ['./approved-prospect.component.scss']
 
})

export class ApprovedProspect {
  
constructor(private dialogRef : MatDialog){}

  closeAllDialog(){
    this.dialogRef.closeAll();
  }
}
