import { Component, ElementRef, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { round } from 'lodash';
import { PayeeSearch } from 'src/app/backoffice/customer/model/customer.model';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';

import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { NewDealService } from 'src/app/core/services/new-deal.service';
import { PayeeComponent } from 'src/app/payee/payee-table/payee.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { DataService } from 'src/app/shared/services/data.service';

import { AgentServiceService } from '../agent-service.service';

import { CommissionService } from 'src/app/core/services/commission.service';
import { roleIdDetails } from 'src/assets/userrole';
import { getContractBgcolor, getContractColor, getContractTooltiptext } from 'src/assets/transactionstatus';
import {  dbsSupportCurrency } from 'src/assets/dropdownvalues';
import { UserConfirmationDialogComponent } from '../modals/user-confirmation-dialog/user-confirmation-dialog.component';


@Component({
  selector: 'app-agent-sendmoney',
  templateUrl: './agent-sendmoney.component.html',
  styleUrls: ['./agent-sendmoney.component.scss','../../../assets/styles/tables/table-style.scss']
})
export class AgentSendmoneyComponent implements OnInit{

  
  public form: FormGroup = Object.create(null);
  payee: PayeeSearch[]=[];
  getContracts: any[] = []; 
  dealIdArray : any[] = [];
  totalAmount : any = 0;
  indexToEdit!: number ;
  payeeName!: string;
  payeeCountry!: string;
  payeeBankName!: string;
  swiftCode!: string;
  routingCode : string = "" ;
  payeeAccNo!: string;
  showDetails: Boolean = false;
  payeeId !: string
  updatedAmount : any;
  checkBoxArray : any[] =[];
  exchangeRateArray : number[] = [];
  dealBalance : any = 0;
  baseAmountEntered : any;
  fcyAmt : any;
  payeeamount : any ;
  showSubmitButton: Boolean = true;
  loader : Boolean = false;
  launchButton : Boolean = true;
  submitButtonLoader : Boolean = false; 
  @ViewChildren('checkboxes') private checkboxes !:QueryList <MatCheckbox>;
  buyCurrencyCode !: string ;
  matspinner : Boolean = false;
  fcyArray : any[] = [];
  fcyTotalAmount : any = 0;
  customerType !: string;
  isDisable : boolean = true;
  isCheckBoxDisable : boolean = true;
  @ViewChildren('amount') amount!: QueryList<any>;
  ccyPair !: string ;
  isdisableSubmit : boolean = true
  payeeFcyAmount !: number;
  fcyTotal !: number;
  contractBalance !: number
  enterFcyAmount !: number
  fcyamountEmpty !: string
  previousbalance !: boolean ;
  isDisableFields : Boolean = false;
  selectedPayee : any;
  remitRecieptArray : any[]=[]
  adminFee : any = 0;
  payeeCountryCode !: string ;
  selectedCountryCode: any;
  comissionArray : any;
  sharingTypeArray : any[] = [
    {"value" : "SHA" , "subValue":"Only Bank Charges to be paid by me", "internalValue" : "1"} ,
    {"value" : "OUR" ,"subValue":"All Charges to be paid by me", "internalValue" : "2"} ,
    {"value" : "BEN" ,"subValue":"All Charges to be paid by beneficiary", "internalValue" : "3"} ,

  ];
  isDisableSharingTypeRadioGroup = false ;
  countryCode: any[] = dbsSupportCurrency;
  selectedCurrency !: string ;
  selectedCurrencyCode !: string;
  p: number = 1;
  itemsPerPage: number = 20;
  showAgentRelatedFields : Boolean = true ;
  

  constructor(private headerService : TitleHeaderService, private fb : FormBuilder, private dialogRef: MatDialog, private store: InMemoryCache,
    private agentService:AgentServiceService,private dealService : NewDealService,private _snackBar: MatSnackBar,
    private router : Router,private dataService: DataService,private commissionService: CommissionService) { }
 
    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }
    
  ngOnInit(): void {
    this.headerService.setTitle('Send Money');
    this.form = this.fb.group({
      //building form and validations
      name : [null, [Validators.compose([Validators.required]),Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')]],
      sendCurrencyCode :  [null, Validators.compose([Validators.required])],
     // sendAmount :  [null, [Validators.compose([Validators.required])]],
      balanceAmount : [null, Validators.compose([Validators.required])],
      Note :[null],
      exchangeRate : [null],
      mycontrol : [null],
      baseCurrencyAmount : [null],
      originatedRemitter : [null,[Validators.compose([Validators.pattern('^[a-zA-Z0-9 ]*$')])]],
      purposeOfRemittance : [null],
      sharingType : [null,[Validators.compose([Validators.required])]] 
    })
   this.form.disable();
   this.form.controls['name'].enable();
   this.form.controls['Note'].enable();
   this.form.controls['originatedRemitter'].enable();
   this.form.controls['purposeOfRemittance'].enable();
   this.form.controls['sharingType'].enable();
   let appStatus : string = this.store.getItem('APPLICATIONSTATUS');
   let userRole : string = this.store.getItem('USER_ROLE');

   if((userRole ==  roleIdDetails.CORPORATE_OWNER || userRole ==  roleIdDetails.CORPORATE_RUNNER || userRole ==  roleIdDetails.CORPORATE_DEALER )){
    this.showAgentRelatedFields = false ;
    if((appStatus == "NEW" || appStatus == "PENDING") ){
      this.isDisableFields = true ;
      this.form.controls['name'].disable();
      this.form.controls['Note'].disable();
     }
     else{
      this.isDisableFields = false ;
     }
   }
   if(userRole == roleIdDetails.AGENT){
    this.isDisableFields = false ;
    this.showAgentRelatedFields = true ;
   }


   //get commission charges api
   this.commissionService.getCommission().subscribe((datas:any)=>{
    this.comissionArray = datas['data'];
  })


  }

  

  onSubmit(){
    const role = this.store.getItem('USER_ROLE');
    this.submitButtonLoader = true;
    this.showSubmitButton = false;

    setTimeout(() => {
    
    if (role  === roleIdDetails.AGENT) {
      this.customerType = "A"; //for agent send-money
   }
   if (role  === roleIdDetails.CORPORATE_OWNER || role  === roleIdDetails.CORPORATE_RUNNER || role  === roleIdDetails.CORPORATE_DEALER) {
       this.customerType = "C"; //for corporate send-money
   }
   let remitrate = this.exchangeRateArray;
   this.store.setItem('SELECTED_CURRENCY',this.selectedCurrency) ;
   this.store.setItem('SELECTED_PAYEEID',this.payeeId) ;
   this.store.setItem('REMARKS',this.form.controls['Note'].value ? this.form.controls['Note'].value : "Remarks not provided") ;
   this.store.setItem('TOTALAMOUNT_FOREIGNCCY',this.fcyTotalAmount) ;
   this.dataService.contractArray = [] ;
   this.dataService.contractArray = this.dealIdArray ; //sending the contract array over service function
   let contractArray = JSON.stringify(this.dealIdArray);
   this.store.setItem('CONTRACT_ARRAY',contractArray);
   let remitArray = JSON.stringify(this.remitRecieptArray);
   this.store.setItem("REMIT_RECIPT_ARRAY",remitArray);
   let originatedRemitter = this.form.controls['originatedRemitter'].value ? this.form.controls['originatedRemitter'].value : "No Originated Remitter" ;
   this.store.setItem('ORIGINATED_REMITTER',originatedRemitter) ;
   let purposeOfRemittance = this.form.controls['purposeOfRemittance'].value ? this.form.controls['purposeOfRemittance'].value : "" ;
   this.store.setItem('AGENT_TT_PURPOSE_OF_REMITTANCE',purposeOfRemittance) ;
   this.store.setItem('AGENT_SHARINGTYPE', this.form.controls['sharingType'].value) ;
   this.router.navigate(['shared/review']) ;
   this.submitButtonLoader = false;
   this.showSubmitButton = true;
  

}, 200);
    }
 
    sharingTypeChange(event:any){
      console.log(event) ; 
      console.log("sharing type changes :" , this.form.controls['sharingType'].value) ;
      let foreignCurrencyCode : string = this.selectedCurrencyCode ? this.selectedCurrencyCode : "" ; 
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

    if(this.showAgentRelatedFields == true){ //Its agent
      this.adminFee = this.comissionArray[this.selectedCurrencyCode].agent[sharingType];
    }
    else if(this.showAgentRelatedFields == false){ //Its corporate
      this.adminFee = this.comissionArray[this.selectedCurrencyCode].corporate[sharingType];
    }
   
      this.store.setItem('ADMIN_FEE',this.adminFee);
   
     
     }


//on clicking Launch Button > opens Payee Table Component on Modal popup
  openPayeeTable(){
    this.launchButton = false
    this.loader = true;
    let status =  '1';
    this.agentService.getPayeeListings(status).subscribe((datas:any) => {
      this.payee = datas['data'];
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
          this.form.controls['balanceAmount'].disable();
          this.form.controls['sendCurrencyCode'].disable();      //Dheepan changes >> disable the payee gets
          this.payee =  this.store.getItem('PAYEESEARCH_DETAILS');
          console.log(this.payee);
          this.isCheckBoxDisable = true ;
          this.dealIdArray = [];
          this.remitRecieptArray = [];
          this.checkBoxArray = [];
          this.fcyArray = [] ;
          this.dealBalance = 0;
          this.totalAmount = 0;
          this.fcyTotalAmount = 0;
         this.amount.forEach(input => input.nativeElement.value = ''); //clearing the entered foreign ccy amount
         this.checkboxes.forEach(element => element.checked = false); //clearing the checkBoxes
         this.form.patchValue({
          sendCurrencyCode : "",
          balanceAmount : "",
          name : "",
         
         })

        }
        if(result == undefined){
          this.matspinner = false;
        }
        if(result.payeeData.length == 1){  //This if block executes when we recieve the payee object from payee list dialog box
          this.form.controls['balanceAmount'].enable();     //Dheepan changes >> disable the payee gets
          this.form.controls['sendCurrencyCode'].enable();
         this.selectedPayee = JSON.stringify(result);
         this.store.setItem("SELECTED_PAYEE",this.selectedPayee)
          //this.matspinner = true;
          this.store.setItem('PAYEESEARCH_DETAILS', result.data);
          this.payeeId = result.payeeId;
          this.payee = result.payeeData;
          this.payeeName = result.payee_name;
          this.payeeCountry = result.payee_country;
          console.log(this.payeeCountry);
          this.payeeBankName = result.payee_BankName;
          this.swiftCode = result.Payee_SwiftCode ? result.Payee_SwiftCode : "" ;
          this.routingCode = result.Payee_RoutingCode ? result.Payee_RoutingCode : "" ,
          this.payeeAccNo = result.payee_accountNo;
          this.showDetails = true;
          this.showDetails = result.Payee_show;
          this.form.patchValue({
            name:this.payeeName
          })
          this.isCheckBoxDisable = true ;
          this.dealIdArray = [];
          this.remitRecieptArray = [];
          this.checkBoxArray = [];
          this.fcyArray = [] ;
          this.dealBalance = 0;
          this.totalAmount = 0;
          this.fcyTotalAmount = 0;
         this.amount.forEach(input => input.nativeElement.value = ''); //clearing the entered foreign ccy amount
         this.checkboxes.forEach(element => element.checked = false); //clearing the checkBoxes
         this.form.patchValue({
          sendCurrencyCode : "",
          balanceAmount : "",
         })
         
        }
      

      })
     })

    
  }
  selectCurrencyCode(flag : string){
    // Find the matching currency code in the first array of objects
       const index = this.countryCode.findIndex(item => item.FLAG == flag);
       this.selectedCurrencyCode = this.countryCode[index].CURRENCYCODE ;
       console.log(index);
       console.log(this.selectedCurrencyCode);
  // this.selectedCurrencyCode = getccyCode;
   this.store.setItem('PAYEEGETS_CURRENCY_CODE',this.selectedCurrencyCode);
   
  }

  retrieveContracts(ccyCode:string){

  if(this.getContracts.length >= 1){ // if already is there any contracts in below table , execute this if
    this.dialogRef.open(UserConfirmationDialogComponent,{
      data : {agentRetrieveContractReview : true},
      width : '560px'
    }).afterClosed().subscribe((response:any)=>{
      if(response && response.action == "OK"){ //User is to retrieve contracts...
        let obj = this.countryCode.filter(v => v.FLAG == ccyCode);
        let currencyCode : string =  obj[0]['CURRENCYCODE'] ;
        this.selectedCurrency = currencyCode ;
        this.ccyPair = currencyCode + "SGD" ;
        console.log(this.ccyPair);
        this.form.patchValue({
          "sharingType" : ""
        });
      
        this.isdisableSubmit = true ;
        this.amount.forEach(input => input.nativeElement.value = ''); //clearing the entered foreign ccy amount
        this.checkboxes.forEach(element => element.checked = false); //clearing the checkBoxes
      //! resetting the Stored values;
        this.dealIdArray = [];
        this.remitRecieptArray = [];
        this.checkBoxArray = [];
        this.fcyArray = [] ;
        this.dealBalance = 0;
        console.log("Total Amount: " + this.totalAmount + "," + "DealIdArray: " + this.dealIdArray);
        console.log("deduction Amount : " + this.dealBalance + "," + "Check Box Array " + this.checkBoxArray);
        this.totalAmount = 0;
        this.fcyTotalAmount = 0;
        this.form.patchValue({
          balanceAmount : "",
        })
        this.getContracts = [];
        this.adminFee = 0 ;
        this.matspinner = true ;
        setTimeout(() => {
         
            let entityId : any = this.store.getItem('USER_ID');
            this.ccyPair ; //for agent and corporate - we are not sending ccypair to req params
          this.agentService.getContractForeignExchangeContracts(entityId,this.ccyPair).subscribe((data:any)=>{
            this.matspinner = false;
            this.getContracts = data['contracts'] ;
            this.getContracts = data['contracts'].filter((v:any) => v.status == "ACTIVE" || v.status == "ENDS TODAY" || v.status == "EXPIRED"); //OPEN CHANGED TO ACTIVE
            this.getContracts = this.getContracts.map(contract => {
              return {
                ...contract,
                sellRate: 1 / parseFloat(contract.rate)
              };
            });
      
            this.getContracts = this.getContracts.map(data => {
              const [buyCurrencyCode, sellCurrencyCode] = data.ccyPair.match(/.{1,3}/g); // split ccyPair into two 3-letter codes
              return {
                ...data, // spread existing properties
                buyCurrency: buyCurrencyCode, // add new property
                sellCurrency: sellCurrencyCode // add new property
              };
            });
          },
          error =>{
            console.log(error);
            let errorMessage ;
            if(error == ""){
               errorMessage = "" ;
            }
            this.matspinner = false;
            this.dialogRef.open(ErrorDialogAdminComponent,{
              data: errorMessage
            })
          }
          )
          
               
               // this.matspinner = false;
             //  }) 
            }, 500);
      }
      else if(response && response.action == "NO"){ //No need to retrieve contracts...
       console.log("DO NOTHING..") ;
      }
    })
  }

  else{

  let obj = this.countryCode.filter(v => v.FLAG == ccyCode);
  let currencyCode : string =  obj[0]['CURRENCYCODE'] ;
  this.selectedCurrency = currencyCode ;
  this.ccyPair = currencyCode + "SGD" ;
  console.log(this.ccyPair);
  this.form.patchValue({
    "sharingType" : ""
  });

  this.isdisableSubmit = true ;
  this.amount.forEach(input => input.nativeElement.value = ''); //clearing the entered foreign ccy amount
  this.checkboxes.forEach(element => element.checked = false); //clearing the checkBoxes
//! resetting the Stored values;
  this.dealIdArray = [];
  this.remitRecieptArray = [];
  this.checkBoxArray = [];
  this.fcyArray = [] ;
  this.dealBalance = 0;
  console.log("Total Amount: " + this.totalAmount + "," + "DealIdArray: " + this.dealIdArray);
  console.log("deduction Amount : " + this.dealBalance + "," + "Check Box Array " + this.checkBoxArray);
  this.totalAmount = 0;
  this.fcyTotalAmount = 0;
  this.form.patchValue({
    balanceAmount : "",
  })
  this.getContracts = [];
  this.adminFee = 0 ;
  this.matspinner = true ;
  setTimeout(() => {
   
      let entityId : any = this.store.getItem('USER_ID');
      this.ccyPair ; //for agent and corporate - we are not sending ccypair to req params
    this.agentService.getContractForeignExchangeContracts(entityId,this.ccyPair).subscribe((data:any)=>{
      this.matspinner = false;
      this.getContracts = data['contracts'] ;
      this.getContracts = data['contracts'].filter((v:any) => v.status == "ACTIVE" || v.status == "ENDS TODAY" || v.status == "EXPIRED"); //OPEN CHANGED TO ACTIVE
      this.getContracts = this.getContracts.map(contract => {
        return {
          ...contract,
          sellRate: 1 / parseFloat(contract.rate)
        };
      });

      this.getContracts = this.getContracts.map(data => {
        const [buyCurrencyCode, sellCurrencyCode] = data.ccyPair.match(/.{1,3}/g); // split ccyPair into two 3-letter codes
        return {
          ...data, // spread existing properties
          buyCurrency: buyCurrencyCode, // add new property
          sellCurrency: sellCurrencyCode // add new property
        };
      });
    },
    error =>{
      console.log(error);
      let errorMessage ;
      if(error == ""){
         errorMessage = "" ;
      }
      this.matspinner = false;
      this.dialogRef.open(ErrorDialogAdminComponent,{
        data: errorMessage
      })
    }
    )
    
         
         // this.matspinner = false;
       //  }) 
      }, 500);

    }

  }


  payeeGets(amount:any,e:any){
    //if entered value is number character
  //  if(e.keyCode >= 48 && e.keyCode <= 57 && e.key !== '-'){
    this.isdisableSubmit = true
    amount = amount.replace(/,/g, '') ;    
    if(amount != "" || amount >= 1){
    this.isCheckBoxDisable = false ;
    this.payeeFcyAmount =  parseFloat(amount);
    this.form.patchValue({
      balanceAmount : ""
     })
    if(this.checkBoxArray.length >=1){ //if user enter some value in payee gets field when check box is enabled , this will execeute
      this.isCheckBoxDisable = false ;
      this.dealIdArray = [];
      this.remitRecieptArray =[];
      this.checkBoxArray = [];
      this.fcyArray = [] ;
      this.dealBalance = 0;
      this.totalAmount = 0;
      this.fcyTotalAmount = 0;
     this.amount.forEach(input => input.nativeElement.value = ''); //clearing the entered foreign ccy amount
     this.checkboxes.forEach(element => element.checked = false); //clearing the checkBoxes
   
  }
}
if(amount == ""){
  if(this.checkBoxArray.length >=1){
    this.isCheckBoxDisable = false ;
    this.dealIdArray = [];
    this.remitRecieptArray =[];
    this.checkBoxArray = [];
    this.fcyArray = [] ;
    this.dealBalance = 0;
    this.totalAmount = 0;
    this.fcyTotalAmount = 0;
   this.amount.forEach(input => input.nativeElement.value = ''); //clearing the entered foreign ccy amount
   this.checkboxes.forEach(element => element.checked = false); //clearing the checkBoxes
}
this.isCheckBoxDisable = true ;
}
//}
// else{
//   this.isCheckBoxDisable = true ;
// }
  }
 //amount.value,Data.contractId,Data.sellRate,Data.txnAmount,$event,Data.bookingId,Data.rate
  onKeyUpInput(enteredFcyAmt:any,dealId:any,exchangeRate:any,txnAmount:string,e:any,bookingId :string,buyRate:any){
    enteredFcyAmt = parseFloat(enteredFcyAmt.replace(/,/g, '')) ? parseFloat(enteredFcyAmt.replace(/,/g, '')) : "" ;
    if(enteredFcyAmt >= 1){ //Entered amount should be greated than 1$

    if(enteredFcyAmt != ""){
    this.payeeamount = this.form.controls['sendCurrencyCode'].value
  this.fcyAmt = enteredFcyAmt;
  this.contractBalance = parseFloat(txnAmount) ;
  this.enterFcyAmount = parseFloat(enteredFcyAmt) ;
  if(enteredFcyAmt){  //checking entered foreing currency amount
    const factor = Math.pow(10, 2);
    let baseCcyAmount =  Math.trunc((enteredFcyAmt * buyRate) * factor) / factor;
    if(this.checkBoxArray.length != 0){
    this.remitRecieptArray.find(v => v.bookingId == bookingId).amount = baseCcyAmount;
    this.dealIdArray.find(v => v.id == dealId).amount = baseCcyAmount;
    this.dealIdArray.find(v => v.id == dealId).amountF = enteredFcyAmt;
    console.log(this.dealIdArray);
    
    // if(baseCcyAmount > dealBalance){ 
    //   this._snackBar.open("Entered amount is greater than deal balance !", "Ok", {
    //     panelClass: "red-notification-snackbar",
    //     duration : 4000   
    //   });
    // }
    this.fcyArray.find(a => a.id == dealId).fcyAmount = this.fcyAmt;
    console.log("FcyArray = " + this.fcyArray);
    }
    
    //displaying the total value by adding the amount in dealIdArray one by one 
    let sum = this.dealIdArray.map(v => parseFloat(v.amount)).reduce((a, b) => { return a + b });
    console.log(sum);
    this.totalAmount = sum ;
    let fcySum = this.fcyArray.map(val => parseFloat(val.fcyAmount)).reduce((c, d) => { return c + d });
    console.log("Total Amount in USD: "+fcySum);
    this.fcyTotalAmount = round(fcySum,2);
    // if(this.checkBoxArray.length >=1 && this.fcyTotalAmount == this.payeeamount && this.enterFcyAmount <= this.contractBalance){
    //   console.log("We can enable the button");
    //   this.isDisable = false ;
    // }
    // else{
    //   console.log("Disabled Submit Button");
    //   this.isDisable = true ;
    // }
    if(this.enterFcyAmount > this.contractBalance){
      this.previousbalance = true ;
    }
    if(this.enterFcyAmount <= this.contractBalance){
      this.previousbalance = false ;
    }
  
   if(this.checkBoxArray.length <=2 && this.fcyTotalAmount == this.payeeFcyAmount && this.enterFcyAmount<= this.contractBalance && this.fcyTotalAmount != 0){
   this.isdisableSubmit = false

       if(this.previousbalance == true)
       {
           this.isdisableSubmit = true
       }
   }
   else{
    this.isdisableSubmit = true
   }
   
  }
  
}
//when User clicks backspace
   if(e.keyCode == 8){
    //! if the admin clear all the value in field means to avoid getting wrong Total Amount value
    if(enteredFcyAmt == "" || this.fcyAmt == "" ){
    enteredFcyAmt ='0';
    this.fcyAmt = '0';
    this.remitRecieptArray.find(v => v.bookingId == bookingId).amount = enteredFcyAmt;
    this.dealIdArray.find(v => v.id == dealId).amount = enteredFcyAmt; //this block executes when cleared/backspace entire value , we push amount as "0" in which we are storing it in enteredFcyAmt variable
    this.dealIdArray.find(v => v.id == dealId).amountF = enteredFcyAmt;
    let sum = this.dealIdArray.map(v => parseFloat(v.amount)).reduce((a, b) => { return a + b });
    console.log(sum);
    this.totalAmount = sum ;

    this.fcyArray.find(val => val.id == dealId).fcyAmount = this.fcyAmt;
    let fcySum = this.fcyArray.map(val => parseFloat(val.fcyAmount)).reduce((c, d ) => { return c + d });
    console.log("total Amount USD : " + fcySum);
    this.fcyTotalAmount = round(fcySum,2);
    if(this.fcyTotalAmount == 0){
      this.isdisableSubmit = true;
   }
    }
    else{
      this.isdisableSubmit = true
      let clearFcyAmt = parseFloat(enteredFcyAmt) 
      const factor = Math.pow(10, 2);
      let baseCcyAmount =  Math.trunc((enteredFcyAmt * buyRate) * factor) / factor;
      this.fcyAmt = enteredFcyAmt;
      this.remitRecieptArray.find(v => v.bookingId == bookingId).amount = baseCcyAmount;
      this.dealIdArray.find(v => v.id == dealId).amount = baseCcyAmount;
      this.dealIdArray.find(v => v.id == dealId).amountF = clearFcyAmt;
      let sum = this.dealIdArray.map(v => parseFloat(v.amount)).reduce((a, b) => { return a + b });
      console.log(this.dealIdArray) ;
      this.totalAmount = sum ;
      console.log("SGD TOTAL AMOUNT = " + this.totalAmount);
  
      this.fcyArray.find(val => val.id == dealId).fcyAmount = this.fcyAmt;
      let fcySum = this.fcyArray.map(val => parseFloat(val.fcyAmount)).reduce((c, d ) => { return c + d });
      this.fcyTotalAmount = round(fcySum,2);  
      console.log("USD TOTAL AMOUNT = " + this.fcyTotalAmount);
      if(this.fcyTotalAmount == this.payeeFcyAmount && clearFcyAmt<= this.contractBalance && this.fcyTotalAmount != 0){
     this.isdisableSubmit = false
      }
    }
  }
}
else {  // else amount entered is lesser than 1$
  this.isdisableSubmit = true ;
  if(enteredFcyAmt == "" || this.fcyAmt == "" ){
    enteredFcyAmt ='0';
    this.fcyAmt = '0';
    this.remitRecieptArray.find(v => v.bookingId == bookingId).amount = enteredFcyAmt;
    this.dealIdArray.find(v => v.id == dealId).amount = enteredFcyAmt; //this block executes when cleared/backspace entire value , we push amount as "0" in which we are storing it in enteredFcyAmt variable
    this.dealIdArray.find(v => v.id == dealId).amountF = enteredFcyAmt;
    let sum = this.dealIdArray.map(v => parseFloat(v.amount)).reduce((a, b) => { return a + b });
    console.log(sum);
    this.totalAmount = sum ;

    this.fcyArray.find(val => val.id == dealId).fcyAmount = this.fcyAmt;
    let fcySum = this.fcyArray.map(val => parseFloat(val.fcyAmount)).reduce((c, d ) => { return c + d });
    console.log("total Amount USD : " + fcySum);
    this.fcyTotalAmount = round(fcySum,2);
    if(this.fcyTotalAmount == 0){
      this.isdisableSubmit = true;
   }
    }
}
  
}
  //checkbox selection in deal table
  selectedCheckBox(e:any,id:string,amount:any,txnAmount:any,exchangeRate:number,contractBalance:any,bookingId:any,buyRate:any, buyCurrency:string){
    this.payeeamount = this.form.controls['sendCurrencyCode'].value
    let fcyAmount = amount ;
    let amountF = amount
    const factor = Math.pow(10, 2);
    amount = Math.trunc((amount * buyRate) * factor) / factor;
   if(e.checked == true){
    this.isdisableSubmit = true
    this.checkBoxArray.push(e.checked); 
    this.exchangeRateArray.push(exchangeRate);

    //Dheepan code changes for deal balance calculation
    let dealbalance = contractBalance ;
    this.dealBalance = this.dealBalance + parseFloat(dealbalance);
    this.form.patchValue({
      balanceAmount : this.dealBalance.toFixed(2) 
     })
     //Dheepan code changes for deal balance calculation

    //! Getting NaN while Adding 
    if(amount == '' || fcyAmount == '' || amountF == ''){
      amount = '0';
      fcyAmount = '0';
      amountF = '0'
    }
    this.remitRecieptArray.push({bookingId,amount,exchangeRate})
    this.dealIdArray.push({id,amount,amountF});
    this.fcyArray.push({id,fcyAmount, buyCurrency}); // {id: 'egsg1iijj', fcyAmount: "100", buyCurrency: "JPY"}
    //setting the value of empty string into 0 to avoid getting NaN value 
    if(amount == "" || fcyAmount == "" || amountF == ""){
      amount = 0;
      fcyAmount = 0;
      amountF = 0;
    }
    if(this.checkBoxArray.length >=1 && fcyAmount == "0"){
     console.log("enter the amount for selected check box");
     this.isDisable = true ;
    }
   
     //To disable sumbit button when agent/corporate select 3 or more checkboxes
     if(this.checkBoxArray.length >= 3){
      this._snackBar.open("maximum selection of two deals is allowed", "Ok", {
        duration: 3000,
        panelClass: "red-notification-snackbar"
      });
      this.isdisableSubmit = true;
  }
  
  
    this.totalAmount = Number(this.totalAmount) + parseFloat(amount);
    this.totalAmount = this.totalAmount ;

    this.fcyTotalAmount = Number(this.fcyTotalAmount) + parseFloat(fcyAmount);
    this.fcyTotalAmount = this.fcyTotalAmount.toFixed(2);
   }
   if(e.checked == false){
    this.previousbalance = false;
    this.isdisableSubmit = true;
    const contractIndex = this.remitRecieptArray.findIndex(object => {return object.bookingId === bookingId;});
    const index = this.dealIdArray.findIndex(object => {return object.id === id;});//Find the index of stored dealId
    const exchRateIndex = this.exchangeRateArray.indexOf(exchangeRate);
    this.dealIdArray.splice(index,1); // Then remove the dealId which is been unselected
    this.remitRecieptArray.splice(contractIndex,1);
    this.checkBoxArray.splice(index,1);
    this.exchangeRateArray.splice(exchRateIndex,1);
    if(this.checkBoxArray.length >=1 && fcyAmount == ""){
      console.log("you selected check box");
      this.isDisable = false;
     }
    //Finding the index of fcyArray and remove the unchecked array Object from the fcyArray
    const fcyIndex = this.fcyArray.findIndex(val => {return val.id === id;});
    this.fcyArray.splice(fcyIndex,1);
    //! Getting NaN while Adding 
    if(amount == '' || fcyAmount == ''){
      amount = '0';
      fcyAmount ='0';
      this.isdisableSubmit = true
    }
    // this.totalAmount = +Number(this.totalAmount).toFixed(2) - +parseFloat(amount);
    // this.totalAmount = this.totalAmount.toFixed(2);
    if(this.dealIdArray.length==0 || this.fcyArray.length == 0){
      this.totalAmount = 0;
      this.fcyTotalAmount = 0;
    }
    else{
      let sum = this.dealIdArray.map(v => parseFloat(v.amount)).reduce((a, b) => { return a + b });
      console.log(sum);
      this.totalAmount = sum ;
      let fcySum = this.fcyArray.map(v => parseFloat(v.fcyAmount)).reduce((c,d) =>{ return c + d});
      console.log('USD Total Amount: ' + fcySum);
      this.fcyTotalAmount = round(fcySum,2);
    }
    //this.payeeFcyAmount is payee gets amount
    if( this.checkBoxArray.length >=1 && this.fcyTotalAmount ==this.payeeFcyAmount  && this.enterFcyAmount<= this.contractBalance && this.fcyTotalAmount != 0){  // To statified the condition for enterFcyamount and contract balance in selected checkbox row 
      this.isdisableSubmit = false                                               
      
      }
  
     //Dheepan code changes for deal balance calculation
     let dealbalance = contractBalance ;
     this.dealBalance = this.dealBalance - parseFloat(dealbalance);
     this.form.patchValue({
       balanceAmount : this.dealBalance.toFixed(2)
      })
    console.log("amount in  SGD"+amount);
     //Dheepan code changes for deal balance calculation
    
   }
   console.log(this.exchangeRateArray);
  
   console.log(this.dealIdArray);
   console.log(this.checkBoxArray);
   console.log(this.fcyArray);
  }


resetForm(){
  this.isdisableSubmit = true
  this.amount.forEach(input => input.nativeElement.value = ''); //clearing the entered foreign ccy amount
  this.checkboxes.forEach(element => element.checked = false); //clearing the checkBoxes
//! resetting the Stored values;
  this.dealIdArray = [];
  this.remitRecieptArray = [];
  this.checkBoxArray = [];
  // this.totalAmount =  0;
  this.dealBalance = 0;
  console.log("Total Amount: " + this.totalAmount + "," + "DealIdArray: " + this.dealIdArray);
  console.log("deduction Amount : " + this.dealBalance + "," + "Check Box Array " + this.checkBoxArray);
  this.isCheckBoxDisable = true;
  this.form.reset();
 this.showDetails = false;
  this.payeeId = "";
  this.totalAmount = 0;
  this.payeeName = "";
  this.fcyTotalAmount = 0;
  this.form.controls['sendCurrencyCode'].disable();
  this.form.controls['balanceAmount'].disable();
  this.form.patchValue({
    sendCurrencyCode : "",
    balanceAmount : "",
  })
  this.selectedCountryCode = "";
  this.getContracts = [];
}

//STATUS color diff
getColor(status: any) :any {
 return getContractColor(status)
}
//bg color for status tags .
getBackgroundColor(status: string): string {
return getContractBgcolor(status)
  
}

 //tool tip text value based on txnstatus ..
 getTooltipText(status: string): string {
 return getContractTooltiptext(status);
}

//to remove commas from the input value 
removeCommas(value: string): number {
  return parseFloat(value.replace(/,/g, ''));
}

//this function used for cutting values -> 120.253 --> 120.25
// customRound(number:any, decimalPlaces:any) {
//   const factor = Math.pow(10, decimalPlaces);
//   return Math.floor(number * factor) / factor;
// }
//truncate values after decimal 2 digits , eg : 53734.808291 will become 53734.80
truncateDecimals(value: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.trunc(value * factor) / factor;
}
}