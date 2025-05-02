import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { NewDealService } from 'src/app/core/services/new-deal.service';
import { CompanyProfileComponent } from 'src/app/onboarding/corporate/profile/company-profile.component';
import { PersonalInfoComponent } from 'src/app/onboarding/individual/basic-info/basic-info.component';
import { AddPayee } from 'src/app/payee/payeeModel/updatePayee';
import { PayeeService } from 'src/app/payee/service/payee.service';
import { ApproveDetailsComponent } from 'src/app/shared/components/approve-details/approve-details.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import {  PayeeSearch } from '../customer/model/customer.model';
import { ViewAgentComponent } from '../shared/modals/viewagent/view-agent/view-agent.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorDialogAdminComponent } from '../shared/modals/errordialogadmin/error-dialog-admin.component';
import { getPayeeTooltipText, getApplicantStatusBgColor, getApplicantStatusColor } from 'src/assets/transactionstatus';

@Component({
  selector: 'app-approve-payee',
  templateUrl: './approve-payee.component.html',
  styleUrls: ['./approve-payee.component.scss', '../../../assets/styles/tables/table-style.scss'],
  styles : [ CommonSearchFilterCard]
})
export class ApprovePayeeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isDesc!: boolean;
  resultsLength= 0;
  p: number = 1;
  rowData : any;
  payeeSearch : PayeeSearch[] = [];
  viewPayee : PayeeSearch[] = [];
  customerInquiry : CustomerInquiry = new CustomerInquiry();
  addPayee: AddPayee = new AddPayee();
  showMe: Boolean = false;
  id!: string;
  status !: string;
  n !: string;
  color !: boolean;
  sortedData : PayeeSearch[] = [];
  isActive = false;
  loader: Boolean = false;
  filterForm : FormGroup = Object.create(null); 
  itemsPerPage: number = 20;
  
   constructor(private payeeService:PayeeService , private store: InMemoryCache,private dialogRef: MatDialog , private customerSearchService: CustomerSearchService,
    private headerService : TitleHeaderService, private dealService: NewDealService,private fb : FormBuilder) { }
   
   
   latestData(){
    this.status = "0"
    this.payeeService.searchPayee(this.status).subscribe((datas:any)=>{
      this.payeeSearch = datas['data'];  
      this.showMe = false;
      this.color = false;
    },
    //error handling completed on 05-07-2023
    (error:any) =>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
    ); 
   }

   ngOnInit(): void {
    this.headerService.setTitle('Approve Payee');
    this.filterForm = this.fb.group({
      "payeeName" : [null,Validators.compose([Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')])],
    })

    //new change on 28 Nov 2023 , based on access control dtls , need to hide and show the approve-reject button .
    let accessControlDtl = this.store.getItem('ACCESS_CONTROLS_ARRAY') ? this.store.getItem('ACCESS_CONTROLS_ARRAY') : "";
    let arrayOfObjects : any ;
    if (accessControlDtl != "") {
       arrayOfObjects = JSON.parse(accessControlDtl);
    }

      // Check if any object has accessId "BAAB" and name "APPLICATION APPROVE-REJECT BUTTON"
      const hasSpecificItem : boolean = arrayOfObjects.some((item:any)=>{
       return item.accessId == "BCAPB" && item.name == "APPROVE PAYEE BUTTON" ;
      }) ;
      let objectExist : string = "";
      if(hasSpecificItem == true){
       objectExist = "true" ;
      }
      else if(hasSpecificItem == false){
       objectExist = "false" ;
      }
      this.store.setItem('APPROVE_PAYEE_BUTTON_ACCESS_CONTROL',objectExist) ;

    this.status = "0"
    this.loader = true;
    setTimeout(()=>{
    this.payeeService.searchPayee(this.status).subscribe((datas:any)=>{
      this.payeeSearch = datas['data'];
      this.loader = false;
      console.log(datas)
      let customerId = datas['data'][0].CUSTOMERID;
      let payeeId = datas['data'][0].PAYEEID;
      this.rowData = datas['data'].filter((v:any) => v.CUSTOMERID == customerId && v.PAYEEID == payeeId);
      this.showMe = true;
      this.color = true;
      this.n = payeeId;
    },
     //error handling completed on 05-07-2023
     (error:any) =>{
      this.loader = false;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
    )
    }, 1000);
     //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;
   }
  
   toggleTag(customer_id:any,payee_id : any){
   this.showMe = true;
   this.n = payee_id;
   this.color = true;
   this.rowData = this.payeeSearch.filter((v:any)=> v.CUSTOMERID == customer_id && v.PAYEEID == payee_id);
   console.log(this.rowData);
      
  }
  
  openCustomerDialog(customer_id:any, customer_type:any){
    if(customer_type == 'I' || customer_type == 'C'){
      this.customerSearchService.getCustomerInquiry(customer_id).subscribe(data => {
      this.customerInquiry = data;
        if(customer_type == 'I'){
          this.dialogRef.open(PersonalInfoComponent,{
            data: {reviewCustomerDetails : data },
            width:'1245px',
            height: '616px',
            panelClass: 'custom-modalbox',
          })
        }
        if(customer_type == 'C'){
          this.dialogRef.open(CompanyProfileComponent,{
            data: {reviewCorpCustomerDetails : data },
            width:'1245px',
            height: '616px',
            panelClass: 'custom-modalbox',
          })  
        }
      },
      //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
      )
    }

    if(customer_type == 'A'){
      this.dealService.viewAgent(customer_id).subscribe(datas => {
        let a = datas['data']
        console.log(a);
        this.dialogRef.open(ViewAgentComponent,{
          data: {reviewAgentDetails : datas['data'] },
          width:'800px',
          height: '300px',
          panelClass: 'custom-modalbox',
        })
      },
       //error handling completed on 05-07-2023
    (error:any) =>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
      )
    }

  }
 getColor(status: any) {
  return getApplicantStatusColor(status)
}

//bg color for status tags .
getBackgroundColor(status: string): string {
 return getApplicantStatusBgColor(status);
}

getTooltipText(status: string): string {
  return getPayeeTooltipText(status);
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
    return { 'height': (this.getScreenHeight - 213)+'px' , 'overflow-y' : 'auto' };
  }
  applyFilter(){
    let name : string = this.filterForm.controls['payeeName'].value ;
    this.loader = true;
    let payeeName : string = name ? name : '' ;
    let status : string ;
    if(payeeName == ''){
      status = "0";
    }
    else{
      status = "0";
    }
    setTimeout(() => {
      this.payeeService.filteredPayeeSearch(payeeName, status).subscribe((datas: any) => {
        this.payeeSearch = datas['data'];
        // Reset page to 1
        this.p = 1;
        this.loader = false;
        this.showMe = true;
        if(this.payeeSearch.length > 0){
          let customerId = datas['data'][0].CUSTOMERID ;
          let payeeId = datas['data'][0].PAYEEID;
          this.rowData = datas['data'].filter((v: any) => v.CUSTOMERID == customerId && v.PAYEEID == payeeId);
          this.color = true;
          this.n = payeeId;
        }
        else if(this.payeeSearch.length == 0){
          this.rowData = [] ;
        }
       
      },
       //error handling completed on 05-07-2023
    (error:any) =>{
      this.loader = false;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
      )
    }, 600);
   
  }
  //
  sortData(sort : Sort){
    const data = this.payeeSearch;
  if (!sort.active || sort.direction == '') {
    this.sortedData = data;
    return ;
    }
    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'NAME':
          return this.compare(a.NAME, b.NAME, isAsc);
        default:
          return 0;
      }
    });
  }
  compare(a: string, b:  string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

}
