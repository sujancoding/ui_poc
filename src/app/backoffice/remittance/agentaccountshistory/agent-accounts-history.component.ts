import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentSettlementService } from 'src/app/core/services/agentsettlement.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CommonSearchFilterCard} from 'src/assets/styles/tables/table-styles';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { ViewManagementReportConfirmationDialogComponent } from '../../shared/modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';

@Component({
  selector: 'app-agent-accounts-history',
  templateUrl: './agent-accounts-history.component.html',
  styleUrls: ['./agent-accounts-history.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class AgentAccountsHistoryComponent implements OnInit {

  p: number = 1;
  agentName !: string;
  loader : boolean = false;
  itemsPerPage = 20 ;
  isActive : Boolean = false;
  filterForm : FormGroup = Object.create(null);
  minStartDate : Date = new Date(2025, 0, 1); 
  minEndDate!: any;
  maxEndDate!: any;
  validateEndDate: any;
  validateStartDate: any;
  dateGt : any ;
  dateLt : any ;
  agentId: any ;
  agentSettlement : any[] = [] ;
  accountNo : any ;
  
  constructor(private route: ActivatedRoute,
    private headerService: TitleHeaderService,private dialog : MatDialog,private fb : FormBuilder,
    private store : InMemoryCache, private agentSettlementService: AgentSettlementService, private dialogRef : MatDialog,
    private router : Router) { }

    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }

  ngOnInit(): void {

    this.headerService.setTitle('Accounts History');

    this.agentId = this.store.getItem('AGENT_ACCOUNTS_HISTORY_ENTITY_ID') ? this.store.getItem('AGENT_ACCOUNTS_HISTORY_ENTITY_ID') : "" ;
    this.agentName = this.store.getItem('AGENT_ACCOUNTS_HISTORY_ENTITY_NAME') ?  this.store.getItem('AGENT_ACCOUNTS_HISTORY_ENTITY_NAME') : "" ;
    this.accountNo = this.store.getItem('AGENT_ACCOUNTS_HISTORY_ENTITY_NO') ?  this.store.getItem('AGENT_ACCOUNTS_HISTORY_ENTITY_NO') : "" ;

    this.filterForm = this.fb.group({
     "agentName" : [null],
     "startDate": [null,Validators.compose([Validators.required])],
     "endDate": [null, Validators.compose([Validators.required])]
    })

    this.filterForm.patchValue({"agentName":this.agentName})
   
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

   this.loader = true
   setTimeout(() => {
    this.agentSettlementService.getAgentSettlement('AGENT',this.agentId,this.dateGt,this.dateLt).subscribe(data => {
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
  }, 700);

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
         this.dialog.open(ViewManagementReportConfirmationDialogComponent, {
           width: "500px",
         }).afterClosed().subscribe((response: any) => {
           console.log(response)
           if (response && response.action == "VIEW") {
            this.loader = true;
    setTimeout(() => {
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value);
  
      //start date and end date format YYY-MM-DD - internally.
      this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
      this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
  
    this.agentSettlementService.getAgentSettlement('AGENT', this.agentId, this.dateGt , this.dateLt).subscribe((datas:any)=> {
      this.agentSettlement = datas['accountDetails'];
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
           else if (response && response.action == "SAVE") {
            this.loader = true ;
            var start_date: any = moment(this.filterForm.controls.startDate.value);
            var end_date: any = moment(this.filterForm.controls.endDate.value);
            
                //start date and end date format YYY-MM-DD - internally.
                this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
                this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
            
           this.agentSettlementService.getAgentLedger(this.accountNo, this.dateGt, this.dateLt, true, false).subscribe((datas:ArrayBuffer)=>{
             this.loader = false;
             // Handle the ArrayBuffer data here
             const blob = new Blob([datas], { type: 'application/pdf' });
            
             // Create a File with a specified filename
             const filename = `${this.agentName} LEDGER-${this.dateGt}-${this.dateLt}.pdf` ;
       
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
           else if (response && response.action == "XLSX") {
            this.loader = true ;
            var start_date: any = moment(this.filterForm.controls.startDate.value);
            var end_date: any = moment(this.filterForm.controls.endDate.value);
            
                //start date and end date format YYY-MM-DD - internally.
                this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
                this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
            
           this.agentSettlementService.getAgentLedger(this.accountNo, this.dateGt, this.dateLt, false, true).subscribe((datas:ArrayBuffer)=>{
             this.loader = false;
             const blob = new Blob([datas], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

             // Create a filename for the XLSX file
             const filename = `${this.agentName} LEDGER.xlsx`;
       
            // Create a File object
             const file = new File([blob], filename, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       
             // Create a data URL from the File
              const url = URL.createObjectURL(file);
       
              const a = document.createElement("a");
               a.href = url;
               a.download = file.name; // Ensures correct file name
               document.body.appendChild(a);
               a.click();
               document.body.removeChild(a);
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
 )
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;

  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  }

  goToAgentSettlements(){
    this.router.navigate(['transaction/agent-settlement']) ;
  }

  //record level -> download transaction summary/ledger , only one day entry
  downloadLedgerFile(acctNo:string, createdDate:any, agentName:string){
    console.log(acctNo , createdDate) ;
    this.loader = true ;
    let date : any = moment(createdDate) ;
    let creationDate = date._d.getFullYear() + "-" + (date._d.getMonth() + 1) + "-" + date._d.getDate();
    this.agentSettlementService.getAgentLedger(acctNo, creationDate, creationDate, true, false).subscribe((datas:ArrayBuffer)=>{
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
