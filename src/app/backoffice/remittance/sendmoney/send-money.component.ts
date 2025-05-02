
import { Component, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { CustomerSearch } from 'src/app/core/model/customersearch/customersearch';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { ExchangeRateService } from 'src/app/core/services/exchange-rate.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { RemitMoney } from 'src/app/payee/payeeModel/remit-money';

import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CustomerTableComponent } from '../../customer/customersearch/customer-table.component';
import { PayeeSearch } from '../../customer/model/customer.model';
import { DailyExchangeRateSetup } from '../../exchangerates/model/exchangerate.model';
import { SavedDialogBoxComponent } from '../../shared/modals/saved-dialog-box.component';
import {  fluctuateAdminFeeCurrencies, organisation, remittanceExchRateArray } from 'src/assets/dropdownvalues';
import { forbiddenNumberValidator } from 'src/app/shared/services/forbiddennumbervalidator';
import { CommissionService } from 'src/app/core/services/commission.service';
import { AlertDialogComponent } from '../../shared/modals/alertdialogbox/alert-dialog.component';
import { AdminTransactionReceipt } from 'src/app/core/model/admintxnreceipt/admintxnreceipt.model';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import {dealFlowCurrency} from 'src/assets/dropdownvalues' ;
import { ExchangeRateComponent } from '../../exchangerates/exchange-rate.component';



@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent implements OnInit {

  search : CustomerSearch[] = [];
  payeeSearch : PayeeSearch[] = [];
  exchangeRate !: DailyExchangeRateSetup ;
  sendMoney:RemitMoney[]=[];
  searchNationality : any;
  loader : Boolean = false;
  launchButton : Boolean = true;
  myDate:any= new Date();
  filteredOptions!: Observable<CustomerSearch[]>;
  public firstFormGroup : FormGroup = Object.create(null);
  public secondFormGroup : FormGroup = Object.create(null);
  public thirdFormGroup : FormGroup = Object.create(null);
  public fourthFormGroup : FormGroup = Object.create(null);
  public fifthFormGroup : FormGroup = Object.create(null) ;
  customerName!: string;
  payeeName !: string;
  value :any;
  remitMoney !: string;
  multiplyValue !: string;
  payeeAccountNumber:any;
  payeeBankName : any;
  payeeCountry : any;
  currencyCode:any
  idrRate : any;
  myrRate : any;
  usdRate : any;
  ExchangeRate : any ;
  inrRate : any;
  payeeId !:string;
  payeePhoneNumber : any;
  customerType !: string;
  logo = 'assets/images/logo.jpg'
  loggedInId !: string;
  username !: string;
  showDetails: Boolean = false;
  showCustomerName : Boolean = false;
  organizationName = organisation;
  customer_name !: string;
  customer_phone !: string;
  nric_number !: string;
  adminFee : any ;
  sharingType !: string ;
  totalAmount : number = 0 ;
  selectedCountryCode !: string ;
  currencyCodeArray = remittanceExchRateArray;
  selectedCurrencyCode !: string;
  selectedBaseCurrency !: string ; 
  selectedCustomerType : string = "";
  baseCurrencyCode : any[] = [
    { "NO": 1, "CURRENCYCODE": "SGD", "FLAG": "flag-icon flag-icon-sg"  }
  ]
  comissionArray : any;
  showOthersField = false ;
  remarksOptions : any[] = [
    {"viewValue":"TRAVEL" , "internalValue":"TRAVEL"},
    {"viewValue":"FAMILY EXPENSES" , "internalValue":"FAMILY EXPENSES"},
    {"viewValue":"SALARY" , "internalValue":"SALARY"},
    {"viewValue":"CHARITY" , "internalValue":"CHARITY"},
    {"viewValue":"PAYMENT" , "internalValue":"PAYMENT"},
    {"viewValue":"OTHERS" , "internalValue":"OTHERS"},

  ];
  remarks : string = "";
  submitButtonLoader : boolean = false; 
  showSubmitButton : boolean = true;
  amountEnteredIndicator : string = "" ;
  selectedSharingType : string = "2" ;
  sharingTypeArray : any[] = [
    {"value" : "SHA" , "subValue":"Only Bank Charges to be paid by me", "internalValue" : "1"} ,
    {"value" : "OUR" ,"subValue":"All Charges to be paid by me", "internalValue" : "2"} ,
    {"value" : "BEN" ,"subValue":"All Charges to be paid by beneficiary", "internalValue" : "3"} ,

  ];
  isDisableSharingTypeRadioGroup : boolean = true ;
  dealForeignCurrency = dealFlowCurrency ;
  fluctuateAdminFeeArray = fluctuateAdminFeeCurrencies ;

  constructor(private customerSearchService: CustomerSearchService , private fb: FormBuilder,private dialogRef: MatDialog,private commissionService : CommissionService,
   private headerService : TitleHeaderService, private exchangeRateService : ExchangeRateService,private dialog : MatDialog, private store:InMemoryCache,private router: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('Send Money');
    this.loggedInId = this.store.getItem('LOGGEDIN_EMAIL_ID') ? this.store.getItem('LOGGEDIN_EMAIL_ID') : ""; 
    this.username = this.store.getItem('USERNAME');
    this.selectedCurrencyCode = "MYR" ;
    this.selectedCountryCode = "flag-icon flag-icon-my";
    this.selectedBaseCurrency = "flag-icon flag-icon-sg";

    this.firstFormGroup = this.fb.group({
      myControl: [null, [Validators.compose([Validators.required]), Validators.pattern('^[a-zA-Z\. ]*$')]],
    });
    this.secondFormGroup = this.fb.group({
      payeeName :  [null, [Validators.compose([Validators.required]), Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')]],
    });
    this.thirdFormGroup = this.fb.group({
      customerCurrencyCode :  [null,[Validators.compose([Validators.required])]], // SGD
    //  payeeCurrencyCode : [null,[Validators.compose([Validators.required])]], --> UNUSED
      //exchangeRate : [null,[Validators.compose([Validators.required])]], --> UNUSED
      customerAmount :[null,[forbiddenNumberValidator()]],
      payeeAmount: [null,[forbiddenNumberValidator()]],
    });
    this.fourthFormGroup = this.fb.group({
      Remarks:[null,[Validators.compose([Validators.required])]],
      Others: [null]
    });
    this.fifthFormGroup = this.fb.group({
      sharingType :[null,[Validators.compose([Validators.required])]] // sharingType ==> 'Shared' or 'Ours' or 'They' .
    });

     //retreiving todays exchange rate from EXCHANGE_RATE API
     this.exchangeRateService.getExchangeRates().subscribe((data:any)=>{
      this.exchangeRate = data;
      console.log(data);
      if(data.rates != null){
       // Looping through the rates in the currency response to find the rate for the country's currency
       let index = data.rates.findIndex((v:any) => v.CCYCODE == "MYR");
       this.ExchangeRate = data.rates[index].EXCHRATE ;
       this.currencyCode = data.rates[index].CCYCODE ;
    }
    else if(data.rates == null){
      this.ExchangeRate = "Exchange Rate is not available"
    }
     },
     //error handling done in 28/06/2023
     (error:any) =>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
    }) 
 
    
     //get commission charges api
     this.commissionService.getCommission().subscribe((datas:any)=>{
     this.comissionArray = datas['data'];
     let sharingType = "orgOurs" ;
     this.fifthFormGroup.patchValue({"sharingType" : "2"}) ;
     this.selectedCurrencyCode = "MYR" ;
     this.selectedCustomerType = "individual";
     this.adminFee = this.comissionArray[this.selectedCurrencyCode].individual[sharingType];
     this.store.setItem('ADMIN_FEE',this.adminFee);
     },
     //error handling done in 03/07/2023
     (error:any) =>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
    }
     )

     //Whenever the input value of the "purpose of remittance" changes based on the value, validation for "Others" field is set. 
     this.fourthFormGroup.get('Remarks')?.valueChanges.subscribe(value => {
      const others = this.fourthFormGroup.get('Others');
      if (value == 'OTHERS') {
        others?.setValidators(Validators.required);
      } else {
        others?.clearValidators();
      }
      others?.updateValueAndValidity();
     

    })

  }
  
  //select payee in dropdown
  selectPayee(name:any,accountNumber:any,bankName:any,country:any,payeeId:any,phoneNumber: any){
    this.showDetails = true;
   this.value = name;
   this.payeeAccountNumber = accountNumber;
   this.payeeBankName = bankName;
   this.payeeCountry = country;
   this.payeeId = payeeId;
   this.payeePhoneNumber = phoneNumber;
  
    
 }

 //selection change
 selectCurrencyCode(flag : string){
    this.thirdFormGroup.patchValue({ //initially setting up into empty string for customer send amt and payee gets .
      customerAmount : "",
      payeeAmount : ""
    })
    this.totalAmount = 0 ;
  // Find the matching currency code in the first array of objects
     const index = this.currencyCodeArray.findIndex((item:any) => item.FLAG == flag);
     this.selectedCurrencyCode = this.currencyCodeArray[index].CURRENCYCODE ? this.currencyCodeArray[index].CURRENCYCODE : "" ;
     console.log(this.selectedCurrencyCode);
     this.isDisableSharingTypeRadioGroup = false ; //enabling sharing type radio buttons .
     //disabling sharing type radio button groups when payee gets currency code is "MYR" or "IDR" and removing selection .
     if(this.selectedCurrencyCode != ""){
      let foreignCurrency : string = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ;
    let isCheckDealForeignCurrency : boolean = this.dealForeignCurrency.includes(foreignCurrency) ;
     if(isCheckDealForeignCurrency == true){ //MYR , IDR 
       this.isDisableSharingTypeRadioGroup = true ;
       this.selectedSharingType = "2" ;
       this.fifthFormGroup.patchValue({"sharingType" : "2"}) ;
       let sharingType = "orgOurs" ;
       //new change ..
       this.selectedCustomerType = this.selectedCustomerType ? this.selectedCustomerType : "individual";
       if(this.selectedCustomerType == "individual"){
        this.adminFee = this.comissionArray[this.selectedCurrencyCode].individual[sharingType];
       }
       else if(this.selectedCustomerType == "corporate"){
        this.adminFee = this.comissionArray[this.selectedCurrencyCode].corporate[sharingType];
       }
      
     }
     else{
      let sharingTypeFormControlValue = this.fifthFormGroup.controls['sharingType'].value ? this.fifthFormGroup.controls['sharingType'].value : "" ;
      let sharingType = "" ;
      if(sharingTypeFormControlValue == 1){
       sharingType = "orgShared" ;
      }
      else if(sharingTypeFormControlValue == 2){
       sharingType = "orgOurs" ;
      }
      else if(sharingTypeFormControlValue == 3){
       sharingType = "orgThey" ;
      }
      else{
        sharingType = "orgShared" ;
        this.fifthFormGroup.patchValue({
          sharingType  : "1"
        });
      }
      //new change ..
      this.selectedCustomerType = this.selectedCustomerType ? this.selectedCustomerType : "individual";
      if(this.selectedCustomerType == "individual"){
       this.adminFee = this.comissionArray[this.selectedCurrencyCode].individual[sharingType];
      }
      else if(this.selectedCustomerType == "corporate"){
       this.adminFee = this.comissionArray[this.selectedCurrencyCode].corporate[sharingType];
      }
     }
    }
     if(this.exchangeRate.rates != null){
      var testObj : any[] =  this.exchangeRate.rates.filter((v:any) => v.CCYCODE == this.selectedCurrencyCode) ;
      if(testObj.length == 0){
       this.ExchangeRate = "Exchange Rate is not available"
      }
      else{
       this.ExchangeRate = testObj[0].EXCHRATE ;
      }
     }
     else{
      this.ExchangeRate = "Exchange Rate is not available"
     }
       this.store.setItem('ADMIN_FEE',this.adminFee);
       this.currencyCode = this.selectedCurrencyCode ;
      
// this.selectedCurrencyCode = getccyCode;
 //this.store.setItem('PAYEEGETS_CURRENCY_CODE',this.selectedCurrencyCode);
 
}


  onSubmit(){
    this.submitButtonLoader = true;
    this.showSubmitButton = false;
    let payeeAmt = this.thirdFormGroup.controls['payeeAmount'].value ? this.thirdFormGroup.controls['payeeAmount'].value : "" ;
    let sendAmt = this.thirdFormGroup.controls['customerAmount'].value ? this.thirdFormGroup.controls['customerAmount'].value : "" ;
    //checking whether user entered amount in LCY field or FCY field ..
    if(this.amountEnteredIndicator != ""){
    this.store.setItem('AMOUNT_ENTERED_INDICATOR', this.amountEnteredIndicator) ;
     }
  setTimeout(()=>{
    this.store.setItem('TRANSACTION_DATE',this.myDate)
    this.store.setItem('PAYEEGETS_CURRENCY_CODE',this.selectedCurrencyCode);
    this.ExchangeRate = this.ExchangeRate ? this.ExchangeRate : "" ;
    if(this.ExchangeRate != "Exchange Rate is not available" && payeeAmt != "" && sendAmt != ""){
      this.store.setItem('PAYEE__ID', this.payeeId);
      this.store.setItem('ORG_EXCHANGE_RATE', this.ExchangeRate);
      this.store.setItem('PAYEE_PHONENUMBER', this.payeePhoneNumber);
      this.store.setItem('BACKOFFICE_ADMIN_FEE', this.adminFee);
      //Remarks check whether its others or already set value
     
      if(this.fourthFormGroup.controls['Remarks'].value == "OTHERS"){
       this.remarks = this.fourthFormGroup.controls['Others'].value ? this.fourthFormGroup.controls['Others'].value : "";
      }
      else if(this.fourthFormGroup.controls['Remarks'].value != "OTHERS"){
       this.remarks = this.fourthFormGroup.controls['Remarks'].value ? this.fourthFormGroup.controls['Remarks'].value : "" ;
      }
      var newObject = new AdminTransactionReceipt({
        "CUSTOMER_ID": this.store.getItem('CUST_ID'),
        "PAYEE_ID": this.store.getItem('PAYEE__ID'),
        "EXCHANGE_RATE": this.store.getItem('ORG_EXCHANGE_RATE'),
        "AMOUNT_IN_SGD": (this.thirdFormGroup.controls['customerAmount'].value).replace(/,/g, ''),
        "AMOUNT_IN_FCY": (this.thirdFormGroup.controls['payeeAmount'].value).replace(/,/g, ''),
        "BASE_CURRENCY": "SGD",
        "FOREIGN_CURRENCY": this.store.getItem('PAYEEGETS_CURRENCY_CODE'),
        "ADMIN_FEE": this.store.getItem('BACKOFFICE_ADMIN_FEE'),
        "PURPOSE": this.remarks,
        "SHARINGTYPE" : this.fifthFormGroup.controls['sharingType'].value ? this.fifthFormGroup.controls['sharingType'].value : ""
      })
      let object = JSON.stringify(newObject);
      this.store.setItem('ADMIN_TXN_RECEIPT_OBJECT', object);
      this.router.navigate(['admin/backoffice-review'], {
        queryParams: {
          'customer_sends': this.thirdFormGroup.controls['customerAmount'].value, 'fyc': this.currencyCode
          , 'payee_name': this.value, 'remarks': this.remarks, 'payee_country': this.payeeCountry, 'payee_accountnbr': this.payeeAccountNumber
        }
      });

    }
    else {
      if(sendAmt == ""|| payeeAmt == ""){
        this.dialogRef.open(SavedDialogBoxComponent,{
          panelClass: 'custom-modalbox',
          width: "346px",
          height: "153px",
          data: "Please Enter Amounts",
        });
      }else{
        this.dialogRef.open(AlertDialogComponent)
      }
      
    }
    this.submitButtonLoader = false;
    this.showSubmitButton = true;
  },500)
  }

 

  clearForm(){
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.fourthFormGroup.reset();
    this.value = "";
    this.payeeBankName = "";
    this.payeeAccountNumber = "";
    this.payeeCountry = "";
    this.customerName = "";
    this.payeeSearch = [];
    this.totalAmount = 0;
    this.remarks = "" ;
  }
 
  formatValue(value : any){  //this functions helps to append commas seperators
    return value.toLocaleString('en-US');
  }

  //send amount entered
  keyUpConsumerSends(customerSends:any){
   let amount : number = parseFloat(customerSends.replace(/,/g, '')); 
   if(customerSends != ""){
    console.log("L") ;
    this.amountEnteredIndicator = "L" ;
    let calculatedPayeeGets = (amount * this.ExchangeRate).toFixed(2) ;  //SGD amount x Local rate = Payee Gets
    let payeeGetsViewValue = this.formatValue(parseFloat(calculatedPayeeGets))  //parseFloat used for converting from string to number
    this.thirdFormGroup.patchValue({
      payeeAmount : payeeGetsViewValue ,
    })
    let foreignCurrency : string = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ;
    let isCheckDealForeignCurrency : boolean = this.fluctuateAdminFeeArray.includes(foreignCurrency) ;
    if(isCheckDealForeignCurrency == true){  //MYR 
      if(amount >= 3000){
        this.adminFee = 0 ;
        this.totalAmount = amount + this.adminFee
      }
      if(amount < 3000){
        this.adminFee = this.store.getItem('ADMIN_FEE');
        this.totalAmount = amount + parseFloat(this.adminFee)
      }
    }
    else{  //USD , VND , CAD ..
      this.adminFee = this.store.getItem('ADMIN_FEE');
      this.totalAmount = amount + parseFloat(this.adminFee) ;
    }
    
   }
   else if(customerSends == ""){
    this.thirdFormGroup.patchValue({
      payeeAmount : (amount * this.ExchangeRate).toFixed(2) ,
    })
    this.totalAmount = amount + parseFloat(this.adminFee)
    if(this.thirdFormGroup.controls['payeeAmount'].value == 0){
      this.thirdFormGroup.patchValue({
        payeeAmount : "" 
      })
    }
   }
  
  }

  //payee gets amount entered
  keyUpPayeeGets(payeeGets:any){
    let amount : number = parseFloat(payeeGets.replace(/,/g, '')) / this.ExchangeRate;   //Payee Gets / Local rate = send amount
    if(payeeGets != ""){
      console.log("F") ;
      this.amountEnteredIndicator = "F" ;
      let calculatedSendAmount = (amount).toFixed(2) ; // send amount
      let sendAmountViewValue = this.formatValue(parseFloat(calculatedSendAmount)) ;//parseFloat used for converting from string to number
      this.thirdFormGroup.patchValue({
        customerAmount : sendAmountViewValue 
      })
  
    let foreignCurrency : string = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ;
    let isCheckDealForeignCurrency : boolean = this.fluctuateAdminFeeArray.includes(foreignCurrency) ;
    if(isCheckDealForeignCurrency == true){  //MYR 
      if(amount >= 3000){
        this.adminFee = 0 ;
        this.totalAmount = amount + this.adminFee
      }
      if(amount < 3000){
        this.adminFee = this.store.getItem('ADMIN_FEE');
        this.totalAmount = amount + parseFloat(this.adminFee)
      }
    }
    else{  //USD , VND , CAD ..
      this.adminFee = this.store.getItem('ADMIN_FEE');
      this.totalAmount = amount + parseFloat(this.adminFee) ;
    }
     }
     else if(payeeGets == ""){
      this.thirdFormGroup.patchValue({
        customerAmount : (payeeGets / this.ExchangeRate).toFixed(2) 
      })
      if(this.thirdFormGroup.controls['customerAmount'].value == 0){
        this.thirdFormGroup.patchValue({
          customerAmount : "" 
        })
      }
     }
    
  }

  openCustomerSearch(){
    this.loader = true;
    this.launchButton = false;
    let customerType = "" ; let status = "1"; //Fetch both Consumer and Corporate records with status as "Active" .
    const dialog =  this.dialogRef.open(CustomerTableComponent,{
      data:{customerSearchReview: true , customerTable: []},
      panelClass: 'custom-modalbox',
      width:'1255px',
    })
    
    dialog.afterOpened().subscribe(() => {
      this.loader = false;
      this.launchButton = true;
    });
     dialog.afterClosed().subscribe(result => {
      this.showCustomerName = true;
      if(result == true){  //this block executes when we close the customer search dialog by close icon
      //  this.payeeSearch =  this.store.getItem('PAYEE_DETAILS');
      //  console.log(this.payeeSearch)
      }
      //storing the customer ID which is selected by BackOffice in SendMoney screen
      if(result != true){
        console.log("Successfully modal dialog closed") ;
      this.store.setItem('CUST_ID', result.customerId);
     this.payeeSearch = result.payeeData;
     this.customerType = result.customer_type;
     let sharingType = "orgOurs" ;
     //new change..
     if(this.customerType == "I"){
      this.selectedCustomerType = "individual";
       this.adminFee = this.comissionArray[this.selectedCurrencyCode].individual[sharingType];
     }
     else if(this.customerType == "C"){
      this.selectedCustomerType = "corporate";
       this.adminFee = this.comissionArray[this.selectedCurrencyCode].corporate[sharingType];
     }
     
     this.store.setItem('ADMIN_FEE',this.adminFee);
     let customerAccountNo = result.customer_accountNo ;
     this.store.setItem('FECTHED_CUSTOMERTYPE',this.customerType);
     this.store.setItem('CUSTOMER_ACCOUNTNBR',customerAccountNo);
     this.store.setItem('CUSTOMER_NAME',result.customer_name); //storing both customer name and phone number for retrieving in review screen.
     this.store.setItem('CUSTOMER_PHONENBR',result.customer_phonenbr);
     //resetting the values of payee details to empty string ""
     this.payeeAccountNumber = ' ';
     this.payeeBankName = '';
     this.value = '';
     this.payeeCountry = '';
   //  this.thirdFormGroup.controls['payeeCurrencyCode'].setValue(''); --> UNUSED
     //this.thirdFormGroup.controls['exchangeRate'].setValue(''); --> UNUSED
     this.thirdFormGroup.controls['customerAmount'].setValue('');
     this.thirdFormGroup.controls['payeeAmount'].setValue('');
     //inititally storing payee details which we will retreieve them when backoffice admin closes the customer_search modal without selecting customer id(radio button),retrieved in if result == true;
     this.store.setItem('PAYEE_DETAILS',result.payeeData);
     if(result.data != undefined){
      this.customerName = result.data;
      this.customer_name = result.customer_name;
      this.customer_phone = result.customer_phonenbr;
      this.payeeName = result.payeeData;
      this.nric_number = result.nric;
      const customerCCYCode = "SGD";
      //clearing validations in customer name text field
      if(result.data != ""){
        this.firstFormGroup.controls['myControl'].clearValidators();
        this.firstFormGroup.controls['myControl'].updateValueAndValidity();
      }
       this.firstFormGroup.patchValue({
        "myControl": this.customer_name,
       })
       this.thirdFormGroup.patchValue({
        "customerCurrencyCode":customerCCYCode,
       })
     }
    }
    })
   
  }

  selectRemarks(remarksValue : string){
   if(remarksValue == "OTHERS"){
    this.showOthersField = true ;
   // this.fourthFormGroup.controls['Remarks'].setValue(this.inputRemarksValue) ; --> UNUSED
   }
   else{
    this.showOthersField = false ;
   }
  }

  sharingTypeChange(event:any){
   console.log(event) ; 
   console.log("sharing type changes :" , this.fifthFormGroup.controls['sharingType'].value) ;
  
   let foreignCurrencyCode : string = this.selectedCurrencyCode ; //USD
   let sharingTypeFormControlValue = this.fifthFormGroup.controls['sharingType'].value ; // 1
   let sharingType = "" ;
   if(sharingTypeFormControlValue == 1){
    sharingType = "orgShared" ;
   }
   else if(sharingTypeFormControlValue == 2){
    sharingType = "orgOurs" ;
   }
   else if(sharingTypeFormControlValue == 3){
    sharingType = "orgThey" ;
   }

   //new change ..
   this.selectedCustomerType = this.selectedCustomerType ? this.selectedCustomerType : "individual";
   if(this.selectedCustomerType == "individual"){
    this.adminFee = this.comissionArray[foreignCurrencyCode].individual[sharingType];
   }
   else if(this.selectedCustomerType == "corporate"){
    this.adminFee = this.comissionArray[foreignCurrencyCode].corporate[sharingType];
   }

   this.store.setItem('ADMIN_FEE',this.adminFee);

   let baseAmount = this.thirdFormGroup.controls['customerAmount'].value ? this.thirdFormGroup.controls['customerAmount'].value : "" ;
   if(baseAmount != ""){
    baseAmount  =  parseFloat(baseAmount.replace(/,/g, '')) ;
   }
     let isCheckDealForeignCurrency : boolean = this.fluctuateAdminFeeArray.includes(foreignCurrencyCode) ;
     if(isCheckDealForeignCurrency == true){  //MYR 
       if(baseAmount >= 3000){
         this.adminFee = 0 ;
         this.totalAmount = baseAmount + this.adminFee
       }
       if(baseAmount < 3000){
         this.adminFee = this.store.getItem('ADMIN_FEE');
         this.totalAmount = baseAmount + parseFloat(this.adminFee)
       }
     }
     else{  //USD , VND , CAD ..
       this.adminFee = this.store.getItem('ADMIN_FEE');
       this.totalAmount = baseAmount + parseFloat(this.adminFee) ;
     }

  
  }

//Enable / disable button based on given condition .
  isDisableSubmit() : Boolean{
    if(this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.fourthFormGroup.valid && this.fifthFormGroup.valid){
      return false
    }else{
     return true
    }
   }

   openUpdateExchRate(){
    //open exchange rate setup component in a modal window
    this.dialog.open(ExchangeRateComponent,{
      data : {isUpdateExchRateReview : true, screenTitleName: 'Send Money' },
      panelClass: 'custom-modalbox',
      width:'1400px',
      disableClose : true
    })
    .afterClosed().subscribe((response:any) =>{
     //retreiving todays exchange rate again from EXCHANGE_RATE API
     this.exchangeRateService.getExchangeRates().subscribe((data:any)=>{
      this.exchangeRate = data;
      console.log(data);
      this.thirdFormGroup.controls['customerAmount'].setValue('');
      this.thirdFormGroup.controls['payeeAmount'].setValue('');  //clear send amount and payee gets amount 
      if(data.rates != null){
       // Looping through the rates in the currency response to find the rate for the country's currency
       this.selectedCurrencyCode = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ;
       let index = data.rates.findIndex((v:any) => v.CCYCODE == this.selectedCurrencyCode);
       if(index != -1){
       this.ExchangeRate = data.rates[index]?.EXCHRATE ;
       this.currencyCode = data.rates[index]?.CCYCODE ;
       }
    }
    else if(data.rates == null){
      this.ExchangeRate = "Exchange Rate is not available"
    }
     },
     //error handling done in 28/06/2023
     (error:any) =>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
    }) 
     
    })
   }

  }

  