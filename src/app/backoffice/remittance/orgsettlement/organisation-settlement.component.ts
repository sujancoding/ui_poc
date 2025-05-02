import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrganisationSettlement } from 'src/app/core/model/orgsettlement/orgsettlement';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { OrganisationSettlementService } from 'src/app/core/services/orgsettlement.service';

import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { Router } from '@angular/router';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import moment from 'moment';
import { AgentSettlementService } from 'src/app/core/services/agentsettlement.service';
import { OrganisationAssetAccountSettlementComponent } from '../../shared/modals/organisation-asset-account-settlement/organisation-asset-account-settlement.component';
import { OrganisationExpensesAddComponent } from '../../shared/modals/organisation-expenses-add/organisation-expenses-add.component';
import { OrganisationResetAccountBalanceComponent } from '../../shared/modals/organisation-reset-account-balance/organisation-reset-account-balance.component';
import { OrganisationFundTransferComponent } from '../../shared/modals/organisation-fund-transfer/organisation-fund-transfer.component';

@Component({
  selector: 'app-organisation-settlement',
  templateUrl: './organisation-settlement.component.html',
  styleUrls: ['./organisation-settlement.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  
})
export class OrganisationSettlementComponent implements OnInit {

  p : number=1;
  orgsettlement: any[] = [];
  loader : Boolean = false;
  showSettlementIcon : Boolean = true ;
  settlementDialog : any;
  arrayOfObjects : any ;

  constructor(private orgService :OrganisationSettlementService,private headerService : TitleHeaderService,
    private dialog : MatDialog , private router : Router, private store : InMemoryCache, private agentSettlementService : AgentSettlementService) { }

  ngOnInit(): void {
  
    this.headerService.setTitle('Organization Accounts');

   //Based on access id , will hide/show settlement option for profit/loss , commission account .
    let accessControlDtl = this.store.getItem('ACCESS_CONTROLS_ARRAY') ? this.store.getItem('ACCESS_CONTROLS_ARRAY') : "";
    if (accessControlDtl != "") {
       this.arrayOfObjects = JSON.parse(accessControlDtl);
    }

      // Check if any object has accessId "BOSI" "
      const hasSpecificItem : boolean = this.arrayOfObjects.some((item:any)=>{
       return item.accessId == "BOSI" ;
      }) ;

      if(hasSpecificItem == true){
        this.showSettlementIcon = true ;
      }
      else if(hasSpecificItem == false){
        this.showSettlementIcon = false ;
      }


    

     this.getOrganizationAccounts();
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
    return { 'height': (this.getScreenHeight - 141)+'px' , 'overflow-y' : 'auto' };
  }

  //On click account history icon , this function helps to navigate to org accounts history screen..
  openAccountsHistory(entity : string , accNo: any, entityId:string, entityName:string){
    this.store.setItem('ORG_ACCOUNTS_HISTORY_ENTITY', entity) ;
    this.store.setItem('ORG_ACCOUNTS_HISTORY_ACCNO', accNo) ;
    this.store.setItem('ORG_ACCOUNTS_HISTORY_ENTITY_ID', entityId) ;
    this.store.setItem('ORG_ACCOUNTS_HISTORY_ENTITY_NAME', entityName) ;
    this.router.navigate(['admin/org-accounts-history']) ;
  }

  //On click expenses transaction history icon , this function helps to navigate to expenses transaction history screen..
  openExpensesTransactionHistory( accNo: any){
    this.store.setItem('ORG_ACCOUNTS_HISTORY_ACCNO', accNo) ;
    this.router.navigate(['admin/expenses-transaction-history']) ;
  }

  ////On click Reset Account history icon , this function helps to navigate to Reset Account history screen..
  openResetAccountHistory(accNo: any){
    this.store.setItem('ORG_ACCOUNTS_HISTORY_ACCNO', accNo) ;
    this.router.navigate(['admin/reset-account-history']) ;
  }
  //record level -> download transaction summary/ledger , only one day entry
  downloadLedgerFile(acctNo:string, createdDate:any, orgName:string){
    console.log(acctNo , createdDate) ;
    this.loader = true ;
    let date : any = moment(createdDate) ;
    let creationDate = date._d.getFullYear() + "-" + (date._d.getMonth() + 1) + "-" + date._d.getDate();
    this.agentSettlementService.getAgentLedger(acctNo, creationDate, creationDate, true, false).subscribe((datas: ArrayBuffer)=>{
      this.loader = false;
      
       // Handle the ArrayBuffer data here
       const blob = new Blob([datas], { type: 'application/pdf' });

       // Create a File with a specified filename
       const filename = `${orgName} LEDGER-${createdDate}.pdf` ;
 
       const file = new File([blob], filename, { type: 'application/pdf' });
 
       // Create a data URL from the File
       const url = URL.createObjectURL(file);
 
       // Open the PDF in a new tab or download as needed
       window.open(url);
    },
    (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        if(error.status == 500){
          // Decode the ArrayBuffer to JSON if it's an error response
          const textDecoder = new TextDecoder("utf-8");
          const errorText = textDecoder.decode(error.error);
          let errorMessage = "";
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.errorMessage || "An error occurred";
          } catch (e) {
            errorMessage = "An error occurred"; // Fallback in case JSON parsing fails
          }
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : errorMessage ? errorMessage : "" }
          }) 
        }
    else{
      this.dialog.open(ErrorDialogAdminComponent) 
  }
  }
    }
    )
  }

  //generic func to open add expense and fund transfer in modal window
  openMatdialog(orgSettlementRecord: any, flag:string) {
    if(flag == "EXPENSE"){ //Add expense
      this.settlementDialog = this.dialog.open(OrganisationExpensesAddComponent, {
        panelClass: 'custom-modalbox',
       // height: '380px',
        width: '750px',
        data: { rowData: orgSettlementRecord }
      })
    }
    else if(flag == "FT"){ //Fund Transfer
      this.settlementDialog = this.dialog.open(OrganisationFundTransferComponent, {
        panelClass: 'custom-modalbox',
       // height: '380px',
        width: '750px',
        data: { rowData: orgSettlementRecord }
      })
    }
    this.settlementDialog.afterClosed().subscribe((res: any) => {
      if (res == 'SUCCESS') {
        this.getOrganizationAccounts();
      }
      else{
        console.log(res)
      }
    })
  }
  

  openResetDialog(orgSettlementRecord:any){
      this.settlementDialog = this.dialog.open(OrganisationResetAccountBalanceComponent, {
        panelClass: 'custom-modalbox',
        width: '560px',
        data: { rowData: orgSettlementRecord}
      })
  
    this.settlementDialog.afterClosed().subscribe((res: any) => {
      if (res == 'SUCCESS') {
        this.getOrganizationAccounts()
      }
      else{
        console.log(res)
      }
    })
  }

  // get organization records.
  getOrganizationAccounts(){
    this.loader = true;
    setTimeout(()=>{
    this.orgService.getOrgAccounts('ORG').subscribe(data =>{ 
      let accountDeatail:any[] = data['accountDetails'];
      // if arrayOfObjects contain accessID == "BPRL" and name ="REMITTANCE PROFIT-LOSS COLUMN" changing status of showProfitLoss as true.
      let showProfitLoss : boolean = this.arrayOfObjects.some((item:any)=>{
        return item.accessId == "BRPL" && item.name == 'REMITTANCE PROFIT-LOSS COLUMN' ;
       }) ;
             // filter profit loss based on showProfitLoss
       if( showProfitLoss == false){
        this.orgsettlement = accountDeatail.filter(account => account.ACCOUNTNO !== "90011")
      }
      else{
        this.orgsettlement= accountDeatail;
      }
       console.log(showProfitLoss);
      this.loader = false;
      console.log(this.orgsettlement);
    },
    (error:any) =>{
      this.loader = false;
      if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }  
      })
  }
    }
    )
  },400)
  }
}
