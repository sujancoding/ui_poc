
import { Component, OnInit} from '@angular/core';
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

import { dealFlowCurrency, fluctuateAdminFeeCurrencies, organisation, purposeOfRemittaceArray, remittanceExchRateArray } from 'src/assets/dropdownvalues';
import { forbiddenNumberValidator } from 'src/app/shared/services/forbiddennumbervalidator';
import { CommissionService } from 'src/app/core/services/commission.service';

import { AdminTransactionReceipt } from 'src/app/core/model/admintxnreceipt/admintxnreceipt.model';
import { PayeeSearch } from 'src/app/backoffice/customer/model/customer.model';
import { DailyExchangeRateSetup } from 'src/app/backoffice/exchangerates/model/exchangerate.model';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { SavedDialogBoxComponent } from 'src/app/backoffice/shared/modals/saved-dialog-box.component';
import { AgentServiceService } from 'src/app/agent/agent-service.service';
import { PayeeComponent } from '../payee-table/payee.component';


@Component({
  selector: 'app-corporate-deal-send-money',
  templateUrl: './corporate-deal-send-money.component.html',
  styleUrls: ['./corporate-deal-send-money.component.scss']
})

export class CorporateDealSendMoneyComponent implements OnInit {

  search : CustomerSearch[] = [];
  payeeSearch : PayeeSearch[] = [];
  exchangeRate !: DailyExchangeRateSetup ;
  sendMoney:RemitMoney[]=[];
  searchNationality : any;
  loader : Boolean = false;
  launchButton : Boolean = true;
  myDate:any= new Date();
  filteredOptions!: Observable<CustomerSearch[]>;
  public secondFormGroup : FormGroup = Object.create(null);
  public thirdFormGroup : FormGroup = Object.create(null);
  public fourthFormGroup : FormGroup = Object.create(null);
  public fifthFormGroup : FormGroup = Object.create(null);
  customerName!: string;
  payeeName !: string;
  value :any;
  remitMoney !: string;
  multiplyValue !: string;
  payeeAccountNumber:any;
  payeeBankName : any;
  payeeCountry : any;
  currencyCode: any;
  idrRate : any;
  myrRate : any;
  usdRate : any;
  ExchangeRate : any ;
  inrRate : any;
  payeeId !:string;
  swiftCode!: string;
  routingCode : string = "" ;
  payeeAccNo!: string;
  payeePhoneNumber : any;
  customerType !: string;
  logo = 'assets/images/logo.jpg'
  showDetails: Boolean = false;
  showCustomerName : Boolean = false;
  organizationName = organisation;
  customer_name !: string;
  customer_phone !: string;
  nric_number !: string;
  adminFee : any ;
  selectedCountryCode !: string ;
  currencyCodeArray : any[] = remittanceExchRateArray ;
  selectedCurrencyCode !: string;
  selectedBaseCurrency !: string ; 
  baseCurrencyCode : any[] = [
    { "NO": 1, "CURRENCYCODE": "SGD", "FLAG": "flag-icon flag-icon-sg"  }
  ]
  comissionArray : any;
  showOthersField = false ;
  remarksOptions : any[] = purposeOfRemittaceArray;
  remarks : string = "";
  submitButtonLoader : boolean = false; 
  showSubmitButton : boolean = true;
  amountEnteredIndicator : string = "" ;
  matspinner : boolean = false ;
  selectedPayee : any;
  isDisableSharingTypeRadioGroup : boolean = true;
  sharingTypeArray : any[] = [
    {"value" : "SHA" , "subValue":"Only Bank Charges to be paid by me", "internalValue" : "1"} ,
    {"value" : "OUR" ,"subValue":"All Charges to be paid by me", "internalValue" : "2"} ,
    {"value" : "BEN" ,"subValue":"All Charges to be paid by beneficiary", "internalValue" : "3"} ,

  ];
  dealForeignCurrency = dealFlowCurrency ;
  fluctuateAdminFeeArray = fluctuateAdminFeeCurrencies ;

  constructor( private fb: FormBuilder,private dialogRef: MatDialog,private commissionService : CommissionService,
   private headerService : TitleHeaderService, private exchangeRateService : ExchangeRateService,private dialog : MatDialog, private store:InMemoryCache,private router: Router,
   private agentService : AgentServiceService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Send Money');
    this.selectedCurrencyCode = "MYR" ;
    this.selectedCountryCode = "flag-icon flag-icon-my";
    this.selectedBaseCurrency = "flag-icon flag-icon-sg";
    this.secondFormGroup = this.fb.group({
      payeeName :  [null, [Validators.compose([Validators.required]), Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')]],
    });
    this.thirdFormGroup = this.fb.group({
      customerAmount :[null,[forbiddenNumberValidator()]],
      payeeAmount: [null,[forbiddenNumberValidator()]],
    });
    this.fourthFormGroup = this.fb.group({
      Remarks:[null,[Validators.compose([Validators.required])]],
      Others:[null]
    });

    this.fifthFormGroup = this.fb.group({
      sharingType:[null,[Validators.compose([Validators.required])]]
    });
     //retreiving todays exchange rate from EXCHANGE_RATE API
     this.exchangeRateService.getExchangeRates().subscribe((data:any)=>{
      this.exchangeRate = data;
      console.log(data);
      if(data.rates != null){
       // Looping through the rates in the currency response to find the rate for the country's currency
       let index = data.rates.findIndex((v:any) => v.CCYCODE == "MYR");
       console.log(index) ;
       if(index != -1){
        this.ExchangeRate = data.rates[index].EXCHRATE ;
        this.currencyCode = data.rates[index].CCYCODE ;
       }
    }
    else if(data.rates == null){
      this.ExchangeRate = "Exchange Rate is not available"
    }
    else{
      this.ExchangeRate = "Exchange Rate is not available"
    }
     },
     //error handling done 
     (error:any) =>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }) 


     //get commission charges api
     this.commissionService.getCommission().subscribe((datas:any)=>{
      this.comissionArray = datas['data'];
      let sharingType = "orgOurs" ;
      this.fifthFormGroup.patchValue({"sharingType" : "2"}) ;
      this.adminFee = this.comissionArray[this.selectedCurrencyCode].corporate[sharingType];
      this.store.setItem('CORP_ADMIN_FEE',this.adminFee);
     },
     //error handling done in 03/07/2023
     (error:any) =>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
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
  
  sharingTypeChange(event:any){
    console.log(event) ; 
    console.log("sharing type changes :" , this.fifthFormGroup.controls['sharingType'].value) ;
   
    let foreignCurrencyCode : string = this.selectedCurrencyCode ; 
    let sharingTypeFormControlValue = this.fifthFormGroup.controls['sharingType'].value ; 
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
 
     this.adminFee = this.comissionArray[foreignCurrencyCode].corporate[sharingType];
     this.store.setItem('CORP_ADMIN_FEE',this.adminFee);
 
    let baseAmount = this.thirdFormGroup.controls['customerAmount'].value ? this.thirdFormGroup.controls['customerAmount'].value : "" ;
    if(baseAmount != ""){
     baseAmount  =  parseFloat(baseAmount.replace(/,/g, '')) ;
    }
      let isCheckDealForeignCurrency : boolean = this.fluctuateAdminFeeArray.includes(foreignCurrencyCode) ;
      if(isCheckDealForeignCurrency == true){  //MYR  
        if(baseAmount >= 3000){
          this.adminFee = 0 ;
        }
        if(baseAmount < 3000){
          this.adminFee = this.store.getItem('CORP_ADMIN_FEE');
        }
      }
      else{  //USD , VND , CAD ..
        this.adminFee = this.store.getItem('CORP_ADMIN_FEE');
      }
 
   
   }


 //selection change --> F_CCY .
 selectCurrencyCode(flag : string){
    this.thirdFormGroup.patchValue({
      customerAmount : "",
      payeeAmount : ""
    })
    this.fifthFormGroup.patchValue({"sharingType" : ""}) ;
  // Find the matching currency code in the first array of objects
     const index = this.currencyCodeArray.findIndex((item:any) => item.FLAG == flag);
     this.selectedCurrencyCode = this.currencyCodeArray[index].CURRENCYCODE
     console.log(index);
     console.log(this.selectedCurrencyCode);
     this.isDisableSharingTypeRadioGroup = false ;
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

      //admin fee ..
      this.isDisableSharingTypeRadioGroup = false ; //enabling sharing type radio buttons .
      //disabling sharing type radio button groups when payee gets currency code is "MYR" or "IDR" or "THB" and removing selection .
      if(this.selectedCurrencyCode != ""){
       let foreignCurrency : string = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ;
     let isCheckDealForeignCurrency : boolean = this.dealForeignCurrency.includes(foreignCurrency) ;
      if(isCheckDealForeignCurrency == true){ //MYR , IDR or THB
        this.isDisableSharingTypeRadioGroup = true ;
        this.fifthFormGroup.patchValue({"sharingType" : "2"}) ;
        let sharingType = "orgOurs" ;
         this.adminFee = this.comissionArray[this.selectedCurrencyCode].corporate[sharingType];
         this.store.setItem('CORP_ADMIN_FEE',this.adminFee);
      }
     }

       this.currencyCode = this.selectedCurrencyCode ;
  
 
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
    this.store.setItem('TRANSACTION_DATE',this.myDate);
    this.store.setItem('PAYEEGETS_CURRENCY_CODE',this.selectedCurrencyCode);
    this.ExchangeRate = this.ExchangeRate ? this.ExchangeRate : "" ;
    if(this.ExchangeRate != "Exchange Rate is not available" && payeeAmt != "" && sendAmt != ""){
      this.store.setItem('PAYEE__ID', this.payeeId);
      this.store.setItem('ORG_EXCHANGE_RATE', this.ExchangeRate);
      this.store.setItem('PAYEE_PHONENUMBER', this.payeePhoneNumber);
      this.store.setItem('CORP_ADMIN_FEE', this.adminFee);
      //Remarks check whether its others or already set value
     
      if(this.fourthFormGroup.controls['Remarks'].value == "OTHERS"){
       this.remarks = this.fourthFormGroup.controls['Others'].value;
      }
      else if(this.fourthFormGroup.controls['Remarks'].value != "OTHERS"){
       this.remarks = this.fourthFormGroup.controls['Remarks'].value ;
      }
      var newObject = new AdminTransactionReceipt({
        "CUSTOMER_ID": this.store.getItem('CUSTOMER_ID'),
        "PAYEE_ID": this.store.getItem('PAYEE__ID'),
        "EXCHANGE_RATE": this.store.getItem('ORG_EXCHANGE_RATE'),
        "AMOUNT_IN_SGD": (this.thirdFormGroup.controls['customerAmount'].value).replace(/,/g, ''),
        "AMOUNT_IN_FCY": (this.thirdFormGroup.controls['payeeAmount'].value).replace(/,/g, ''),
        "BASE_CURRENCY": "SGD",
        "FOREIGN_CURRENCY": this.store.getItem('PAYEEGETS_CURRENCY_CODE'),
        "ADMIN_FEE": this.store.getItem('CORP_ADMIN_FEE'),
        "PURPOSE": this.remarks,
        "SHARINGTYPE" : this.fifthFormGroup.controls['sharingType'].value ? this.fifthFormGroup.controls['sharingType'].value : ""  
      })
      let object = JSON.stringify(newObject);
      this.store.setItem('CORP_TXN_RECEIPT_OBJECT', object);
      this.router.navigate(['payee/corporate-deal-review-transaction'], {
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
        this.dialogRef.open(SavedDialogBoxComponent,{
          panelClass: 'custom-modalbox',
         // width: "346px",
          height: "200px",
          data: "There is no exchange rate for this currency, Please contact admin !",
        });
      }
      
    }
    this.submitButtonLoader = false;
    this.showSubmitButton = true;
  },500)
  }

 

  clearForm(){
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    this.fourthFormGroup.reset();
    this.value = "";
    this.payeeBankName = "";
    this.payeeAccountNumber = "";
    this.payeeCountry = "";
    this.customerName = "";
    this.payeeSearch = [];
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
    });

    let foreignCurrency : string = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ;
    let isCheckDealForeignCurrency : boolean = this.fluctuateAdminFeeArray.includes(foreignCurrency) ;
    if(isCheckDealForeignCurrency == true){  //MYR  
      if(amount >= 3000){
        this.adminFee = 0 ;
      }
      else if(amount < 3000){
        this.adminFee = this.store.getItem('CORP_ADMIN_FEE');
      }
    }
    else{  //USD , VND , CAD ..
      this.adminFee = this.store.getItem('CORP_ADMIN_FEE');
    }
   }
   else if(customerSends == ""){
    this.thirdFormGroup.patchValue({
      payeeAmount : (amount * this.ExchangeRate).toFixed(2) ,
    })
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
      }
      else if(amount < 3000){
        this.adminFee = this.store.getItem('CORP_ADMIN_FEE');
      }
    }
    else{  //USD , VND , CAD ..
      this.adminFee = this.store.getItem('CORP_ADMIN_FEE');
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


  selectRemarks(remarksValue : string){
   if(remarksValue == "OTHERS"){
    this.showOthersField = true ;
   // this.fourthFormGroup.controls['Remarks'].setValue(this.inputRemarksValue) ;
   }
   else{
    this.showOthersField = false ;
   }
  }

  //open payee listings table .
  openPayeeTable(){
    this.launchButton = false
    this.loader = true;
    let status =  '1';
    this.agentService.getPayeeListings(status).subscribe((datas:any) => {
      this.payeeSearch = datas['data'];
      this.loader = false;
      this.launchButton = true;      
      const dialog =  this.dialogRef.open(PayeeComponent,{
        data:{payeeSearch: true, payeeTable: datas['data'] },
        panelClass: 'custom-modalbox',
        width:'1255px',
        height: '710px',
      })
      //after closing the Modal popup >  Triggers
      dialog.afterClosed().subscribe(result => {
        if(result == true){   //This if block executes when user close the payee list dialog box
          this.showDetails = false;   
          this.payeeSearch =  this.store.getItem('PAYEESEARCH_DETAILS');
          console.log("after closed payee dialog");
        }
        if(result == undefined){
          this.matspinner = false;
        }
        if(result.payeeData.length == 1){  //This if block executes when we recieve the payee object from payee list dialog box
          this.secondFormGroup.patchValue({"payeeName" : result.payee_name })
         this.selectedPayee = JSON.stringify(result);
         this.store.setItem("SELECTED_PAYEE",this.selectedPayee)
          //this.matspinner = true;
          this.store.setItem('PAYEESEARCH_DETAILS', result.data);
          this.payeeId = result.payeeId;
          this.payeeSearch = result.payeeData;
          this.payeeName = result.payee_name;
          this.payeeCountry = result.payee_country;
          console.log(this.payeeCountry);
          this.payeeBankName = result.payee_BankName;
          this.swiftCode = result.Payee_SwiftCode;
          this.routingCode = result.Payee_RoutingCode ;
          this.payeeAccNo = result.payee_accountNo;
          this.showDetails = true;
          this.showDetails = result.Payee_show;
         
        }

      })
     })

  }

  isDisableSubmit() : boolean {
    //need to enable submit button only when valid payee name , sgd amount , fcy amount , exchange rate and remarks
    // let payeeName = this.secondFormGroup.controls['payeeName'].value ? this.secondFormGroup.controls['payeeName'].value : "" ;
    // let customerSendAmount = this.thirdFormGroup.controls['customerAmount'].value ? this.thirdFormGroup.controls['customerAmount'].value : "" ;
    // let payeeGetsAmount =  this.thirdFormGroup.controls['payeeAmount'].value ? this.thirdFormGroup.controls['payeeAmount'].value : "";
    // let exchangeRate = this.ExchangeRate ? this.ExchangeRate : "" ;
    // let remarks = this.fourthFormGroup.controls['Remarks'].value ? this.fourthFormGroup.controls['Remarks'].value : "" ;
    // let sharingType = this.fifthFormGroup.controls['sharingType'].value ? this.fifthFormGroup.controls['sharingType'].value : "" ;
    if(this.secondFormGroup.valid && this.thirdFormGroup.valid && this.fourthFormGroup.valid && this.fifthFormGroup.valid){
      return false
    }
    else{
      return true ;
    }
  }

  }

  
