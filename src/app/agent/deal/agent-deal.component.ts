import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RetrieveDeals } from 'src/app/backoffice/dailysetup/model/deal';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { NewDealService } from 'src/app/core/services/new-deal.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { AgentServiceService } from '../agent-service.service';
import {organisation} from 'src/assets/dropdownvalues';
import { RetrieveTransactionInquiry } from '../models/agent.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';

@Component({
  selector: 'app-agent-deal',
  templateUrl: './agent-deal.component.html',
  styleUrls: ['./agent-deal.component.scss', '../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class AgentDealComponent implements OnInit {
  p: number = 1;
  itemsPerPage: number = 20;
  status: any;
  agentId: any;
  initiatedBy: any;
  isActive = false;
  orgArray : any[] =[organisation];
  getTransactionInquiry : RetrieveTransactionInquiry[] = [] ;
  getDeals : RetrieveDeals[] = [];
  loader : boolean = false;

  myDate:any= new Date();
  expandedRecord: any; // Store the currently expanded record
  loading: boolean = false;

  constructor(private datePipe: DatePipe,private headerService : TitleHeaderService,private dealService : NewDealService,
    private store : InMemoryCache,private agentService : AgentServiceService,
    private dialog : MatDialog) {
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
   }


   handlePageChange(event: any): void {
     this.p = event.pageIndex + 1;
   }

  ngOnInit(): void {
    this.headerService.setTitle('Deals');
    this.getDeal();
    this.initiatedBy = "APT" ;
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
//responsvie table height based on windows inner height
  changeTableHeight() {
    return { 'height': (this.getScreenHeight - 214) + 'px', 'overflow-y': 'auto' };
  }
  getDeal(){
    let agentId = this.store.getItem('USER_ID');
    let initiatedBy = 'APT';
    this.loader = true;
    setTimeout(() => {
      this.dealService.getAgentDeals(agentId,initiatedBy).subscribe((datas:any) => {
        this.getDeals = datas['data'];
        this.loader = false;
        },
         //error handling completed - 05/07/2023
         (error:any)=>{
          this.loader = false;
          if(error.status != 401){
            this.dialog.open(ErrorDialogAdminComponent) ;
          }
         }
        )
    }, 400);
    
 }

 applyFilter(initiatedBy:string){
  this.p = 1;
  let agentId = this.store.getItem('USER_ID');
  this.loader = true;
  setTimeout(() => {
    this.dealService.getAgentDeals(agentId,initiatedBy).subscribe((datas:any) => {
      this.getDeals = datas['data'];
      this.loader = false;
      },
       //error handling completed - 05/07/2023
       (error:any)=>{
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
       }
      )
  }, 400);
  
 }



  toggleExpansionPanel(record: any): void {
    let selectedDealId = record.DEALID;
    this.loading = true;
    setTimeout(() => {
      this.agentService.getTransactionInquiry(selectedDealId).subscribe((datas:any)=>{
        this.getTransactionInquiry = datas['data'] ;
        this.loading = false;
      }, //error handling completed - 05/07/2023
      (error:any)=>{
        this.loading = false ;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
       })
    }, 400);
    
    if (this.expandedRecord === record) {
      this.expandedRecord = null; // Collapse the panel if it's already expanded
    } else {
      this.expandedRecord = record; // Expand the panel for the clicked record
    }
  }
 

}
