import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PayeeSearch } from 'src/app/backoffice/customer/model/customer.model';
import { DailyExchangeRateSetup } from 'src/app/backoffice/exchangerates/model/exchangerate.model';
import { ExchangeRateService } from 'src/app/core/services/exchange-rate.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { PayeeService } from '../service/payee.service';
import { CommissionService } from 'src/app/core/services/commission.service';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { CustomerInquiry } from 'src/app/core/model/Customer Inquiry/customer-inquiry';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { dealFlowCurrency, fluctuateAdminFeeCurrencies, purposeOfRemittaceArray, remittanceExchRateArray } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-remit-money',
  templateUrl: './remit-money.component.html',
  styleUrls: ['./remit-money.component.scss']
})
export class RemitMoneyComponent implements OnInit {
  //variable declarations
  public form: FormGroup = Object.create(null);
  payeeSearch : PayeeSearch[] = [];
  saveButton : Boolean = true;
  loader : Boolean = false;
  exchangeRate : DailyExchangeRateSetup = new DailyExchangeRateSetup();
  public multiplyValue  : any = ""; //reciepient gets
  public remitMoney :  any = "";//customer sends
  ExchangeRate : any;
  transferId !: string;
  idrRate : any;
  myrRate:any;
  usdRate : any;
  countryCode :any;
  inrRate : any;
  result : any;
  isDisabledSubmit : Boolean = true;
  adminFee : any ;
  selectedCurrencyCode !: string
  selectedCountryCode !: string ;
  currencyCode = remittanceExchRateArray ;
  selectedBaseCurrency !: string ; 
  selectedCustomerType = "individual";
  baseCurrencyCode : any[] = [
    { "NO": 1, "CURRENCYCODE": "SGD", "FLAG": "flag-icon flag-icon-sg"  }
  ];
  purposeOfRemittanceArray = purposeOfRemittaceArray ;
  comissionArray : any;
  customerInquiry: CustomerInquiry = new CustomerInquiry();
  amountEnteredIndicator : string = "" ;
  showOthersField : Boolean = false ;
  remarks : string = "" ;
  selectedSharingType !: string ;
  sharingTypeArray : any[] = [
    {"value" : "SHA" , "subValue":"Only Bank Charges to be paid by me", "internalValue" : "1"} ,
    {"value" : "OUR" ,"subValue":"All Charges to be paid by me", "internalValue" : "2"} ,
    {"value" : "BEN" ,"subValue":"All Charges to be paid by beneficiary", "internalValue" : "3"} ,

  ];
  isDisableSharingTypeRadioGroup : boolean = true ;
  dealForeignCurrency = dealFlowCurrency ;
  fluctuateAdminFeeArray = fluctuateAdminFeeCurrencies ;
 
  constructor(private router: Router,private payeeService: PayeeService , private exchangeRateService: ExchangeRateService,private fb: FormBuilder,
    private dialog:MatDialog , private store: InMemoryCache,private headerService : TitleHeaderService,private snackBar : MatSnackBar,
    private commissionService : CommissionService ,
    private customerSearchService : CustomerSearchService) { }

    public getScreenWidth!: number;
    public getScreenHeight !: number;
    //The HostListener is a Decorator used for listening to the DOM,
    // and It provides a handler method to run when that event occurs.
    @HostListener('window:resize', ['$event'])
    onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }    
    
  ngOnInit(): void {
    this.headerService.setTitle('Send Money');
    this.selectedCountryCode = "flag-icon flag-icon-my";
    this.selectedBaseCurrency = "flag-icon flag-icon-sg";
    //building a form and validations
    this.form = this.fb.group({
      remitMoney: [null, [Validators.compose([Validators.required,Validators.pattern(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/)])]],
      recipientGets :  [null, [Validators.compose([Validators.required,Validators.pattern(/^\d{1,3}(,\d{3})*(\.\d{1,2})?$/)])]],
      orgNumber : [null],
      Remarks: [null , Validators.compose([Validators.required])],
      sharingType : [null,[Validators.compose([Validators.required])]],
      Others : [null]
    });

     //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight; 

    //retrieving payee name  payee account number and country code using PAYEE_SEARCH API call
  let customerId = this.store.getItem('CUSTOMER_ID');
  let payeeId = this.store.getItem('PAYEEID');
    this.payeeService.viewPayee(customerId,payeeId).subscribe((datas:any)=>{
      this.payeeSearch = datas['data'];
      let obj = JSON.stringify(datas['data'])
      this.store.setItem('PAYEE_ARRAY',obj) ; //new change (sujan) , storing payee details in store
      let payeeName = datas.data[0].NAME
      this.store.setItem('PAYEE_NAME',payeeName);
      let relationshipCode= datas.data[0].RELATIONSHIP ? datas.data[0].RELATIONSHIP : "";
      this.store.setItem('RELATIONSHIPCODE',relationshipCode);
       //retrieving exchange rate onload
       this.exchangeRateService.getExchangeRates().subscribe((data: any) => {
        this.exchangeRate = data;
        console.log(data);
        if (data.rates == null) {
          this.ExchangeRate = "Exchange Rate is not available, Please contact APT"
          this.isDisabledSubmit = true;
        }
        else {
          this.isDisabledSubmit = false;
          const country = this.countryCode // Extracting the country from the first object in the array
          var testObj : any[] =  this.exchangeRate.rates.filter(v => v.CCYCODE == "MYR") ;
          if(testObj.length == 0){
            this.ExchangeRate = "Exchange Rate is not available, Please contact APT"
          }
          else{
            this.ExchangeRate = testObj[0].EXCHRATE ;
          }
          this.countryCode = "MYR" ;

          // Looping through the rates in the currency response to find the rate for the country's currency
          data.rates.forEach((rate: any) => {
            if (rate.CCYCODE === country) {
              this.ExchangeRate = rate.EXCHRATE;
            }
          });

             console.log(this.ExchangeRate); // Output the exchange rate for the country
         if(this.ExchangeRate == "" || this.ExchangeRate == "Exchange Rate is not available, Please contact APT"){
           this.form.controls['recipientGets'].setValidators(Validators.compose([Validators.required]));
         }
        }
        
       },
       
       (error:any) =>{
        this.isDisabledSubmit = true;
        (error:any) =>{
          if(error.status != 401){
            this.dialog.open(ErrorDialogComponent) ;
          }
        }
        
       }) 
      
       //get commission charges api
       this.commissionService.getCommission().subscribe((datas:any)=>{
         this.comissionArray = datas['data'];
         this.form.patchValue({"sharingType" : "2"}) ;
         let sharingType = "orgOurs" ;
         this.selectedCurrencyCode = "MYR" ;
         this.adminFee = this.comissionArray[this.selectedCurrencyCode].individual[sharingType];
         this.store.setItem('ADMIN_FEE',this.adminFee);
       })
      
    },
    
     //error handling completed - 30/06/2023
     (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogComponent) ;
      }
     })

  
     //Whenever the input value of the "purpose of remittance" changes based on the value, validation for "Others" field is set. 
     this.form.get('Remarks')?.valueChanges.subscribe(value => {
      const others = this.form.get('Others');
      if (value == 'OTHERS') {
        others?.setValidators(Validators.required);
      } else {
        others?.clearValidators();
      }
      others?.updateValueAndValidity();
     

    })
     
  }

  formatValue(value : any){  //this functions helps to append commas seperators
    return value.toLocaleString('en-US');
  }
  sharingTypeChange(event:any){
    console.log(event) ; 
    console.log("sharing type changes :" , this.form.controls['sharingType'].value) ;
   
    let foreignCurrencyCode : string = this.selectedCurrencyCode ; 
    let sharingTypeFormControlValue = this.form.controls['sharingType'].value ; 
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

     this.adminFee = this.comissionArray[foreignCurrencyCode].individual[sharingType];
  
    this.store.setItem('ADMIN_FEE',this.adminFee);
 
    let baseAmount = this.form.controls['remitMoney'].value ? this.form.controls['remitMoney'].value : "" ;
    if(baseAmount != ""){
     baseAmount  =  parseFloat(baseAmount.replace(/,/g, '')) ;
    }
      let isCheckDealForeignCurrency : boolean = this.fluctuateAdminFeeArray.includes(foreignCurrencyCode) ;
      if(isCheckDealForeignCurrency == true){  //MYR 
        if(baseAmount >= 3000){
          this.adminFee = 0 ;
        }
        if(baseAmount < 3000){
          this.adminFee = this.store.getItem('ADMIN_FEE');
        }
      }
      else{  //USD , VND , CAD ..
        this.adminFee = this.store.getItem('ADMIN_FEE');
      }
 
   
   }

  //selection change
  selectCurrencyCode(flag : string){
    // Find the matching currency code in the first array of objects
       const index = this.currencyCode.findIndex((item:any) => item.FLAG == flag);
       this.selectedCurrencyCode = this.currencyCode[index].CURRENCYCODE
       console.log(index);
       console.log(this.selectedCurrencyCode);
       if(this.exchangeRate.rates != null){
        var testObj : any[] = this.exchangeRate.rates?.filter(v => v.CCYCODE == this.selectedCurrencyCode) ;
        if(testObj.length == 0){
         this.ExchangeRate = "Exchange Rate is not available, Please contact APT"
        }
        else{
         this.ExchangeRate = testObj[0].EXCHRATE ;
        }
       }
       else{
        this.ExchangeRate = "Exchange Rate is not available, Please contact APT"
       }
       //admin fee ..
       this.isDisableSharingTypeRadioGroup = false ; //enabling sharing type radio buttons .
       //disabling sharing type radio button groups when payee gets currency code is "MYR" or "IDR" or "THB" and removing selection .
       if(this.selectedCurrencyCode != ""){
        let foreignCurrency : string = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ;
      let isCheckDealForeignCurrency : boolean = this.dealForeignCurrency.includes(foreignCurrency) ;
       if(isCheckDealForeignCurrency == true){ //MYR , IDR or THB
         this.isDisableSharingTypeRadioGroup = true ;
         this.selectedSharingType = "" ;
         this.form.patchValue({"sharingType" : "2"}) ;
         let sharingType = "orgOurs" ;
          this.adminFee = this.comissionArray[this.selectedCurrencyCode].individual[sharingType];
       }
       else{
        let sharingTypeFormControlValue = this.form.controls['sharingType'].value ? this.form.controls['sharingType'].value : "" ;
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
          this.form.patchValue({
            sharingType  : "1"
          });
        }
         this.adminFee = this.comissionArray[this.selectedCurrencyCode].individual[sharingType];
       }
      }
         this.store.setItem('ADMIN_FEE',this.adminFee);
         this.countryCode = this.selectedCurrencyCode ;
         this.form.patchValue({
          remitMoney: "0.00",
          recipientGets : "0.00"
         })
         this.form.controls['remitMoney'].clearValidators();
         this.form.controls['remitMoney'].updateValueAndValidity();  
         this.form.controls['recipientGets'].clearValidators();
         this.form.controls['recipientGets'].updateValueAndValidity();  
  // this.selectedCurrencyCode = getccyCode;
   this.store.setItem('PAYEEGETS_CURRENCY_CODE',this.selectedCurrencyCode);
   
  }

 

  //change event fires in recipient gets text field
  validateRecipientGets(e:any){
    let left = e.replace(/,/g, '');
    let ert = this.ExchangeRate
    this.result = (left / ert).toFixed(2);
    console.log(this.result);
    console.log("F") ;
    this.amountEnteredIndicator = "F" ;
    if(this.form.controls['recipientGets'].value != ''){
      this.form.controls['remitMoney'].clearValidators();
    this.form.controls['remitMoney'].updateValueAndValidity();  
    if(this.ExchangeRate == "" || this.ExchangeRate == undefined || this.ExchangeRate == "Exchange Rate is not available, Please contact APT"){
      this.form.controls['recipientGets'].setValidators(Validators.compose([Validators.required]));
    }
    else
    {
      let baseCcyAmt = this.formatValue(parseFloat(this.result)) // to change format number append comma using localstring.
      this.form.patchValue({
        remitMoney : baseCcyAmt 
      })
  }

  let localAgentforeignCurrency : string = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ;
  let isCheckDealForeignCurrency : boolean = this.fluctuateAdminFeeArray.includes(localAgentforeignCurrency) ;
  if(isCheckDealForeignCurrency == true){  //MYR 
    if(this.result >= 3000){
      this.adminFee = 0;
     }  
     else{
      this.adminFee = this.store.getItem('ADMIN_FEE') ;
    }
  }  
  else { //DBS Supported currencies ..
    this.adminFee = this.store.getItem('ADMIN_FEE') ;
  }              
  } 
  else{
    this.form.patchValue({
      remitMoney : "" 
    })
  }
}
 //change event fires in customer sends text field
validateCustomerSends(e:any){
  this.result = e.replace(/,/g, '');
  console.log(this.result);
  console.log("L") ;
  this.amountEnteredIndicator = "L" ;
  if(this.form.controls['remitMoney'].value != ''){
    //if no exchange rate for this payee country
    if(this.ExchangeRate == "" || this.ExchangeRate == undefined || this.ExchangeRate == "Exchange Rate is not available, Please contact APT"){
      this.form.controls['recipientGets'].setValidators(Validators.compose([Validators.required]));
    }
    else
    {
    let fcyViewAmt = this.formatValue(parseFloat((this.result * this.ExchangeRate).toFixed(2)))
    this.form.patchValue({
      recipientGets : fcyViewAmt
    })  
    this.form.controls['recipientGets'].clearValidators();
    this.form.controls['recipientGets'].updateValueAndValidity();  
    } 

    let localAgentforeignCurrency : string = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ;
    let isCheckDealForeignCurrency : boolean = this.fluctuateAdminFeeArray.includes(localAgentforeignCurrency) ;
    if(isCheckDealForeignCurrency == true){  //MYR 
      if(this.result >= 3000){
        this.adminFee = 0;
       }  
       else{
        this.adminFee = this.store.getItem('ADMIN_FEE') ;
      }
    }  
    else { //DBS Supported currencies ..
      this.adminFee = this.store.getItem('ADMIN_FEE') ;
    }   
} 
else{
  this.form.patchValue({
    recipientGets : "" 
  }) 
}

 }  


//view payee
  viewPayee(){
    let customerId = this.store.getItem('CUSTOMER_ID');
    let payeeId = this.store.getItem('PAYEEID')
      this.payeeService.viewPayee(customerId,payeeId).subscribe((datas:any)=>{
        this.payeeSearch = datas['data'];
        this.router.navigate([`payee/add-payee/${customerId}/${payeeId}`])
      },
      
       //error handling completed - 30/06/2023
    (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogComponent) ;
      }
     })
  }

  //onSubmit POST API => ADD TRANSACTION API FIRES
  onSubmit(){
    this.loader = true;
    this.saveButton = false;
     //checking whether user entered amount in LCY field or FCY field ..
     if(this.amountEnteredIndicator != ""){
      this.store.setItem('CONSUMERMOBILE_AMOUNT_ENTERED_INDICATOR', this.amountEnteredIndicator) ;
       }
    if(this.ExchangeRate == undefined || this.ExchangeRate == "" || this.ExchangeRate == "Exchange Rate is not available, Please contact APT"){
      this.snackBar.open("Exchange Rate is not available, Please contact APT" , "Ok",{
        panelClass : 'orange-notification-snackbar'
      });
  }
  if(this.ExchangeRate != "Exchange Rate is not available, Please contact APT"){
    if(this.form.controls['remitMoney'].value == 0 || this.form.controls['recipientGets'].value == 0){
      this.snackBar.open("Amount should not be empty, Try again !" , "Ok",{
        panelClass : 'orange-notification-snackbar'
      });
    }
    else{
      //CUSTOMER INQUIRY API CALL - To Retrieve Customer Details for showing Transfer Receipt .
        let customerId =  this.store.getItem('CUSTOMER_ID');
        this.customerSearchService.getCustomerInquiry(customerId).subscribe((data:any) => {
          this.customerInquiry = data;
          let obj = JSON.stringify(data)
          this.store.setItem('CUSTOMER_INQUIRY_ARRAY',obj) ;
          this.store.setItem('ADMIN_FEE',this.adminFee);
          //just removing commas seperators from payee gets amount value and storing in STORE(IN MEMORY CACHE) .
          let receivingValue : any = this.form.controls['recipientGets'].value ;
          let payeeGets = receivingValue.replace(/,/g, '');
          this.store.setItem('RECIPIENT_GETS', payeeGets ) ;

          if(this.form.controls['Remarks'].value == "OTHERS"){
            this.remarks = this.form.controls['Others'].value ? this.form.controls['Others'].value : "Purpose Of Remittance not provided";
           }
           else if(this.form.controls['Remarks'].value != "OTHERS"){
            this.remarks = this.form.controls['Remarks'].value ? this.form.controls['Remarks'].value : "" ;
           }

          this.router.navigate(['payee/customer-review'],{queryParams:{ 'Remarks': this.remarks , 'ExchRate': this.ExchangeRate,'payeeCountryCode':this.selectedCurrencyCode,'sharingType':this.form.controls['sharingType'].value}});
         // this.router.navigate(['payee/money-receipt'],{queryParams:{'Send_Money':this.form.controls['remitMoney'].value}})
          this.store.setItem('CUSTOMER_SEND',this.result);
        },
         //error handling completed in 30-06-2023
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogComponent) ;
    }
  }
        
        ) ;
       
    
    }
  }
   
      this.loader = false;
      this.saveButton = true;
      //this.store.setItem('REFERENCE_NUMBER',data.transactionId);
    
   
  }

  changePurposeOfRemittance(purposeOfRemittance:string){
    console.log(purposeOfRemittance) ;
    if(purposeOfRemittance == "OTHERS"){
      this.showOthersField = true ;
     }
     else{
      this.showOthersField = false ;
     }
  }

  
}


