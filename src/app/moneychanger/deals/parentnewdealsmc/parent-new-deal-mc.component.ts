import {  Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
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
import { NewDealMoneyChanger } from 'src/app/core/model/mcdeals/mcdeals.model';
import { CorporateService } from 'src/app/core/services/corporate.service';
import moment from 'moment';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyComponent } from '../../maintenance/currency/currency.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MoneyChangerAccountsService } from 'src/app/core/services/mcaccounts.service'; // added for customer accounts inquiry api.


@Component({
  selector: 'app-parent-new-deal-mc',
  templateUrl: './parent-new-deal-mc.component.html',
  styleUrls: ['./parent-new-deal-mc.component.scss'],
})
export class ParentNewDealMcComponent implements OnInit {

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
  dealForm : FormGroup = Object.create(null) ;
  currencyArray : any[] = [] ;
  isReadOnly = true ;
  customerSearchRecords : any[] = [] ;
  customerId !: string ;
  customerNricNo !: string ;
  customerName !: string ;
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
  dealTableLoader = false ;
  showSaveIcon = false ;
  showEditIcon = true ;
  finalDealList : any[] = [] ;
  @ViewChild('drawer') drawer: any; // Access the mat-drawer using ViewChild
 @ViewChild('typeInputRef') typeInputRef !: ElementRef ;
 @ViewChild('dealerNameInputRef') dealerNameInputRef !: any ;//
 combinedAssociatesArray : any[] = [
  {"name" : "No Name" , "jobTitle" : "No Designation" , "associateId" : ""}
];
selectedDealerAssociateId !: string ;
associateId !: string ;
indicatorCurrencyStock : boolean = false ;
@ViewChild(CurrencyStockComponent) childComponent!: CurrencyStockComponent ;
minErrorMessage: string = 'Entered rate is lesser than variance rate';
maxErrorMessage: string = 'Entered rate is more than variance rate';
startRate : any ;
endRate : any ;
options: any[] = [];
filteredOptions!: Observable<any[]>;
customerForm : FormGroup =  Object.create(null) ;
stockListings : any[] = [] ; 
counterType !: string;
isReadRateFields = false;
aliasName : string = "" ;
stockValue !: string; //actualStock
avgCost : any ; //Average cost
showWholesaleCounterDatas = false ;
inputColor: string = 'black'; // Default color
customerAccountsRecords : any[] = [] ;
preferredCcy : string = "";
isOpenedInWindow : boolean = false;

  constructor(private titleService : TitleHeaderService, private router : Router, private dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb : FormBuilder, private currencyMaintenanceService : MoneyChangerMaintenanceService,
    private customerSearchService : CustomerSearchService, private dealService : MoneyChangerDealsService,
    private corporateService : CorporateService, private store : InMemoryCache, private snackBar : MatSnackBar, private accountsService : MoneyChangerAccountsService) {
     
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
    
   //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 292 )+'px' , 'overflow-y' : 'auto' }; 
  }
  // if this component is opened in new window changing table height
  ChangeTableHeightInWindow(){
    return { 'height': (this.getScreenHeight - 252 )+'px' , 'overflow-y' : 'auto' };
  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }
  
  ngOnInit(): void {
    this.titleService.setTitle('Add Deal') ;
   
      // checking for whether this component is opened in window
  if(window.opener){
    this.isOpenedInWindow = true
    console.log("it is opened in new window")
  }
  else {
    this.isOpenedInWindow = false;
  }

    this.dealForm = this.fb.group({
      "type" : [null,[Validators.compose([Validators.required, Validators.pattern(/^(B|S)$/)])]], //user allowed to enter either B or S
      "currencyNo" :[null,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'),Validators.maxLength(4)])]], // Validation patter change, only alphanumeric allowed and max length 4
      "currencyCode" :[null,[Validators.compose([Validators.required])]],
      "fAmount" : [null,[Validators.compose([Validators.required])]],
      "rate": [null, [Validators.compose([Validators.required, Validators.pattern('^\\d{1,4}\\.\\d{1,6}$')])]], // Max 4 digits before the decimal and max 6 digits after
      "lAmount" : [null,[Validators.compose([Validators.required])]],
      "valueDate" : [null,[Validators.compose([Validators.required])]],
      "remarks" :  [null, [Validators.pattern('^[a-zA-Z0-9 _\\-@.,;:()/\'"]+$'),Validators.maxLength(50)]], //--> biz told : remarks field is non mandatory..
      "currencyName" : [null,[Validators.compose([Validators.required])]],

    });

    //customer details form group
    this.customerForm = this.fb.group({
      "customerNameControl" : [null]
    })

    //patch current date on "Value Date" field (dealForm) 
    let currentDate = new Date() ;
    this.dealForm.patchValue({
      "valueDate" : currentDate
    });
    // customer accounts inquiry
    this.callCustomerAccountsService();


    if(this.data.isDealReview){
      this.titleService.setTitle('Deal Listings') ;
      this.xpandStatus = false; 
      this.isDisableButtons = true ;
      this.showViewDealsContent = false ;
      this.showMatToolBar = true ;
      this.isDisableRemoveIcon = true ; //disable remove icon in deal detail inqury table
      this.data.dealDetailInquiryData ;
      this.dealListings = this.data.dealDetailInquiryData ;
      this.retrievedCustomerCode = this.data.customerId ;
      //call customer inquiry api for showing respective customer details .
      if(this.data.customerType == "I"){
        this.showIndContent = true ;
        this.showCorpContent = false ;
        let customerId = this.data.customerId ? this.data.customerId : "" ;
        this.customerSearchService.getCustomerInquiry(customerId).subscribe(data => {
          this.customerId = customerId ;  //customer id
          this.customerName = data.name.name ;  //consumer name
          this.aliasName = data.name.aliasName ? data.name.aliasName: "Alias not found" ;
          const selectedCustomerName : any = {NAME: this.customerName , CUSTOMERID : this.customerId , ALIASNAME: this.aliasName}
          this.customerForm.patchValue({"customerNameControl" : selectedCustomerName}) ;
          this.customerNricNo = data.demographics.idNumber  //consumer nric
          this.customerNationality = data.demographics.nationality ; //consumer nationality
          this.customerType = data.customerType ; //customer type
          this.customerPhnNo = data.phone.phoneNo ; //consumer phone numner
        }
        );
  
      }
      else if(this.data.customerType == "C"){
        this.showIndContent = false ;
        this.showCorpContent = true ;
        let customerId = this.data.customerId ? this.data.customerId : "" ;
        this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
          this.customerId = customerId ;  //corporate id
          this.customerName = data.companyName ;  //corporate name
          this.aliasName = data.name.aliasName ? data.name.aliasName: "Alias not found" ;
          const selectedCustomerName : any = {NAME: this.customerName , CUSTOMERID : this.customerId , ALIASNAME: this.aliasName}
          this.customerForm.patchValue({"customerNameControl" : selectedCustomerName}) ;
          this.customerType = data.customerType ; //customer type
          this.customerPhnNo = data.phone.phoneNo; //corporate phone no
          //filtering owner , dealer and runner array from associates array ..
          let ownerArray = data.associates.owner ;
          if(ownerArray.length >= 1){
            this.ownerNricNo = ownerArray[0].idNumber ;
          }
          else{
            this.ownerNricNo = "Owner Nric No Not specified"
          }

          let dealerArray = data.associates.dealer ;
          if(dealerArray.length >= 1){
            this.dealerNricNo = dealerArray[0].idNumber ;
          }
          else{
            this.dealerNricNo = "Dealer Nric No Not specified"
          }

          let runnerArray = data.associates.runner ;
          if(runnerArray.length >= 1){
          this.runnerNricNo = runnerArray[0].idNumber ;
          }
          else{
            this.runnerNricNo = "Runner Nric No Not specified"
          }
          
        }
        );
  
      }
     
    }

    this.counterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";

    if(this.counterType == "W"){
      this.showWholesaleCounterDatas = true;
    this.currencyMaintenanceService.getStockInventoryInquiry(this.counterType,'','').subscribe((datas:any)=>{
      this.stockListings = datas['data'] ;
    },
  //error handling - write down
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
      }) ;
    }
   }
  );
  }
   
  
    this.getCurrencyMaintenance();
      //getScreenWidth and getScreenHeight will get the windows inner height and width.
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;

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

 

  responsiveCard(){
    return { 'background-color': 'whitesmoke', 'position': 'relative',
    'margin-top': '1px','height': '77px',
    'border': '1px solid #d1d1d1' ,
    'margin-bottom': '24px',
    'margin-left': '1px',
    'margin-right': '6px'
  }
  }  
  contentScrollable(){
    return {'position':'relative','top':'-15px','opacity':'2'}
  }

  responsiveAverageCostContainer(){
    return { 
      "background-color" : "rgb(229, 229, 229)",
      "height" : "40px",
      "width" : (this.getScreenWidth + 170) + 'px',
      "border-radius": "7px",
      "border" : "1px solid #e8e8e8" ,
  }
}



  goToViewDeals(){
    this.router.navigate(['moneychanger-deals/view-deals']) ;
  }

 

  toggleContent(): void {
    this.xpandStatus = !this.xpandStatus;
  }

  openCustomerSearch(){
    let status = "1";
    this.launchButton = false ;
    this.openCustomerSearchloader = true ;
    //pull both consumer and corporate customers in service .
    const dialogRef= this.dialog.open(CustomerTableComponent,{
      data:{mcAddDealCustomerReview: true , customerTable: [], titleName : 'Deal'},
      panelClass: 'custom-modalbox',
      width:'1255px'
    })

    dialogRef.afterOpened().subscribe(() => {
      this.openCustomerSearchloader = false;
      this.launchButton = true;
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      this.focusDealerNameInputField();// After the customer search modal is closed, auto-focus to dealer input 
      let res = result.customerId ? result.customerId : "";
      if(res != ""){
        this.retrievedCustomerCode = res ;
          this.showIndContent = true ;
          this.showCorpContent = false ;
          this.customerId = result.customerId ? result.customerId : "Customer ID Not Specified" ;
          this.customerNricNo = result.nricNo ? result.nricNo : "NRIC No Not Specified" ;
          this.customerName = result.customerName ? result.customerName : "Customer Name Not Found" ;
          this.aliasName = result.aliasName ? result.aliasName: "Alias not found" ;
          const selectedCustomerName : any = {NAME: this.customerName , CUSTOMERID: this.customerId , ALIASNAME: this.aliasName}
          this.customerForm.patchValue({"customerNameControl" : selectedCustomerName}) ;
          this.customerPhnNo = result.phnNo ? result.phnNo : "Phone Number Not Specified" ;
          this.customerNationality = result.nationality ? result.nationality : "Customer Nationality Not Specified" ;
          this.customerType = result.customerType ? result.customerType : "Customer Type Not Found" ;
         //when successfully customer name is searched , next focus to type field .
          //let next = this.typeInputRef.nativeElement;
           //call customerInquiry api Only when customer type is C
           if(this.customerType == "C"){
            this.callCustomerInquiryService(this.retrievedCustomerCode) ;
          }
          else if(this.customerType == "I"){
            this.combinedAssociatesArray = [
              {"name" : "No Name" , "jobTitle" : "No Designation"}
            ]
          }
          //next.focus() ;
         
      }
      else{
       console.log("No data") ;
      }
    })
    
    
    
    }
  

     //Customer inquiry service for getting runner detail // this function only applies for corporate .
     callCustomerInquiryService(customerId:string){
      console.log("customer inq api called")

      this.customerSearchService.getCustomerInquiry(customerId).subscribe((data:any)=>{
        
        let associatesDealersArray :any[] = data.associates.dealer ? data.associates.dealer : [] ;
        let associatesOwnerArray :any[] = data.associates.owner ? data.associates.owner : [];
        let associatesArray = associatesOwnerArray.concat(associatesDealersArray);
        let ownerAssociateId = associatesOwnerArray[0] ? associatesOwnerArray[0].associateId : "";
        let dealerAssociateId = associatesDealersArray[0] ? associatesDealersArray[0].associateId : "";
    
       //Associates group --> associatesArray is an array where we combine both dealers and owners in an array ..
        if(associatesArray.length >=1){
          this.combinedAssociatesArray = associatesArray;
          if(associatesOwnerArray.length < 1){
          this.selectedDealerAssociateId = dealerAssociateId;
          this.associateId = this.selectedDealerAssociateId
          }
          else{
            this.selectedDealerAssociateId = ownerAssociateId;
            this.associateId = this.selectedDealerAssociateId
          }
        }
        //If no owner and dealer found --> dropdown : below object iterated .
        else{
          this.combinedAssociatesArray = [
            {"name" : "No Associates found" , "jobTitle" : "No Designation"}
          ]
        }
      },
      (error:any)=>{
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
       }
      )
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

  //push deals in deal table 
  pushDeal(){
    var validTill : any = moment(this.dealForm.controls.valueDate.value);
    let valueDate = validTill._d.getFullYear() + "-" + (validTill._d.getMonth() + 1) + "-" + validTill._d.getDate();

 let custName=this.customerName;
 let customerAccount=this.customerAccountsRecords.find(record => record.entityName === custName);
 if(customerAccount){
 this.preferredCcy=customerAccount.preferredCcy;
 }
 console.log(this.preferredCcy);
if(this.preferredCcy == "57" && this.dealForm.controls['currencyNo'].value =="57" ){
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
}
else if (this.preferredCcy !== "57" ) {
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
}
else {
  if(this.preferredCcy == "57" && this.dealForm.controls['currencyNo'].value !=="57" ){
  this.snackBar.open('Only USD INWARD allowed for this customer', 'Ok', {
    panelClass: "custom-red-notification-snackbar",
    verticalPosition: 'bottom',
    duration: 3000
  });
}
}
}
//remove record 
removeRecord(index:any){
  console.log(index) ;
  this.dealListings.splice(index,1) ;
  
}
  //clear all field in deal form
  clearFields(){
    this.dealForm.reset() ;
    this.stockValue = "" ;
    this.avgCost = "" ;
     //patch current date on "Value Date" field (dealForm) 
     let currentDate = new Date() ;
     this.dealForm.patchValue({
       "valueDate" : currentDate
     })

  }


  getCurrencyMaintenance() {
    console.log('currency get triggerd');
      this.currencyMaintenanceService.getCurrencyListings('','','').subscribe((datas:any)=>{
        this.currencyArray = datas['data'] ;
        }) ;
   
  }

  //input event triggered on currency number is changed ..
  onCurrencyNumberChange(value:any, indicator:string, index:any){
    console.log("on currency number change triggered") ;
    let currencyNo : any ;
  
    let localCurrency = "SGD" ;

    if(indicator != "templateRef" ){  //manual add txn items from bottom form field ..
      currencyNo = this.dealForm.controls['currencyNo'].value ?  this.dealForm.controls['currencyNo'].value : "" ;
      let result :any[] = this.currencyArray.filter(v => v.ccyNo.toUpperCase() == currencyNo.toUpperCase()) ;
      let selectedStock = this.stockListings.find(stock => stock.ccyNo.toUpperCase() == currencyNo.toUpperCase());

    //Only if its wholesale counter , perform below code ..
    // Patch avg cost in rate field of selected currency after input event triggered in field ..
    if(this.counterType == "W"){
    if (selectedStock) {
      this.dealForm.patchValue({
        "rate": ""
      });
      this.avgCost = selectedStock.avgCost ? selectedStock.avgCost : "" ;
      this.stockValue = selectedStock.actualStock;
      this.isReadRateFields = false; // if the currency is other than SGD, make the rate field editable.
    }
    else{
      this.dealForm.patchValue({
        "rate": ""
      });
      this.isReadRateFields = false; // if the rate field is empty, make it editable.
      this.stockValue = "";
      this.avgCost = "" ;
    }
  } 
  else{  //RETAIL COUNTER
    this.dealForm.patchValue({ // Retail counter -  initially make the rate field empty.
      "rate": ""
    });
    this.isReadRateFields = false; // if the rate field is empty, make it editable for retail counter.
    this.stockValue = "";
    this.avgCost = "" ;
  }
      if (result.length != 0) {
       //calculation for txn rate setup based on variance percentage and variance rate  
       let varianceRate: any = result[0].varianceRate ? result[0].varianceRate : 0;
       let variancePercentage: any = result[0].variancePercentage ? result[0].variancePercentage : 0;  
       let extractVariancePercentage = parseFloat(variancePercentage) / 100; 
          // Get the number of decimal places in varianceRate                  old code
     //let decimalPlaces :number = varianceRate.toString().split('.')[1]?.length || 0;  old code

      // this.startRate  = (varianceRate - extractVariancePercentage).toFixed(decimalPlaces); old code

      //Calculation updated (04 June 2024) :
      //start date = variance exch rate - (variance exch rate * 10%)
      //end date = variance exch rate + (variance exch rate * 10%)

      this.startRate = varianceRate - (varianceRate * extractVariancePercentage)
      this.endRate = varianceRate + (varianceRate * extractVariancePercentage)

       // this.endRate  = (varianceRate + extractVariancePercentage).toFixed(decimalPlaces); old code
       this.startRate = parseFloat(this.startRate).toFixed(6) ;
       this.endRate = parseFloat(this.endRate).toFixed(6) ;
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
    if(result[0].ccyCode == localCurrency){
      this.dealForm.patchValue({
        "rate" : "1.00"
      })
      this.avgCost = "1.00" ;
      this.isReadRateFields = true;
    }

      if(result.length == 1){
        let currencyCode = result[0].ccyCode ;
        let currencyName = result[0].ccyName ;
        this.dealForm.patchValue({
          "currencyCode" : currencyCode ? currencyCode : "",
          "currencyName" : currencyName ? currencyName : ""
        })
      }
      else{
        this.dealForm.patchValue({
          "currencyCode" :  "",
          "currencyName" : ""
        })
      }
    } else{  //if no currency no matches in currency array list ..
      this.dealForm.patchValue({
        "currencyCode" :  "",
        "currencyName" : ""
      })
    }
    }
    else{  // its 'templateRef' -> so its edited from table layout .
      currencyNo = value ? value : "";
      let result = this.currencyArray.filter(v => v.ccyNo.toUpperCase() == currencyNo.toUpperCase()) ;
      if(result.length == 1){
        let currencyCode = result[0].ccyCode ;
        let currencyName = result[0].ccyName ;
        this.dealListings[index].ccyCode = currencyCode;
        this.dealListings[index].ccyName = currencyName;
      }
      else{
        this.dealListings[index].ccyCode = "";
        this.dealListings[index].ccyName = "";
      }
    }
    
  }

  //user input f amount and calculate l.amount = f.amount * rate
  onFAmountChange(value:any, indicator:string, index:any, fieldChange:string){
    if(indicator != "templateRef"){
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

    else{
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
    
    }
   
   
  }

  formatValue(value : any){
    return value.toLocaleString('en-US') ;
   }
 

   onSaveDeal(){
    console.log("save deal api") ;

    let customerType = this.customerType ? this.customerType : "" ;
    let associateId = this.associateId ? this.associateId : "" ;

    if(customerType == "C"){ //if its corporate , should check associateId has value ..
     if(associateId != ""){
      this.saveDealServiceCall() ;
     }
     else{
      this.dialog.open(ErrorDialogAdminComponent,{
        data : {errorMessage : "Please Select Dealer Name", titleMessage : "Required Fields Missing !"}
      }) ;
     }
    }
    else if(customerType == "I"){
     this.saveDealServiceCall() ;
    }
    else{
      this.dialog.open(ErrorDialogAdminComponent,{
        data : {errorMessage : "Please Choose Customer" , titleMessage : "Required Fields Missing !"}
      }) ;
    }
  
   }
  
   saveDealServiceCall(){
    this.dealService.bookDeal(this.buildPayload()).subscribe((datas:any)=>{
      this.snackBar.open("Record saved successfully","Ok",{duration:2000}) ; //2secs open snackbar
      this.customerId = "" ;
      this.customerName = "" ;
      this.aliasName = "" ;
      this.customerForm.patchValue({"customerNameControl":""});
      this.dealListings = [] ;
      this.finalDealList = [] ;
      this.dealForm.reset() ;
      this.stockValue = "" ;
      this.avgCost = "" ;
      //patch current date on "Value Date" field (dealForm) 
      let currentDate = new Date();
      this.dealForm.patchValue({
        "valueDate": currentDate
      })
      this.retrievedCustomerCode = "" ;
      this.combinedAssociatesArray = [
        {"name" : "No Name" , "jobTitle" : "No Designation" , "associateId" : ""}
      ];

      //Once add deal API is success --> again call currency mts and stock API to fecth the latest datas .
      this.getCurrencyMaintenance();

      if(this.counterType == "W"){
        this.showWholesaleCounterDatas = true;
      this.currencyMaintenanceService.getStockInventoryInquiry(this.counterType,'','').subscribe((datas:any)=>{
        this.stockListings = datas['data'] ;
      },
    //error handling 
    (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
     }
    );
    }

      // this.dialog.open(SavedDialogBoxComponent, {
      //   panelClass: 'custom-modalbox',
      //   width:'322px',
      //   height:'140px',
      //   data : {isMCDealSaveReview : "Open Saved Dialog"}
      //  })
    },
    (error:any)=>{
      console.log("error handling")
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
   }
   buildPayload():NewDealMoneyChanger{
    this.finalDealList = this.dealListings ;
    let dealItemsNode : any[] = this.finalDealList.map((item: any) => {
      const { editMode, amountL, ccyName,  ...rest } = item; // Destructure object excluding 'editMode' and 'amountL'
      return rest; // Return the object without 'editMode' and 'amountL'
    });
    dealItemsNode.forEach(item => {
      item.valueDate = moment(item.valueDate).format('YYYY-MM-DD');
    });
     return new NewDealMoneyChanger({
      "customerId": this.customerId,
      "customerType": this.customerType,
      "associateId" : this.associateId ? this.associateId : "" ,
      "dealItems" : dealItemsNode
     })
   }
  

   //enabling/disabling save deal button
   isDisableSaveDeal():boolean{
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
    this.dealListings[index].amountF = (this.dealListings[index].amountF).replace(/,/g, '') ;
    updatedRecord ;
   }
 
   closeDrawer() {
    // Close the drawer when the closeDrawerEvent is emitted from CurrencyStockComponent
    this.drawer.close();
  }

  //this function triggers whenever user tap 'Enter' button in keyboard , it focus to next field .
  onEnterKey(event: any, nextField: any , value : any , fieldName : string) {
    if (event.key === 'Enter') {
      if(value !== ""){
        this.onCustomerNameInputChange(value);
      }
      else if(value == ""){
        let next = nextField;
      if(nextField == "addDealItems"){
        if(this.dealForm.valid == true){
          this.pushDeal() ;
          next = this.typeInputRef.nativeElement;
          next.focus() ;
        }
        else if(this.dealForm.valid == false){
         next = this.typeInputRef.nativeElement;
         next.focus() ;
        }
      }
      else if (next) {
        if(next == "enterAssociateDropdown" && this.dealerNameInputRef.panelOpen){
          this.dealerNameInputRef.close(); // Close the dropdown if it's open
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
     if(this.isDisableSaveDeal().valueOf() == false){
        this.onSaveDeal() ;
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
  
  }

  //Deal form >>> Type field , if user entered '+' --> B , '-' --> S
  onSpecialCharacterKey(e:any, nextField:any){
    let next = nextField ;
   if(e.key == "+"){
    this.inputColor = "#123969" ;
    this.dealForm.patchValue({
     type : "B"
    })
    next.focus() ;
   } 
   else if(e.key == "-"){
    this.inputColor = "red" ;
    this.dealForm.patchValue({
     type : "S"
    })
    next.focus() ;
   } 
  }

  onLeftNavigation(e:any,prevField : any ,fieldName : string){
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

//on selection dealer dropdown --> associate 
selectDealerId(dealerAssociateId:string){
  console.log(dealerAssociateId) ;
  let selectedDealerArray = this.combinedAssociatesArray.filter((v:any) => v.associateId == dealerAssociateId) ;
  this.associateId = selectedDealerArray[0].associateId ;
}

//open currency search record and get the currency list
openCurrencySearchModal(){
  this.dialog.open(CurrencyComponent,{
    data : { isCurrencyReviewFromExternal :true , screenName:'AddDeal'} ,
    panelClass: 'custom-modalbox',
  }).afterClosed().subscribe((res:any)=>{
    console.log(res)
    if(res.currencyNumber != false){
      this.dealForm.patchValue({
        "currencyNo" : res.currencyNumber ? res.currencyNumber : "",
        "currencyCode" : res.currencyCode ? res.currencyCode : "",
        "currencyName" : res.currencyName ? res.currencyName : ""
      })

      let currencyNo = this.dealForm.controls['currencyNo'].value ?  this.dealForm.controls['currencyNo'].value : "" ;
      let result :any[] = this.currencyArray.filter(v => v.ccyNo.toUpperCase() == currencyNo.toUpperCase()) ;
    let selectedStock = this.stockListings.find(stock => stock.ccyNo.toUpperCase() == currencyNo.toUpperCase());
    //When the user chooses SGD currency from the currency Modal popup, the rate field should always be "1.000"
    if(this.dealForm.controls['currencyCode'].value == "SGD"){
      this.dealForm.patchValue({
        "rate": "1.00"
      })
      this.avgCost = "1.00" ;
      this.stockValue =  selectedStock.actualStock ? selectedStock.actualStock : "" ;
      this.isReadRateFields = true; // When the user chooses SGD currency from the currency Modal popup, make the rate field read only.
    }
      //Only if its wholesale counter , perform below code ..
    // Patch avg cost in rate field of selected currency after currency listings modal closed ..
    if(this.counterType == "W"){
      let isBaseCurrency = this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "" ;
      if (selectedStock) {
        if(isBaseCurrency != "SGD"){ //Currency code should not be SGD when patching avgCost in rate field .
        this.dealForm.patchValue({
          "rate": ""
        });
        this.avgCost = selectedStock.avgCost ? selectedStock.avgCost : "" ;
        this.stockValue =  selectedStock.actualStock ? selectedStock.actualStock : "" ;
        this.isReadRateFields = false; // if the currency is other than SGD, make the rate field editable.
      }
    }
      else{
        this.dealForm.patchValue({ 
          "rate": ""
        });
        this.avgCost =  "" ;
        this.stockValue =  "" ;
        this.isReadRateFields = false; // if the rate field is empty, make it as editable.
      }
    }
    else{  //RETAIL COUNTER ...
      let isBaseCurrency = this.dealForm.controls['currencyCode'].value ? this.dealForm.controls['currencyCode'].value : "" ;
      if(isBaseCurrency != "SGD"){
        this.dealForm.patchValue({ // Retail counter -  if the currency is other SGD, make the rate field empty.
          "rate": ""
        });
        this.avgCost = "" ;
        this.stockValue =  "" ;
        this.isReadRateFields = false; // if the rate field is empty, make it as editable for retail counter.
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
        this.startRate = parseFloat(this.startRate).toFixed(6) ;
        this.endRate = parseFloat(this.endRate).toFixed(6) ;
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

    }
  })


}

//on selection customer name in auto complete field
async onOptionSelectedCustomer(e:any){
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
//when successfully customer name is searched , next focus to type field .
 //let next = this.typeInputRef.nativeElement;
  //call customerInquiry api Only when customer type is C
  if(this.customerType == "C"){
    await this.callCustomerInquiryService(this.customerId) ;
 }
 else if(this.customerType == "I"){
  await this.setAssociatesArray();
 }
 //next.focus() ;
this.focusDealerNameInputField();// After customer selected from the auto-complete panel, auto-focus to runner input

}
async setAssociatesArray() {
  this.combinedAssociatesArray = [
    {"name" : "No Name" , "jobTitle" : "No Designation"}
  ];
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

focusTypeInputField() {// We can call this function, if we need to autofocus on the customer name field 
  if (this.typeInputRef ) {
    const typeInputElement = this.typeInputRef.nativeElement;
    typeInputElement.focus();
  }
}

focusDealerNameInputField() {// We can call this function, if we need to autofocus on the dealer dropdown field 
  if (this.dealerNameInputRef ) {
    const dealerNameInputElement = this.dealerNameInputRef._elementRef.nativeElement;
    dealerNameInputElement.focus();
  }
}
onInputChange(nextField:any) {
  const value = this.dealForm.controls['type'].value.toUpperCase();
  let next = nextField ;
  this.dealForm.controls['type'].setValue(value, { emitEvent: false }); 
  if (value === 'B') {
    this.inputColor = '#123969';
    next.focus() ;
  } else if (value === 'S') {
    this.inputColor = 'red';
    next.focus() ;
  } else {
    this.inputColor = 'black';
  }
}

//added  customer accounts inquiry api call for filtered currency
callCustomerAccountsService(){
  this.accountsService.getCustomerAccounts('', '', '', '', '', '', '','01','').subscribe((datas:any)=>{
    this.customerAccountsRecords = datas['data'] ;
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
  
    onCustomerNameInputChange(value:any){
    
      // Convert to string if it's a number to handle numeric inputs
      const inputValue = value.toString().trim();
      
      // Check if the input contains only numbers
      const isNumber = /^\d+$/.test(inputValue);
      
      // Check if the input contains only letters (and spaces) and specific spl chars .,/@
      const isString = /^[a-zA-Z .,/@\s]*$/.test(inputValue);
    
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
  
}



// {
//     "customerId": "C7e310fd42b",
//     "customerType": "C",
//     "valueDate": "2023-12-25",
//     "dealItems": [
//         {
//             "buySellInd": "B",
//             "ccyNo": "1C",
//             "ccyCode": "MYR",
//             "amountF": "303.03",
//             "exchangeRate": "0.033"
//         }
//     ]
// }
