import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Accounts, UpdateCustomerAccountsRq } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';

import { ErrorDialogAdminComponent } from '../errordialogadmin/error-dialog-admin.component';
import { SuccessDialogComponent } from 'src/app/shared/components/success-dialog/success-dialog.component';

@Component({
  selector: 'app-update-customer-accounts',
  templateUrl: './update-customer-accounts.component.html',
  styleUrls: ['./update-customer-accounts.component.scss','../../../../../assets/styles/tables/table-style.scss'],
  
})
export class UpdateCustomerAccountsComponent implements OnInit {

  customerAccountsSearch : any[] = [] ;
  customerName : string = "" ;
  customerType : string = "" ;
  isActive!:false;
  loader : boolean= false;
  noSearchData : boolean = false ;
  searchData : boolean = true ;
  errorMessage : string = "" ;
  form !: FormGroup ;
  customerTypeDescription : string = "" ;
  customerId : string = "" ;
  marginTierArray : any[] = [ //margin tier dropdown options
    {"tier" : "0" },  {"tier" : "1" },  {"tier" : "2" },  {"tier" : "3" },  {"tier" : "4" },  {"tier" : "5" },
  ] ;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<UpdateCustomerAccountsComponent>, private fb:FormBuilder,
  private customerSearchService: CustomerSearchService, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      rows: this.fb.array([])
    });

    if(this.data.isCustomerAccountsInquiry){
      this.customerName = this.data.customerName ;
      this.customerType = this.data.customerType ;
      this.customerId = this.data.customerId ;
      if(this.customerType && this.customerType == "I"){
        this.customerTypeDescription = "Individual" ;
      }
      else if(this.customerType && this.customerType == "C"){
        this.customerTypeDescription = "Corporate" ;
      }
      this.customerAccountsSearch = this.data.isCustomerAccountsInquiry ;
      if(this.customerAccountsSearch.length >= 1){
       this.searchData = true ;
       this.noSearchData = false ;
       this.customerAccountsSearch.forEach( (items:any) => { //loop customerAccountsSearch (it holds response) using foreach
        let accountNo = items.ACCOUNTNO ? items.ACCOUNTNO : "" ;
        let accountName = items.ACCOUNTNAME ? items.ACCOUNTNAME : "" ;
        let status = items.ACCOUNTSTATUS ? items.ACCOUNTSTATUS : "" ;
        let productType = items.ACCOUNTPRODUCTTYPE ? items.ACCOUNTPRODUCTTYPE : "" ;
        let marginTier = items.MARGINTIER ? items.MARGINTIER : "0" ;
        this.rows.push(this.tableRow(accountNo, accountName , status, productType,marginTier)) //push the respective elements in rows form array .
       })
       
      }
      else { //Display 'No Records found' when response length is 0
        this.searchData = false ;
        this.noSearchData = true ;
        this.errorMessage = "No Records Found" ;
      }
    }
    else{ //isCustomerAccountsInquiry is undefiend
      this.customerAccountsSearch = [] ;
      this.searchData = false ;
      this.noSearchData = true ;
      this.errorMessage = "Error..Something Went Wrong !" ;
    }
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }
  
  tableRow(accountNo : string, accountName : string, status:string, productType : string,marginTier : string): FormGroup {
    return this.fb.group({
      accountNo : [accountNo] ,
      accountName : [accountName] ,
      status : [status == '1'],
      productType : [productType],
      marginTier: [marginTier],
      editMode : []
    });
  }

// On update customer accounts
  updateCustomerAccounts(){
   this.customerSearchService.updateCustomerAccounts(this.buildPayload()).subscribe((data:any)=>{
     this.dialogRef.close() ;
     this.dialog.open(SuccessDialogComponent, {
      panelClass: 'custom-modalbox',
      width:'322px',
      height:'140px',
      data: `Customer Accounts Updated for ${this.customerName}`,
     })
   },
   (error:any) =>{ //error handling
    if(error.status != 401){ 
      this.dialog.open(ErrorDialogAdminComponent,{
         data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Update Customer Accounts Failed due to some technical reasons" }
       }) 
   }
   }
  )
  }

  buildPayload():UpdateCustomerAccountsRq{
   return new UpdateCustomerAccountsRq({
    customerId : this.customerId ,
    accounts : this.buildAccountsPayload() 
   })
  }

  buildAccountsPayload(): Accounts[]{
  let accountsArray : Accounts[] = [] ;
  let form : any[] = this.rows.value ;
  if(form.length >= 1){
    console.log(form) ;
    form.forEach(items => {
      let marginTier = items.marginTier ? items.marginTier  : "" ;
      accountsArray.push(new Accounts({
        accountNumber : items.accountNo ? items.accountNo : "" ,
        status : items.status ? 1 : 0, // If true, store 1, else store 0 // 1 --> ACTIVE , 0 --> INACTIVE
        productType : items.productType ? items.productType : "",
        marginTier : (this.customerType == 'I' || items.productType == 'MC') ?  "" : marginTier // margin tier needs be sent only for corporate customers and it productType should be 'RT'
      }))
    })
   }  
   return accountsArray ;
  }


  //edit access 
 onEditAccess(index:any){
  // Set edit mode for the specific item in the array
   this.customerAccountsSearch[index].editMode = true;
 }

  //edit and save deal items
  onSaveMarginTier(index:any){
  // Update the specific item in the array with edited values
   this.customerAccountsSearch[index].editMode = false;

  }

}
