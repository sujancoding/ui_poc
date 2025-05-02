import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentSettlementService } from 'src/app/core/services/agentsettlement.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { AgentSettlementHistory } from '../model/TransactionModel';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';


@Component({
  selector: 'app-settlement-history',
  templateUrl: './settlement-history.component.html',
  styleUrls: ['./settlement-history.component.scss', '../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class SettlementHistoryComponent implements OnInit {

  p: number = 1;
  agentName !: string;
  agentSettlementHistory : AgentSettlementHistory[] = [];
  loader : boolean = false;
  itemsPerPage = 20 ;
  isActive : Boolean = false;
  filterForm : FormGroup = Object.create(null);
  minStartDate!: Date;
  minEndDate!: any;
  maxEndDate!: any;
  validateEndDate: any;
  validateStartDate: any;
  dateGt : any ;
  dateLt : any ;
  agentId: any ;
  
  constructor(private router: Router,private agentSettlement : AgentSettlementService,private route: ActivatedRoute,
    private headerService: TitleHeaderService,private dialog : MatDialog,private fb : FormBuilder) { }

    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }

  ngOnInit(): void {

    this.headerService.setTitle('Manual Settlement History');
    
    this.filterForm = this.fb.group({
     "agentName" : [null],
     "startDate": [null,Validators.compose([Validators.required])],
     "endDate": [null, Validators.compose([Validators.required])]
    })
   
    //date on load should be start date = current date - one week and end date = current date
    const todayFormatted = new Date();
    const dateDifference = new Date(todayFormatted.getTime() - 7 * 24 * 60 * 60 * 1000); // startdate = current date - 7 days
     
    this.filterForm.controls.startDate.setValue(dateDifference);
    this.filterForm.controls.endDate.setValue(todayFormatted);
    this.dateGt = dateDifference.getFullYear() +"-" + (dateDifference.getMonth() + 1) + "-" + dateDifference.getDate();
    this.dateLt = todayFormatted.getFullYear() +"-" + (todayFormatted.getMonth() + 1) + "-" + todayFormatted.getDate();


    this.route.queryParams.subscribe((params: any)=> {
      console.log(params)
    this.agentName = params.agent_name;

    //patch agentName in filter formfield.
    this.filterForm.patchValue({
      "agentName": this.agentName
    });

    })
    let agentId = this.route.snapshot.params['agentId'];
    this.agentId = agentId ;
    this.loader = true;
    setTimeout(() => {
    this.agentSettlement.getAgentSettlementHistory(agentId, this.agentName, this.dateGt , this.dateLt,'M').subscribe((datas:any)=> {
      this.agentSettlementHistory = datas['data'];
      this.loader = false;
    },
     //error handling completed on 05-07-2023
  (error:any)=>{
    this.loader = false;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
    )
    }, 500);
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
  titleCase(str:any) {
    return str.toLowerCase().replace(/\b\w/g, (s:any) => s.toUpperCase());
  }
  showSettlement(){
    this.router.navigate(['transaction/agent-settlement'])
  }

  searchFilter(){
    this.loader = true;
    setTimeout(() => {
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value);
  
      //start date and end date format YYY-MM-DD - internally.
      this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
      this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
  
    this.agentSettlement.getAgentSettlementHistory(this.agentId, this.agentName, this.dateGt , this.dateLt,'M').subscribe((datas:any)=> {
      this.agentSettlementHistory = datas['data'];
      this.loader = false;
    },
     //error handling completed on 05-07-2023
  (error:any)=>{
    this.loader = false;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
    )
    }, 500);
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;

  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 31 * 24 * 60 * 60 * 1000);
  }

  goToAgentSettlements(){
    this.router.navigate(['transaction/agent-settlement'])
  }
}
