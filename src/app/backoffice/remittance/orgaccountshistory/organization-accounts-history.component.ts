import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { OrganisationSettlementService } from 'src/app/core/services/orgsettlement.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import {  CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import moment from 'moment';
import { Router } from '@angular/router';
import { AgentSettlementService } from 'src/app/core/services/agentsettlement.service';
import { ViewManagementReportConfirmationDialogComponent } from '../../shared/modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';

@Component({
  selector: 'app-organization-accounts-history',
  templateUrl: './organization-accounts-history.component.html',
  styleUrls: ['./organization-accounts-history.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class OrganizationAccountsHistoryComponent implements OnInit {

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
  orgsettlement : any[] = [] ;
  selectedAccountNumber : any ;
  selectedEntityId !: string ;
  selectedEntityName !: string;
  
  constructor(private titleService : TitleHeaderService, private store : InMemoryCache, private fb : FormBuilder,
    private orgService :OrganisationSettlementService, private dialog : MatDialog, private router : Router,
    private agentSettlementService : AgentSettlementService) { }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Organization Accounts History') ;
    
    this.store.getItem('ORG_ACCOUNTS_HISTORY_ENTITY') ;
    this.selectedAccountNumber = this.store.getItem('ORG_ACCOUNTS_HISTORY_ACCNO') ;
    this.selectedEntityId = this.store.getItem('ORG_ACCOUNTS_HISTORY_ENTITY_ID') ;
    this.selectedEntityName = this.store.getItem('ORG_ACCOUNTS_HISTORY_ENTITY_NAME');
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

   //onload --> call organization accounts history api .
   setTimeout(()=>{
    this.loader = true ;
    this.orgService.getOrgSettlement('ORG',this.selectedAccountNumber,this.dateGt,this.dateLt,this.selectedEntityId).subscribe(data =>{ 
      this.orgsettlement = data['accountDetails'];
      this.loader = false;
      console.log(this.orgsettlement);
    },
    //error handling completed on 04/07/2023
    (error:any) =>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
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
  
    if(this.selectedAccountNumber == "20003" || this.selectedAccountNumber == "90013" || this.selectedAccountNumber == "90014"){
      // for APT-DBS Account , cash in hand , expenses account we show this dialog for getting pdf.
        this.dialog.open(ViewManagementReportConfirmationDialogComponent, {
          width: "500px",
        }).afterClosed().subscribe((response: any) => {
          console.log(response)
          if (response && response.action == "VIEW") {
            this.loader =true;
            setTimeout(() => {
              var start_date: any = moment(this.filterForm.controls.startDate.value);
              var end_date: any = moment(this.filterForm.controls.endDate.value);
          
              //start date and end date format YYY-MM-DD - internally.
              this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
              this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
          
              this.orgService.getOrgSettlement('ORG', this.selectedAccountNumber, this.dateGt , this.dateLt,this.selectedEntityId).subscribe((datas:any)=> {
                this.orgsettlement = datas['accountDetails'];
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
            }, 400);
    
          }
          else if (response && response.action == "SAVE") {
            this.loader = true;
            var start_date: any = moment(this.filterForm.controls.startDate.value);
              var end_date: any = moment(this.filterForm.controls.endDate.value);
          
              //start date and end date format YYY-MM-DD - internally.
              this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
              this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
          
            this.agentSettlementService.getAgentLedger(this.selectedAccountNumber, this.dateGt, this.dateLt, true, false).subscribe((datas:ArrayBuffer)=>{
              this.loader = false;
               // Handle the ArrayBuffer data here
              const blob = new Blob([datas], { type: 'application/pdf' });
              let orgName = this.selectedEntityName;
              // Create a File with a specified filename
              const filename = `${orgName} LEDGER-${this.dateGt}-${this.dateLt}.pdf` ;
        
              const file = new File([blob], filename, { type: 'application/pdf' });
        
              // Create a data URL from the File
              const url = URL.createObjectURL(file);
        
              // Open the PDF in a new tab or download as needed
              window.open(url);
            },
            (error:any)=>{
              this.loader = false;
              if(error.status != 401){
                this.dialog.open(ErrorDialogAdminComponent) ;
              }
            }
            )
    
          }
          else if (response && response.action == "XLSX") {
            this.loader = true;
            var start_date: any = moment(this.filterForm.controls.startDate.value);
              var end_date: any = moment(this.filterForm.controls.endDate.value);
          
              //start date and end date format YYY-MM-DD - internally.
              this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
              this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
          
            this.agentSettlementService.getAgentLedger(this.selectedAccountNumber, this.dateGt, this.dateLt, false, true).subscribe((datas:ArrayBuffer)=>{
              this.loader = false;
              const blob = new Blob([datas], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

              // Create a filename for the XLSX file
              let orgName = this.selectedEntityName;
              const filename = `${orgName} LEDGER.xlsx`;
        
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
                this.dialog.open(ErrorDialogAdminComponent) ;
              }
            }
            )
    
          }

  }
)
    }
  else{
    this.loader = true;
    setTimeout(() => {
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value);
  
      //start date and end date format YYY-MM-DD - internally.
      this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
      this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
  
      this.orgService.getOrgSettlement('ORG', this.selectedAccountNumber, this.dateGt , this.dateLt,this.selectedEntityId).subscribe((datas:any)=> {
        this.orgsettlement = datas['accountDetails'];
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
    }, 400);
}
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;

  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  }

  goToOrganizationAccounts(){
    this.router.navigate(['transaction/settlement']) ;
  }

  //record level -> download transaction summary/ledger , only one day entry
  downloadLedgerFile(acctNo:string, createdDate:any, orgName:string){
    console.log(acctNo , createdDate) ;
    this.loader = true ;
    let date : any = moment(createdDate) ;
    let creationDate = date._d.getFullYear() + "-" + (date._d.getMonth() + 1) + "-" + date._d.getDate();
    this.agentSettlementService.getAgentLedger(acctNo, creationDate, creationDate, true, false).subscribe((datas:ArrayBuffer)=>{
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
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }
    )
  }

}

