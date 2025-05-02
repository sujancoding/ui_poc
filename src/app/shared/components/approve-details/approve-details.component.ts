import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PayeeSearch } from 'src/app/backoffice/customer/model/customer.model';
import { AddPayee } from 'src/app/payee/payeeModel/updatePayee';
import { PayeeService } from 'src/app/payee/service/payee.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { InMemoryCache } from '../../services/cache.service';
import { getApplicantStatusBgColor, getApplicantStatusColor } from 'src/assets/transactionstatus';
import { bankCodeTypeArr, relationArr } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-approve-details',
  templateUrl: './approve-details.component.html',
  styleUrls: ['./approve-details.component.scss']
})
export class ApproveDetailsComponent implements OnInit {
   @Input() payeeDetails !: PayeeSearch[];
   action:any;
   loader: boolean = true;
   approveButtonLoader : boolean = false;
   rejectButtonLoader : boolean = false ;
   showApproveButton : boolean = true;
   showRejectButton : boolean = true ;
   isDisableApproveButton : boolean = false ;
   relation:any []=relationArr;
   status: string = "";
   bankCodeType : any[] = bankCodeTypeArr
   @Output() public approvePayeeEventEmitter= new EventEmitter(); 
   
   fulfillPayee(customerId:any,payeeId:any,action:string){
    this.action = action;
    let passData : string = "" ;
    if(action == "APPROVED"){
      this.approveButtonLoader=true;
      this.showApproveButton = false ;
      passData = "Payee Approved Successfully !" ;
      this.status="1"
    }
    else if(action == "REJECTED"){
      this.rejectButtonLoader=true;
      this.showRejectButton = false ;
      passData = "Payee Rejected !" ;
      this.status="2"
    }
  
    this.payeeService.payeeFulFilment(customerId,payeeId,this.status).subscribe((datas:any)=>{
      this.payeeDetails = datas['data'];

      this.approveButtonLoader=false; //Approve button loader
      this.showApproveButton = true;  //Approve button

      this.rejectButtonLoader =false; // Reject button loader
      this.showRejectButton = true; // Reject button

      this.approvePayeeEventEmitter.emit('Refresh');
      this.dialog.open(SuccessDialogComponent, {
        panelClass: 'custom-modalbox',
        width:'366px',
        height:'152px',
        data : passData
       })    },
      //error handling completed on 05-07-2023
      (error:any) =>{

        this.approveButtonLoader= false;
        this.showApproveButton = true;

        this.rejectButtonLoader =false; // Reject button loader
      this.showRejectButton = true; // Reject button

        if(error.status != 401){
          if(error.error.errorMessage == "Customer status inactive"){
            let error = "This is deactivated customer so unable to approve this payee."  // Show error message when backoffice user approve payee when customer status in Inactive   
            this.dialog.open(ErrorDialogAdminComponent,{
              data : { errorMessage : error }
            }) ;

          }
          else{
            this.dialog.open(ErrorDialogAdminComponent,{
              data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "Failed" }
            }) ;
          }
        }
      }
    )
  

  }
  getData(data: AddPayee) {
    console.log(data);
}
getColor(value: any) {
  return getApplicantStatusColor(value)
}

//bg color for status tags .
getBackgroundColor(status: string) {
  return getApplicantStatusBgColor(status);
}
responsiveCard(){
  return {'background-color': 'white' ,'margin-top': '10px' ,'height': (this.getScreenHeight - 184)+'px' , 'width': '86%;'}
}
responsiveButton(){
  return {'text-align': 'center', 'display':'flex', }
}
  constructor(public dialog: MatDialog,private payeeService: PayeeService, private store : InMemoryCache) { }

  ngOnChanges(): void {
    this.loader = true;

    let hasSpecificItem : string = this.store.getItem('APPROVE_PAYEE_BUTTON_ACCESS_CONTROL') ? this.store.getItem('APPROVE_PAYEE_BUTTON_ACCESS_CONTROL') : "" ;
       //we should enable this approve and reject btn only when hasSpecificItem is true and executed ..
       if(hasSpecificItem == "true"){
        this.isDisableApproveButton = false ;
       }
        if(hasSpecificItem == "false"){
        this.isDisableApproveButton = true ;
       }

    setTimeout(() => {
     this.payeeDetails = this.payeeDetails;
     this.loader= false;
    },500)
  }
  ngOnInit(): void {
   //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;
    
  }
  public getScreenWidth: any;
  public getScreenHeight: any;
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }
  getRelationDescription(code: string): string {
    let relationship = this.relation.find(item => item.CODE === code);
    return relationship ? relationship.RELATION : ""; // Fallback to code if no match is found
  }

  responsiveContent(){
    return {'height': (this.getScreenHeight - 390)+'px'}
  }

  // getting bank code description
  bankCodeTypeLabel(type:any) : string{
   let bankCode ;
   if(type){
    bankCode = this.bankCodeType.filter((v) => v.VALUE === type);
    return bankCode ? bankCode[0].DESCRIPTION : "";
   }
   return "ROUTING CODE";
  }

}
