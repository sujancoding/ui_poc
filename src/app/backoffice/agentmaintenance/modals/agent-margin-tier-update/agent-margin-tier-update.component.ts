import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';

import { AgentMarginTierUpdate } from '../../models/agent.model';
import { SuccessDialogComponent } from 'src/app/shared/components/success-dialog/success-dialog.component';

@Component({
  selector: 'app-agent-margin-tier-update',
  templateUrl: './agent-margin-tier-update.component.html',
  styleUrls: ['./agent-margin-tier-update.component.scss','../../../../../assets/styles/tables/table-style.scss'],
  
})
export class AgentMarginTierUpdateComponent implements OnInit {

  agentAccountInquiry : any[] = [] ;
  agentName : string = "" ;
  isActive!:false;
  loader : boolean= false;
  noSearchData : boolean = false ;
  searchData : boolean = true ;
  errorMessage : string = "" ;
  form !: FormGroup ;
  accountNumber : string = "" ;
  agentId : string = "" ;
  marginTierArray : any[] = [ //margin tier dropdown options
    {"tier" : "0" },  {"tier" : "1" },  {"tier" : "2" },  {"tier" : "3" },  {"tier" : "4" },  {"tier" : "5" },
  ] ;
  agentAccountNo : string = "" ;
  agentAccountStatus : string = "" ;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<AgentMarginTierUpdateComponent>, private fb:FormBuilder,
   private dialog: MatDialog, private agentMaintenanceService: AgentMaintenanceService) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      rows: this.fb.array([])
    });

    if(this.data.isAgentAccountsInquiry){
      //agentName: agentName, acctStatus: acctStatus, acctNumber : acctNumber,agentId : agentId
      this.agentName = this.data.agentName ;
      this.agentId = this.data.agentId ;
      this.agentAccountNo = this.data.acctNumber ? this.data.acctNumber : "" ;
      this.agentAccountStatus = this.data.acctStatus ? this.data.acctStatus : "" ;
      //agent inquiry service call
      this.agentMaintenanceService.agentAccountsInquiry(this.agentId).subscribe((datas:any)=>{
       this.agentAccountInquiry = datas['data'] ;

    if(this.agentAccountInquiry.length >= 1){
      this.searchData = true ;
      this.noSearchData = false ;
      this.agentAccountInquiry.forEach( (items:any) => { //loop agentAccountInquiry (it holds response) using foreach
       let accountNo = items.ACCOUNTNO ? items.ACCOUNTNO : "" ;
       let accountName = items.ACCOUNTNAME ? items.ACCOUNTNAME : "" ;
       let marginTier = items.MARGINTIER ? items.MARGINTIER : "0" ;
       let accountStatus = items.ACCOUNTSTATUS ? items.ACCOUNTSTATUS : "" ;
       this.rows.push(this.tableRow(accountNo, accountName ,marginTier,accountStatus)) //push the respective elements in rows form array .
      })
      
     }
     else { //Display 'No Records found' when response length is 0
       this.searchData = false ;
       this.noSearchData = true ;
       this.errorMessage = "No Records Found" ;
     }

      },
      error => { //error handling
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
          }) ;
        } 
      }
    )
     
    }
    else{ //isAgentAccountsInquiry is undefiend
      this.agentAccountInquiry = [] ;
      this.searchData = false ;
      this.noSearchData = true ;
      this.errorMessage = "Error..Something Went Wrong !" ;
    }
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }
  
  tableRow(accountNo : string, accountName : string,marginTier : string,accountStatus:string): FormGroup {
    return this.fb.group({
      accountNo : [accountNo] ,
      accountName : [accountName] ,
      marginTier: [marginTier],
      editMode : [],
      accountStatus : [accountStatus]
    });
  }

// On update customer accounts
  updateCustomerAccounts(){
   this.agentMaintenanceService.updateMarginTier(this.agentAccountNo, this.buildPayload()).subscribe((data:any)=>{
     this.dialogRef.close() ;
     this.dialog.open(SuccessDialogComponent, {
      panelClass: 'custom-modalbox',
      width:'322px',
      height:'140px',
      data: `Agent Accounts Updated for ${this.agentName}`,
     })
   },
   (error:any) =>{ //error handling
    if(error.status != 401){ 
      this.dialog.open(ErrorDialogAdminComponent,{
         data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Update Agent Accounts Failed due to some technical reasons" }
       }) 
   }
   }
  )
  }


  //edit access 
 onEditAccess(index:any){
  // Set edit mode for the specific item in the array
   this.agentAccountInquiry[index].editMode = true;
 }

  //edit and save deal items
  onSaveMarginTier(index:any,updatedRecord:any){
  // Update the specific item in the array with edited values
   this.agentAccountInquiry[index].editMode = false;

  }

  buildPayload() : AgentMarginTierUpdate{
    let form : any[] = this.rows.value ;
    let marginTier = form[0].marginTier ? form[0].marginTier : "" ;
    let accountStatus = form[0].accountStatus ? form[0].accountStatus : "" ;
   return new AgentMarginTierUpdate({
    accountNumber : this.agentAccountNo ? this.agentAccountNo : "",
    accountStatus : accountStatus,
    marginTier : marginTier

   })
  }
}
