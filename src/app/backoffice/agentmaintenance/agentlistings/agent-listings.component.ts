import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { ParentStepperComponent } from '../modals/parentstepper/parent-stepper.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { HttpClient } from '@angular/common/http';
import { RegisterAgentComponent } from '../modals/resigteragent/register-agent.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayeeService } from 'src/app/payee/service/payee.service';
import { PayeeSearch } from '../../customer/model/customer.model';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { ViewPayeeComponent } from '../../customer/payeesearch/view-payee.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { getAgentTooltipText, statusBgColor, statusColor } from 'src/assets/transactionstatus';
import { AgentMarginTierUpdateComponent } from '../modals/agent-margin-tier-update/agent-margin-tier-update.component';

@Component({
  selector: 'app-agent-listings',
  templateUrl: './agent-listings.component.html',
  styleUrls: ['./agent-listings.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]

})
export class AgentListingsComponent implements OnInit {

  isActive!:false;
  getAgentDetails : any[] = [] ;
  loader : boolean= false;
  public filterForm : FormGroup = Object.create(null);
  searchPayee : PayeeSearch[] = [];
  payeeid !: string;
  p: number = 1;
  itemsPerPage: number = 20;

  constructor(private dialog:MatDialog,private headerService : TitleHeaderService,private fb : FormBuilder,
    private payeeService :PayeeService ,private store : InMemoryCache,
    private agentMaintenanceService : AgentMaintenanceService, ) { 

      dialog.afterAllClosed.subscribe(()=>{
        let activateAgent = this.store.getItem("DEACTIVATE_AGENT");
        if(activateAgent != undefined){
         this.store.removeItem("DEACTIVATE_AGENT")
         this.getAgentListings();
        }
        let deactivateAgent = this.store.getItem("ACTIVATE_AGENT");
        if(deactivateAgent != undefined){
          this.store.removeItem("ACTIVATE_AGENT");
          this.getAgentListings();
        }
       let loadAgentListing =  this.store.getItem("AGENT_FORM_SUBMITTED")
       if(loadAgentListing == "LOAD_AGENTLISTING"){
        this.store.removeItem("AGENT_FORM_SUBMITTED");
        this.getAgentListings();
      }
      })
    }

  ngOnInit(): void {
    this.headerService.setTitle('Agent Onboarding');
    this.filterForm = this.fb.group({
      agentName : [null],
      PhoneNumber : [null ,[Validators.compose([Validators.pattern('[0-9 ]*$')])]]
    })

  this.getAgentListings();


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
    return (this.getScreenHeight - 214);
  }
  modalTable(){
    return 441 ;
  }
  getOverFlow(){
    return 'auto';
  }

//STATUS color diff
getColor(status: string) : string{
  return statusColor(status)
 }
 //bg color for status tags .
 getBackgroundColor(status: string): string {
  return statusBgColor(status)
   
 }
   //tool tip text value based on txnstatus ..
   getTooltipText(status: string): string {
   return getAgentTooltipText(status);
  }

  getAgentListings(){
    this.loader= true;
    setTimeout(() => {
      this.agentMaintenanceService.getAgentListings().subscribe((datas:any)=>{
       this.getAgentDetails = datas['data'];
       datas['data'].filter((v:any)=> {
         if(v.STATUS == '1'){
           v.STATUS = "Active";
         }
         if(v.STATUS == '0'){
           v.STATUS = "InActive";
         }
       })
       this.loader = false;
      },
       //error handling 
   (error:any)=>{
     this.loader = false;
     if(error.status != 401){
       this.dialog.open(ErrorDialogAdminComponent) ;
     }
   }
      )  
    }, 400);
  }

  openAgentDialog(name : string,status : string,agentId:string){
    this.store.setItem("AGENT_ID",agentId)
    this.dialog.open(ParentStepperComponent,{
      width : '1380px',
      height : '720px',
      panelClass: 'custom-modalbox',
      disableClose: true,
      data : {'agentName':name,'status': status}
    })
  }

  openAgentRegister(){
   this.dialog.open(RegisterAgentComponent,{
      width : '480px',
      height : '460px',
      panelClass: 'custom-modalbox',
    }
    )
    .afterClosed().subscribe(result =>{
      if(result == undefined){
       
      }
      else if (result == "No Data"){
        
      }
      else if(result.agentId !== undefined || result.agentId !== ""){
        this.getAgentListings();
      }
      
    })
  }

   //view agent payee by backoffice 
   agentViewPayee(agentId:any,agentName : string){
    let status = '1';
    this.payeeService.viewCustomersPayee(agentId,status).subscribe((datas:any)=>{
      this.searchPayee = datas['data'];
      datas['data'].filter((v:any)=> {
        //STATUS Not needed to be changed..
        // if(v.STATUS == 'ACTIVE'){
        //   v.STATUS = "ACTIVE";
        // }
        // if(v.STATUS == 'INACTIVE'){
        //   v.STATUS = "INACTIVE";
        // }
      })
      this.store.setItem('CUSTOMER_ID',agentId)
    this.dialog.open(ViewPayeeComponent, {
      data:{agentPayeeReview : datas['data'],AGENT_NAME : agentName},
      panelClass: 'custom-modalbox',
      width:'1350px',
      height: '750px',
     })
    },
    
    (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent)
      }
    }
    )

  }
  searchFilter(name:string){
   //reset to page 
   this.p = 1;
    this.loader = true;
    let agentName= name ? name : "";
   this.agentMaintenanceService.searchAgentListing(agentName).subscribe((datas:any)=>{
    this.loader = false;
    this.getAgentDetails = datas['data'];
    datas['data'].filter((v:any)=>{
      if(v.STATUS == '1'){
        v.STATUS = "Active";
      }
      if(v.STATUS == "0"){
        v.STATUS = "InActive";
      }
    })
   },
   (error:any)=>{
    this.loader = false;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
   })
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }


  openMarginTierUpdate(agentName:string, acctStatus:string, acctNumber: string,agentId:string){
    console.log(acctNumber) ;
    this.dialog.open(AgentMarginTierUpdateComponent,{
      panelClass: 'custom-modalbox',
      height: '365px',
      data : {isAgentAccountsInquiry : true , agentName: agentName, acctStatus: acctStatus, acctNumber : acctNumber,
        agentId : agentId
      }
    })
  }
}
