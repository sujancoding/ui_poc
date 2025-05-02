import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayeeSearch } from 'src/app/backoffice/customer/model/customer.model';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { PayeeList } from '../payeeModel/remit-money';
import { PayeeService } from '../service/payee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { getPayeeStatusColor, getPayeeTextColor } from 'src/assets/transactionstatus';

@Component({
  selector: 'app-all-payee',
  templateUrl: './all-payee.component.html',
  styleUrls: ['./all-payee.component.scss']
})
export class AllPayeeComponent implements OnInit {
 searchPayee: PayeeSearch[]=[];
 stage: any;
 isDisable !: Boolean;
 searchName !: string;
 showNoTransactionMessage : Boolean = false ;
 public form: FormGroup = Object.create(null);
 customerId !: string;
 loader : boolean = false;

 constructor(private router: Router,private payeeService: PayeeService , private store : InMemoryCache,private headerService : TitleHeaderService,private fb : FormBuilder,private dialog : MatDialog) { }

 ngOnInit(): void {

  this.form = this.fb.group({
  payeeName : [null,Validators.compose([Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$'),Validators.maxLength(35)])]
  })

  this.headerService.setTitle('All Payee');
   this.customerId = this.store.getItem('CUSTOMER_ID');
   let customerStatus = this.store.getItem('CUSTOMER_STATUS');
   if(customerStatus == "INACTIVE"){
    this.isDisable = true;
   }else{
    this.isDisable = false;
   }
   let status =  '0,1';
   this.loader = true;
   this.payeeService.viewCustomersPayee(this.customerId,status).subscribe((datas:any) => {
     this.searchPayee = datas['data'];
     this.loader = false;
   },
   //error handling
(error : any) => {
  this.loader = false;
  if(error.status != 401){
    this.loader = false;
    this.dialog.open(ErrorDialogComponent); 
   }
})
   if(this.store.getItem('APPLICATIONSTATUS') == "NEW"){
       this.isDisable = true;
       this.showNoTransactionMessage = true ;
   }
   if(this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
    this.isDisable = true;
    this.showNoTransactionMessage = true ;
}
if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED"){
  this.isDisable = false;
}
 }

getColor(status: any) : any{
 return getPayeeStatusColor(status)
}
getTextcolor(status : any) : any {
  return getPayeeTextColor(status)
}
onClick(){
  this.router.navigate(['/payee/add-payee'])
}

navigateViewPayee(customerId:any,payeeId:any){
   this.router.navigate([`payee/add-payee/${customerId}/${payeeId}`])
}

getPayeeName(name: string){
  let status : string = "0,1"
  let payeeName : string = name ? name : "";
  this.loader = true;
this.payeeService.searchPayeeName(status,payeeName,this.customerId ).subscribe((datas:any) => {
  this.searchPayee = datas['data'];
  this.loader = false;
},
//error handling
(error : any) => {
  this.loader = false;
  if(error.status != 401){
    this.dialog.open(ErrorDialogComponent); 
   }
})
}

}
