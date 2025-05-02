import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { OrganisationSettlementService } from 'src/app/core/services/orgsettlement.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import moment from 'moment';
import { Router } from '@angular/router';
import { AgentSettlementService } from 'src/app/core/services/agentsettlement.service';

@Component({
  selector: 'app-expenses-transaction-history',
  templateUrl: './expenses-transaction-history.component.html',
  styleUrls: ['./expenses-transaction-history.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class ExpensesTransactionHistoryComponent implements OnInit {
 p: number = 1;
  agentName !: string;
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
  expensesTransactionHistory : any[] = [] ;
  selectedAccountNumber : any ;
  selectedEntityId !: string ;
  
  constructor(private titleService : TitleHeaderService, private store : InMemoryCache, private fb : FormBuilder,
   private dialog : MatDialog, private router : Router, private agentSettlementService : AgentSettlementService) { }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Expenses Tansaction History') ;
    this.selectedAccountNumber = this.store.getItem('ORG_ACCOUNTS_HISTORY_ACCNO') ;

    this.filterForm = this.fb.group({
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
   
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;

   //onload --> call Expenses Transaction history api .
   setTimeout(()=>{
    this.loader = true ;
    this.agentSettlementService.getExpensesTransactionHistory(this.selectedAccountNumber,this.dateGt,this.dateLt).subscribe(data =>{ 
      this.expensesTransactionHistory = data['data'];
      this.loader = false;
      console.log(this.expensesTransactionHistory);
    },
    (error:any) =>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" } 
        }) ;
      }
    }
    )
  }, 400)
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

 

  searchFilter(){
    this.loader = true;
    setTimeout(() => {
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value);
  
      //start date and end date format YYY-MM-DD - internally.
      this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
      this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
  
      this.agentSettlementService.getExpensesTransactionHistory(this.selectedAccountNumber, this.dateGt , this.dateLt).subscribe((datas:any)=> {
        this.expensesTransactionHistory = datas['data'];
        console.log(this.expensesTransactionHistory)
      this.loader = false;
    },
  (error:any)=>{
    this.loader = false;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" } 
      }) ;
    }
  }
    )
    }, 400);
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;

  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 31 * 24 * 60 * 60 * 1000);
  }

  goToOrganizationAccounts(){
    this.router.navigate(['transaction/settlement']) ;
  }

  

}
