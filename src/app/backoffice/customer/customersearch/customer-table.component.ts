import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PersonalInfoComponent } from 'src/app/onboarding/individual/basic-info/basic-info.component';
import { ProfileinfoService } from 'src/app/core/services/profileinfo.service';
import { ViewPayeeComponent } from '../payeesearch/view-payee.component';
import { CustomerSearch } from 'src/app/core/model/customersearch/customersearch';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { Sort } from '@angular/material/sort';
import { PayeeService } from 'src/app/payee/service/payee.service';
import { PayeeSearch } from '../model/customer.model';
import { AddPayeeComponent } from 'src/app/payee/add-payee/add-payee.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { CompanyProfileComponent } from 'src/app/onboarding/corporate/profile/company-profile.component';
import { CorporateService } from 'src/app/core/services/corporate.service';
import { IdentitydocumentComponent } from 'src/app/onboarding/individual/documents/document-uploader.component';


import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { nricRegex } from 'src/assets/dropdownvalues';
import { ViewCustomerstatusRemarksComponent } from '../../shared/modals/view-customerstatus-remarks/view-customerstatus-remarks.component';
import { UpdateCustomerAccountsComponent } from '../../shared/modals/update-customer-accounts/update-customer-accounts.component';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { ViewManagementReportConfirmationDialogComponent } from '../../shared/modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';



@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss', '../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],
})
export class CustomerTableComponent implements OnInit {
  isActive = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterForm : FormGroup = Object.create(null);
  isDesc!: boolean;
  resultsLength= 0;
  loader: Boolean = false;
  searchName!: string;
  searchNumber!: string;
  searchidNumber !: string;
  selectedType : any = "";
  selectedAccount : any = "";
  selectedStatus : any = "";
  customerSearch : CustomerSearch [] = [];
  sortedData : CustomerSearch[] = [];
  searchPayee : PayeeSearch[] = [];
  showHeader : Boolean = true;
  showMatToolbar : Boolean = false;
  showButton : Boolean = false;
  showOKButton : Boolean = false;
  value : any;
  customerInquiry: CustomerInquiry = new CustomerInquiry();
  status : any;
  type:any;
  customerId: any;
  customerType !: string;
  customerName: any;
  customerNumber: any;
  disableOkButton : Boolean = true;
  payeeid: any;
  customerAccountNumber : any;
  nric_number !: string;
  optionDiabled : Boolean = false ;
//new changes
  minStartDate!: Date;
  maxStartDate!: Date;
  minEndDate!: any;
  maxEndDate!: any;
  validateEndDate: any;
  validateStartDate: any;
  xpandStatus = false;
  filterValues: any[] = [];
  sendCurrency: string = '';
  recordsCount: any = '';
  searchFieldTyped: Boolean = false;
  finalTransactionStatusArray: any = "";
  patchStartDate: any = "";
  patchEndDate: any = "";
  dateGt: any = "";
  dateLt: any = "";
  p: number = 1;
  itemsPerPage: number = 20;
  showOKButtonForMC = false ;
  productCode !: string ;
  customerNationality !: string ;
  isMoneyChangerReview : Boolean = false ;  
  showCustomerNameSearch = true ; //Customer Name Search Field
  getCustomerInquiry : any ;
  customerAccountsInquiry : any ;
  bizProfileCustomerResponse : any ;
  accountDropdown : any[] = [
    {"value" : "All" , "description" : "All"} ,
    {"value" : "TT" , "description" : "Remittance"} ,
    {"value" : "MC" , "description" : "MoneyChanger"} ,
  ];
  account :string = "" ;
  searchEmailId !: string ;
  searchNameForm : FormGroup = Object.create(null);
  selectedRiskRating : any = "";
  getRiskRatingList : any[] = [
    {"VALUE" : "9", "DESC" : "HIGH"},
    {"VALUE" : "5", "DESC" : "MEDIUM"},
    {"VALUE" : "0", "DESC" : "LOW"}
  ];

  constructor(public dialogRef: MatDialog, public dialog: MatDialogRef<CustomerTableComponent>,private customerSearchService: CustomerSearchService,private payeeService: PayeeService, private route: ActivatedRoute , private store: InMemoryCache,
    @Inject(MAT_DIALOG_DATA) public data: any,private headerService : TitleHeaderService,private corporateService:CorporateService,
    private fb : FormBuilder ) {
      dialogRef.afterAllClosed.subscribe(() => {
        if(this.store.getItem('CUSTOMER_ACTIVATE') != undefined){
          this.store.removeItem('CUSTOMER_ACTIVATE');
          var status: string;
          if(this.selectedStatus != undefined){
            status = this.selectedStatus ? this.selectedStatus : "" ;
          }
          else {
            status = this.status ? this.status : "" ;
          }
          this.loader = true; 
          setTimeout(() => {
            this.customerSearchService.getCustomerSearch(this.selectedType,status,"","").subscribe((datas:any) => {
              console.log(datas)
              this.customerSearch = datas['data'];
              this.loader = false;
              datas['data'].filter((v:any)=> {
                if(v.STATUS == '1'){
                  v.STATUS = "Active";
                }
                if(v.STATUS == '0'){
                  v.STATUS = "InActive";
                }
              })
            },
            //error handling completed on 04/07/2023
      (error:any) =>{
        this.loader = true; 
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
        }
      }
            )
          }, 1000); 
        }
      if(this.store.getItem('CUSTOMER_INACTIVATE') != undefined){
        this.store.removeItem('CUSTOMER_INACTIVATE');
        this.loader = true;


        setTimeout(() => {
          this.customerSearchService.getCustomerSearch(this.selectedType,this.selectedStatus,"","").subscribe((datas:any) => {
            console.log(datas)
            this.customerSearch = datas['data'];
            this.loader = false;
            datas['data'].filter((v:any)=> {
              if(v.STATUS == '1'){
                v.STATUS = "Active";
              }
              if(v.STATUS == '0'){
                v.STATUS = "InActive";
              }
            })
          },
           //error handling completed on 04/07/2023
      (error:any) =>{
        this.loader = false;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
        }
      }
          )
        }, 1000);
      }
    })
    }

    //This function triggers whenever previous and next page is clicked on mat pagination ..
    handlePageChange(event: any): void {
      const startValue = (event.pageIndex * this.itemsPerPage) + 1; //from which record we need , eg : 1 or 21 or 41 or 61
      const limit = this.itemsPerPage; //records per Page
      this.p = event.pageIndex + 1;
     this.loader = true;
     setTimeout(() => {
      this.selectedType = this.selectedType ? this.selectedType : "" ;
      this.selectedStatus = this.selectedStatus ? this.selectedStatus : "" ;
      this.customerSearchService.customerSearchServerPagination(this.selectedType,this.selectedStatus,startValue,limit).subscribe((datas:any)=>{
       console.log(datas) ;
        this.loader = false;
  
        //converting the values of response object as status="1" as active "0" as inactive and customerType="I" as Individual
        datas['data'].filter((v:any)=> {
          if(v.STATUS == '1'){
            v.STATUS = "Active";
          }
          if(v.STATUS == '0'){
            v.STATUS = "InActive";
          }
        })
      },
       //error handling done on 03-07-2023
    (error:any) =>{
      this.loader = false;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    })
     }, 400);
     
    }

  ngOnInit(): void {
    //status is captured from the routes
    this.headerService.setTitle('Customers');
    var regex = nricRegex
    this.filterForm = this.fb.group({
      "customerName" : [null,Validators.compose([Validators.pattern('^[a-zA-Z0-9 ./,@]+$'),Validators.required])],
      "idNbr" : [null,Validators.compose([Validators.pattern(regex), Validators.required])],
      "phoneNo" : [null,Validators.compose([Validators.pattern("^[0-9 ]+$"), Validators.required])],
      "startDate": [null, Validators.compose([Validators.required])],
      "endDate": [null, Validators.compose([Validators.required])],
      "account" : [null, Validators.compose([Validators.required])],
      "emailId" : [null, Validators.compose([Validators.email, Validators.required])],
      "type" : [null,Validators.compose([Validators.required])],
      "status" : [null,Validators.compose([Validators.required])],
      "riskRating" : [null,Validators.compose([Validators.required])],
    })

    this.searchNameForm = this.fb.group({
      "customerName" : [null,Validators.compose([Validators.pattern('^[a-zA-Z0-9 ./,@]+$')])],
    })
   this.status = this.route.snapshot.params['status'] ? this.route.snapshot.params['status'] : "" ;
   this.selectedStatus = this.status ? this.status : "";
   if(this.status === "Total"){
    this.selectedStatus = "";
   }
   if(this.status == ""){
    this.selectedStatus = "";
    this.selectedType = ""; 
   }

    //new change on 01/08/2023 , pushing objects for displaying filter values
    this.filterValues = [] ;
    let customerStatus : string = "" ;
    if(this.selectedStatus == "0"){
      customerStatus = "InActive"
    }
    if(this.selectedStatus == "1"){
      customerStatus = "Active"
    }
    if(this.selectedStatus == ""){ //coming from menu items ==> handling customer status
      customerStatus = "Active, InActive"
    }
    var customerStatusObj = {"fieldName": "Status", "value" : customerStatus}
    this.filterValues.push(customerStatusObj) ;
   this.route.queryParams.subscribe((params: any)=> {
    console.log("url params :" + params);
    let previewData =  params.indicator;
    let customerId = this.store.getItem('ID');
    if(previewData == "FROM_CUSTOMER_PREVIEW"){
      this.customerSearchService.getCustomerInquiry(customerId).subscribe(data => {
        this.customerInquiry = data;
        this.dialogRef.open(IdentitydocumentComponent, {
          data : {isCustomerReview : data , custId: customerId},
          panelClass: 'custom-modalbox',
          width:'1245px',
          height: '616px',
         })
      },
      //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
      )
    }
    if(params.type == "I"){
  this.selectedType = "I";
  //new change on 01/08/2023 , pushing objects for displaying filter values
  var individualObj = {"fieldName": "Customer Type", "value" : "Individual"}
    this.filterValues.push(individualObj) ;
    this.getCustomerSearch(this.selectedType,this.status,"","") ;

    }
  if(params.type == "C"){
    this.selectedType = "C";
    //new change on 01/08/2023 , pushing objects for displaying filter values
  var corporateObj = {"fieldName": "Customer Type", "value" : "Business"}
    this.filterValues.push(corporateObj) ;
    this.getCustomerSearch(this.selectedType,this.status,"","") ;
  }
  if(params.type == undefined){ //new if brought on 01/08/2023 , //coming from menu items ==> handling customer type
    // var allObj = {"fieldName": "Customer Type", "value" : "Individual, Business"}
    // this.filterValues.push(allObj) ;
    this.filterValues = [];
  }
  })
  //Service call for customer_search
  if(!this.data.customerSearchReview && !this.data.mcAddDealCustomerReview){
  //!FOR TEMPORARY
    this.loader = true;
    setTimeout(() => {
    this.loader=false;
    }, 500);
  } 

   if(this.data.customerSearchReview){
    this.headerService.setTitle('Send Money');
    this.customerSearch = this.data.customerTable;
    this.recordsCount = this.customerSearch.length ;
    this.optionDiabled = false;
    this.selectedType = ""; //Fetch both Consumer and Corporate
    this.selectedStatus = "1";
     //new change on 01/08/2023 , pushing objects for displaying filter values
     this.filterValues = [] ;

    this.showHeader = false;
    this.showMatToolbar = true;
    this.showButton = true;
   }
   //MC => Add deal => customer search open dialog
   if(this.data.mcAddDealCustomerReview){
    this.isMoneyChangerReview = true ;
    if(this.data.titleName == "Deal"){
      this.headerService.setTitle('Add Deal');
      this.showCustomerNameSearch = false ; //Show Alias Name search
    }
    else if(this.data.titleName == "Transaction"){
      this.headerService.setTitle('Add Transaction');
      this.showCustomerNameSearch = false ; //Show Alias Name search
    }
    else if(this.data.titleName == "Add Shipment"){
      this.headerService.setTitle('Add Shipment');
    }
   
    this.customerSearch = this.data.customerTable;
    this.recordsCount = this.customerSearch.length ;
    this.productCode = "MC" ;
    this.optionDiabled = false; //can select any customers either ind or corp in customer type dropdown field
    this.selectedType = "";
    this.selectedStatus = "1";
     //new change on 01/08/2023 , pushing objects for displaying filter values
     this.filterValues = [] ;

    this.showHeader = false;
    this.showMatToolbar = true;
    this.showButton = false;

   }
   //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;
  }
 
  // Custom getter to check if at least one field is valid in filterForm group
  get isAnyFieldValid(): boolean {
    return Object.values(this.filterForm.controls).some(control => control.valid);
  }

 //STATUS color diff
 getColor(status: any) {
  switch (status) {
    case 'Active':
      return 'rgb(30 189 40)'; 
    case 'InActive':
      return 'red'
    default:
      return '';
  }
}
//bg color for status tags .
getBackgroundColor(status: string): string {
  switch (status) {
    case 'Active':
      return '#E1FCEF'; 
    case 'InActive':
      return '#FFEDDF'
    default:
      return '';
  }
  
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
    return (this.getScreenHeight - 278 ); 
  }
  modalTable(){
    return 526 ;
  }
  getOverFlow(){
    return 'auto';
  }
  


  // show radiobutton in backoffice > send money > fect customer 
  radioSelected(id:any,name:any,number:any,accountNumber:any,customerType:string,nricNumber:string,nationality:string){
    this.disableOkButton = false;
    console.log("Radio selected") ;
    let productCode = this.productCode ? this.productCode : "" ;
    if(productCode == "MC"){
      this.showOKButton = false;
      this.showOKButtonForMC = true ;
    }
    else{
      this.showOKButtonForMC = false ;
      this.showOKButton = true;
    }
    this.customerId = id;
    this.customerName = name;
    this.customerNumber = number
    this.customerAccountNumber = accountNumber;
    this.customerType = customerType;
    this.nric_number = nricNumber;
    this.customerNationality = nationality ;
  }
  //onClick - ok button => navigate sendmoney screen in backoffice along with customer name 
  navigateParentScreen(){
    let customerType = this.customerType;
    let name = this.customerName;
    let id = this.customerId;
    let number = this.customerNumber;
    console.log("value" + name);
    console.log("Navigate to parent screen") ;
    let status = '1';
      this.payeeService.viewCustomersPayee(id,status).subscribe((datas:any)=>{
          this.searchPayee = datas['data'];
          this.dialog.close({data: name +"," + number, payeeData: datas['data'], customerId:this.customerId , customer_name: name , customer_phonenbr: number,customer_accountNo: this.customerAccountNumber,customer_type:customerType , nric : this.nric_number });
   },
   //error handling done on 03-07-2023
   (error:any) =>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
   )
    
  }

  //navigate to MC Deal screen 
  //navigateBookDealScreen(activeCustomers.CUSTOMERID,activeCustomers.NAME,activeCustomers.PHONENBR,activeCustomers.ACCOUNTNBR,activeCustomers.CUSTOMERTYPE,activeCustomers.IDNBR,activeCustomers.NATIONALITY)
  navigateBookDealScreen(customerId:string,customerName:string,customerNumber:string,acctNo:string,customerType:string,nricNumber:string,nationality:string,aliasName:string){
    this.dialog.close({customerId : customerId, nricNo : nricNumber, customerName : customerName,
    phnNo : customerNumber, nationality: nationality, customerType : customerType, aliasName: aliasName})
  }
  //this function -> applies filter after customer type and status value is captured
  applyFilter(customerName:string,phoneNumber:string,idNumber:string, type:any , status:any, action:string,emailId:string,riskRating : any){
    this.xpandStatus = false ;
    customerName = customerName ? customerName : "" ;
    phoneNumber = phoneNumber ? phoneNumber : "" ;
    idNumber = idNumber ? idNumber : "" ;
    type = type ? type : "" ;
    status = status ? status : "" ;
    emailId = emailId ? emailId : "" ;
    this.account = this.filterForm.controls['account'].value ? this.filterForm.controls['account'].value : "" ;
    // Clear the filters array 
    this.filterValues = [];
    if(this.filterForm.controls.startDate.value != null || this.filterForm.controls.endDate.value != null){
    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value);
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

     // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     this.patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
     this.patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

    if(this.patchStartDate == 'NaN-NaN-NaN'){
      this.patchStartDate = "" ;
    }
    if(this.patchEndDate == 'NaN-NaN-NaN'){
      this.patchEndDate = "" ;
    }
     //pushing dates
     var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
     var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
     this.filterValues.push(obj1);
     this.filterValues.push(obj2);

    }
    else{
      this.dateGt = "" ;
      this.dateLt = "" ;
    }
   

    //pushing customer name        
    if (customerName != "") {

      let modifiedCustomerName = customerName;
  
      if (customerName.length > 15) {
        modifiedCustomerName = customerName.substring(0, 15) + " ...";
      }
      const newFilterObject = { "fieldName": "Customer Name", "value": modifiedCustomerName };
      this.filterValues.push(newFilterObject);
    }

    //pushing Phone Number        
    if (phoneNumber != "") {
      const newFilterObject = { "fieldName": "Phone Number", "value": phoneNumber };
      this.filterValues.push(newFilterObject);
    }
    //pushing email id        
    if (emailId != "") {
      const newFilterObject = { "fieldName": "Email ID", "value": emailId };
      this.filterValues.push(newFilterObject);
    }
    //pushing NRIC        
    if (idNumber != "") {
      const newFilterObject = { "fieldName": "NRIC", "value": idNumber };
      this.filterValues.push(newFilterObject);
    }
    //pushing Type 
    if (type != "") {
      let custType = "" ;
      if(type == "I"){
        custType = "Individual"
      }
      if(type == "C"){
        custType = "Business"
      }
      if(type == ""){
        custType = "Active, InActive"
      }
      const newFilterObject = { "fieldName": "Customer Type", "value": custType };
      this.filterValues.push(newFilterObject);
    }
     //pushing customer status 
     if (status != "") {
      let customerStatus = "" ;
      if(status == "0"){
        customerStatus = "InActive"
      }
      if(status == "1"){
        customerStatus = "Active"
      }
      if(status == ""){
        customerStatus = "Active, InActive"
      }
      const newFilterObject = { "fieldName": "Status", "value": customerStatus };
      this.filterValues.push(newFilterObject);
    }

    //pushing Phone Number        
    if (this.account != "") {
      let accountDescription = this.accountDropdown.filter(v=> v.value == this.account) ;
      const newFilterObject = { "fieldName": "Account", "value": accountDescription[0] ? accountDescription[0].description : "" };
      this.filterValues.push(newFilterObject);
    }

    //pushing Riskrate 
    if (riskRating != "") {
      let riskRatingValue = ""
      if(riskRating == "0"){
        riskRatingValue = "Low"
      }
      if(riskRating == "5"){
        riskRatingValue = "Medium"
      }
      if(riskRating == "9"){
        riskRatingValue = "High"
      }
      const newFilterObject = { "fieldName": "Risk Rating", "value": riskRatingValue };
      this.filterValues.push(newFilterObject);
    }

    //if all element is empty string , push old object back and display it in screen .
    if(customerName == "" && phoneNumber == "" && idNumber == "" && type == "" &&  status == "" && this.dateGt == "" && this.dateLt == "" && this.account == "" && riskRating == ""){
      if(this.showMatToolbar == false){
        let customerStatus = "Active, InActive" ;
        let customerType = "Individual, Business" ;
        const obj = { "fieldName": "Status", "value": customerStatus } ;
        const obj2 =  { "fieldName": "Customer Type", "value": customerType };
        this.filterValues.push(obj);
        this.filterValues.push(obj2);
      }
      else{
        //pushing Type 
  let custType = "Individual" ;
  const newFilterTypeObject = { "fieldName": "Customer Type", "value": custType };
  this.filterValues.push(newFilterTypeObject); 

  //pushing status 
  let customerStatus = "Active";
  const newFilterStatusObject = { "fieldName": "Status", "value": customerStatus };
  this.filterValues.push(newFilterStatusObject);
      }
    }
    this.loader = true;
    //service call
    setTimeout(() => {
      if(action == "VIEW"){
      this.customerSearchService.filteredCustomerSearch(customerName,phoneNumber ,idNumber, type , status,this.dateGt,this.dateLt,"", this.account,emailId,riskRating).subscribe((datas:any)=> 
      {
        this.customerSearch = datas['data'];
        this.recordsCount = this.customerSearch.length ;
        // Reset page to 1
        this.p = 1;
        this.loader = false;
        datas['data'].filter((v:any)=> {
          if(v.STATUS == '1'){
            v.STATUS = "Active";
          }
          if(v.STATUS == '0'){
            v.STATUS = "InActive";
          }
         })
      },
      (error:any) =>{
        this.loader = false;
         //error handling completed on 04/07/2023
        if(error.status != 401){
          const dialog = this.dialogRef.open(ErrorDialogAdminComponent);
          dialog.afterClosed().subscribe(result => {
            if(result.data == 'ErrorDialogClosed'){
            }})
        }
      
      }
      )
    }
    else if(action == "PDF"){
      this.loader = false;
      this.dialogRef.open(ViewManagementReportConfirmationDialogComponent,{
        data: {isCustomerTableReview: true},
        width: '500px'
      }).afterClosed().subscribe((response:any)=>{
        console.log(response)
        if(response && response.action == "SAVE"){ //PDF export
          this.exportCustomerMaster(customerName,phoneNumber ,idNumber, type , status,this.dateGt,this.dateLt, this.account, emailId, response.action,riskRating) ;
        }
        else if(response && response.action == "XLSX"){ //excel export
          this.exportCustomerMaster(customerName,phoneNumber ,idNumber, type , status,this.dateGt,this.dateLt, this.account, emailId, response.action,riskRating) ;
        }
      }
      )
    }
    }, 400);
  }
 

//view basicinfo details of customer in a modal popup dialog
  openDialog(customerId:string,customerType:string) {
    if(customerType == "I"){
    this.store.setItem('CUSTOMER_ID',customerId)
    this.customerSearchService.getCustomerInquiry(customerId).subscribe(data => {
      this.customerInquiry = data;
      this.dialogRef.open(PersonalInfoComponent, {
        data : {isCustomerReview : data , custId: customerId},
        panelClass: 'custom-modalbox',
        width:'1245px',
        height: '575px',
        disableClose : true
       })
    },
    //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialogRef.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }
  if(customerType == "C"){
    this.store.setItem('CUSTOMER_ID',customerId);
    this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
      this.dialogRef.open(CompanyProfileComponent, {
        data : {custId: customerId,isCompanyProfileReview:data},
        panelClass: 'custom-modalbox',
        width:'1245px',
        height: '575px',
        disableClose : true,
       })
    },
    //error handling Completed on 06-07-2023
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    })
  }
   
  }

  //this function triggers after eye icon clicked(let branch user to view payee of respective customers)
  viewPayeeDialog(customerId:any,customerName : string){
    let status = '1';
    this.payeeService.viewCustomersPayee(customerId,status).subscribe((datas:any)=>{
      this.searchPayee = datas['data']
      this.payeeid = datas.data.filter((v:any)=>{return v.PAYEEID})
      this.store.setItem('PAYEE_ID',this.payeeid);
      this.store.setItem('CUSTOMER_ID',customerId)
    this.dialogRef.open(ViewPayeeComponent, {
      data:{isPayeeReview : datas['data'],CUSTOMER_NAME : customerName},
      panelClass: 'custom-modalbox',
      width:'1350px',
      height: '765px',
     })
    },
    //error handling completed on 04/07/2023
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent)
      }
    }
    )

  }

  //this function triggers after add icon clicked which is aside of view payee icon
  addPayeeDialog(customerId:any,customerType : string){
    this.store.setItem('BACKOFFICECUSTOMER_ID',customerId)
    console.log(customerId)
    this.dialogRef.open(AddPayeeComponent,{
      data:{addPayeeModal: true, customerType : customerType},
      panelClass: 'custom-modalbox',
      width:'1240px',
      height: '600px',
    })
  }

  //table sort header
  sortData(sort: Sort) {
    const data = this.customerSearch;
  if (!sort.active || sort.direction == '') {
    this.sortedData = data;
    return ;
    }
    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction == 'asc';
      switch (sort.active) {
        case 'CUSTOMERID':
          return this.compare(a.CUSTOMERID ,b.CUSTOMERID ,isAsc);
        case 'NAME':
          return this.compare(a.NAME, b.NAME, isAsc);
        case 'STATUS':
          return this.compare(a.STATUS, b.STATUS, isAsc);
          case 'CUSTOMERTYPE':
            return this.compare(a.CUSTOMERTYPE, b.CUSTOMERTYPE, isAsc);
            case 'PHONENBR':
              return this.compare(a.PHONENBR, b.PHONENBR, isAsc);
        case 'NATIONALITY':
          return this.compare(a.NATIONALITY, b.NATIONALITY, isAsc);
        default:
          return 0;
      }
    });
  }
  compare(a: string, b:  string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  sortId() {
    // this.activeCustomers = this.activeCustomers.sort((a, b) => {
    //   if (a.applicantId > b.applicantId) {
    //     return 1;
    //   }
    //   if (a.applicantId < b.applicantId) {
    //     return -1;
    //   }
    //   return 0;
    // }
    // )
  };

   //tool tip text value based on txnstatus ..
   getTooltipText(status: string): string {
    switch (status) {
      case 'Active' :
        return 'Active Customers' ;

      case 'InActive':
        return 'Deactivated Customers';

    
      default:
        return ''; // Empty string as default tooltip text
    }
  }
 
  resetFilter() {
    this.xpandStatus = false ;
    this.searchName =  "" ;
    this.searchNumber =  "" ;
    this.searchEmailId =  "" ;
    this.searchidNumber =  "" ;
    this.selectedStatus = "" ;
    this.selectedType = "" ;
    this.selectedRiskRating = "";
    this.loader = true;
    let dateGt: any;
    let dateLt: any;
    dateGt = "" ;
    dateLt = "";
    this.filterForm.controls['startDate'].setValue(null) ;
    this.filterForm.controls['endDate'].setValue(null) ;
    this.xpandStatus = false; //expansion panel will close
    this.minEndDate = null;
    this.maxEndDate =  null;
    this.filterForm.controls['account'].setValue(null) ;
    this.customerSearch = [];
    this.recordsCount = this.customerSearch.length;
    this.filterValues=[];
    setTimeout(() => {
      this.loader = false;
    }, 700);
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value? event.value._d : "";
    if(this.validateEndDate != ""){
    this.filterForm.controls['startDate'].setValidators(Validators.required);
    this.filterForm.controls['startDate'].updateValueAndValidity();
    }

  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value? event.value._d : "";
    if(this.validateStartDate != ""){
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 31 * 24 * 60 * 60 * 1000);
     // set validation in end date field when value is null
    if( this.filterForm.controls['endDate'].value == null){
      this.filterForm.controls['endDate'].setValidators(Validators.required);
      this.filterForm.controls['endDate'].updateValueAndValidity();
   }
  }
  }

  onCustomerNameChange(flag:string) {
    let inputText : any ;
    let customerNameControl : any ;
    let isAlphabetic : Boolean = true ; //initialy true.
    let isNumeric : Boolean = true ;  //initialy true .
    if(flag == "CUSTOMERNAME"){
      customerNameControl = this.searchNameForm.controls['customerName'];
      // Get the current value of the input field --> CUSTOMER NAME
     inputText = customerNameControl.value;
     customerNameControl.setValue(inputText.toUpperCase());
    }
    else if(flag == "ALIASNAME"){ // --> Add Txn / Add deal > filteration customer : if alphabets -> map in customerName , if numeric -> map in aliasName
      customerNameControl = this.searchNameForm.controls['customerName'];
      // Get the current value of the input field --> CUSTOMER NAME
     inputText = customerNameControl.value;
      // Check if inputText is alphabetic (Starts with alphabet)
       isAlphabetic = /^[a-zA-Z]/.test(inputText) ;

      // Check if inputText is numeric (Starts only numbers)
       isNumeric = /^\d/.test(inputText);

       if(isAlphabetic){ //If customer name search is alphabet --> convert to UPPERCASE .
        inputText = customerNameControl.value;
        customerNameControl.setValue(inputText.toUpperCase());
       }
    }

   this.searchName  = this.searchName ? this.searchName : "" ;
   this.searchNumber = this.searchNumber ? this.searchNumber : "";
   this.searchEmailId = this.searchEmailId ? this.searchEmailId : "";
   this.searchidNumber = this.searchidNumber ? this.searchidNumber : "" ;
   this.selectedStatus = this.selectedStatus ? this.selectedStatus : "";
   this.selectedType = this.selectedType ? this.selectedType : "" ;
   this.account = this.filterForm.controls['account'].value ? this.filterForm.controls['account'].value : "";

   
    if (this.searchFieldTyped == true && inputText.length == 0 && flag == "CUSTOMERNAME" ) {
      // Triggered and service is called
      setTimeout(() => {
        this.filterValues = [];

         //dynamic date values and pushing dates if there ! .
    let startDate = this.filterForm.controls.startDate.value ? this.filterForm.controls.startDate.value : "" ;
    let endDate = this.filterForm.controls.endDate.value ? this.filterForm.controls.endDate.value : "" ;
    var start_date: any = moment(startDate);
    var end_date: any = moment(endDate);
    if(startDate != "" || endDate != ""){
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

     // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     this.patchStartDate =  start_date._d.toLocaleDateString('en-GB', options);
     this.patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

    if(this.patchStartDate == 'NaN-NaN-NaN'){
      this.patchStartDate = "" ;
    }
    if(this.patchEndDate == 'NaN-NaN-NaN'){
      this.patchEndDate = "" ;
    }
     //start date and end date pushed .
     var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
     var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
     this.filterValues.push(obj1);
     this.filterValues.push(obj2); //
    }
      
        //pushing customer name        
        if (this.searchName != "") {
          const newFilterObject = { "fieldName": "Customer Name", "value": this.searchName };
          this.filterValues.push(newFilterObject);
        }
       
        //pushing Phone Number        
        if (this.searchNumber != "") {
          const newFilterObject = { "fieldName": "Phone Number", "value": this.searchNumber };
          this.filterValues.push(newFilterObject);
        }
        //pushing email id        
        if (this.searchEmailId != "") {
          const newFilterObject = { "fieldName": "Email ID", "value": this.searchEmailId };
          this.filterValues.push(newFilterObject);
        }
        //pushing NRIC        
        if (this.searchidNumber != "") {
          const newFilterObject = { "fieldName": "NRIC", "value": this.searchidNumber };
          this.filterValues.push(newFilterObject);
        }

         //pushing account        
         if (this.account != "") {
          let accountDescription = this.accountDropdown.filter(v=> v.value == this.account) ;
          const newFilterObject = { "fieldName": "Account", "value": accountDescription[0] ? accountDescription[0].description : "" };
          this.filterValues.push(newFilterObject);
        }

         //pushing Type 
    if (this.selectedType != "") {
      let custType = "" ;
      if(this.selectedType == "I"){
        custType = "Individual"
      }
      if(this.selectedType == "C"){
        custType = "Business"
      }
      if(this.selectedType == ""){
        custType = "Active, InActive"
      }
      const newFilterObject = { "fieldName": "Customer Type", "value": custType };
      this.filterValues.push(newFilterObject);
    }
     //pushing customer status 
     if (this.selectedStatus != "") {
      let customerStatus = "" ;
      if(this.selectedStatus == "0"){
        customerStatus = "InActive"
      }
      if(this.selectedStatus == "1"){
        customerStatus = "Active"
      }
      if(this.selectedStatus == ""){
        customerStatus = "Active, InActive"
      }
      const newFilterObject = { "fieldName": "Status", "value": customerStatus };
      this.filterValues.push(newFilterObject);
    }

    //pushing Riskrate 
    if (this.selectedRiskRating != "") {
      let riskRating = ""
      if(this.selectedRiskRating == "0"){
        riskRating = "Low"
      }
      if(this.selectedRiskRating == "5"){
         riskRating = "Medium"
      }
      if(this.selectedRiskRating == "9"){
        riskRating = "High"
      }
      const newFilterObject = { "fieldName": "Risk Rating", "value": riskRating };
      this.filterValues.push(newFilterObject);
    }
//filter service call 
    this.loader = true;

    //if all elements are found empty --> dont call service , instead empty the records and white label it 
    if(this.searchName == "" && this.searchNumber == "" && this.searchidNumber == "" && this.selectedType == "" && this.selectedStatus == "" && this.dateGt == "" && this.dateLt == "" && this.account == "" && this.searchEmailId == "" && this.selectedRiskRating == ""){
      this.customerSearch = [] ;
      this.recordsCount = this.customerSearch.length;
       // Reset page to 1
       this.p = 1;
       this.loader = false;
    }
    else {
    this.customerSearchService.filteredCustomerSearch(this.searchName,this.searchNumber ,this.searchidNumber, this.selectedType , this.selectedStatus,this.dateGt,this.dateLt,"",this.account, this.searchEmailId,this.selectedRiskRating).subscribe((datas:any)=> 
        {
          this.customerSearch = datas['data'];
         this.recordsCount = this.customerSearch.length;
         // Reset page to 1
        this.p = 1;
          this.loader = false;
          datas['data'].filter((v:any)=> {
            if(v.STATUS == '1'){
              v.STATUS = "Active";
            }
            if(v.STATUS == '0'){
              v.STATUS = "InActive";
            }
           })
      
  
         },
          //error handling done on 03-07-2023
          (error: any) => {
            this.loader = false;
            if (error.status != 401) {
              this.dialogRef.open(ErrorDialogAdminComponent);
            }
          }
        ) 
      }
      }, 700);
    }
    // Check if the input has at least three characters and contains only alphabets
    if (inputText.length >= 3 && /^[a-zA-Z ]+$/.test(inputText) && flag == "CUSTOMERNAME") {

      this.searchFieldTyped = true;  //once user entered more than 3 char , will call this variable 'searchFieldTyped' and give it as true signal

      this.filterValues = [];
      //dynamic date values and pushing dates if there ! .
    let startDate = this.filterForm.controls.startDate.value ? this.filterForm.controls.startDate.value : "" ;
    let endDate = this.filterForm.controls.endDate.value ? this.filterForm.controls.endDate.value : "" ;
    var start_date: any = moment(startDate);
    var end_date: any = moment(endDate);
    if(startDate != "" || endDate != ""){
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

     // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     this.patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
     this.patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

    if(this.patchStartDate == 'NaN-NaN-NaN'){
      this.patchStartDate = "" ;
    }
    if(this.patchEndDate == 'NaN-NaN-NaN'){
      this.patchEndDate = "" ;
    }
     //start date and end date pushed .
     var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
     var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
     this.filterValues.push(obj1);
     this.filterValues.push(obj2); //
    }

      //pushing customer name        
      if (this.searchName != "") {
        const newFilterObject = { "fieldName": "Customer Name", "value": this.searchName };
        this.filterValues.push(newFilterObject);
      }
     
      //pushing Phone Number        
      if (this.searchNumber != "") {
        const newFilterObject = { "fieldName": "Phone Number", "value": this.searchNumber };
        this.filterValues.push(newFilterObject);
      }
      //pushing Phone Number        
      if (this.searchEmailId != "") {
        const newFilterObject = { "fieldName": "Email ID", "value": this.searchEmailId };
        this.filterValues.push(newFilterObject);
      }
      //pushing NRIC        
      if (this.searchidNumber != "") {
        const newFilterObject = { "fieldName": "NRIC", "value": this.searchidNumber };
        this.filterValues.push(newFilterObject);
      }

       //pushing account        
       if (this.account != "") {
        let accountDescription = this.accountDropdown.filter(v=> v.value == this.account) ;
      const newFilterObject = { "fieldName": "Account", "value": accountDescription[0] ? accountDescription[0].description : "" };
        this.filterValues.push(newFilterObject);
      }
 //pushing Type 
 if (this.selectedType != "") {
  let custType = "" ;
  if(this.selectedType == "I"){
    custType = "Individual"
  }
  if(this.selectedType == "C"){
    custType = "Business"
  }
  if(this.selectedType == ""){
    custType = "Active, InActive"
  }
  const newFilterObject = { "fieldName": "Customer Type", "value": custType };
  this.filterValues.push(newFilterObject);
}
 //pushing customer status 
 if (this.selectedStatus != "") {
  let customerStatus = "" ;
  if(this.selectedStatus == "0"){
    customerStatus = "InActive"
  }
  if(this.selectedStatus == "1"){
    customerStatus = "Active"
  }
  if(this.selectedStatus == ""){
    customerStatus = "Active, InActive"
  }
  const newFilterObject = { "fieldName": "Status", "value": customerStatus };
  this.filterValues.push(newFilterObject);
}

    //pushing Riskrate 
    if (this.selectedRiskRating != "") {
      let riskRating = ""
      if(this.selectedRiskRating == "0"){
        riskRating = "Low"
      }
      if(this.selectedRiskRating == "5"){
        riskRating = "Medium"
      }
      if(this.selectedRiskRating == "9"){
        riskRating = "High"
      }
      const newFilterObject = { "fieldName": "Risk Rating", "value": riskRating };
  this.filterValues.push(newFilterObject);
}

      // Triggered and service is called
      this.loader = true;
      setTimeout(() => {
        this.customerSearchService.filteredCustomerSearch(this.searchName,this.searchNumber ,this.searchidNumber, this.selectedType , this.selectedStatus,this.dateGt,this.dateLt,"", this.account, this.searchEmailId ,this.selectedRiskRating).subscribe((datas:any)=> 
        {
          this.customerSearch = datas['data'];
         this.recordsCount = this.customerSearch.length;
         // Reset page to 1
        this.p = 1;
          this.loader = false;
          datas['data'].filter((v:any)=> {
            if(v.STATUS == '1'){
              v.STATUS = "Active";
            }
            if(v.STATUS == '0'){
              v.STATUS = "InActive";
            }
           })
         
  
          
    
         },
          //error handling done on 03-07-2023
          (error: any) => {
            this.loader = false;
            if (error.status != 401) {
              this.dialogRef.open(ErrorDialogAdminComponent);
            }
          }
        )
      }, 700);

    }

    if (this.searchFieldTyped == true && inputText.length == 0 && flag == "ALIASNAME") {
      // Triggered and service is called
      setTimeout(() => {
        this.filterValues = [];

         //dynamic date values and pushing dates if there ! .
    let startDate = this.filterForm.controls.startDate.value ? this.filterForm.controls.startDate.value : "" ;
    let endDate = this.filterForm.controls.endDate.value ? this.filterForm.controls.endDate.value : "" ;
    var start_date: any = moment(startDate);
    var end_date: any = moment(endDate);
    if(startDate != "" || endDate != ""){
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

     // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     this.patchStartDate =  start_date._d.toLocaleDateString('en-GB', options);
     this.patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

    if(this.patchStartDate == 'NaN-NaN-NaN'){
      this.patchStartDate = "" ;
    }
    if(this.patchEndDate == 'NaN-NaN-NaN'){
      this.patchEndDate = "" ;
    }
     //start date and end date pushed .
     var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
     var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
     this.filterValues.push(obj1);
     this.filterValues.push(obj2); //
    }
      
        //pushing customer name        
        if (this.searchName != "") {
          const newFilterObject = { "fieldName": "Customer Name", "value": this.searchName };
          this.filterValues.push(newFilterObject);
        }
       
        //pushing Phone Number        
        if (this.searchNumber != "") {
          const newFilterObject = { "fieldName": "Phone Number", "value": this.searchNumber };
          this.filterValues.push(newFilterObject);
        }
        //pushing email id        
        if (this.searchEmailId != "") {
          const newFilterObject = { "fieldName": "Email ID", "value": this.searchEmailId };
          this.filterValues.push(newFilterObject);
        }
        //pushing NRIC        
        if (this.searchidNumber != "") {
          const newFilterObject = { "fieldName": "NRIC", "value": this.searchidNumber };
          this.filterValues.push(newFilterObject);
        }
         //pushing account        
         if (this.account != "") {
          let accountDescription = this.accountDropdown.filter(v=> v.value == this.account) ;
          const newFilterObject = { "fieldName": "Account", "value": accountDescription[0] ? accountDescription[0].description : "" };
          this.filterValues.push(newFilterObject);
        }
         //pushing Type 
    if (this.selectedType != "") {
      let custType = "" ;
      if(this.selectedType == "I"){
        custType = "Individual"
      }
      if(this.selectedType == "C"){
        custType = "Business"
      }
      if(this.selectedType == ""){
        custType = "Active, InActive"
      }
      const newFilterObject = { "fieldName": "Customer Type", "value": custType };
      this.filterValues.push(newFilterObject);
    }
     //pushing customer status 
     if (this.selectedStatus != "") {
      let customerStatus = "" ;
      if(this.selectedStatus == "0"){
        customerStatus = "InActive"
      }
      if(this.selectedStatus == "1"){
        customerStatus = "Active"
      }
      if(this.selectedStatus == ""){
        customerStatus = "Active, InActive"
      }
      const newFilterObject = { "fieldName": "Status", "value": customerStatus };
      this.filterValues.push(newFilterObject);
    }

        //pushing Riskrate 
        if (this.selectedRiskRating != "") {
          let riskRating = ""
          if(this.selectedRiskRating == "0"){
            riskRating = "Low"
          }
          if(this.selectedRiskRating == "5"){
            riskRating = "Medium"
          }
          if(this.selectedRiskRating == "9"){
            riskRating = "High"
          }
          const newFilterObject = { "fieldName": "Risk Rating", "value": riskRating };
      this.filterValues.push(newFilterObject);
    }

//filter service call 
    this.loader = true;
    let customerName : string = "" ;
    let aliasName : string = "" ;
    if(isAlphabetic){ //If customer name search is alphabet -> send customerName with value and aliasName as empty string..
      customerName = this.searchName ;
      aliasName = "" ;
    }
    else if(isNumeric){  //If customer name search is numeric -> send aliasName with value and customerName as empty string..
      aliasName = this.searchName ;
      customerName = "" ;
    }

    //if all elements are found empty --> dont call service , instead empty the records and white label it 
    if(customerName == "" && this.searchNumber == "" && this.searchidNumber == "" && this.selectedType == "" && this.selectedStatus == "" && this.dateGt == "" && this.dateLt == "" && aliasName == "" && this.account == "" && this.searchEmailId == "" && this.selectedRiskRating == ""){
      this.customerSearch = [] ;
      this.recordsCount = this.customerSearch.length;
       // Reset page to 1
       this.p = 1;
       this.loader = false;
    }
    else {
    this.customerSearchService.filteredCustomerSearch(customerName,this.searchNumber ,this.searchidNumber, this.selectedType , this.selectedStatus,this.dateGt,this.dateLt,aliasName, this.account, this.searchEmailId,this.selectedRiskRating).subscribe((datas:any)=> 
        {
          this.customerSearch = datas['data'];
         this.recordsCount = this.customerSearch.length;
         // Reset page to 1
        this.p = 1;
          this.loader = false;
          datas['data'].filter((v:any)=> {
            if(v.STATUS == '1'){
              v.STATUS = "Active";
            }
            if(v.STATUS == '0'){
              v.STATUS = "InActive";
            }
           })
      
  
         },
          //error handling done on 03-07-2023
          (error: any) => {
            this.loader = false;
            if (error.status != 401) {
              this.dialogRef.open(ErrorDialogAdminComponent);
            }
          }
        )
      }
      }, 700);
    }
    // Check if the input has at least 1 characters and contains only alphabets
    if (inputText.length >= 1 && flag == "ALIASNAME") {

      this.searchFieldTyped = true;  //once user entered more than 1 char , will call this variable 'searchFieldTyped' and give it as true signal

      this.filterValues = [];
      //dynamic date values and pushing dates if there ! .
    let startDate = this.filterForm.controls.startDate.value ? this.filterForm.controls.startDate.value : "" ;
    let endDate = this.filterForm.controls.endDate.value ? this.filterForm.controls.endDate.value : "" ;
    var start_date: any = moment(startDate);
    var end_date: any = moment(endDate);
    if(startDate != "" || endDate != ""){
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

     // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     this.patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
     this.patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

    if(this.patchStartDate == 'NaN-NaN-NaN'){
      this.patchStartDate = "" ;
    }
    if(this.patchEndDate == 'NaN-NaN-NaN'){
      this.patchEndDate = "" ;
    }
     //start date and end date pushed .
     var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
     var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
     this.filterValues.push(obj1);
     this.filterValues.push(obj2); //
    }

      //pushing customer name        
      if (this.searchName != "") {
        const newFilterObject = { "fieldName": "Customer Name", "value": this.searchName };
        this.filterValues.push(newFilterObject);
      }
     
      //pushing Phone Number        
      if (this.searchNumber != "") {
        const newFilterObject = { "fieldName": "Phone Number", "value": this.searchNumber };
        this.filterValues.push(newFilterObject);
      }
       //pushing email id        
       if (this.searchEmailId != "") {
        const newFilterObject = { "fieldName": "Email ID", "value": this.searchEmailId };
        this.filterValues.push(newFilterObject);
      }
      //pushing NRIC        
      if (this.searchidNumber != "") {
        const newFilterObject = { "fieldName": "NRIC", "value": this.searchidNumber };
        this.filterValues.push(newFilterObject);
      }
       //pushing account        
       if (this.account != "") {
        let accountDescription = this.accountDropdown.filter(v=> v.value == this.account) ;
        const newFilterObject = { "fieldName": "Account", "value": accountDescription[0] ? accountDescription[0].description : "All" };
        this.filterValues.push(newFilterObject);
      }
 //pushing Type 
 if (this.selectedType != "") {
  let custType = "" ;
  if(this.selectedType == "I"){
    custType = "Individual"
  }
  if(this.selectedType == "C"){
    custType = "Business"
  }
  if(this.selectedType == ""){
    custType = "Active, InActive"
  }
  const newFilterObject = { "fieldName": "Customer Type", "value": custType };
  this.filterValues.push(newFilterObject);
}
 //pushing customer status 
 if (this.selectedStatus != "") {
  let customerStatus = "" ;
  if(this.selectedStatus == "0"){
    customerStatus = "InActive"
  }
  if(this.selectedStatus == "1"){
    customerStatus = "Active"
  }
  if(this.selectedStatus == ""){
    customerStatus = "Active, InActive"
  }
  const newFilterObject = { "fieldName": "Status", "value": customerStatus };
  this.filterValues.push(newFilterObject);
}


     //pushing Riskrate 
    if (this.selectedRiskRating != "") {
      let riskRating = ""
      if(this.selectedRiskRating == "0"){
        riskRating = "Low"
      }
      if(this.selectedRiskRating == "5"){
        riskRating = "Medium"
      }
      if(this.selectedRiskRating == "9"){
        riskRating = "High"
      }
      const newFilterObject = { "fieldName": "Risk Rating", "value": riskRating };
      this.filterValues.push(newFilterObject);
    }

      // Triggered and service is called
      this.loader = true;
      let customerName: string = "";
      let aliasName: string = "";
      if (isAlphabetic) { //If customer name search is alphabet -> send customerName with value and aliasName as empty string..
        customerName = this.searchName;
        aliasName = "";
      }
      else if (isNumeric) {  //If customer name search is numeric -> send aliasName with value and customerName as empty string..
        aliasName = this.searchName;
        customerName = "";
      }
      setTimeout(() => {
        this.customerSearchService.filteredCustomerSearch(customerName,this.searchNumber ,this.searchidNumber, this.selectedType , this.selectedStatus,this.dateGt,this.dateLt,aliasName, this.account, this.searchEmailId,this.selectedRiskRating).subscribe((datas:any)=> 
        {
          this.customerSearch = datas['data'];
         this.recordsCount = this.customerSearch.length;
         // Reset page to 1
        this.p = 1;
          this.loader = false;
          datas['data'].filter((v:any)=> {
            if(v.STATUS == '1'){
              v.STATUS = "Active";
            }
            if(v.STATUS == '0'){
              v.STATUS = "InActive";
            }
           })
         
  
          
    
         },
          //error handling done on 03-07-2023
          (error: any) => {
            this.loader = false;
            if (error.status != 401) {
              this.dialogRef.open(ErrorDialogAdminComponent);
            }
          }
        )
      }, 700);

    }
  }


  //On Click 'Status' 
  openCustomerStatusRemarks(customerId:string){
    // open dialog --> component called 'ViewCustomerStatusRemarks' .

  //call Customer Inquiry service
    this.customerSearchService.getCustomerInquiry(customerId).subscribe((datas:any)=>{
      this.getCustomerInquiry = datas ;
      //once service is success , open 'ViewCustomerstatusRemarksComponent' Component
    this.dialogRef.open(ViewCustomerstatusRemarksComponent,{
      data: {isCustomerInquiryResponse : datas },
      width:'545px',
      height: '270px',
      panelClass: 'custom-modalbox',
    })
  },
  //error handling for customer inquiry service call
   (error:any) => {
    if(error.status != 401){ 
       this.dialogRef.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) 
    }
   } 
)


  
  }
 
  openCustomerAccounts(customerName:string, customerType:string, customerId:string){

    //call customer accounts Inquiry service
    this.customerSearchService.getCustomerAccountsInquiry(customerId).subscribe((datas:any)=>{
      this.customerAccountsInquiry = datas['data'] ;
      //once service is success => open dialog 'UpdateCustomerAccounts' Component
      this.dialogRef.open(UpdateCustomerAccountsComponent,{
        data : {isCustomerAccountsInquiry : datas['data'] , customerName : customerName , customerType : customerType , customerId : customerId } ,
        height: '515px',
        panelClass: 'custom-modalbox',
      })
    },
     //error handling
     (error:any) => {
      if(error.status != 401){ 
        this.dialogRef.open(ErrorDialogAdminComponent,{
           data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
         }) 
     }
     }
  )
  }

  //Onclick perform html2pdf and open biz profile in PDF file.
  openPdfBizProfile(customerType:string, customerId:string){
   console.log(customerType) ;
   if(customerType == "I"){
    //1. call customerinquiry API using customerId .
    //2. Once service is success --> store the response in a reference variable (bizProfileCustomerResponse)..
    //3. handle error scenario...
    //perform html2pdf and generate a PDF ...
   }
   else if(customerType == "C"){
    //1. call customerinquiry API using customerId .
    //2. Once service is success --> store the response in a reference variable (bizProfileCustomerResponse)..
    //3. handle error scenario...
    //perform html2pdf and generate a PDF ...
   }
   else {
    console.log("No Customer") ;
   }
  }

 //added for exporting customer list as pdf.
 
  exportCustomerMaster(customerName:string,phoneNumber:string,idNumber:string, type:any , status:any, dateGt:any , dateLt:any , account:string, emailId:string,action:string,riskRating : string){
    
    if(action == "XLSX"){
      this.customerSearchService.getCustomerMasterReport(customerName,phoneNumber ,idNumber, type , status,dateGt, dateLt,"", account,emailId,false,true,riskRating).subscribe((datas:ArrayBuffer) =>{
        this.loader = false;
         // Handle the ArrayBuffer data here
      const blob = new Blob([datas], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a filename for the XLSX file
      const filename = `customer_master.xlsx`;

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

      // Open the PDF in a new tab or download as needed
      // window.open(url);
       
      },//error handling
      (error:any) => { 
        if(error.status != 401){
          this.loader = false;
          if(error.status == 500){
            // Decode the ArrayBuffer to JSON if it's an error response
            const textDecoder = new TextDecoder("utf-8");
            const errorText = textDecoder.decode(error.error);
            let errorMessage = "";
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.errorMessage || "An error occurred";
            } catch (e) {
              errorMessage = "An error occurred"; // Fallback in case JSON parsing fails
            }
            this.dialogRef.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : errorMessage ? errorMessage : "" }
            }) 
          }
      else{
        this.dialogRef.open(ErrorDialogAdminComponent) 
    }
        }
       
    }  
  );
    }

    else if(action == "SAVE"){
    //name:string,phoneNumber:string,idNumber:string,type:any,status:any,dateGt : any, dateLt: any,aliasName:string
    this.customerSearchService.getCustomerMasterReport(customerName,phoneNumber ,idNumber, type , status,dateGt, dateLt,"", account,emailId,true,false,riskRating).subscribe((datas:ArrayBuffer) =>{
      this.loader = false;
      
      // Handle the ArrayBuffer data here
      const blob = new Blob([datas], { type: 'application/pdf' });

      // Create a File with a specified filename
      const filename = `customer_master.pdf` ;

      const file = new File([blob], filename, { type: 'application/pdf' });

      // Create a data URL from the File
      const url = URL.createObjectURL(file);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name; // Ensures correct file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Cleanup the blob URL to free memory
      URL.revokeObjectURL(url);

      // Open the PDF in a new tab or download as needed
      // window.open(url);
    },//error handling
    (error:any) => { 
      if(error.status != 401){
        this.loader = false;
        if(error.status == 500){
          // Decode the ArrayBuffer to JSON if it's an error response
          const textDecoder = new TextDecoder("utf-8");
          const errorText = textDecoder.decode(error.error);
          let errorMessage = "";
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.errorMessage || "An error occurred";
          } catch (e) {
            errorMessage = "An error occurred"; // Fallback in case JSON parsing fails
          }
          this.dialogRef.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : errorMessage ? errorMessage : "" }
          }) 
        }
    else{
      this.dialogRef.open(ErrorDialogAdminComponent) 
  }
      }
     
  }  
);
    }
  }
// for Biz Profile Report.
  bizProfileReport(customerId:string,customerType:string){
    // Report Name Changed as BUSINESS PROFILE
    let reportName="BUSINESS PROFILE";
    let isPdf=true;
    // calling getBizProfileReportAsPdf() service...
    this.customerSearchService.getBizProfileReportAsPdf(customerId,customerType,reportName,isPdf).subscribe((datas:ArrayBuffer) =>{
      this.loader = false;
      const blob = new Blob([datas], { type: 'application/pdf' });

      // Create a File with a specified filename
      // filename also changed as BUSINESS PROFILE
      const filename = `Business_Profile_report.pdf` ;

      const file = new File([blob], filename, { type: 'application/pdf' });

      // Create a data URL from the File
      const url = URL.createObjectURL(file);


      const a = document.createElement("a");
      a.href = url;
      a.download = file.name; // Ensures correct file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Cleanup the blob URL to free memory
      URL.revokeObjectURL(url);

      // Open the PDF in a new tab or download as needed
      // window.open(url);
  },
  //error handling
  (error:any) => { 
    if(error.status != 401){
      this.loader = false;
      if(error.status == 500){
        // Decode the ArrayBuffer to JSON if it's an error response
        const textDecoder = new TextDecoder("utf-8");
        const errorText = textDecoder.decode(error.error);
        let errorMessage = "";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.errorMessage || "An error occurred";
        } catch (e) {
          errorMessage = "An error occurred"; // Fallback in case JSON parsing fails
        }
        this.dialogRef.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : errorMessage ? errorMessage : "" }
        }) 
      }
  else{
    this.dialogRef.open(ErrorDialogAdminComponent) 
}
    }
   
}  
    )
  }

  getCustomerSearch(customerType : string, status : string , name : string, aliasName : string ){
    this.customerSearchService.getCustomerSearch(customerType,status,name,aliasName).subscribe((datas:any) => {
      console.log(datas)
      this.customerSearch = datas['data'];
      this.loader = false;
      datas['data'].filter((v:any)=> {
        if(v.STATUS == '1'){
          v.STATUS = "Active";
        }
        if(v.STATUS == '0'){
          v.STATUS = "InActive";
        }
      })
    },
    //error handling completed on 04/07/2023
(error:any) =>{
this.loader = true; 
if(error.status != 401){
  this.dialogRef.open(ErrorDialogAdminComponent) ;
}
}
    )
  }
}
