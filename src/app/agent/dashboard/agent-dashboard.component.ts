import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { TransactionData } from 'src/app/dashboards/model/approveddashboard';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AgentServiceService } from '../agent-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {
  myDate:any = new Date
  agentName : string = this.store.getItem('USERNAME');
  agentRemittance : TransactionData[]=[];
  agentTransactionCount : any;
  organizationRemittance : TransactionData[] = [];
  orgTransactionCount : any;
  statusIndication:string = "agent-intitated";
  loader : boolean = false;

  constructor(private datePipe: DatePipe,private headerService : TitleHeaderService,private store : InMemoryCache,
     private agentService:AgentServiceService,private dialog : MatDialog) { 
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.headerService.setTitle('Dashboard');
    this.loader = true;
  //Added by Shafi @ 07/11/2022
  // Display count Of Agent Initiated Transaction
    let customerId = this.store.getItem('USER_ID');
    setTimeout(() => {
      this.agentService.getAgentInitiatedTransactions(customerId,'3,1,6').subscribe((datas:any) =>{
        this.agentRemittance = datas['data'];
        console.log(this.agentRemittance);
        this.agentTransactionCount = this.agentRemittance.length;
        this.loader = false;
        console.log("Agent Initiated Transaction : "+this.agentTransactionCount)
      },
      //error handling completed on 05-07-2023
    (error:any)=>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }
      )
    }, 400);
   
  //Display count Of APT Initiated Transaction 
    let agentId = this.store.getItem('USER_ID');
    this.agentService.getOrgInitiatedTransactions(agentId,'3,6').subscribe((datas:any) =>{
      this.organizationRemittance = datas['data'];
      console.log(this.organizationRemittance);
      this.orgTransactionCount = this.organizationRemittance.length;
      console.log("APT Initiated Transaction : " +this.orgTransactionCount);
    },
    //error handling completed on 05-07-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }
  agentInitatedTransaction(){
    this.store.setItem("AGENT_INITIATE",this.statusIndication)
  }
}
