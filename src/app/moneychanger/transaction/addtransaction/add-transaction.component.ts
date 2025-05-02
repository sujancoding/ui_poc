import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';

import { CurrencyStockComponent } from '../../modals/currencystock/currency-stock.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerTableComponent } from 'src/app/backoffice/customer/customersearch/customer-table.component';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MoneyChangerDealsService } from 'src/app/core/services/mcdeals.service';

import { CorporateService } from 'src/app/core/services/corporate.service';
import { SavedDialogBoxComponent } from 'src/app/backoffice/shared/modals/saved-dialog-box.component';
import { DealsmcComponent } from '../../deals/viewdealsmc/dealsmc.component';
import { MoneyChangerTransactionService } from 'src/app/core/services/mctransaction.service';
import { AddTransactionMoneyChanger } from 'src/app/core/model/mctransaction/mctransaction.model';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataHistoryConfirmationDialogComponent } from '../modals/datahistoryconfirmationdialog/data-history-confirmation-dialog.component';
import { MoneyChangerDailySetupService } from 'src/app/core/services/mcdailysetup.service';
import { CurrencyComponent } from '../../maintenance/currency/currency.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MoneyChangerAccountsService } from 'src/app/core/services/mcaccounts.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { UserMessageComponent } from '../modals/user-message/user-message/user-message.component';
import { ParentDealSelectionTabComponent } from '../modals/parent-deal-selection-tab/parent-deal-selection-tab.component';
import { CorporateCustomerInquiry } from 'src/app/core/model/corporatecustomerinquiry/corporatecustomerinquiry';
import { orgName } from 'src/assets/orgdetails';
import { ReprintTransactionComponent } from '../modals/reprint-transaction/reprint-transaction.component';
import { SelectionModel } from '@angular/cdk/collections';
import { PeriodicElement } from 'src/app/core/model/Submit Document/SubmitDocument';
import { WeakestCurrencyArray } from 'src/assets/dropdownvalues';


@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],

})
export class AddTransactionComponent implements OnInit, AfterViewInit {

  dealListings : any[] = [] ;
  isActive = false;
  p: number = 1;
  itemsPerPage: number = 20;
  loader : Boolean = false ;
  public getScreenWidth: any;
  public getScreenHeight: any;
  customCollapsedHeight: string = '80px';
  customExpandedHeight: string = '90px';
  step = 0;
  launchButton : boolean = true ;
  openCustomerSearchloader : boolean = false ;
  xpandStatus = true;  //default open panel
  isDisableButtons = false ;
  showViewDealsContent = true ;
  showMatToolBar = false ;
  currencyArray : any[] = [] ;
  currencyAllArray : any[] = [] ;
  isReadOnly = true ;
  customerSearchRecords : any[] = [] ;
  customerId !: string ;
  customerNricNo !: string ;
  customerName : string = "" ;
  aliasName : string = "" ;
  customerPhnNo !: string ;
  customerNationality !: string ;
  customerType !: string ;
  showIndContent = false ;
  showCorpContent = false ;
  ownerNricNo !: string ;
  runnerNricNo !: string;
  dealerNricNo !: string ;
  isDisableRemoveIcon = false ;
  retrievedCustomerCode !: string ;
  expandedRecord: any; // Store the currently expanded record
  loading: boolean = false;
  dealDetailInqRecords :any[] = [] ;
  difference : any ;
  cardLoader = false;
  @ViewChild('drawer') drawer: any; // Access the mat-drawer using ViewChild
  tableLoader = false ; 
  dealListingsBackup : any[] = [] ; //dealListing backup array
  dealForm : FormGroup = Object.create(null) ;
  @ViewChild('typeInputRef') typeInputRef !: ElementRef ;
  @ViewChild('runnerNameInputRef') runnerNameInputRef !: any ;
  isDisableToggleButton !: Boolean ;
  totalTally:any ;
  stockListingsArray : any[] = [] ;
  runnerArray : any[] = [
    {"name" : "No Name" , "jobTitle" : "No Designation", "associateId" : ""}
  ];
  sequenceNumberArray: any[] = [];
  capturedCircles: number = 0;
  componentHistoryBackup : any[] = [] ;
  selectedRunnerAssociateId !: string ;
  associateId !: string
  counterType !: string ;
  indicatorCurrencyStock : boolean = false ;
 @ViewChild(CurrencyStockComponent) childComponent!: CurrencyStockComponent ;
  minErrorMessage: string = 'Entered rate is lesser than variance rate';
  maxErrorMessage: string = 'Entered rate is more than variance rate';
  startRate: any;
  endRate: any;
  printerPort: any | null = null;
  modifiedDealListings : any[] = [] ;
  rateType : string = '' ;
  retailersExchangeRate : any = '' ;
  dailySetupExchangeRateArray : any[] = [] ;
  showDailySetupRates = false ;
  @ViewChild('table') table!: ElementRef;
  receiptCurrentDate = new Date() ;
  transNo !: string  ;
  options: any[] = [];
 filteredOptions!: Observable<any[]>;
 customerForm : FormGroup =  Object.create(null) ; 
 stockValue !: any;// actual stock
 customerAccountsRecords : any[] = [] ;
 customerOutstandingBalance : any;
 @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
 showActualStock = false;
 notifyUserArray : any[] = [] ;
 showWholesaleCounterDatas = false;
 avgCost : any; // average Cost
 inputColor: string = 'black'; // Default color
 staffName : string = "" ;
 corporateCustomerInquiry : CorporateCustomerInquiry = new CorporateCustomerInquiry() ;
 corporateAddress : any ;
 consumerAddress : any ;
 consumerCountry : any = "";
 consumerPostalCode : any = "";
 consumerPhoneNo : string = "" ;
 consumerPhoneCountryCode : string = "" ;
 consumerNRICPrint : string = "" ;
 corporateCountry : string = "" ;
 corporatePostalCode : string = "" ;
 corporateDetail : boolean = false ;
 consumerDetails : boolean = false ;
 corporatePhoneNo : string = "" ;
 corporatePhoneCountryCode : string = "" ;
 associateName : string = "" ;
 associatePassportNumber : string = "" ;
 associateOverseasId : string = "" ;
 associateNric : string = "" ;
 associateProof : string = "" ;
 associateNationality : string = "" ;
 organisationName = orgName ;
 dealListForReceipt : any[] = [] ;
 customerNameInReceipt : string = "" ;
 fetchTransactionId : string = "" ;
 getTransactionDetail : any ;
 getcustomerDeatails : any ;
 preferredCcy : string= "";
 customerUsOutstandingBalance : any;
 isShowUsBalance : Boolean = false;
 // it  helps to  manage selections in  tables.
 selection = new SelectionModel<PeriodicElement>(true, []);
 isSuspicious : string = "";
 localCurrency : string = "SGD"
 @ViewChild('rateInputRef') rateInputRef!: ElementRef;
 @ViewChild('tableContainer') tableContainer!: ElementRef;
 isOpenedInWindow : boolean = false;
 storingTxnId : string = "";
 WeakestCurrencyArray : any []= WeakestCurrencyArray;
 sgdCcyNo : string = "" ;

  constructor(private titleService : TitleHeaderService, private router : Router, private dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb : FormBuilder, private currencyMaintenanceService : MoneyChangerMaintenanceService,
    private customerSearchService : CustomerSearchService, private addTransactionService : MoneyChangerTransactionService,
    private dealService : MoneyChangerDealsService, private corporateService : CorporateService,
    private store : InMemoryCache, private snackBar : MatSnackBar, private maintenanceService : MoneyChangerMaintenanceService,
    private exchangeRateService : MoneyChangerDailySetupService, private cdr: ChangeDetectorRef, private accountsService : MoneyChangerAccountsService
   ) { }

   ngAfterViewInit(): void {
    //If counter is "R" (Retail) --> focus cursor in Type field .
    console.log("After view in it is triggered")
    if(this.counterType == "R"){
      setTimeout(() => {
        this.focusTypeInput();
      }, 0);
    }
  }

  focusTypeInput() {
    if (this.typeInputRef) {
      this.typeInputRef.nativeElement.focus();
    }
  }

   //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 322 )+'px' , 'overflow-y' : 'auto' }; 
  }
  // if this component is opened in new window changing table height
  ChangeTableHeightInWindow(){
    return { 'height': (this.getScreenHeight - 252 )+'px' , 'overflow-y' : 'auto' };
  }
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  displayFn(customerSearch: any): string {
    if (customerSearch) {
      const isNumeric = /^\d+$/.test(customerSearch.ALIASNAME);
      
      // Return ALIASNAME if it's numeric, otherwise return NAME
      return isNumeric ? customerSearch.ALIASNAME : customerSearch.NAME;
    }
    return '';
  }

  // Function to filter options based on input value
private _filter(value: string): any[] {
  const isNumeric = /^\d+$/.test(value); // Check if the input contains only numbers
  const filterValue = value.toLowerCase();
  if (isNumeric) {
    // Filter by ALIASNAME when the input is numeric
    return this.options.filter(option => 
      option.ALIASNAME && option.ALIASNAME.includes(filterValue)
    );
  } else {
    // Filter by CUSTOMERNAME when the input is alphabetic
    return this.options.filter(option => 
      option.NAME && option.NAME.toLowerCase().includes(filterValue)
    );
  }
}
  
  ngOnInit(): void {

  

    this.titleService.setTitle('Add Transaction') ; //screen title define .

    // checking for whether this component is opened in window
  if(window.opener){
    this.isOpenedInWindow = true
    console.log("it is opened in new window")
  }
  else {
    this.isOpenedInWindow = false;
  }

    //form declaration ..
    this.dealForm = this.fb.group({
      "type" : [null,[Validators.compose([Validators.required, Validators.pattern(/^(B|S)$/) ])]],//Allowing B or S
      "currencyNo" :[null,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'),Validators.maxLength(4)])]], // Validation pattern change, only Alphanumeric and max length 4.  
      "currencyCode" :[null,[Validators.compose([Validators.required])]],
      "fAmount" : [null,[Validators.compose([Validators.required])]],
      "rate": [null, [Validators.compose([Validators.required, Validators.pattern('^\\d{1,4}\\.\\d{1,6}$')])]], // Max 4 digits before the decimal and max 6 digits after
      "lAmount" : [null,[Validators.compose([Validators.required])]],
      "valueDate" : [null,[Validators.compose([Validators.required])]],
      "remarks" :  [null, [Validators.pattern('^[a-zA-Z0-9 _\\-@.,;:()/\'"]+$'),Validators.maxLength(50)]],
      "currencyName" : [null,[Validators.compose([Validators.required])]],

    })

     //customer details form group
     this.customerForm = this.fb.group({
      "customerNameControl" : [null]
    })

     //patch current date on "Value Date" field (dealForm) 
     let currentDate = new Date() ;
     this.dealForm.patchValue({
       "valueDate" : currentDate
     });

     this.counterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";

      if(this.counterType == "R"){
        let name= "CASH CUSTOMER";
        let customerType = "I"
        let status = "1";
    this.customerSearchService.getCustomerSearch(customerType,status , name , "").subscribe((datas:any)=>{
        this.customerSearchRecords = datas['data'] ;

        if(this.customerSearchRecords.length == 1){ //only one object is expected here..
        let customer : any = { NAME : this.customerSearchRecords[0].NAME ? this.customerSearchRecords[0].NAME : "", ALIASNAME: this.customerSearchRecords[0].ALIASNAME }
       // For Retail counter in customer name field patching cash customer.
        this.customerForm.patchValue({
          customerNameControl: customer
        })
        this.customerName = this.customerSearchRecords[0].NAME ? this.customerSearchRecords[0].NAME : "" 
        this.customerId= this.customerSearchRecords[0].CUSTOMERID ? this.customerSearchRecords[0].CUSTOMERID : "";
        this.customerType = this.customerSearchRecords[0].CUSTOMERTYPE ? this.customerSearchRecords[0].CUSTOMERTYPE : "" ;
        this.callCustomerAccountsService(this.customerId);
        }
        else if(this.customerSearchRecords.length > 1){
          console.log("More than one cash customer is found")
        }
        (error:any)=>{
          if(error.status != 401){
            this.dialog.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
            }) ;
          }
        }
      }
      )
    }
      // this.focusCustomerNameInputField() ; // When the screen is loaded, auto focus to customer Name Input.
      //getScreenWidth and getScreenHeight will get the windows inner height and width.
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

      // in ngOninit we should call customer acoounts service 
      // this.callCustomerAccountsService();
       //Customer Accounts API call only for Wholesale counter ...
       if(this.counterType == "W"){
        this.showWholesaleCounterDatas = true;  
      }else{
        this.showWholesaleCounterDatas = false;
      }

      //onload call currency maintenance api --> SGD
      this.getCurrencyMaintenance();

      //onload call currency maintenance api --> All currency 
      this.getAllCurrencyMaintenance();

      //onload call stock inventory api 
      this.callStockInventoryApi("").subscribe(
        (datas: any) => {
            this.stockListingsArray = datas['data'];
        },
        (error: any) => {
            if (error.status != 401) {
              this.dialog.open(ErrorDialogAdminComponent,{
                data :{ errorMessage : error.error.errorMessage  ? error.error.errorMessage : ""}
              }) 
            }
        }
    );

      //onload call daily exchange rate service for only RETAIL counters .
      if(this.counterType == "R"){
        this.callDailySetupExchangeRate() ;
      }
  }
  

  responsiveCard(){
    return { 'background-color': 'whitesmoke', 'position': 'relative',
    'margin-top': '1px','height': '76px',
    'border': '1px solid #d1d1d1' ,
    'margin-left':'1px',
    'margin-right': '6px'
  }
  }  

 

goToViewTransaction(){
    this.router.navigate(['moneychanger-transaction/view-transaction']) ;
  }

 

  toggleContent(): void {
    this.xpandStatus = !this.xpandStatus;
  }

  //child (inventory) component to parent component --> passing data . HTML --> (childDataEvent)="receiveDataFromStockChild($event)"
  // receiveDataFromStockChild(data: any){
  //  console.log(data) ;
  //  this.stockListingsArray = data ;

  // }


  
  // Make API call return an Observable
callStockInventoryApi(ccyNo: string) {
  return this.maintenanceService.getStockInventoryInquiry(this.counterType, '', ccyNo);
}

  //service call --> Daily setup exchange rate for Retail counters add txn ..
  callDailySetupExchangeRate(){
    let ccyCode = "";
    let units = "" ;
    let displayRate = false;
    this.exchangeRateService.getExchangeRates(ccyCode, units, displayRate).subscribe((data:any)=>{
      this.dailySetupExchangeRateArray = data['rates'] ;
    },
    //error handling .
    (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
     }
    )
  }

  openCustomerSearch(){
    let status = "1";
    this.openCustomerSearchloader = true ;
    this.launchButton = false ;
    const dialogRef = this.dialog.open(CustomerTableComponent,{
      data:{mcAddDealCustomerReview: true , customerTable: [],  titleName : 'Transaction'},
      panelClass: 'custom-modalbox',
      width:'1255px',
    })
  dialogRef.afterOpened().subscribe(() => {
    this.openCustomerSearchloader = false;
    this.launchButton = true;
  });
dialogRef.afterClosed().subscribe((result:any) => {
      this.openCustomerSearchloader = false ;
      this.launchButton = true;
      let res = result.customerId ? result.customerId : "";
      this.cardLoader = true ;
      let dealArray :any[] = this.dealListings.filter((v:any)=> v.manualTransactionFlag == true);
      let manualTransactionFlag  = false ;
      //now we support both with and without deal scenario .
      // if(dealArray.length >= 1){
      //   manualTransactionFlag = true ;
      // }
      if(res != ""){
        this.cardLoader = false ;
        this.retrievedCustomerCode = res ;
          this.showIndContent = true ;
          this.showCorpContent = false ;
          this.customerId = result.customerId ? result.customerId : "Customer ID Not Specified" ;
          this.customerNricNo = result.nricNo ? result.nricNo : "NRIC No Not Specified" ;
          this.customerName = result.customerName ? result.customerName : "Customer Name Not Found" ;
          this.aliasName = result.aliasName ? result.aliasName: "Alias not found" ;
          const selectedCustomerName: any = { NAME : result.customerName ? result.customerName : "Customer Name Not Found", ALIASNAME: this.aliasName };
          this.customerForm.patchValue({
            customerNameControl: selectedCustomerName
           });
          this.customerPhnNo = result.phnNo ? result.phnNo : "Phone Number Not Specified" ;
          this.customerNationality = result.nationality ? result.nationality : "Customer Nationality Not Specified" ;
          this.customerType = result.customerType ? result.customerType : "Customer Type Not Found" ;
          this.dealForm.enable() ;
           // calling customer Accounts after customer selected.         
          this.callCustomerAccountsService(this.customerId) ;
          //call customerInquiry api 
          if(this.customerType == "C"){
            this.callCustomerInquiryService(this.retrievedCustomerCode, this.customerType) ;
          }
          else if(this.customerType == "I"){
            this.runnerArray = [
              {"name" : "No Name" , "jobTitle" : "No Designation"}
            ];
            this.callCustomerInquiryService(this.retrievedCustomerCode, this.customerType) ;
          }

          console.log("customer search data Ok") ;
          //call deal master api only when manualSettlementFlag is false
          if(manualTransactionFlag == false){
            this.callDealInquiryService('',res) ;
            //this.dealForm.disable() ;  //disable dealForm panel
          }
  //Based on the customerId, we need to display the respective outstandingBalance amount.
  console.log(this.customerAccountsRecords)
  // added in common function for getiing customer outstanding balance 
  // const selectedCustomer = this.customerAccountsRecords.filter(accounts => accounts.customerId == this.customerId);
  // console.log(selectedCustomer)
  //       if (selectedCustomer) {
  //         const sgdBalanceAccount = selectedCustomer.find(account => account.ccyNo == '01');
  //         console.log(sgdBalanceAccount)
  //         if(sgdBalanceAccount){
  //           this.customerOutstandingBalance = sgdBalanceAccount.outstandingBalance ? sgdBalanceAccount.outstandingBalance : "";
  //         }
  //         const usBalanceAccount = selectedCustomer.find(account => account.ccyNo == '57');
  //         console.log(usBalanceAccount)
  //         if(usBalanceAccount){
  //           this.isShowUsBalance = true;
  //           this.customerUsOutstandingBalance = usBalanceAccount.outstandingBalance ? usBalanceAccount.outstandingBalance : "";
  //         }
  //         else{
  //           this.isShowUsBalance=false;
  //         }
  //       }
  //       else{
  //       this.customerOutstandingBalance = "";
  //       }
               

      }
      else{
        this.cardLoader = false ;
       console.log("No data") ;
      }
    })
    
    
    
    }


    // saveAndPrint() {
    //   //service call first ..
    //       this.saveTransactionServiceCall('print') ;   
    //     }
      
        // async print(text: string) {
        //   if (!this.printerPort) {
        //     console.error('Printer not connected');
        //     return;
        //   }
      
        //   const writer = this.printerPort.writable.getWriter();
        //   await writer.write(text); // Send commands to the printer
        //   await writer.releaseLock();
        // }
      
        // convertTableToPlainText(table:any) {
        //   let plainText = '';
        
        //   // Iterate over each row in the table
        //   table.querySelectorAll('tr').forEach((row:any) => {
        //     // Iterate over each cell in the row
        //     row.querySelectorAll('td').forEach((cell:any) => {
        //       // Append the cell's text content to the plain text string
        //       plainText += cell.textContent + '\t'; // Add tab separator between cells
        //     });
        
        //     // Add a newline character after each row
        //     plainText += '\n';
        //   });
        
        //   return plainText;
        // }


    //Customer inquiry service for getting runner detail 
    callCustomerInquiryService(customerId:string,customerType:string){
      console.log("customer inq api called")
      this.customerSearchService.getCustomerInquiry(customerId).subscribe((data:any)=>{
        if(customerType == "C"){
          this.corporateCustomerInquiry = data ;
          let runnerAssociatesArray :any[] = data.associates.runner ? data.associates.runner : [];
          let runnerArrayList :any[] = [] ;
          let runnerAssociateId = runnerAssociatesArray[0] ? runnerAssociatesArray[0].associateId : ""; // To check, whether there is associateId or not in the response.

          //to capture address 
           //expected Address format for corporate : street name, building name (block is building name) , #level-unit , postal code, country
          let findAddress = this.corporateCustomerInquiry.address.filter(v => v.isprimary == "Y") ;
          if(findAddress){  //checking for address node .
         
            //corporate address patch code...
            let corpAddressParts = [];
  
            // Add non-empty components to the array
            if (findAddress[0].streetName[0]?.trim()) { //trim function used which removes whitespace from both sides of a string
              corpAddressParts.push(findAddress[0].streetName);
            }
            if (findAddress[0].block?.trim()) {
              corpAddressParts.push(findAddress[0].block);
            }
            if (findAddress[0].level?.trim()) {
              corpAddressParts.push(findAddress[0].level);
            }
            if (findAddress[0].unit?.trim()) {
              // If level exists but unit doesn't, we don't want a hanging hyphen
              const lastIndex = corpAddressParts.length - 1;
              if (lastIndex >= 0 && corpAddressParts[lastIndex] === findAddress[0].level) {
                corpAddressParts[lastIndex] += '-' + findAddress[0].unit;
              } else {
                corpAddressParts.push(findAddress[0].unit);
              }
            }
  
            // Join only the non-empty parts with commas
            this.corporateAddress = corpAddressParts.join(', ');
            console.log("Corporate address : ", this.corporateAddress);

            this.corporateCountry = findAddress[0].country ? findAddress[0].country : "" ;
            this.corporatePostalCode = findAddress[0].postalCode ? findAddress[0].postalCode : "" 

          }
          else{
            this.corporateAddress = "" ;
          }

          this.corporatePhoneNo = this.corporateCustomerInquiry.phone.phoneNo ? this.corporateCustomerInquiry.phone.phoneNo : "";
          this.corporatePhoneCountryCode = this.corporateCustomerInquiry.phone.phoneCountryCode ? `+ ${this.corporateCustomerInquiry.phone.phoneCountryCode}` : "" ;
            console.log("corporate phone country code : ", this.corporatePhoneCountryCode);

          if(runnerAssociatesArray.length == 0){
            runnerAssociatesArray =  data.associates.teller ? data.associates.teller : [];
          }
          if(runnerAssociatesArray.length >=1){
            runnerArrayList = runnerAssociatesArray ;
            if(runnerArrayList.length >=1){ //if any object exist in RUNNER 
              this.runnerArray = runnerArrayList ;
              this.selectedRunnerAssociateId = runnerAssociateId; // If any object exist in RUNNER, we will patch the name of the first RUNNER
              this.associateId = this.selectedRunnerAssociateId;
            }
          }
          else{ //if there are no associates 
            this.runnerArray = [
              {"name" : "No Associates found" , "jobTitle" : "No Designation"}
            ];
            this.associateId = "" ;
          }
         // this.focusRunnerNameInputField(); When value is patched in runner field, it auto focuses
        }
        else if(customerType == "I"){
          this.associateId = "" ;

          this.consumerNRICPrint = data.demographics ? data.demographics.idNumber : "" ;

            let consumerPrimaryAddress : any[] = data.address.filter((v:any)=> v.isprimary == "Y") ; //finding consumer address where isPrimary is "Y"
            if(consumerPrimaryAddress.length >= 1){
              //consumer address patch code...
              let addressParts = [];

              // Add non-empty components to the array
              if (consumerPrimaryAddress[0].streetName?.trim()) { //trim function used which removes whitespace from both sides of a string
                  addressParts.push(consumerPrimaryAddress[0].streetName);
              }
              if (consumerPrimaryAddress[0].block?.trim()) {
                  addressParts.push(consumerPrimaryAddress[0].block);
              }
              if (consumerPrimaryAddress[0].level?.trim()) {
                  addressParts.push(consumerPrimaryAddress[0].level);
              }
              if (consumerPrimaryAddress[0].unit?.trim()) {
                  // If level exists but unit doesn't, we don't want a hanging hyphen
                  const lastIndex = addressParts.length - 1;
                  if (lastIndex >= 0 && addressParts[lastIndex] === consumerPrimaryAddress[0].level) {
                      addressParts[lastIndex] += '-' + consumerPrimaryAddress[0].unit;
                  } else {
                      addressParts.push(consumerPrimaryAddress[0].unit);
                  }
              }
              
              // Join only the non-empty parts with commas
              this.consumerAddress = addressParts.join(', ');
              console.log("consumer address : ", this.consumerAddress) ;

            this.consumerCountry = consumerPrimaryAddress[0].country ? consumerPrimaryAddress[0].country : "";
            this.consumerPostalCode = consumerPrimaryAddress[0].postalCode ? consumerPrimaryAddress[0].postalCode : "";

            }
            else{ //if isPrimary "Y" not found , display "No Address Found !"
              this.consumerAddress = "" ;
            }

            this.getMaskedConsumerNricProof() ;

            //phone country code and phone number patch in seperate ...
            this.consumerPhoneCountryCode = data.phone.phoneCountryCode ? `+ ${data.phone.phoneCountryCode}` : "";
            console.log("consumer phone country code: ", this.consumerPhoneCountryCode) ;
            this.consumerPhoneNo = data.phone.phoneNo ? data.phone.phoneNo : "";
        }
        else{
          console.log("No customer type found")
        }
      },
      (error:any)=>{
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
       }
      )
    }
  
    //Deal Inquiry service call
  callDealInquiryService(dealId:string,customerId:string){
    //FROM LINE 475 TO 522 IS BACKUP -- ONCE NEW CHANGE GOT WORKED -- WILL REMOVE IN FUTURE
    // //(ccyCode:string,customerId:string, customerName:string, buySellInd:string, status:string, id:string,dateGt:any, dateLt:any)
    // this.dialog.open(DealsmcComponent,{
    //     data : {isTransactionReview : true , customerId :  customerId},
    //     panelClass: 'custom-modalbox',
    //    })
    //   .afterClosed().subscribe((response : any)=>{
    //     //After deal screen modal window is closed , again the auto complete suggestion was reflected in customer name field - Fixed
    //       this.autocompleteTrigger.closePanel();

    //     this.focusRunnerNameInputField();//After closing the Deal modal, auto-focus to the runner dropdown.
     
    //     if(response){
    //       this.loader = false ;
    //       if(response.data){
    //       //  this.dealListings = response.data ; //dealListings for iterating in table
    //       let listArray :any[] = response.data ;
    //       console.log(response.data)
    //       if(listArray.length >= 1){
    //         this.dealListings = [...this.dealListings, ...listArray.map(item => ({ 
    //           "buySellInd" : item.buySellInd? item.buySellInd : "",
    //           "ccyNo" : item.ccyNo? item.ccyNo : "",
    //           "ccyCode" : item.ccyCode? item.ccyCode : "",
    //           "ccyName" : item.ccyName ? item.ccyName : "" ,
    //           "amountF" : item.balanceAmountF? item.balanceAmountF : "",
    //           "exchRate" :item.exchRate? item.exchRate : "",
    //           "amountL" : item.amountL? item.amountL : "",
    //           "valueDate" : item.valueDate? item.valueDate : "",
    //           "remarks" : item.remarks? item.remarks : "",
    //           "dealItemId" : item.dealItemId ? item.dealItemId : ""
    //          }))];
    //           this.dealListingsBackup = this.dealListings;  //put it in a backup
    //           let backupDealSearch = JSON.stringify(this.dealListingsBackup) ;
    //           this.store.setItem('DEAL_LIST_BACKUP',backupDealSearch);
    //       }
    //        // this.dealForm.disable() ;  //disable dealForm panel
    //         console.log("Deal data Ok") ;
    //         this.tallyTotalValue() ;
    //       }
    //       else{
    //         console.log("Deal data Not Ok") ;
    //         this.loader = false ;
    //       //  this.dealForm.enable() ;  //enable dealForm panel
    //        // this.dealListings = [] ; //empty the dealListings and backup you have
    //       //  this.dealListingsBackup = [] ;
    //         this.totalTally = "" ;
    //       }
    //    }
    //  })
    this.dialog.open(ParentDealSelectionTabComponent,{
      data : {isTransactionReview : true , customerId :  customerId},
      panelClass: 'custom-modalbox',
      width:'1255px',
      //height: '820px',
    }).
    afterClosed().subscribe((response:any)=>{
//After deal screen modal window is closed , again the auto complete suggestion was reflected in customer name field - Fixed
this.autocompleteTrigger.closePanel();

this.focusRunnerNameInputField();//After closing the Deal modal, auto-focus to the runner dropdown.

if(response){
  this.loader = false ;
  if(response.data){
  let listArray :any[] = response.data ;
  console.log(response.data)
  if(listArray.length >= 1){
    this.dealListings = [...this.dealListings, ...listArray.map(item => ({ 
      "buySellInd" : item.buySellInd? item.buySellInd : "",
      "ccyNo" : item.ccyNo? item.ccyNo : "",
      "ccyCode" : item.ccyCode? item.ccyCode : "",
      "ccyName" : item.ccyName ? item.ccyName : "" ,
      "amountF" : item.balanceAmountF? item.balanceAmountF : "",
      "exchRate" :item.exchRate? item.exchRate : "",
      "amountL" : item.balanceAmountF? parseFloat(item.balanceAmountF) * item.exchRate : 0,
      "valueDate" : item.valueDate? item.valueDate : "",
      "remarks" : item.remarks? item.remarks : "",
      "dealItemId" : item.dealItemId ? item.dealItemId : ""
     }))];
      this.dealListingsBackup = this.dealListings;  //put it in a backup
      let backupDealSearch = JSON.stringify(this.dealListingsBackup) ;
      this.store.setItem('DEAL_LIST_BACKUP',backupDealSearch);
  }
   // this.dealForm.disable() ;  //disable dealForm panel
    console.log("Deal data Ok") ;
    this.tallyTotalValue() ;
  }
  else{
    console.log("Deal data Not Ok") ;
    this.loader = false ;
    this.totalTally = "" ;
  }
}
    })
  }

  //dollar icon clicked --> this function triggered ,  toggle right side panel (stock inventory) .
  onDrawerToggle(){
    this.drawer.toggle() ;
    if(this.drawer._opened == true){  //panel is going to open..
     this.indicatorCurrencyStock = true ;
     this.childComponent.onDrawerOpened(this.indicatorCurrencyStock);
    }
    else if(this.drawer._opened == false){  //panel is going to close..
      this.indicatorCurrencyStock = false ;
      this.childComponent.onDrawerOpened(this.indicatorCurrencyStock);
    }
  }

   
  openCurrencyStock(){
    this.dialog.open(CurrencyStockComponent,{
      panelClass: 'custom-modalbox',
      width : '500px',
      height : (this.getScreenHeight - 50) + 'px',
      position: {
        right:'25px',
        
      }
    })
  }

 

  //tally deal
  tallyDeal(){
    this.tableLoader = true ;
    setTimeout(() => {
      this.tableLoader = false ;
      let indexValue = this.dealListings.findIndex(v => v.tallyFlag == true) ;
    if(indexValue != -1){
      this.dealListings.splice(indexValue, 1) ;
    }

    let totalS = 0;
    let totalB = 0;

   //fetch currencyNo from currency list
    let ccyNo = this.sgdCcyNo;
    // if(this.currencyArray.length != 0){
    //    ccyNo = this.currencyArray[0].ccyNo  ;
   // }
  
    // Calculate totals for 'S' and 'B' entries (sum of amountL (S) and sum of amountL(B))
    this.dealListings.forEach((deal) => {
      if (deal.buySellInd === 'S') {
        totalS += parseFloat(deal.amountF) * deal.exchRate;
      } else if (deal.buySellInd === 'B') {
        totalB += parseFloat(deal.amountF) * deal.exchRate;
      }
    });

    // Calculate the difference
  const difference = Math.abs(totalS - totalB);

  // Create the new object
  const newObject = {
    buySellInd: totalB > totalS ? 'S' : 'B',
    ccyCode: 'SGD',
    ccyName: 'SGD' ,
    exchRate: 1.0000,
    amountF: difference,
    amountL: difference,
    tallyFlag : true,
    remarks : totalB > totalS ? 'APT Sell to the customer' : 'APT Buy from the customer',
    valueDate : "",
    ccyNo : ccyNo ,
    dealItemId : ""
  };

  // Push the new object to the 'dealListings' array
  this.dealListings.push(newObject);

  setTimeout(() => {
  this.scrollToBottom(); //auto vertical scroll
    },100);

  this.tallyTotalValue(); //setting up total tally value dynamically..
 // this.totalTally = difference ; 
 // when we add a new item to table section we have to check whether other items are marked as suspicious or not...
 // if suspicious marking Tally Deal record also suspicious...
 let selectedRecord :any[] = this.selection? this.selection.selected : [] ;
 if(selectedRecord.length >= 1){
  this.selection.clear();
  this.selection.select(...this.dealListings);
  console.log("Checkbox Selected Records: ", this.selection.selected)
  console.log("Deal List Records: ", this.dealListings)
 }
    }, 400);
    
  
    
  }

  //tally for setting up the total value 
  tallyTotalValue(){
    let totalS = 0;
    let totalB = 0;
  
    // Calculate totals for 'S' and 'B' entries (sum of amountL (S) and sum of amountL(B))
    this.dealListings.forEach((deal) => {
      if (deal.buySellInd == 'S') {
        totalS += parseFloat(deal.amountF) * deal.exchRate;
      } else if (deal.buySellInd == 'B') {
        totalB += parseFloat(deal.amountF) * deal.exchRate;
      }
    });

    // Calculate the difference
  const difference = Math.abs(totalS - totalB);
  this.totalTally = difference ;
  
  }
  //reset specific deal item
  onResetDealRecord(index:any,id:string){
    console.log("reset deal record level")
    let dealDetailBackup = this.store.getItem('DEAL_LIST_BACKUP') ? this.store.getItem('DEAL_LIST_BACKUP') : "" ;
    const arrayOfObjects = JSON.parse(dealDetailBackup);
    if(arrayOfObjects != ""){
      let dealListingsBackup = arrayOfObjects.filter((v:any) => v.dealItemId == id) ;
      this.dealListings[index].amountF = dealListingsBackup[0].amountF ;
      this.dealListings[index].amountL = parseFloat(dealListingsBackup[0].amountF) * dealListingsBackup[0].exchRate ;
    }
    this.tallyTotalValue() ;
  }

  //reset whole deals 
  resetDeals(){
    this.tableLoader = true ;
    let dealDetailBackup = this.store.getItem('DEAL_LIST_BACKUP') ;
    const arrayOfObjects = JSON.parse(dealDetailBackup);
    setTimeout(() => {
      if(arrayOfObjects != null){
        this.dealListings = arrayOfObjects  ;
        this.tallyTotalValue();
      }
      else if(arrayOfObjects == null){
        this.dealListings = [] ;
      }
      this.tableLoader = false;
      ; 
    }, 400);
    // clearing selected deals in reset option.
    this.selection.clear();
  }

 

   //remove specific record 
   removeRecord(index:any){
    console.log(index) ;
    this.dealListings.splice(index,1) ;
 // added for selecting other records which is present in deal Lisiting.
 let selectedRecord :any[] = this.selection? this.selection.selected : [] ;
 if(selectedRecord.length >= 1){
  this.selection.clear();
  this.selection.select(...this.dealListings);
  console.log("Checkbox Selected Records: ", this.selection.selected)
  console.log("Deal List Records: ", this.dealListings)
 }
 // added for calling tally Deal when an record removed from table section
    let tallyDeal = this.dealListings.filter(v => v.tallyFlag);
    if(tallyDeal.length == 1 ){
      this.tallyDeal();
    }
    this.tallyTotalValue() ;

  }

 


  getCurrencyMaintenance() {
    // Your function logic when F1 key is pressed
    console.log('currency get triggerd');
      this.currencyMaintenanceService.getCurrencyListings('','SGD','').subscribe((datas:any)=>{
        this.currencyArray = datas['data'] ;

        if(this.currencyArray.length != 0){
          this.sgdCcyNo = this.currencyArray[0].ccyNo  ;
       }


        }) ;
   
  }

  getAllCurrencyMaintenance() : Promise<void> {
    return new Promise((resolve,reject)=>{
      this.currencyMaintenanceService.getCurrencyListings('','','').subscribe((datas:any)=>{
        this.currencyAllArray = datas['data'] ;
        resolve(); // Resolve the promise once data is fetched successfully
        },
       error =>{ //error handling
        if(error.status != 401){
            this.dialog.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : error.error.errorMessage  ? error.error.errorMessage : ""}
            }) 
        }
        reject(error); // Reject if there's an error
       }
      ) ;
    })
  }



  //user input f amount and calculate l.amount = f.amount * rate
  onFAmountChange(value:any, indicator:string, index:any, fieldChange:string){
   
    let lAmount : any ;
    if(fieldChange == "fAmountChanged"){
      let fAmount = value ? value : "" ;
      let rate = this.dealListings[index].exchRate ? this.dealListings[index].exchRate : "" ;
      if(fAmount != "" && rate != ""){
        let f_Amt = fAmount.replace(/,/g, '') ;
        let calculatedAmt = parseFloat(f_Amt) * parseFloat(rate) ;
        lAmount = calculatedAmt.toFixed(2)
        this.dealListings[index].amountL = parseFloat(lAmount)
      }
      else{
        this.dealListings[index].amountL = "" ;
      }
    }
    else if(fieldChange == "rateChanged"){
      let fAmount = this.dealListings[index].amountF ? this.dealListings[index].amountF : "" ;
      let rate = value ? value : "" ;
      if(fAmount != "" && rate != ""){
        let f_Amt = fAmount.replace(/,/g, '') ;
        let calculatedAmt = parseFloat(f_Amt) * parseFloat(rate) ;
        lAmount = calculatedAmt.toFixed(2)
        this.dealListings[index].amountL = parseFloat(lAmount)
      }
      else{
        this.dealListings[index].amountL = "" ;
      }
    }
    else if(fieldChange == ""){
      let lAmount : any ;
      let fAmount = this.dealForm.controls['fAmount'].value ? this.dealForm.controls['fAmount'].value : "" ;
      let rate = this.dealForm.controls['rate'].value ? this.dealForm.controls['rate'].value : "" ;
      if(fAmount != "" && rate != ""){
        let f_Amt = fAmount.replace(/,/g, '') ;
        let calculatedAmt = parseFloat(f_Amt) * parseFloat(rate) ;
        lAmount = calculatedAmt.toFixed(2)
      
        this.dealForm.patchValue({
          "lAmount" : this.formatValue(parseFloat(lAmount))
        })
      }
      else{
        this.dealForm.patchValue({
          "lAmount" : ""
        })
      }
    }
  
   
   
  }

  formatValue(value : any){
    return value.toLocaleString('en-US') ;
   }
 
   closeDrawer() {
    // Close the drawer when the closeDrawerEvent is emitted from CurrencyStockComponent
    this.drawer.close();
  }

  //enabling/disabling save deal button
  isDisableSaveTransaction():boolean{
    //Enable button when below properties are fulfilled 
    // - customer name should be not null or empty string
    // - customer type should be not null or empty string 
    // - deallistings length should be greate than or equal to one
    // - if customer type is 'I' --> check in deallistings array : do any of the object has tallyFlag == true to enable the button otherwise disable}

  // Check if customer name is not null or empty
  if (!this.customerName || this.customerName == '') {
    return true; // Disable button
  }

  // Check if customer type is not null or empty
  if (!this.customerType || this.customerType == '') {
    return true; // Disable button
  }

  // Check if deal listings length is at least 1
  if (this.dealListings.length < 1) {
    return true; // Disable button
  }

  // If customer type is 'I', check if any object in dealListings has tallyFlag set to true
  if (this.customerType == 'I') {
    const hasTallyFlag = this.dealListings.some(deal => deal.tallyFlag == true);
    if (!hasTallyFlag) {
      return true; // Disable button
    }
  }

  return false; // Enable button if all conditions are met
    
  }

  isDisableButton() : Boolean{
    if(this.dealListings.length >=1){
      return false ;
     }
     else{
      return true ;
     }
  }
  
 //edit access 
 onEditAccessDeal(index:any){
  // Set edit mode for the specific item in the array
   this.dealListings[index].editMode = true;
 }

  //edit and save deal items
  onSaveDealItems(index:any,updatedRecord:any){
  // Update the specific item in the array with edited values
   this.dealListings[index].editMode = false;
   if (this.dealListings[index].amountF.toString().includes(',')) { //checking if it has commas seperators
   this.dealListings[index].amountF = (this.dealListings[index].amountF).replace(/,/g, '') ;
   }

   // check whether tally is row is present ot not, if available
   // added for calling tally deal when record level save changes occured.
   let tallyDeal = this.dealListings.filter(v => v.tallyFlag);
   if(tallyDeal.length == 1 && !updatedRecord.tallyFlag){
    this.tallyDeal();
   }
  
    this.tallyTotalValue() ;
   
   
  }



   onSaveTransaction(){
    
    console.log("save txn api") ;

    let customerType = this.customerType ? this.customerType : "" ;
    let associateId = this.associateId ? this.associateId : "" ;

    if(customerType == "C"){ //if its corporate , should check associateId has value ..
     if(associateId != ""){
      this.saveTransactionServiceCall('') ;
     }
     else{
      this.snackBar.open("Please select Runner name", "Ok",{duration:2000}) ;
     }
    }
    else if(customerType == "I"){
     this.saveTransactionServiceCall('') ;
    }
    else{
      this.snackBar.open("Please choose Customer", "Ok",{duration:2000}) ;
    }

   }



   saveTransactionServiceCall(indicator:string){
  //   this.notifyUserArray = [] ; //Initially empty array...
  //   if(this.dealListings.length >= 1){
  //   this.dealListings.forEach(deal => { //from dealListings --> find out the objects which has buySellInd as "SELL"
  //     if (deal.buySellInd == 'S') {
  //       const stock = this.stockListingsArray.find(s => s.ccyNo == deal.ccyNo); //currency number check...
  
  //       if (stock && deal.amountF > stock.actualStock) {  //checking amountF exceeds deal stock . 
  //       var obj = {"ccyCode": deal.ccyCode , "ccyNo": deal.ccyNo} ;
  //       this.notifyUserArray.push(obj) ;
  //       }
  //     }
  //   });
  // }

  // if(this.notifyUserArray.length >= 1){
  //   this.dialog.open(UserMessageComponent, {
  //     width: '450px',
  //     height: '240px',
  //     data: { messageArray : this.notifyUserArray }, 
  //   })
  // }
  //need to call add transaction service only when F.Amount is lesser than deal stock irrespective of their currencies...
  //else{

    this.addTransactionService.addTransactionMoneyChanger(this.buildPayload()).subscribe((datas:any)=>{
      console.log(datas) ;
      // storing Txn id
      this.storingTxnId = datas.transactionId ? datas.transactionId : "";
      console.log(this.storingTxnId)
               // Manually trigger change detection
this.cdr.detectChanges();

      this.store.setItem('TRANS_NO', datas.transactionId) ;
      const storeTransNo =  this.store.getItem('TRANS_NO') ? this.store.getItem('TRANS_NO')  : "" ; 
      this.transNo = storeTransNo ;
  
     
      if(indicator == "print"){
        console.log("indicator as print");
        if(this.customerType == "C"){ //Corporate
          this.corporateDetail = true ;
          this.consumerDetails = false ;
          this.customerNameInReceipt = this.customerName ? this.customerName : "" ;
        let selectedDealerArray = this.runnerArray.filter((v: any) => v.associateId == this.associateId);
        this.associateName = selectedDealerArray[0] ? selectedDealerArray[0].name : "";
        this.associateNationality = selectedDealerArray[0] ? selectedDealerArray[0].nationality : "";
        this.associatePassportNumber = selectedDealerArray[0].passportNumber ? selectedDealerArray[0].passportNumber : "";
        this.associateOverseasId = selectedDealerArray[0].overseasId ? selectedDealerArray[0].overseasId : "";
        this.associateNric = selectedDealerArray[0].idNumber ? selectedDealerArray[0].idNumber : "";
        if (this.associateNric && this.associateNric != "") { //Checking NRIC
          this.associateProof = this.associateNric;
        }
        else if (this.associatePassportNumber && this.associatePassportNumber != "") { //Checking passport number
          this.associateProof = this.associatePassportNumber;
        }
        else if (this.associateOverseasId && this.associateOverseasId != "") { //Checking overseas Id
          this.associateProof = this.associateOverseasId;
        }

        }
        else if(this.customerType == "I"){ //Consumer
          this.corporateDetail = false ;
          this.consumerDetails = true ;
          this.customerNameInReceipt = this.customerName ? this.customerName : "" ;
        }

        this.dealListForReceipt = this.dealListings ; //store dealListings datas to new variable called dealListForReceipt.

        this.staffName = this.store.getItem('USERNAME') ? this.store.getItem('USERNAME') : "" ;

        setTimeout(() => {
          const printButton = document.getElementById('printButton');
      printButton?.click();
        }, 200);
      
      //  const port = (navigator as any).serial.requestPort();
        // This is a method call on the navigator.serial object. The serial object is part of the Web Serial API,
        //  which allows web applications to communicate with serial devices like Arduino boards or other embedded 
        //  systems connected to the user's computer. The requestPort() method is used to request access to a
        //   serial port on the user's device.
        // port.open({ baudRate: 9600 }); // The baud rate is the rate at which bits are transmitted over the serial connection
        // this.printerPort = port;

        // const htmlTable = document.getElementById('myTable'); // Replace 'myTable' with the ID of your HTML table
        // const plainTextTable = this.convertTableToPlainText(htmlTable);
        // console.log(plainTextTable);
        // this.print(plainTextTable);
      }


      if(this.counterType && this.counterType != "R"){ //Whole sale we can clear customer informations , but Retail --> we should persist those datas .
        this.customerId = "" ;
        this.customerName = "" ;
        this.aliasName = "" ;
        this.customerForm.patchValue({"customerNameControl" : ""})
        this.typeInputRef.nativeElement.focus() ; //focus on type field .
      }
      this.dealListings = [] ;
      // added for unselect check box when transaction is saved.
      this.selection.clear();
      this.isAllSelected()
      this.dealListingsBackup = [] ;
      this.dealForm.reset() ;
      this.customerOutstandingBalance = "";
      this.customerUsOutstandingBalance = "";
      this.stockValue = "";
      this.avgCost = "";
      this.isSuspicious = "N";
      //patch current date on "Value Date" field (dealForm) 
      let currentDate = new Date();
      this.dealForm.patchValue({
        "valueDate": currentDate
      })
      this.retrievedCustomerCode = "" ;
      this.runnerArray = [
        {"name" : "No Name" , "jobTitle" : "No Designation", "associateId" : ""}
      ];
      this.associateId = "" ;
      this.snackBar.open("Record saved successfully","Ok",{duration:2000}) ; //2secs open snackbar
      
 //once service got success, Again call CustomerAccounts API
 // after save transaction we should not call CustomerAccountsService
//  this.callCustomerAccountsService() ;

     // call currency maintenance api --> SGD
     this.getCurrencyMaintenance();

     // call currency maintenance api --> All currency 
     this.getAllCurrencyMaintenance();

     //call stock inventory api 
     //this.callStockInventoryApi() ;

     // call daily exchange rate service for only RETAIL counters .
     if(this.counterType == "R"){
       this.callDailySetupExchangeRate() ;
     }
      // this.dialog.open(SavedDialogBoxComponent, {
      //   panelClass: 'custom-modalbox',
      //   width:'322px',
      //   height:'140px',
      //   data : {isMCTransactionSaveReview : "Open Saved Dialog"}
      //  })
    },
    (error:any)=>{
      console.log("error handling:txn");
      if(error.status != 401){
        if(error.error.errorMessage){
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage }
          }) 
        }
        else{
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : "Please check technical team" }
          }) 
        }
      }
     }
    )


 // }

   }
  
  

   buildPayload():AddTransactionMoneyChanger{
    const itemsNode = this.dealListings ;
    console.log(itemsNode) ;
    //let index = itemsNode.findIndex(v =>v.tallyFlag == true);
    //if(index != -1){
    //  itemsNode.splice(index,1);
   // }
   // Extracting specific properties from each object
   this.modifiedDealListings = itemsNode.map(item => {
  return {
    "dealItemId": item.dealItemId,
    "buySellInd": item.buySellInd,
    "ccyNo": item.ccyNo,
    "amountF": item.amountF,
    "exchRate" : item.exchRate ,
    "tallyFlag": item.tallyFlag ? true : "" , // Added the "tallyFlag" property with an empty string value
    "remarks" : item.remarks ? item.remarks : "",
  };
});

console.log(this.modifiedDealListings);
    return new AddTransactionMoneyChanger({
      customerId : this.customerId ,
      associateId : this.associateId ? this.associateId : "" ,
      suspicious : this.isSuspicious ? this.isSuspicious : "N", // added suspicious elememt with value "Y" or "N"
      transactionItems : this.modifiedDealListings
    })
   }

   responsiveAverageCostContainer(){
    return { 
      "background-color" : "rgb(229, 229, 229)",
      "height" : "30px",
      "width" : '100%',
      "border-radius": "7px",
      "border" : "1px solid #e8e8e8" ,
  }
}



 //this function triggers whenever user tap 'Enter' button in keyboard , it focus to next field .
 onEnterKey(event: any, nextField: any, value : any,fieldName:string) {
  if (event.key === 'Enter') {
    if(value !== ''){ // value => name
      this.onCustomerNameInputChange(value);
    }
    else if(value == ""){
    let next = nextField;
    console.log(next);
    if(nextField == "addDealItems"){
      if(this.dealForm.valid == true){
        // if next Field is addDealItems we have to call  this.AddTxnItem() ;
       this.addTxnItem() ;
        next = this.typeInputRef.nativeElement;
        next.focus() ;
      }
      else if(this.dealForm.valid == false){
       next = this.typeInputRef.nativeElement;
       next.focus() ;
      }
    }
    else if (next) {
      if(next == "enterAssociateDropdown" && this.runnerNameInputRef.panelOpen){
        this.runnerNameInputRef.close(); // Close the dropdown if it's open
        setTimeout(() => {
          next = this.typeInputRef.nativeElement;
          next.focus() ;
        }, 200); // Small delay to ensure dropdown closes
      }
      else{
        if(fieldName ==  "rate" || fieldName == "currencyNo" || fieldName == "fAmount"
          || fieldName == "valueDate" || fieldName == "remarks"){
          //if next field is rate || currencyNo || fAmount || valueDate  , mark whole value using select method
          console.log(fieldName);
          next.select(); 
         }
        next.focus();
      }
      }
    }
  }
}

// HostListener to detect keyup events on the document body
 @HostListener('document:keydown', ['$event'])
handleKeyUpEvent(event: KeyboardEvent) {

  //save deal if valid
   if (event.key == 'F4') {
    event.preventDefault(); // Prevent default browser behavior
   if(this.isDisableSaveTransaction().valueOf() == false){
       this.onSaveTransaction() ;
     }
  }
  //open customer search
  else if(event.key == "F1"){
    event.preventDefault(); // Prevent default browser behavior
    //whenever user clicks F1 , Initially will check if there are any modal is opened , if any modal opened , will not trigger operCustomerSeacrh function
    if(this.dialog.openDialogs.length == 0){
      this.openCustomerSearch()
    }
  }
  //clear deal fields
  else if(event.key == "F2"){
    event.preventDefault(); // Prevent default browser behavior
    this.clearFields()
  }

  // Trigger Save/Print
  else if(event.key == "F3"){
    event.preventDefault();// Prevent default browser behavior
    if(this.isDisableSaveTransaction().valueOf() == false){// Checks whether the isDisableSaveTransaction function returns false and calls saveAndPrint function.
    this.saveAndPrint();
    }
  }

  // Trigger tally
  else if(event.key == "F5"){
    event.preventDefault();// Prevent default browser behavior
    if(this.isDisableButton().valueOf() == false && this.isShowUsBalance == false){// Checks whether the isDisableSaveTransaction function returns false and calls tallyDeal function.
      // and checks for Us Balance element is false.
    this.tallyDeal();
    }
  }

  // Open reprint transaction modal window
  else if(event.key == "F6"){
    event.preventDefault();// Prevent default browser behavior
    //Open Reprint dialog component here 'ReprintTransactionComponent', no need to send any data , set width , height and panel class properly...
    this.dialog.open(ReprintTransactionComponent,{
      width:"400px",
      height:"250px",
      panelClass: 'custom-modalbox',
    }).afterClosed().subscribe((response)=>{
      console.log(response) ;
      if(response && response.txnId){
      this.fetchTransactionId = response.txnId ? response.txnId : "";
      this.addTransactionService.getTransactionDetailInquiry(this.fetchTransactionId).subscribe((datas:any)=>{
        this.getTransactionDetail = datas['data'];
        this.receiptCurrentDate = this.getTransactionDetail[0].createdDate ? this.getTransactionDetail[0].createdDate : "";
        this.transNo = this.getTransactionDetail[0].transactionId ? this.getTransactionDetail[0].transactionId : "";
        this.staffName = this.getTransactionDetail[0].createdBy ? this.getTransactionDetail[0].createdBy : ""; 
        this.dealListForReceipt = this.getTransactionDetail[0].transactionItems ? this.getTransactionDetail[0].transactionItems : [];
        this.customerId = this.getTransactionDetail[0].customerId ? this.getTransactionDetail[0].customerId : "";
        this.associateId = this.getTransactionDetail[0].associateId ? this.getTransactionDetail[0].associateId : "";
        this.customerSearchService.getCustomerInquiry(this.customerId).subscribe((data:any)=>{
          this.getcustomerDeatails = data;

          if(data.customerType == "I"){
            this.consumerDetails = true;
            this.customerNameInReceipt = data.name ? data.name.name : "";//consumer name patch
            this.consumerNRICPrint = data.demographics ? data.demographics.idNumber : "" ;

            let consumerPrimaryAddress : any[] = data.address.filter((v:any)=> v.isprimary == "Y") ; //finding consumer address where isPrimary is "Y"
            if(consumerPrimaryAddress.length >= 1){
              
              //consumer address patch code...
              let addressParts = [];

              // Add non-empty components to the array
              if (consumerPrimaryAddress[0].streetName?.trim()) { //trim function used which removes whitespace from both sides of a string
                addressParts.push(consumerPrimaryAddress[0].streetName);
              }
              if (consumerPrimaryAddress[0].block?.trim()) {
                addressParts.push(consumerPrimaryAddress[0].block);
              }
              if (consumerPrimaryAddress[0].level?.trim()) {
                addressParts.push(consumerPrimaryAddress[0].level);
              }
              if (consumerPrimaryAddress[0].unit?.trim()) {
                // If level exists but unit doesn't, we don't want a hanging hyphen
                const lastIndex = addressParts.length - 1;
                if (lastIndex >= 0 && addressParts[lastIndex] === consumerPrimaryAddress[0].level) {
                  addressParts[lastIndex] += '-' + consumerPrimaryAddress[0].unit;
                } else {
                  addressParts.push(consumerPrimaryAddress[0].unit);
                }
              }

              // Join only the non-empty parts with commas
              this.consumerAddress = addressParts.join(', ');
              console.log("consumer address : ", this.consumerAddress);

            this.consumerCountry = consumerPrimaryAddress[0].country ? consumerPrimaryAddress[0].country : "";
            this.consumerPostalCode = consumerPrimaryAddress[0].postalCode ? consumerPrimaryAddress[0].postalCode : "";

            }
            else{ //if isPrimary "Y" not found , display "No Address Found !"
              this.consumerAddress = "" ;
            }

            this.getMaskedConsumerNricProof() ;

            //phone country code and phone number patch in seperate ...
            this.consumerPhoneCountryCode = data.phone.phoneCountryCode ? `+ ${data.phone.phoneCountryCode}` : "";
            console.log("consumer phone country code: ", this.consumerPhoneCountryCode) ;
            this.consumerPhoneNo = data.phone.phoneNo ? data.phone.phoneNo : "";
          }

          else if(data.customerType == "C"){
          this.corporateDetail = true;
          this.customerNameInReceipt = data.name ? data.name.name : "";

      if(data.address){  //checking for address node .
          //corporate address patch code...
          let corpAddressParts = [];

          // Add non-empty components to the array
          if (data.address[0].streetName[0]?.trim()) { //trim function used which removes whitespace from both sides of a string
            corpAddressParts.push(data.address[0].streetName);
          }
          if (data.address[0].block?.trim()) {
            corpAddressParts.push(data.address[0].block);
          }
          if (data.address[0].level?.trim()) {
            corpAddressParts.push(data.address[0].level);
          }
          if (data.address[0].unit?.trim()) {
            // If level exists but unit doesn't, we don't want a hanging hyphen
            const lastIndex = corpAddressParts.length - 1;
            if (lastIndex >= 0 && corpAddressParts[lastIndex] === data.address[0].level) {
              corpAddressParts[lastIndex] += '-' + data.address[0].unit;
            } else {
              corpAddressParts.push(data.address[0].unit);
            }
          }

          // Join only the non-empty parts with commas
          this.corporateAddress = corpAddressParts.join(', ');
          console.log("Corporate address : ", this.corporateAddress);

          this.corporateCountry = data.address[0].country ? data.address[0].country : "";
          this.corporatePostalCode = data.address[0].postalCode ? data.address[0].postalCode : "";

        }

        else{
          this.corporateAddress = "" ; //if no address node , patch empty string .
        }

          this.corporatePhoneCountryCode = data.phone.phoneCountryCode ? `+ ${data.phone.phoneCountryCode}` : "" ;
          console.log("corporate phone country code : ", this.corporatePhoneCountryCode);
          this.corporatePhoneNo = data.phone.phoneNo ? data.phone.phoneNo : "" ;

          this.runnerArray= data.associates.runner ? data.associates.runner : "";
          let selectedDealerArray = this.runnerArray.filter((v: any) => v.associateId == this.associateId);
          this.associateName = selectedDealerArray[0].name ? selectedDealerArray[0].name : "";
          this.associateProof = selectedDealerArray[0].idNumber ? selectedDealerArray[0].idNumber : "";
          this.getMaskedAssociateProof() ;
          this.associateNationality = selectedDealerArray[0].nationality ? selectedDealerArray[0].nationality : "" ;
          }
          //delay and triger the printtransaction function
          setTimeout(() => {
            this.printTransaction();
          },200)
        },
        (error:any)=>{
          if(error.status != 401){
            if(error.error.errorMessage){
              this.dialog.open(ErrorDialogAdminComponent,{
                data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Issue Occured.." }
              }) 
            }
          }
         }
    )
      },
      (error:any)=>{
        if(error.status != 401){
          if(error.error.errorMessage){
            this.dialog.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Issue Occured.." }
            }) 
          }
        }
       }
    )
  }
    })
    //after closed -> 
    //1. retrieve that transactionId from 'ReprintTransactionComponent' dialog and store it in a variable called 'fetchTransactionId'
    //2. call a service where function called 'getTransactionDetailInquiry(transactionId)' , this service function is inside 'MoneyChangerTransactionService' .
    //3. Once getTransactionDetailInquiry service is success, do below activities : 
    //   - store that getTransactionDetailInquiry response in variable 'getTransactionDetail' .
    //   - Error handling should do for getTransactionDetailInquiry service
    //   - once above service is success => call customerInquiry service , find customerSearchService in constructor (reuse).
    //   - In customer inquiry service => pass the customerId (you can get the customer id from above transaction response) in that service and pull the corresponding customer details thru this api.
    //   - below variables you need to map properly :
    //   - {{organisationName}} --> map APT value as we did for save/print
    //   - {{receiptCurrentDate}} --> this should come from getTransactionDetailInquiry service response
    //   - {{transNo}} --> this should come from getTransactionDetailInquiry service response
    //   - {{staffName}} --> this should come from getTransactionDetailInquiry service response
    //   - {{customerNameInReceipt}} </p> --> this should come from getTransactionDetailInquiry service response
    //   - {{corporateAddress}} </p> --> this should come from customer inquiry service response
    //   - {{corporateCountry}} </p> --> this should come from customer inquiry service response
    //   - {{corporatePostalCode}} </p> --> this should come from customer inquiry service response
    //   - {{corporatePhoneCountryCode}} {{corporatePhoneNo}} </p> --> this should come from customer inquiry service response
    //   - {{associateName}} </p> --> this should come from customer inquiry service response
    //   - {{ getMaskedAssociateProof() }} </p>  --> this should come from customer inquiry service response
    //   - {{associateNationality}} </p>  --> this should come from customer inquiry service response
    //   - dealListForReceipt --> in this variable : this should come from getTransactionDetailInquiry service response , it should hold array of objects where inside objects it should contain below elements :
    //                         - ccyCode , ccyNo ,buySellInd, exchRate, amountF, amountL . 
    //4. Once both service is success (getTransactionDetailInquiry and Customer Inquiry) => trigger the reprintTransaction() function .

  }

  //Above txn item table > Reset the table :
  //1. if items added from form group => on reset > it clears record into empty
  //2. if items added from deal selection => on reset > it resets to record into initial state .
  else if(event.key == "F7"){
    event.preventDefault();// Prevent default browser behavior
    if(this.isDisableButton().valueOf() == false){// Checks whether the isDisableSaveTransaction function returns false and calls tallyDeal function.
    this.resetDeals();
   }
  }

  else if(event.key == "ArrowUp"){
    console.log(this.storingTxnId); 
    if(this.storingTxnId){
    this.fetchTransactionId = this.storingTxnId ? this.storingTxnId : "";
    this.addTransactionService.getTransactionDetailInquiry(this.fetchTransactionId).subscribe((datas:any)=>{
      this.getTransactionDetail = datas['data'];
      this.receiptCurrentDate = this.getTransactionDetail[0].createdDate ? this.getTransactionDetail[0].createdDate : "";
      this.transNo = this.getTransactionDetail[0].transactionId ? this.getTransactionDetail[0].transactionId : "";
      this.staffName = this.getTransactionDetail[0].createdBy ? this.getTransactionDetail[0].createdBy : ""; 
      this.dealListForReceipt = this.getTransactionDetail[0].transactionItems ? this.getTransactionDetail[0].transactionItems : [];
      this.customerId = this.getTransactionDetail[0].customerId ? this.getTransactionDetail[0].customerId : "";
      this.associateId = this.getTransactionDetail[0].associateId ? this.getTransactionDetail[0].associateId : "";
      this.customerSearchService.getCustomerInquiry(this.customerId).subscribe((data:any)=>{
        this.getcustomerDeatails = data;

        if(data.customerType == "I"){
          this.consumerDetails = true;
          this.customerNameInReceipt = data.name ? data.name.name : "";//consumer name patch
          this.consumerNRICPrint = data.demographics ? data.demographics.idNumber : "" ;

          let consumerPrimaryAddress : any[] = data.address.filter((v:any)=> v.isprimary == "Y") ; //finding consumer address where isPrimary is "Y"
          if(consumerPrimaryAddress.length >= 1){
            
            //consumer address patch code...
            let addressParts = [];

            // Add non-empty components to the array
            if (consumerPrimaryAddress[0].streetName?.trim()) { //trim function used which removes whitespace from both sides of a string
              addressParts.push(consumerPrimaryAddress[0].streetName);
            }
            if (consumerPrimaryAddress[0].block?.trim()) {
              addressParts.push(consumerPrimaryAddress[0].block);
            }
            if (consumerPrimaryAddress[0].level?.trim()) {
              addressParts.push(consumerPrimaryAddress[0].level);
            }
            if (consumerPrimaryAddress[0].unit?.trim()) {
              // If level exists but unit doesn't, we don't want a hanging hyphen
              const lastIndex = addressParts.length - 1;
              if (lastIndex >= 0 && addressParts[lastIndex] === consumerPrimaryAddress[0].level) {
                addressParts[lastIndex] += '-' + consumerPrimaryAddress[0].unit;
              } else {
                addressParts.push(consumerPrimaryAddress[0].unit);
              }
            }

            // Join only the non-empty parts with commas
            this.consumerAddress = addressParts.join(', ');
            console.log("consumer address : ", this.consumerAddress);

          this.consumerCountry = consumerPrimaryAddress[0].country ? consumerPrimaryAddress[0].country : "";
          this.consumerPostalCode = consumerPrimaryAddress[0].postalCode ? consumerPrimaryAddress[0].postalCode : "";

          }
          else{ //if isPrimary "Y" not found , display "No Address Found !"
            this.consumerAddress = "" ;
          }

          this.getMaskedConsumerNricProof() ;

          //phone country code and phone number patch in seperate ...
          this.consumerPhoneCountryCode = data.phone.phoneCountryCode ? `+ ${data.phone.phoneCountryCode}` : "";
          console.log("consumer phone country code: ", this.consumerPhoneCountryCode) ;
          this.consumerPhoneNo = data.phone.phoneNo ? data.phone.phoneNo : "";
        }

        else if(data.customerType == "C"){
        this.corporateDetail = true;
        this.customerNameInReceipt = data.name ? data.name.name : "";

    if(data.address){  //checking for address node .
        //corporate address patch code...
        let corpAddressParts = [];

        // Add non-empty components to the array
        if (data.address[0].streetName[0]?.trim()) { //trim function used which removes whitespace from both sides of a string
          corpAddressParts.push(data.address[0].streetName);
        }
        if (data.address[0].block?.trim()) {
          corpAddressParts.push(data.address[0].block);
        }
        if (data.address[0].level?.trim()) {
          corpAddressParts.push(data.address[0].level);
        }
        if (data.address[0].unit?.trim()) {
          // If level exists but unit doesn't, we don't want a hanging hyphen
          const lastIndex = corpAddressParts.length - 1;
          if (lastIndex >= 0 && corpAddressParts[lastIndex] === data.address[0].level) {
            corpAddressParts[lastIndex] += '-' + data.address[0].unit;
          } else {
            corpAddressParts.push(data.address[0].unit);
          }
        }

        // Join only the non-empty parts with commas
        this.corporateAddress = corpAddressParts.join(', ');
        console.log("Corporate address : ", this.corporateAddress);

        this.corporateCountry = data.address[0].country ? data.address[0].country : "";
        this.corporatePostalCode = data.address[0].postalCode ? data.address[0].postalCode : "";

      }

      else{
        this.corporateAddress = "" ; //if no address node , patch empty string .
      }

        this.corporatePhoneCountryCode = data.phone.phoneCountryCode ? `+ ${data.phone.phoneCountryCode}` : "" ;
        console.log("corporate phone country code : ", this.corporatePhoneCountryCode);
        this.corporatePhoneNo = data.phone.phoneNo ? data.phone.phoneNo : "" ;

        this.runnerArray= data.associates.runner ? data.associates.runner : "";
        let selectedDealerArray = this.runnerArray.filter((v: any) => v.associateId == this.associateId);
        this.associateName = selectedDealerArray[0].name ? selectedDealerArray[0].name : "";
        this.associateProof = selectedDealerArray[0].idNumber ? selectedDealerArray[0].idNumber : "";
        this.getMaskedAssociateProof() ;
        this.associateNationality = selectedDealerArray[0].nationality ? selectedDealerArray[0].nationality : "" ;
        }
        //delay and triger the printtransaction function
        setTimeout(() => {
          this.printTransaction();
        },200)
      },
      (error:any)=>{
        if(error.status != 401){
          if(error.error.errorMessage){
            this.dialog.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Issue Occured.." }
            }) 
          }
        }
       }
  )
    },
    (error:any)=>{
      if(error.status != 401){
        if(error.error.errorMessage){
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Issue Occured.." }
          }) 
        }
      }
     }
  )
}
   }
}

//Deal form >>> Type field , if user entered '+' --> B , '-' --> S
onSpecialCharacterKey(e:any,nextField:any){

  const specialChars = ['+', '-', 'B', 'S', 'b', 's']; // Call your function when a special character is pressed

  if (specialChars.includes(e.key)) {
    
  let next = nextField ;
  const value = this.dealForm.controls['type'].value.toUpperCase();
  this.dealForm.controls['type'].setValue(value, { emitEvent: false }); 

 if(e.key == "+" || e.key== 'B' || e.key =='b' ){
  this.inputColor = "blue" ;
  this.dealForm.patchValue({
   type : "B"
  })
  next.focus() ;
 } 
  else if(e.key == "-" || e.key== 'S' || e.key =='s'){
  this.inputColor = "red" ;
  this.dealForm.patchValue({
   type : "S"
  })
  next.focus() ;
 } 



  //check daily exchange rate array has objects ? if array.length >=1 = Its retails else its wholesale
  if(this.dailySetupExchangeRateArray.length != 0){

    //decide rate type and rate value based on currency code and buysellindicator
    let currencyCode = this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "" ;
    let buySellIndicator = this.dealForm.controls['type'].value ? this.dealForm.controls['type'].value : "" ;
    let currencyNumber = this.dealForm.controls['currencyNo'].value ? this.dealForm.controls['currencyNo'].value : "";
    console.log(currencyNumber);
    if(currencyCode != "" && buySellIndicator != "" && currencyNumber!=""){ //currency code, type, cuurency number should contain value .
      let currencyCodeArray = this.dailySetupExchangeRateArray.filter((v:any) => v.CCYCODE == currencyCode && v.CCYNO == currencyNumber) ; // filter with same ccyCode and ccyNo.
      if(currencyCodeArray.length != 0){
        this.showDailySetupRates = true ;
        if(buySellIndicator == "B"){
          this.rateType = "SYS BUY RATE" ;
          this.retailersExchangeRate = currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE ? currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE : "No Rates" ;
          let dealRate = currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE ? currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE : "";
          // in Retail counter hardcoded SGD rate as 1.00 when selected currency is SGD.
           if(currencyCodeArray[0].CCYCODE !== this.localCurrency){
            this.dealForm.patchValue({
              "rate":dealRate
            })
          }
          else{
            this.dealForm.patchValue({
              "rate":"1.00"
            })
            this.avgCost = "1.00" ;
          } 
          
        }
        else if(buySellIndicator == "S"){
          this.rateType = "SYS SELL RATE" ;
          this.retailersExchangeRate = currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE ? currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE : "No Rates" ;
          let dealRate = currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE ? currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE : "";
          // in Retail counter hardcoded SGD rate as 1.00 when selected currency is SGD.
          if(currencyCodeArray[0].CCYCODE !== this.localCurrency){
            this.dealForm.patchValue({
              "rate":dealRate
            })
          }
          else{
            this.dealForm.patchValue({
              "rate":"1.00"
            })
            this.avgCost = "1.00" ;
          } 
        }
      }
      else{
        this.showDailySetupRates = false ;
      }
    }
    else{
      this.showDailySetupRates = false ;
    }
  }

//it can be whole sale or retail counter
        let lAmount: any;
        let buySellIndicator = this.dealForm.controls['type'].value ? this.dealForm.controls['type'].value : "";
        let fAmount = this.dealForm.controls['fAmount'].value ? this.dealForm.controls['fAmount'].value : "";
        let rate = this.dealForm.controls['rate'].value ? this.dealForm.controls['rate'].value : "";

        //this block executes when user hits enter on 'Type' field and also checking for famount and rate . so i calculate lamount based on rate changes 
        if (fAmount != "" && rate != "") { 

          if (buySellIndicator == "B" || buySellIndicator == "S") {

            let fAmt = fAmount.replace(/,/g, '');
            let calculatedAmt = parseFloat(fAmt) * parseFloat(rate);
            lAmount = calculatedAmt.toFixed(2)

            this.dealForm.patchValue({
              "lAmount": this.formatValue(parseFloat(lAmount)) // patch l amount
            })

          }

        }

      }
}

onLeftNavigation(e:any,prevField : any,fieldName : string){
  let prev = prevField ; 
  const inputElement = e.target as HTMLInputElement;
  //trigger the function when the cursor is at the beginning of the input field
  if(inputElement.selectionStart === 0){ //
    if(fieldName ==  "rate" || fieldName == "currencyNo" || fieldName == "fAmount"
      || fieldName == "valueDate"){  
        //while previous field is rate || currencyNo || fAmount || valueDate , mark whole content using select method
      prev.select();
    }
  prev.focus();
  }
}

pushDeal(){
 let type = this.dealForm.controls['type'].value ? this.dealForm.controls['type'].value : "" ;
 //let fAmount = this.dealForm.controls['fAmount'].value ? (this.dealForm.controls['fAmount'].value).replace(/,/g, '') : "" ; --> UNUSED
 //let currencyNo = this.dealForm.controls['currencyNo'].value ? this.dealForm.controls['currencyNo'].value : "";
 //let stockArray = this.stockListingsArray.filter((v:any)=> v.ccyNo == currencyNo) ; --> UNUSED
// let actualStock = 0 ;
//  if(stockArray.length >= 1){
//   actualStock = stockArray[0].actualStock ;
//  }
  //Only For 'S' ==> to push txn items only when Current stock >= F.Amount .
 // if(type == "S"){
   // if(actualStock >= parseFloat(fAmount)){ //COMMENTED THIS CONDITION BECAUSE BACKEND HAS THIS CONDITION WHILE ADD TXN .
//push objects dealListings array
// this.dealListings.push({
//   "buySellInd" : this.dealForm.controls['type'].value ? this.dealForm.controls['type'].value : "",
//   "ccyNo" : this.dealForm.controls['currencyNo'].value ? this.dealForm.controls['currencyNo'].value : "",
//   "ccyCode" : this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "", 
//   "ccyName" : this.dealForm.controls['currencyName'].value ? this.dealForm.controls['currencyName'].value : "", 
//   "amountF" : this.dealForm.controls['fAmount'].value ? (this.dealForm.controls['fAmount'].value).replace(/,/g, '') : "",
//   "exchRate" : this.dealForm.controls['rate'].value ? this.dealForm.controls['rate'].value : "",
//   "amountL" : this.dealForm.controls['lAmount'].value ? (this.dealForm.controls['lAmount'].value).replace(/,/g, '') : "",
//   "valueDate" : this.dealForm.controls['valueDate'].value ? this.dealForm.controls['valueDate'].value : "",
//   "remarks" : this.dealForm.controls['remarks'].value ? this.dealForm.controls['remarks'].value : "",
//   "manualTransactionFlag" : true ,//this element is added because its a manually added txn item (which is without deal)
//   "dealItemId" : ""
// }) ;
// //clearing fields
// this.clearFields() ;
// //tally
// this.tallyTotalValue() ;
   // }
    // else{
    //   this.snackBar.open("Actual Stock is lesser than F.Amount", "Ok",{duration:3000})
    // }
  //}
  let custName=this.customerName;
 let customerAccount=this.customerAccountsRecords.find(record => record.entityName === custName);
 if(customerAccount){
this.preferredCcy=customerAccount.preferredCcy;
 }
 console.log(this.preferredCcy);
if(this.preferredCcy == "57" && this.dealForm.controls['currencyNo'].value =="57" ){ //this block: USD AC Customers and Currency No shud be 57
  if(type == "B" || type == "S"){
//push objects dealListings array
this.dealListings.push({
  "buySellInd" : this.dealForm.controls['type'].value ? this.dealForm.controls['type'].value : "",
  "ccyNo" : this.dealForm.controls['currencyNo'].value ? this.dealForm.controls['currencyNo'].value : "",
  "ccyCode" : this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "",
  "ccyName" : this.dealForm.controls['currencyName'].value ? this.dealForm.controls['currencyName'].value : "", 
  "amountF" : this.dealForm.controls['fAmount'].value ? (this.dealForm.controls['fAmount'].value).replace(/,/g, '') : "",
  "exchRate" : this.dealForm.controls['rate'].value ? this.dealForm.controls['rate'].value : "",
  "amountL" : this.dealForm.controls['lAmount'].value ? (this.dealForm.controls['lAmount'].value).replace(/,/g, '') : "",
  "valueDate" : this.dealForm.controls['valueDate'].value ? this.dealForm.controls['valueDate'].value : "",
  "remarks" : this.dealForm.controls['remarks'].value ? this.dealForm.controls['remarks'].value : "",
  "manualTransactionFlag" : true ,//this element is added because its a manually added txn item (which is without deal)
  "dealItemId" : ""
}) ;
//clearing fields
this.clearFields() ;
//tally
this.tallyTotalValue() ;
  }
  else {
    this.snackBar.open("Buy/Sell Indicator is invalid","Ok",{duration:3000}) ;
  }
}
else if (this.preferredCcy !== "57") {  //All Customers can initiate regardless US AC CUSTOMERS...
  if(type == "B" || type == "S"){
    //push objects dealListings array
    this.dealListings.push({
      "buySellInd" : this.dealForm.controls['type'].value ? this.dealForm.controls['type'].value : "",
      "ccyNo" : this.dealForm.controls['currencyNo'].value ? this.dealForm.controls['currencyNo'].value : "",
      "ccyCode" : this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "",
      "ccyName" : this.dealForm.controls['currencyName'].value ? this.dealForm.controls['currencyName'].value : "", 
      "amountF" : this.dealForm.controls['fAmount'].value ? (this.dealForm.controls['fAmount'].value).replace(/,/g, '') : "",
      "exchRate" : this.dealForm.controls['rate'].value ? this.dealForm.controls['rate'].value : "",
      "amountL" : this.dealForm.controls['lAmount'].value ? (this.dealForm.controls['lAmount'].value).replace(/,/g, '') : "",
      "valueDate" : this.dealForm.controls['valueDate'].value ? this.dealForm.controls['valueDate'].value : "",
      "remarks" : this.dealForm.controls['remarks'].value ? this.dealForm.controls['remarks'].value : "",
      "manualTransactionFlag" : true ,//this element is added because its a manually added txn item (which is without deal)
      "dealItemId" : ""
    }) ;
    //clearing fields
    this.clearFields() ;
    //tally
    this.tallyTotalValue() ;
      }
      else {
        this.snackBar.open("Buy/Sell Indicator is invalid","Ok",{duration:3000}) ;
      }
}
  else {
    if (this.preferredCcy == "57" && this.dealForm.controls['currencyNo'].value !=="57") { // When US AC CUSTOMERS try to initiate TT with other currencies
      this.snackBar.open('Only USD INWARD allowed for this customer', 'Ok', {
        panelClass: "custom-red-notification-snackbar",
        verticalPosition: 'bottom',
        duration: 3000
      });
    }
  }
  // when we add a new item to table section we have to check whether other items are marked as suspicious or not...
  let selectedRecord :any[] = this.selection? this.selection.selected : [] ;
  if(selectedRecord.length >= 1){
   this.selection.clear();
   this.selection.select(...this.dealListings);
   console.log("Checkbox Selected Records: ", this.selection.selected)
   console.log("Deal List Records: ", this.dealListings)
  }
  // Wait for UI update and then scroll
  setTimeout(() => {
    this.scrollToBottom();
    },100);
}

scrollToBottom() {
  if (this.tableContainer) {
    this.tableContainer.nativeElement.scrollTop = this.tableContainer.nativeElement.scrollHeight;
  }
}

clearFields(){
  this.dealForm.reset() ;
  this.stockValue = "" ;
  this.avgCost = "" ;
   //patch current date on "Value Date" field (dealForm) 
   let currentDate = new Date() ;
   this.dealForm.patchValue({
     "valueDate" : currentDate
   })

   this.showDailySetupRates = false ;

}

//input event triggered on currency number is changed ..
onCurrencyNumberChange(value:any, indicator:string, index:any){

  console.log("on currency number change triggered") ;
  let currencyNo : any ;
  let localCurrency = "SGD" ;

  if(indicator != "templateRef" ){ //manual add txn items from bottom form field ..
    currencyNo = this.dealForm.controls['currencyNo'].value ?  this.dealForm.controls['currencyNo'].value : "" ;
    let result :any[] = this.currencyAllArray.filter(v => v.ccyNo.toUpperCase() == currencyNo.toUpperCase()) ;
    let selectedStock = this.stockListingsArray.find(stock => stock.ccyNo.toUpperCase() == currencyNo.toUpperCase());

    //Only if its wholesale counter , perform below code ..
    // Patch avg cost in rate field of selected currency after input event triggered in field ..
    if(this.counterType == "W"){
    if (selectedStock) { // Changed  for Not patching avg cost in rate field for Wholesale counter
      this.dealForm.patchValue({
        "rate": ""
      });
      this.stockValue = selectedStock.actualStock ? selectedStock.actualStock : "";
      this.avgCost = selectedStock.avgCost ? selectedStock.avgCost : "" ;
    }
    else{
      this.dealForm.patchValue({
        "rate": ""
      });
      this.stockValue = "";
      this.avgCost = "";
    }
  }


    if (result.length != 0) {
      //calculation for txn rate setup based on variance percentage and variance rate  
      //0.860720, 30.00, 0.3
      let varianceRate: any = result[0].varianceRate ? result[0].varianceRate : 0;
      let variancePercentage: any = result[0].variancePercentage ? result[0].variancePercentage : 0;
      let extractVariancePercentage = parseFloat(variancePercentage) / 100;

      // Get the number of decimal places in varianceRate
    //  let decimalPlaces: number = varianceRate.toString().split('.')[1]?.length || 0;

     // this.startRate = (varianceRate - extractVariancePercentage).toFixed(decimalPlaces);  OLD CODE

     //Calculation updated (04 June 2024) :
      //start date = variance exch rate - (variance exch rate * 10%)
      //end date = variance exch rate + (variance exch rate * 10%)

     this.startRate = varianceRate - (varianceRate * extractVariancePercentage)
     this.endRate = varianceRate + (varianceRate * extractVariancePercentage)

     // this.endRate = (varianceRate + extractVariancePercentage).toFixed(decimalPlaces);  OLD CODE
      this.startRate = parseFloat(this.startRate).toFixed(6);
      this.endRate = parseFloat(this.endRate).toFixed(6);
      console.log(this.startRate);
      console.log(this.endRate);

      // Set  validators
      this.dealForm.controls['rate'].setValidators([
        Validators.required,
        Validators.min(this.startRate),
        Validators.max(this.endRate),
        Validators.pattern('^\\d{1,4}\\.\\d{1,6}$')
      ]);

      // Set custom error messages for min and max validators
      this.dealForm.controls['rate'].setErrors({
        'min': { 'message': this.minErrorMessage },
        'max': { 'message': this.maxErrorMessage }
      });

      // Update value and validity
      this.dealForm.controls['rate'].updateValueAndValidity();

      //if user enters SGD currency code , default patch rate as 1.000
      if (result[0].ccyCode == localCurrency) {
        this.dealForm.patchValue({
          "rate": "1.00"
        })
        this.avgCost = "1.00" ;
      }

      if (result.length == 1) { //patch currency code field based on currency number from currency api response .
        let currencyCode = result[0].ccyCode;
        let currencyName = result[0].ccyName;
        this.dealForm.patchValue({
          "currencyCode": currencyCode ? currencyCode : "",
          "currencyName" : currencyName ? currencyName : "" //patch currency name
        })
        //check daily exchange rate array has objects ? if array.length >=1 = Its retails else its wholesale
        if(this.dailySetupExchangeRateArray.length != 0){
          //decide rate type and rate value based on currency code and buysellindicator
          let currencyCode = this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "" ;
          let buySellIndicator = this.dealForm.controls['type'].value ? this.dealForm.controls['type'].value : "" ;
          let currencyNumber = this.dealForm.controls['currencyNo'].value ? this.dealForm.controls['currencyNo'].value : "";
          console.log(currencyNumber);

          if(selectedStock){ // to  patch in grey bar .
            this.stockValue = selectedStock.actualStock ? selectedStock.actualStock : "";
            this.avgCost = selectedStock.avgCost ? selectedStock.avgCost : "" ;
          }

          if(currencyCode != "" && buySellIndicator != "" && currencyNumber!=""){ //currency code, type, cuurency number should contain value .
            let currencyCodeArray = this.dailySetupExchangeRateArray.filter((v:any) => v.CCYCODE == currencyCode && v.CCYNO == currencyNumber) ; // filter with same ccyCode and ccyNo.

            if(currencyCodeArray.length != 0){
              this.showDailySetupRates = true ;
              if(buySellIndicator == "B"){
                this.rateType = "SYS BUY RATE" ;
                this.retailersExchangeRate = currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE ? currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE : "No Rates" ;
                let dealRate = currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE ? currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE : "";
               // in Retail counter hardcoded SGD rate as 1.00 when selected currency is SGD.
                if(currencyCodeArray[0].CCYCODE !== this.localCurrency){
                  this.dealForm.patchValue({
                    "rate":dealRate
                  })
                }
                else{
                  this.dealForm.patchValue({
                    "rate":"1.00"
                  })
                  this.avgCost = "1.00" ;
                } 
              }
              else if(buySellIndicator == "S"){
                this.rateType = "SYS SELL RATE" ;
                this.retailersExchangeRate = currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE ? currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE : "No Rates" ;
                let dealRate = currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE ? currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE : "";
                // in Retail counter hardcoded SGD rate as 1.00 when selected currency is SGD.
                if(currencyCodeArray[0].CCYCODE !== this.localCurrency){
                  this.dealForm.patchValue({
                    "rate":dealRate
                  })
                }
                else{
                  this.dealForm.patchValue({
                    "rate":"1.00"
                  })
                  this.avgCost = "1.00" ;
                } 
              }
            }
            else{
              this.showDailySetupRates = false ;
            }
          }
          else{
            this.showDailySetupRates = false ;
          }
        }
      }
      else {
        this.dealForm.patchValue({
          "currencyCode": "" ,
          "currencyName" : ""
        })
      }
      }
      else{  //if no currency no matches in currency array list ..
        this.dealForm.patchValue({
          "currencyCode" :  "",
          "currencyName" : ""
        })
        this.showDailySetupRates = false ;
      }
     
  }
  else{ // its 'templateRef' -> so its edited from table layout .
    currencyNo = value ? value : "";
    let result = this.currencyAllArray.filter(v => v.ccyNo.toUpperCase() == currencyNo.toUpperCase()) ;
    if(result.length == 1){
      let currencyCode = result[0].ccyCode ;
      this.dealListings[index].ccyCode = currencyCode;
    }
    else{
      this.dealListings[index].ccyCode = "";
    }
  }
}

//add number sequence and store current data in screen 
addHistorySeries(){
  this.dialog.open(DataHistoryConfirmationDialogComponent,{
    width : '480px',
      panelClass: 'custom-modalbox',
      data : {restoredata : false}
  }).afterClosed().subscribe((response:any)=>{
    console.log("after closed confirmation");
   if(response.storeData == true){
    //customer name short form and display in sequence container
    this.customerName = this.customerName ? this.customerName : "" ;
    this.aliasName = this.aliasName ? this.aliasName : "" ;
    const retrievedCustomerName : any = {NAME: this.customerName ? this.customerName : "" , ALIASNAME : this.aliasName }
    this.customerForm.patchValue({"customerNameControl" : retrievedCustomerName})
    let shortFormName = this.getShortName(this.customerName) ;
    console.log(shortFormName) ;
    // dealListings is an array, create a new copy
  const copiedDealListings = [...this.dealListings];

  if (this.capturedCircles < 3) {
    let newSequence = 1;
    // Lets Find the next available unique sequence using while loop
    while (this.sequenceNumberArray.some(item => item.sequence === newSequence)) {
      newSequence++;
    }
    this.capturedCircles++;
    this.sequenceNumberArray.push({
      sequence: newSequence,
      sequenceCustomerName : shortFormName,
      customerName: this.customerName ? this.customerName : "",
      aliasName : this.aliasName,
      historyBackup: {
        "customerId": this.customerId ? this.customerId : "",
        "dealListings": copiedDealListings,
        "runnerArray": this.runnerArray,
        "customerName": this.customerName,
        "aliasName" : this.aliasName ,
        "retrievedCustomerCode" : this.retrievedCustomerCode ? this.retrievedCustomerCode : "",
        "outstandingBalanace":this.customerOutstandingBalance ? this.customerOutstandingBalance : "",
        // added US balance
        "UsOutstandingBalance":this.customerUsOutstandingBalance ?this.customerUsOutstandingBalance : ""
      }
    });
  }
  console.log(this.sequenceNumberArray) ;
  //again clearing all fields and resfreshing the screen ..
  this.customerId = "" ;
  this.customerName = "" ;
  this.aliasName = "" ;
  this.customerForm.patchValue({"customerNameControl" : ""})
  this.dealListings = [] ;
  // added for uncheck checkbox when customer is hold.
  this.selection.clear();
  this.isAllSelected();
  this.dealListingsBackup = [] ;
  this.dealForm.reset() ;
  this.retrievedCustomerCode = "" ;
  this.runnerArray = [
    {"name" : "No Name" , "jobTitle" : "No Designation"}
  ];
  this.totalTally = "" ;
  this.customerOutstandingBalance="";
  this.customerUsOutstandingBalance="";
  this.snackBar.open("Record captured successfully","Ok",{duration:2000}) ; //2secs open snackbar
   }
  }) 
}

//restore datas based on index --> oncircle click
restoreData(index:number){
  const selectedCircle = this.sequenceNumberArray[index];
  console.log(selectedCircle.historyBackup);
  this.dialog.open(DataHistoryConfirmationDialogComponent,{
    width : '480px',
    panelClass: 'custom-modalbox',
    data : {restoredata : true , sequence : selectedCircle.sequence , sequenceCustomerName : selectedCircle.customerName }
  }).afterClosed().subscribe((response:any)=>{
    if(response.killCircle){
      this.dealListings = selectedCircle.historyBackup.dealListings ? selectedCircle.historyBackup.dealListings : [] ;
      this.customerId = selectedCircle.historyBackup.customerId ? selectedCircle.historyBackup.customerId : "" ;
      this.retrievedCustomerCode = selectedCircle.historyBackup.retrievedCustomerCode ? selectedCircle.historyBackup.retrievedCustomerCode : "" ;
      this.customerName = selectedCircle.historyBackup.customerName ? selectedCircle.historyBackup.customerName : "" ;
      this.aliasName = selectedCircle.historyBackup.aliasName ? selectedCircle.historyBackup.aliasName : "" ;
      const retrievedCustomerName : any = {NAME : this.customerName , ALIASNAME : this.aliasName}
      this.customerForm.patchValue({"customerNameControl" : retrievedCustomerName})
      this.runnerArray = selectedCircle.historyBackup.runnerArray ? selectedCircle.historyBackup.runnerArray : "" ;
      this.customerOutstandingBalance=selectedCircle.historyBackup.outstandingBalanace ? selectedCircle.historyBackup.outstandingBalanace : "" ;
      //added US balance  
      this.customerUsOutstandingBalance=selectedCircle.historyBackup.UsOutstandingBalance ? selectedCircle.historyBackup.UsOutstandingBalance : ""
      this.tallyTotalValue() ;
      this.killHistory(index);
    }
  })
}

//kill history / number
killHistory(index: number) {
  if (index < this.sequenceNumberArray.length) {
    this.sequenceNumberArray.splice(index, 1);
    this.capturedCircles--;
  }
}

//disable/enable capture button based on dealListings and enable if sequence is not more than 3 ..
isDisableCapture():boolean{
  if(this.dealListings.length >=1 && this.capturedCircles < 3){
   return false ; //enable
  }
  else{
   return true ; //disable
  }
}
  

//runner id selection 
selectRunnerId(runnerAssociateId:string){
  console.log(runnerAssociateId) ;
  let selectedDealerArray = this.runnerArray.filter((v:any) => v.associateId == runnerAssociateId) ;
  this.associateId = selectedDealerArray[0].associateId ;

}

getMaskedAssociateProof(): string {
  const length = this.associateProof.length;
  if (length <= 4) {
    return this.associateProof; // No masking if the string is too short
  }
  const visiblePart = this.associateProof.slice(-4);
  const maskedPart = '*'.repeat(length - 4);
  return maskedPart + visiblePart;
}

getMaskedConsumerNricProof(): string {
  if(this.consumerNRICPrint !=""){
  const length = this.consumerNRICPrint.length;
  if (length <= 4) {
    return this.consumerNRICPrint ; // No masking if the string is too short
  }
  const visiblePart = this.consumerNRICPrint.slice(-4);
  const maskedPart = '*'.repeat(length - 4);
  return maskedPart + visiblePart;
}
else{
  return "";
}
}

//take first letter from first word and first letter from second word ..
getShortName(fullName:string) { 
  return fullName.split(' ').map(n => n[0]).join('');
}

 isRateFieldReadOnly(): boolean { // If the currencyCode value is SGD, make the Rate field readonly, else make it editable
  if(this.dealForm.controls['currencyCode'].value === 'SGD'){
    return true;
  }
  return false;
  }

//open currency search record and get the currency list
async openCurrencySearchModal(){
  this.dialog.open(CurrencyComponent,{
    data : { isCurrencyReviewFromExternal :true, screenName:'AddTransaction' } ,
    panelClass: 'custom-modalbox',
  }).afterClosed().subscribe(async (res:any)=>{
    console.log(res);
    if(res.currencyNumber != false){
      this.dealForm.patchValue({
        "currencyNo" : res.currencyNumber ? res.currencyNumber : "",
        "currencyCode" : res.currencyCode ? res.currencyCode : "",
        "currencyName" : res.currencyName ? res.currencyName : ""
      });
     
      // Wait for the getAllCurrencyMaintenance() function to complete
      await this.getAllCurrencyMaintenance();
      
       // Once the above function is successful, execute the following lines
      let currencyNo = this.dealForm.controls['currencyNo'].value ?  this.dealForm.controls['currencyNo'].value : "" ;
      let result :any[] = this.currencyAllArray.filter(v => v.ccyNo.toUpperCase() == currencyNo.toUpperCase()) ;

      let selectedStock = this.stockListingsArray.find(stock => stock.ccyNo.toUpperCase() == currencyNo.toUpperCase());
      //When the user chooses SGD currency from the currency Modal popup, the rate field should always be "1.000" 
      if(this.dealForm.controls['currencyCode'].value == "SGD"){
        this.dealForm.patchValue({
          "rate": "1.00"
        })
        this.avgCost = "1.00" ;
        this.stockValue = selectedStock.actualStock ? selectedStock.actualStock : "";
      }
      //Only if its wholesale counter , perform below code ..
    // Patch avg cost in rate field of selected currency after currency listings modal closed ..
    if(this.counterType == "W"){
      let isBaseCurrency = this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "" ;
      if (selectedStock) {
        if(isBaseCurrency != "SGD"){  // Changed for Not patching avg cost in rate field for Wholesale counter
          this.dealForm.patchValue({
            "rate": ""
          });
          this.stockValue = selectedStock.actualStock ? selectedStock.actualStock : "";
          this.avgCost = selectedStock.avgCost ? selectedStock.avgCost : "" ;
        }
      }
      else{
        this.dealForm.patchValue({
          "rate": ""
        });
        this.stockValue = "";
        this.avgCost = "";
      }
    }
    else{ // retail counter
      let isBaseCurrency = this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "" ;
      if(selectedStock){
          this.stockValue = selectedStock.actualStock ? selectedStock.actualStock : "";
          this.avgCost = selectedStock.avgCost ? selectedStock.avgCost : "" ;
      }
      else{
        this.stockValue = "";
        this.avgCost = "";
      }
    }

      if (result.length != 0) {
        //calculation for txn rate setup based on variance percentage and variance rate  

        //Calculation updated (04 June 2024) :
      //start date = variance exch rate - (variance exch rate * 10%)
      //end date = variance exch rate + (variance exch rate * 10%)
      
        let varianceRate: any = result[0].varianceRate ? result[0].varianceRate : 0;
        let variancePercentage: any = result[0].variancePercentage ? result[0].variancePercentage : 0;
        let extractVariancePercentage = parseFloat(variancePercentage) / 100;
        this.startRate = varianceRate - (varianceRate * extractVariancePercentage)
        this.endRate = varianceRate + (varianceRate * extractVariancePercentage)

        this.startRate = parseFloat(this.startRate).toFixed(6);
      this.endRate = parseFloat(this.endRate).toFixed(6);
      console.log(this.startRate);
      console.log(this.endRate);

      // Set  validators
      this.dealForm.controls['rate'].setValidators([
        Validators.required,
        Validators.min(this.startRate),
        Validators.max(this.endRate),
        Validators.pattern('^\\d{1,4}\\.\\d{1,6}$')
      ]);

      // Set custom error messages for min and max validators
      this.dealForm.controls['rate'].setErrors({
        'min': { 'message': this.minErrorMessage },
        'max': { 'message': this.maxErrorMessage }
      });

      // Update value and validity
      this.dealForm.controls['rate'].updateValueAndValidity();

      }

      //check daily exchange rate array has objects ? if array.length >=1 = Its retails else its wholesale
  if(this.dailySetupExchangeRateArray.length != 0){

    //decide rate type and rate value based on currency code and buysellindicator
    let currencyCode = this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "" ;
    let buySellIndicator = this.dealForm.controls['type'].value ? this.dealForm.controls['type'].value : "" ;
    let currencyNumber = this.dealForm.controls['currencyNo'].value ? this.dealForm.controls['currencyNo'].value : "";
     console.log(currencyNumber);
    if(currencyCode != "" && buySellIndicator != "" && currencyNumber!=""){ //currency code, type, cuurency number should contain value .
      let currencyCodeArray = this.dailySetupExchangeRateArray.filter((v:any) => v.CCYCODE == currencyCode && v.CCYNO == currencyNumber) ; // filter with same ccyCode and ccyNo.
      if(currencyCodeArray.length != 0){
        this.showDailySetupRates = true ;
        if(buySellIndicator == "B"){
          this.rateType = "SYS BUY RATE" ;
          this.retailersExchangeRate = currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE ? currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE : "No Rates" ;
          let dealRate = currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE ? currencyCodeArray[0].SYSTEMCONVENTIONBUYRATE : "";
        // in Retail counter hardcoded SGD rate as 1.00 when selected currency is SGD.
          if(currencyCodeArray[0].CCYCODE !== this.localCurrency){
            this.dealForm.patchValue({
              "rate":dealRate
            })
          }
          else{
            this.dealForm.patchValue({
              "rate":"1.00"
            })
            this.avgCost = "1.00" ;
          } 
        }
        else if(buySellIndicator == "S"){
          this.rateType = "SYS SELL RATE" ;
          this.retailersExchangeRate = currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE ? currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE : "No Rates" ;
          let dealRate = currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE ? currencyCodeArray[0].SYSTEMCONVENTIONSELLRATE : "";
          // in Retail counter hardcoded SGD rate as 1.00 when selected currency is SGD.
          if(currencyCodeArray[0].CCYCODE !== this.localCurrency){
            this.dealForm.patchValue({
              "rate":dealRate
            })
          }
          else{
            this.dealForm.patchValue({
              "rate":"1.00"
            })
            this.avgCost = "1.00" ;
          } 
        }
      }
      else{
        this.showDailySetupRates = false ;
      }
    }
    else{
      this.showDailySetupRates = false ;
    }
  }

    }
  })
}

saveAndPrint(){
  this.saveTransactionServiceCall('print') ;  
}

//on selection customer name in auto complete field
onOptionSelectedCustomer(e:any){
  console.log(e) ;
  console.log(e.option.viewValue) ;
  let customerName = e.option.viewValue ? e.option.viewValue : "" ;
  
  // Split the string by colon and space
let partsArray  = customerName.split(': ');
// Extract the ID (assuming it's the second part)
this.customerId = partsArray[1].trim();
this.customerId = this.customerId.replace(':', '').trim() ;
let resultArray = this.customerSearchRecords.filter(v => v.CUSTOMERID == this.customerId ) ;
  


this.customerType = resultArray[0].CUSTOMERTYPE ? resultArray[0].CUSTOMERTYPE : "Customer Type Not Found" ;
this.customerName = resultArray[0].NAME;
this.aliasName = resultArray[0].ALIASNAME ;
// after customer selected we should call callCustomerAccountsService for that customer.
this.callCustomerAccountsService(this.customerId) ;
//when successfully customer name is searched , next focus to type field .
 //let next = this.typeInputRef.nativeElement;
  //call customerInquiry api Only when customer type is C
  if(this.customerType == "C"){
   this.callCustomerInquiryService(this.customerId,this.customerType) ;
 }
 else if(this.customerType == "I"){
   this.runnerArray = [
     {"name" : "No Name" , "jobTitle" : "No Designation"}
   ];
   this.callCustomerInquiryService(this.customerId,this.customerType) ;
 }


 
 //Based on the customerId, we need to filter the records.
 // added in common function to get customer outstanding balance 
//  const selectedCustomer = this.customerAccountsRecords.filter(accounts => accounts.customerId == this.customerId);
//        if (selectedCustomer) {
//         // using ccyNo "01" finding SGD balance
//          const sgdBalanceAccount = selectedCustomer.find(account => account.ccyNo == '01');
//          if(sgdBalanceAccount){
//            this.customerOutstandingBalance = sgdBalanceAccount.outstandingBalance ? sgdBalanceAccount.outstandingBalance : "";
//          }
//          // using ccyNo "57" finding US balance
//          const usBalanceAccount = selectedCustomer.find(account => account.ccyNo == '57');
//          if(usBalanceAccount){
//            this.isShowUsBalance = true;
//            this.customerUsOutstandingBalance = usBalanceAccount.outstandingBalance ? usBalanceAccount.outstandingBalance : "";
//          }
//          else{
//            this.isShowUsBalance=false;
//          }
//        }
//        else{
//        this.customerOutstandingBalance = "";
//        }
//customerUsOutstandingBalance
      if(this.customerId){
        setTimeout(() => {
          this.callDealInquiryService('',this.customerId) ;
        }, 100);
      }

      //next.focus() ;
 

}

// calling customer accounts for the selected customer ...
callCustomerAccountsService(customerId : string){
  // changed "01" to "" for getting US balance.
this.accountsService.getCustomerAccounts('', '', '', customerId, '', '', '','','').subscribe((datas:any)=>{
  this.customerAccountsRecords = datas['data'] ;
  // getting customer outstanding balance after getCustomerAccounts API successful
  this.getCustomerOutstandingBalance();
},
//ERROR HANDLING
(error:any)=>{
if(error.status != 401){
  this.dialog.open(ErrorDialogAdminComponent,{
    data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
  }) ;
}
}
)
}

dateError = false ;

dateFilter = (date: Date | null): boolean => {
  if (date) {
    // Disable dates before the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight to compare only dates
    const isValid = date >= today;
    this.dateError = !isValid;
    return date >= today; //disabled dates
  }
  this.dateError = false;
  return false; //enabled dates
}



focusRunnerNameInputField() {// We can call this function, if we need to autofocus on the customer name field 
  if (this.runnerNameInputRef ) {
    const runnerNameInputElement = this.runnerNameInputRef._elementRef.nativeElement;
    runnerNameInputElement.focus();
  }
}



getConsolidatedAmount(): number {
  return this.dealListForReceipt.reduce((total, item) => {
    const amountL = parseFloat(item.amountL); // Convert amountL to a number
    return item.buySellInd === 'B'
      ? total + amountL
      : total - amountL;
  }, 0);
}

//function triggers for re-printing receipt...
  // reprintTransaction() {
  //   setTimeout(() => {
  //     const printButton = document.getElementById('printButton');
  //     printButton?.click();
  //   }, 200);
  // }


  printTransaction(){
    console.log('print function triggered')
    const data = document.getElementById('printarea');

    // Extract the HTML of the div
  const printContent = data?.innerHTML;

  if (window.opener) {  // Check if this window was opened by another window (meaning shortcut window)
    console.log("Window.Opener: ", window.opener)
    // Listen for print status from parent --> parent component refers to WindowService file here... the place where we open shortcut window
    window.addEventListener('print-status', (event: any) => {
      const response = event.detail;
      console.log('Print Status:', response.message);
      if (response.success) {
        console.log('Printing was successful');
      } else {
        console.error('Printing failed:', response.message);
      }
    });

    // Send print request to parent window
    window.opener.dispatchEvent(new CustomEvent('child-print-request', {
      detail: {
        printContent: printContent,
        sourceWindow: window
     }
   }));
  }
    else if (window.electronAPI) {  //electron integrated here, its checking whether its running on electron env ...
      window.electronAPI.silentPrint(printContent); //html content sent to silentPrint which is in electron
  
      // Listening for the print status response
      window.electronAPI.onPrintStatus((response: any) => { //getting the print status response from electron whether its success or failure case ...
        console.log('Print Status:', response.message); 
        if (response.success) {
          console.log('Printing was successful');
        } else {
          console.error('Printing failed:', response.message);
        }
      });
    } else {
      console.error('Electron API not available!');

      // const printButton = document.createElement('button');
      // printButton.setAttribute('printSectionId', 'printarea');
      // printButton.setAttribute('ngxPrint', '');
      // printButton.style.display = 'none';
      // printButton.click();
    
    }
  }
  // added for selecting all rows.
  toggleAllRows() {
    if (this.isAllSelected()) { //it returns true or false .. true means selected rows equals to deal list records , else false .. 
      this.selection.clear();
      this.isAllSelected();
      return;
    }

    this.selection.select(...this.dealListings);
  }
  // checking whether all rows are selected or not.
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dealListings.length;
    if(numSelected === numRows){
      this.isSuspicious = "Y";
    }
    else{
      this.isSuspicious = "N";
    }
    return numSelected === numRows;
    
  }


  onCustomerNameInputChange(value:any){
   
    // Convert to string if it's a number to handle numeric inputs
    const inputValue = value.toString().trim();
    
    // Check if the input contains only numbers
    const isNumber = /^\d+$/.test(inputValue);
    
    // Check if the input contains only letters (and spaces) and specfic spl char such as .,/@
    const isString = /^[a-zA-Z ./,@\s]*$/.test(inputValue);
  
    if (isNumber) {
      console.log('Input is a number');
      // checking minimum length
      if(inputValue.length>=1){
      // call customer Search
      let customerType = ""
      let status = "1";
      this.customerSearchService.getCustomerSearch(customerType,status,"",inputValue).subscribe((datas:any)=>{
       this.customerSearchRecords = datas['data'] ;
        // mat auto complete implementation..
      this.options = this.customerSearchRecords.map(item => ({NAME : item.NAME, CUSTOMERID: item.CUSTOMERID, ALIASNAME: item.ALIASNAME})) ;
      this.filteredOptions = this.customerForm.controls['customerNameControl'].valueChanges.pipe(
       startWith(''),
       map(value => {
        return typeof value === 'string' ? this._filter(value) : this.options.slice();
       }),
     );
      (error:any)=>{
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
          }) ;
        }
      }
    }
    )
      }
    } else if (isString) {
      console.log('Input is a string containing only letters');
      // checking minimum length 
      if(inputValue.length>=3){
       // call customer Search
       let customerType = ""
       let status = "1";
       this.customerSearchService.getCustomerSearch(customerType,status,inputValue,"").subscribe((datas:any)=>{
        this.customerSearchRecords = datas['data'] ;
       // mat auto complete implementation..
      this.options = this.customerSearchRecords.map(item => ({NAME : item.NAME, CUSTOMERID: item.CUSTOMERID, ALIASNAME: item.ALIASNAME})) ;
      this.filteredOptions = this.customerForm.controls['customerNameControl'].valueChanges.pipe(
       startWith(''),
       map(value => {
        return typeof value === 'string' ? this._filter(value) : this.options.slice();
       }),
     );
       (error:any)=>{
         if(error.status != 401){
           this.dialog.open(ErrorDialogAdminComponent,{
             data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
           }) ;
         }
       }
     }
     )
      }
      else if (inputValue.length < 3) {
        console.log("enter atleast 3 characters");
        this.customerForm.controls['customerNameControl'].setValidators([Validators.minLength(3)]);
        this.customerForm.controls['customerNameControl'].updateValueAndValidity(); 
           } 
    } else {
      console.log('Input contains mixed or special characters');
    } 
  }

  // on clicking refresh icon this function will be called.
  retriveStocks() {
    let ccyNo = this.dealForm.controls['currencyNo'].value ? this.dealForm.controls['currencyNo'].value : "";
    console.log(ccyNo);
    // if ccyNo is present we have to call stock inventory API.
    if (ccyNo) {
        this.callStockInventoryApi(ccyNo).subscribe(
            (datas: any) => {
                this.stockListingsArray = datas['data'];
                
                // Ensure the array is not empty before accessing elements
                if (this.stockListingsArray.length > 0) {
                    this.stockValue = this.stockListingsArray[0].actualStock ? this.stockListingsArray[0].actualStock : "";
                    this.avgCost = this.stockListingsArray[0].avgCost ? this.stockListingsArray[0].avgCost : "";
                } 
                else {
                    this.stockValue = "";
                    this.avgCost = "";
                }
            },
            (error: any) => {
                if (error.status != 401) {
                  this.dialog.open(ErrorDialogAdminComponent,{
                    data :{ errorMessage : error.error.errorMessage  ? error.error.errorMessage : ""}
                  }) 
                }
            }
        );
        // else we have to show Please Enter Currency No
    } else {
        this.snackBar.open("Please Enter Currency No", "Ok", { duration: 3000 });
    }
}
  removeCommas(value: any): string {
    if(value != null){ 
  // Changed the return type from number to string and ensured the value is treated as a string before removing commas.
  // if we remove comma in string type it will return 1,000.00 as '1000.00'
      return String(value.replace(/,/g, ''));
    }
    return value
  }

  addTxnItem(){
    let type = this.dealForm.controls['type'].value ? this.dealForm.controls['type'].value : "" ;
    // for SELL we have to check actual stock is greater than fAmount
    if(type == "S"){
        let fAmount = this.dealForm.controls['fAmount'].value ? this.dealForm.controls['fAmount'].value : "";
        fAmount = this.removeCommas(fAmount);
        // if actual stock is lesser than fAmount we have to restrict add txn item to table.
        if(this.stockValue < parseFloat(fAmount)){
          this.snackBar.open("Actual Stock is lesser than F.Amount","Ok",{duration:3000}) ;
        }
        // else we can add txn item to table
        else{
          this.pushDeal();
        }
    }
    // if it is BUY we can add txn item to table
    else{
      this.pushDeal();
      }
}

// getting customer outstanding balance 
getCustomerOutstandingBalance(){
   //Based on the customerId, we need to filter the records.
 const selectedCustomer = this.customerAccountsRecords.filter(accounts => accounts.customerId == this.customerId);
 if (selectedCustomer) {
  // using ccyNo "01" finding SGD balance
   const sgdBalanceAccount = selectedCustomer.find(account => account.ccyNo == '01');
   if(sgdBalanceAccount){
     this.customerOutstandingBalance = sgdBalanceAccount.outstandingBalance ? sgdBalanceAccount.outstandingBalance : "";
   }
   // using ccyNo "57" finding US balance
   const usBalanceAccount = selectedCustomer.find(account => account.ccyNo == '57');
   if(usBalanceAccount){
     this.isShowUsBalance = true;
     this.customerUsOutstandingBalance = usBalanceAccount.outstandingBalance ? usBalanceAccount.outstandingBalance : "";
   }
   else{
     this.isShowUsBalance=false;
   }
 }
 else{
 this.customerOutstandingBalance = "";
 }
}

// check for weakest currency for receipt
isWeakCurrency(ccyCode: string): boolean {
  console.log(this.WeakestCurrencyArray.find(curr => curr.CCY === ccyCode))
  return this.WeakestCurrencyArray.find(curr => curr.CCY === ccyCode);
}

}



