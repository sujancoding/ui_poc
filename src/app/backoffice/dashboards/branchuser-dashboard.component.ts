import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Dashboard } from 'src/app/dashboards/model/dashboard.model';
import { BranchUserService } from 'src/app/dashboards/services/branch-user.service';
import { ProfileinfoService } from 'src/app/core/services/profileinfo.service';
import { Router } from '@angular/router';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { Status } from 'src/app/dashboards/model/status';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerSearch } from 'src/app/core/model/customersearch/customersearch';
import { ApplicationListings } from 'src/app/core/model/Application Search/application-search';
import { ExchangeRateService } from 'src/app/core/services/exchange-rate.service';
import { DailyExchangeRateSetup } from '../exchangerates/model/exchangerate.model';
import { PayeeService } from 'src/app/payee/service/payee.service';
import { TransactionData } from 'src/app/dashboards/model/approveddashboard';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from '../shared/modals/errordialogadmin/error-dialog-admin.component';
import { remittanceExchRateArray } from 'src/assets/dropdownvalues';

export class NullStatus{
  
  name!: string;
  value!: string;
}

@Component({
  selector: 'app-branchuser-dashboard',
  templateUrl: './branchuser-dashboard.component.html',
  styleUrls: ['./branchuser-dashboard.component.scss']
})
export class BranchuserDashboardComponent implements OnInit {
  isDisabled : Boolean = true;
  dashboard: Dashboard = new Dashboard();
  customerSearch : CustomerSearch [] = [];
  applicationSearch : ApplicationListings [] = [];
  exchangeRate : DailyExchangeRateSetup[] = [];
  searchTransaction : TransactionData[] = [];
  unpostedTransactionCount : number = 0;
  amountReceievedTransactionCount : number = 0 ;
  postedTransactionCount : any = 0;
  appWidget : any;
  newStatus : any;
  pendingStatus: any;
  rejectedStatus: any;
  showCircle = true;
  appStatus : any;
  noItem : any;
  test:any;
  type:any;

  testCustomerStatus: any[] = [];

  customerIndStatus : any[] = [] ;
  applicationIndStatus : any[] = [] ;
  applicationCorStatus : any[] = [] ;
  applicationOverallStatus : any[] = [] ;

  customerOverallStatus : any[] = [] ;

  payeeCount : any[] = [] ;

  noStatus =[{ name:"DRAFT" , value:"0" },{ name:"PENDING" , value:"0"},{ name:"REJECTED" , value:"0"},{ name:"CONVERTED" , value:"0"}]
  branchUserName = this.store.getItem('USERNAME');
  transactionListing : any ;
  totalTransactionCount : any ;
  isLoading : boolean = true ;

  accessControlDetails: any[] = [];
  disablePostedLink: boolean = true;
  disableUnpostedLink : boolean = true;
  disableCustomerLink : boolean = true;
  disableApplicationLink : boolean = true;
  disablePayeeLink : boolean = true;
  disableExchRateLink : boolean = true;
  currencyArray :any[] = remittanceExchRateArray ;
  rateLoader : boolean = false;
  
  noCustomerStatus  = [ { name:"TOTAL" , value:"0" },{ name:"ACTIVE" , value:"0"},{ name:"INACTIVE" , value:"0"}]
  
  constructor(private datePipe: DatePipe , private branchUserService: BranchUserService , private profileService: ProfileinfoService,private payeeService : PayeeService,
    private dialog : MatDialog, private headerService : TitleHeaderService, private router: Router , private store : InMemoryCache, private customerSearchService: CustomerSearchService , private exchangeRateService: ExchangeRateService) {
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
   }

  ngOnInit(): void {
    this.headerService.setTitle('Dashboard');
    console.log(this.noCustomerStatus);
    console.log(this.noStatus)
    this.isLoading = true ;

   let accessControlDtl = this.store.getItem("ACCESS_CONTROLS_ARRAY");
    this.accessControlDetails = JSON.parse(accessControlDtl);

    this.accessControlDetails.forEach((item) => {
      switch (item.accessId) {
        case "BRUM":
          this.disableUnpostedLink = false;
          break;
        case "BRFM":
          this.disablePostedLink = false;
          break;
        case "BCSM":
          this.disableCustomerLink = false;
          break;
        case "BCAM":
          this.disablePayeeLink = false;
          break;
        case "BASM":
          this.disableApplicationLink = false;
          break;
        case "BDEM":
          this.disableExchRateLink = false;
          break;
      }
    });
     
    setTimeout(() => {
    this.branchUserService.getApplicationWidget().subscribe((data: any) => {
      this.dashboard = data;
      this.processDashboardData();
      this.isLoading = false ;

       //this customerIndStatus is for determining the array length for Individual subgroup in customer group
     this.customerIndStatus = this.dashboard.metrics.filter(v => v['group'] == "CUSTOMER" && v['subgroup'] == "I");

      //this testCustomerStatus is for determining the array length for business subgroup in customer group
     this.testCustomerStatus = this.dashboard.metrics.filter(v => v['group'] == "CUSTOMER" && v['subgroup'] == "C");

     //this customerOverallStatus is for determining the array length for OVERALLTOTAL subgroup in customer group
     this.customerOverallStatus = this.dashboard.metrics.filter(v => v['group'] == "CUSTOMER" && v['name'] == "OVERALLTOTAL");

     //this applicationIndStatus   is for determining the array length for individual subgroup in application group
     this.applicationIndStatus = this.dashboard.metrics.filter(v => v['group'] == "APPLICATION" && v['subgroup'] == "I");

     //this applicationCorStatus   is for determining the array length for corporate subgroup in application group
     this.applicationCorStatus = this.dashboard.metrics.filter(v => v['group'] == "APPLICATION" && v['subgroup'] == "C");

      //this applicationOverallStatus is for determining the array length for OVERALLTOTAL name in application group
     this.applicationOverallStatus = this.dashboard.metrics.filter(v => v['group'] == "APPLICATION" && v['name'] == "OVERALLTOTAL");

     this.transactionListing = this.dashboard.metrics.filter(v => v['group'] == "TRANSACTION");

     //this payeeCount is for determining the array length for PENDING name in Payee group
     this.payeeCount = this.dashboard.metrics.filter(v => v['group'] == "PAYEE" && v['name'] == "PENDING");
     //Total Remittance Count
     let totalArrOfObj  = this.transactionListing.filter((v:any) => v.name == "TOTAL" );
     if(totalArrOfObj.length >=1){
      this.totalTransactionCount = totalArrOfObj.map((v:any) => parseFloat(v.value)).reduce((a:any, b:any) => { return a + b });
     }else{
      this.totalTransactionCount = "Nil" ;
     }
     
     //Unposted Count 
     let unpostedArrOfObj = this.transactionListing.filter((v:any) => v.name == "UNPOSTED" );
     let amtReceievedArrOfObj = this.transactionListing.filter((v:any) => v.name == "AMOUNTRECEIVED" );
     let unpostedCount : number = 0 ;
     if(unpostedArrOfObj.length >=1 && amtReceievedArrOfObj.length >= 1){
      unpostedCount = unpostedArrOfObj.map((v:any) => parseFloat(v.value)).reduce((a:any, b:any) => { return a + b });
      this.amountReceievedTransactionCount = amtReceievedArrOfObj.map((v:any) => parseFloat(v.value)).reduce((a:any, b:any) => { return a + b });
      this.unpostedTransactionCount = unpostedCount + this.amountReceievedTransactionCount
     }else{
      this.unpostedTransactionCount = unpostedCount + this.amountReceievedTransactionCount
     }

    

      //Posted Count 
      let postedArrOfObj = this.transactionListing.filter((v:any) => v.name == "POSTED" );
      if(postedArrOfObj.length >= 1){
        this.postedTransactionCount = postedArrOfObj.map((v:any) => parseFloat(v.value)).reduce((a:any, b:any) => { return a + b });
      }else{
        this.postedTransactionCount = "Nil" ;
      }

      this.dashboard.metrics.filter((statusName:any) => {
        if (statusName.name == "APPROVED") {
          statusName.name = "CONVERTED";
         }
         return statusName;
     });
    },
    
    (error:any) =>{
      this.isLoading = false ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
        this.isLoading = false ;
      }
    })
  }, 1000);

  
this.getExchRate();
 //this.getRemittanceCount();
  }

  processDashboardData() {
    // Call the required functions here based on the success of the service
    this.getApplicationStatus('group', 'subGroup');
    this.getTotalApplications('group', 'name');
     this.getCustomerStatus('group', 'subGroup');
    this.getTotalCustomer('group', 'name');
     this.getPayeeCount('group', 'name');
  
    // Perform any further processing or assignments using the data
    // ...
  }
  
   getApplicationStatus(group: string, subGroup: string) {
    if (this.dashboard && Object.keys(this.dashboard).length > 0) {
   return this.dashboard.metrics.filter(v => v['group'] == group && v['subgroup'] == subGroup && v.name != "TOTAL");
  }
  return [];
}

  getTotalApplications(group: string, name: string) {
    if (this.dashboard && Object.keys(this.dashboard).length > 0) {
    return this.dashboard.metrics.filter(v => v['group'] == group && v['name'] == name);
    }
    return [] ;
  }
  getCustomerStatus(group: string, subGroup: string) {
    if (this.dashboard && Object.keys(this.dashboard).length > 0) {
    return this.dashboard.metrics.filter(v => v['group'] == group && v['subgroup'] == subGroup);
    }
    return [] ;
  }
  getTotalCustomer(group: string, name: string) {
    if (this.dashboard && Object.keys(this.dashboard).length > 0) {
    return this.dashboard.metrics.filter(v => v['group'] == group && v['name'] == name);
    }
    return [] ;
  }
  //payee widget - count
  getPayeeCount(group: string, name: string) {
    if (this.dashboard && Object.keys(this.dashboard).length > 0) {
    return this.dashboard.metrics.filter(v => v['group'] == group && v['name'] == name && v.name != "TOTAL" && v.name != "APPROVED" && v.name != "REJECTED");
  }
  return [] ;
  }
 
//   getRemittanceCount(){
//   this.transactionService.viewTransactions().subscribe((datas:any) =>{
//     this.searchTransaction = datas['data'];
//     let unpostedTransaction = datas['data'].filter((v:any) =>v.TXNSTATUS == "INITIATED");
//     let postedTransaction = datas['data'].filter((v:any) =>v.TXNSTATUS == "APPROVED");
//     this.unpostedTransactionCount = unpostedTransaction.length;
//     this.postedTransactionCount = postedTransaction.length;
//   });
// }

 
  
  routeApplicationListings(status:any,type:string){
  
    if (status == "DRAFT") {
      status = "NEW";
    }
    else if (status == "CONVERTED") {
      status = "APPROVED"
    }
    this.router.navigate([`/profile/Application-Listings/${status}`], {
      queryParams:
        { 'Application_Type': type }
    })
   
  }

  routeCustomerListings(status:any,type:string){
    if (status == "ACTIVE") {
       status = "1" 
    }
     if (status == "INACTIVE") {
      status = "0"
    }
    if(status == "TOTAL"){
      status = "Total";
    }
    this.router.navigate([`/customer/table/${status}`],{
      queryParams : {'type': type}
    })
   
   
  }

  navigateExchangeRate(){
    this.router.navigate(['/daily-setup/exchange-rate'])
  }
  
  status: Status[] = [{
    name: "APPROVED", red: "REJECTED", orange: "PENDING", grey: "NEW"
  }]

  //remittance widget - onClick unposted and posted circle
 routeTransactionListings(value:string){
   if(value == "unposted"){
    this.router.navigate(['/transaction/unposted-transaction'],{queryParams:{'type':'unposted'}});
   }
   if(value == "posted"){
    this.router.navigate(['/transaction/posted-transaction'],{queryParams:{'type':'posted'}});
   }
 }

  getColor(Status: any): any {
    switch (Status) {

      case 'PENDING':
        return 'orange';
        case 'REJECTED':
          return 'red';
          case 'APPROVED':
            return 'green';
            case 'NEW':
              return 'grey';
              case 'ACTIVE':
                return 'green';
                case 'INACTIVE':
                  return 'red';
      // case 'Unposted':
      // return 'orange';

    }
  }
  myDate:any= new Date();

  dashboards: Dashboard = {
    "metrics": [
      //exchange rate group
    ],
    "exchangerate":[
      {
          group:"ERT",
          subgroup:"AGN",
          name:"No Rates",
          value:""
        }
      ],

      "promotions":[{
        title:"Bus Driver 5% cashback",
        timeline:"11 Dec 2021 - 11 Jan 2022",
      }]
  }

  //Disabling circle count .
  isDisableTotalCustomer(name:string, type:string) : boolean {
    if(name == "TOTAL" && type == "I"){
      return true ; //disable TOTAL circle for Individual
    }
    if(name == "TOTAL" && type == "C"){
      return true ; //disable TOTAL circle for Corporate
    }
    return false ;
  }
 

getExchRate(){
  this.rateLoader = true;
  setTimeout(() => {
  this.exchangeRateService.getExchangeRates().subscribe((data:any)=>{
    this.rateLoader=false;
    this.exchangeRate = data['rates'];
    console.log(data['rates']);
    if(this.exchangeRate != null)
    this.exchangeRate.filter((v:any)=> {
      if(v.EXCHRATE == 0 || v.EXCHRATE == null){
        v.EXCHRATE = 'No Rates'
      }
      data['rates'].forEach((obj:any) => {
        let loopedObject = this.currencyArray.filter(v => v.CURRENCYCODE == obj.CCYCODE) ;
        obj.CCYFLAG = loopedObject[0].FLAG ? loopedObject[0].FLAG : "" ; 
        if (obj.EXCHRATE < 1) {
          if(obj.EXCHRATE == 0 || obj.EXCHRATE == "0.0000000000"){
            obj.EXCHRATE = 0;
          }
          else{
          obj.EXCHRATE = 1/obj.EXCHRATE;
          obj.EXCHRATE = obj.EXCHRATE.toFixed(10);
          }
      }
      })

    
   
    })
    
   },
   //error handling done - 28/06/2023
   (error:any) =>{
    this.rateLoader=false;
    console.log(error)
    if(error.status != 401){
      if(error.error.errorMessage){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage }
        }) 
      }
    }
  })}
  ,200)
}
 
}
