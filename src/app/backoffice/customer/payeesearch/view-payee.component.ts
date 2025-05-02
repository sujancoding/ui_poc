import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { AddPayee } from 'src/app/payee/payeeModel/updatePayee';
import { PayeeService } from 'src/app/payee/service/payee.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import { ConfirmationDialogComponent } from '../../shared/modals/confirmation-dialog.component';
import { PayeeSearch } from '../model/customer.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { bankCodeTypeArr, relationArr } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-view-payee',
  templateUrl: './view-payee.component.html',
  styleUrls: ['./view-payee.component.scss','../../../../assets/styles/tables/table-style.scss'],
  
})
export class ViewPayeeComponent implements OnInit {
 searchpayee : PayeeSearch[] = [] ;
 isActive = false;
 selectedStatus !: string;
 customerId : any;
 payeeId: any;
 payeeid:any
 action: any;
 isDisabledInActive = true;
 isDisabledActive = true;
 loader : Boolean = false;
 deactivateButtons : Boolean = false;
 activateButtons : Boolean = false;
 customerName !: string; 
 filterForm : FormGroup = Object.create(null);
 p: number = 1;
 itemsPerPage: number = 20;
 relation:any []=relationArr;
 status : string ="";
 isCustomerSearch : boolean = false;
 bankCodeType : any [] = bankCodeTypeArr;
  constructor(private dialogRef: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any , private payeeService: PayeeService,private store: InMemoryCache,private headerService : TitleHeaderService,private fb :FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      payeeName :  [null,Validators.compose([Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')])],
    })
    this.selectedStatus = "ACTIVE";
    if(this.data.isPayeeReview){
      this.customerName = this.data.CUSTOMER_NAME ;
      this.deactivateButtons = true;
      this.activateButtons = false;
      this.headerService.setTitle('Customers');
      this.searchpayee = this.data.isPayeeReview;
      this.isCustomerSearch = true;
    }

// dheepan changes 25-08-2023 , To view agent payee by backoffice
    if(this.data.agentPayeeReview){
      this.customerName = this.data.AGENT_NAME ;
      this.deactivateButtons = true; // show inactive button
      this.activateButtons = false;
      this.headerService.setTitle('Agent Onboarding');
      this.searchpayee = this.data.agentPayeeReview;
    }

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

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 482)+'px' , 'overflow-y' : 'auto' };
  }
  customerSearchTableHeight(){
    return { 'height': 485 + 'px', 'overflow-y': 'auto' };
  }
  openInActive(){
    this.dialogRef.open(ConfirmationDialogComponent, {  
      data:{isPayeeReview : "INACTIVATE_PAYEE"}
    });
  }
  openActive(){
    this.dialogRef.open(ConfirmationDialogComponent, {  
      data:{isPayeeReview : "ACTIVATE_PAYEE"}
    });
  }
  //getColor() -> adds color for the status text
  getColor(status: any){
    switch(status) {
      case 'ACTIVE' :
        return'green';

        case 'INACTIVE' :
        return'red';

    }
  }
  inactivePayee(PAYEEID:any){
    this.payeeid =  this.store.setItem('PAYEE_ID',PAYEEID)
    this.isDisabledInActive = false;
    this.isDisabledActive = false;
  }
  applyFilter(status:string){
     let payeeName = this.filterForm.controls['payeeName'].value ? this.filterForm.controls['payeeName'].value : "" ;
    this.loader = true;
    let customerId = this.store.getItem('CUSTOMER_ID');
    if(status == "ACTIVE"){
      this.deactivateButtons = true;
      this.activateButtons = false;
      this.isDisabledInActive = true;
      this.isDisabledActive = true;
      this.status="1"
    }
    else if (status == "INACTIVE"){
      this.deactivateButtons = false;
      this.activateButtons = true;
      this.isDisabledInActive = true;
      this.isDisabledActive = true;
      this.status="3"
    }
    this.payeeService.filterCustomersPayee(customerId,this.status,payeeName).subscribe((datas:any)=>{
      this.searchpayee = datas['data'];
       // Reset page to 1
       this.p = 1;
      this.loader = false;

    },
     //error handling completed on 04/07/2023
     (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent)
      }
    }
    );
  }
  
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }
  getRelationDescription(code: string): string {
    let relationship = this.relation.find(item => item.CODE === code);
    return relationship ? relationship.RELATION : ""; // Fallback to code if no match is found
  }

  //getting bank code Description
  getBankCodeDescription(code: string) : String{
    let bankCodeType : any ;
    if(code){
     bankCodeType = this.bankCodeType.find((v) => v.VALUE === code);
     return  bankCodeType ? bankCodeType.DESCRIPTION : "";
    }
    return "ROUTING CODE" ;
  }
}
