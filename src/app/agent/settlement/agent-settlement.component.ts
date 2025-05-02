import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AgentSettlement } from 'src/app/transaction/model/TransactionModel';
import { NewSettlementComponent } from 'src/app/transaction/new-settlement/new-settlement.component';
import {AgentSettlementService} from 'src/app/core/services/agentsettlement.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import moment from 'moment';




@Component({
  selector: 'app-agent-settlement',
  templateUrl: './agent-settlement.component.html',
  styleUrls: ['./agent-settlement.component.scss', '../../../assets/styles/tables/table-style.scss'],
  styles : [ CommonSearchFilterCard]
})
export class AgentSettlementComponent implements OnInit {
  p: number = 1;
  agentSettlement : any[] = [];
  disable = true;
  enable = true;
  isActive : Boolean = false;
  loader : Boolean = false;
  filterForm : FormGroup = Object.create(null);
  itemsPerPage: number = 20;

  constructor(public dialogRef: MatDialog,private router: Router,private agentSettlementService: AgentSettlementService,private headerService : TitleHeaderService,
    private fb : FormBuilder, private store : InMemoryCache) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      "agentName" : [null,Validators.compose([Validators.pattern("^[a-zA-Z ]+$")])],
    })

    this.loader = true;
    this.headerService.setTitle('Agent Accounts');
  
    setTimeout(() => {
      this.agentSettlementService.getAgentSettlement('AGENT','','','').subscribe(data => {
        this.agentSettlement = data['accountDetails'];
        this.loader = false;
        console.log(this.agentSettlement);
        // let filteredArray = data['accountDetails'].filter((v:any)=> v.credit == 0);
        // console.log(filteredArray);
      },
      //error handling completed on 05-07-2023
  (error:any)=>{
    this.loader = false ;
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
      )
    }, 400);
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

  changeTableHeight() {
    return { 'height': (this.getScreenHeight - 216) + 'px', 'overflow-y': 'auto' };
  }
  disableIcon(outstandingAmount: any) {
    if (outstandingAmount == 0) {
      let classes = {
        disable: this.disable,
      };
      return classes;
    }
    if (outstandingAmount != 0) {
      let classes = {
        enable: this.enable,
      };
      return classes;
    }
  }
  openMatdialog(agentSettlement: any) {
    const dialog = this.dialogRef.open(NewSettlementComponent, {
      panelClass: 'custom-modalbox',
     // height: '380px',
      width: '900px',
      data: { rowData: agentSettlement }
    })
    dialog.afterClosed().subscribe((res) => {
      if (res == true) {
        this.agentSettlementService.getAgentSettlement('AGENT','','','').subscribe(data => {
          this.agentSettlement = data['accountDetails'];
        },
         //error handling completed on 05-07-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
        )
      }
    })
  }
  applyFilter() {
    let agentName : string = this.filterForm.controls['agentName'].value ;
    if (agentName == undefined) {
      agentName = "";
    }
    this.loader = true;
    setTimeout(() => {
      this.agentSettlementService.filteredAgentSettlement(agentName).subscribe((data:any) => {
        this.loader = false;
        this.agentSettlement = data['accountDetails'];
        // Reset page to 1
        this.p = 1;
      },
      
      //error handling completed on 05-07-2023
  (error:any)=>{
    this.loader = false;
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  })
    }, 400);
  }

  openSettlementHistory(agentId: any, agentName: string) {
    this.router.navigate([`/transaction/settlement-history/${agentId}`], { queryParams: { 'agent_name': agentName } });
  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  openAccountsHistory(agentId: any, agentName: string, accountNo: string){
    this.store.setItem('AGENT_ACCOUNTS_HISTORY_ENTITY_ID', agentId) ;
    this.store.setItem('AGENT_ACCOUNTS_HISTORY_ENTITY_NAME', agentName) ;
    this.store.setItem('AGENT_ACCOUNTS_HISTORY_ENTITY_NO',accountNo);
    this.router.navigate(['admin/agent-accounts-history']);
  }

  //record level -> download transaction summary/ledger , only one day entry
  downloadLedgerFile(acctNo:string, createdDate:any, agentName:string){
    console.log(acctNo , createdDate) ;
    this.loader = true ;
    let date : any = moment(createdDate) ;
    let creationDate = date._d.getFullYear() + "-" + (date._d.getMonth() + 1) + "-" + date._d.getDate();
    this.agentSettlementService.getAgentLedger(acctNo, creationDate, creationDate, true, false).subscribe((datas: ArrayBuffer)=>{
      this.loader = false;
      // Handle the ArrayBuffer data here
      const blob = new Blob([datas], { type: 'application/pdf' });

      // Create a File with a specified filename
      const filename = `${agentName} LEDGER-${createdDate}.pdf` ;

      const file = new File([blob], filename, { type: 'application/pdf' });

      // Create a data URL from the File
      const url = URL.createObjectURL(file);

      // Open the PDF in a new tab or download as needed
      window.open(url);
    },
    (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
    )
  }
  
}
