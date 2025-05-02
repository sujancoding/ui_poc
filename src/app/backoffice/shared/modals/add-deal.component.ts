import {  DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AddDeal, AgentList } from '../../dailysetup/model/deal';
import { dealFlowCurrency, dealHandledByArray, initiatedBy } from 'src/assets/dropdownvalues';
import { NewDealService } from 'src/app/core/services/new-deal.service';
import { DailyExchangeRateSetup } from '../../exchangerates/model/exchangerate.model';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { ErrorDialogAdminComponent } from './errordialogadmin/error-dialog-admin.component';


@Component({
  selector: 'app-add-deal',
  templateUrl: './add-deal.component.html',
  styleUrls: ['./add-deal.component.scss']
})
export class AddDealComponent implements OnInit {
  form: FormGroup = Object.create(null);
  SellAmount!: number;
  buyingAmount!: number;
  iterateAgentName : AgentList[]=[] ;
  disableSellAmount !: Boolean ;
  disableBuyAmount !: Boolean ;
  buyingAmountResult !: number;
  date:any= new Date();
  exchangeRate: DailyExchangeRateSetup[]=[];
  multiplyValue : any;
  remitMoney : any;
  ExchRate : any;
  handlerName :any[] = dealHandledByArray; // The values for the handled by dropdown is retrieved from the common file
  buyCountryCode = dealFlowCurrency;  
  initiatedByValues : string[] = initiatedBy;
  labelName !: string;

  constructor(public fb: FormBuilder,private dealService: NewDealService,private alertService: AlertService, @Inject(MAT_DIALOG_DATA) public data:any,private store: InMemoryCache,
    public dialogRef: MatDialogRef<AddDealComponent>,private datePipe: DatePipe,
     private dialog : MatDialog) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      agentname: [null, [Validators.compose([Validators.required])]],
      AccountNumber: [null, [Validators.compose([Validators.required, Validators.pattern('^[0-9 \-\']+')])]],
      InitiatedBy: [null, [Validators.compose([Validators.required,])]],
      Sell: [null, [Validators.compose([Validators.required])]],
      SellAmount : [null, [Validators.compose([Validators.required, Validators.pattern('^[0-9 \-\'^+-=]+')])]],
      Buy: [null, [Validators.compose([Validators.required])]],
      buyingAmount: [null, [Validators.compose([Validators.required, Validators.pattern('^[0-9 \-\'^+-=]+')])]],
      ExchangeRate: [null, [Validators.compose([Validators.required, Validators.pattern('^\\d{1,4}\\.\\d{1,10}$')])]], //change on 05 dec 2023 , Max 4 digits before the decimal and max 10 digits after
      handledBy : [null, [Validators.compose([Validators.required])]], 
      
    });
    this.form.patchValue({
      "Sell": "SGD",
      "InitiatedBy" : initiatedBy[0]  //APT
    })
    //retrieving agent datas 
    if(this.data.agentData){
      this.iterateAgentName = this.data.agentData;
    }
  }
  
//format value function helps to format the value to commas separators for every thousands .
  formatValue(value:any){
    return value.toLocaleString('en-US') ;
  }

  
 //calculate buyamount - onBlur event       
  calculateBuyAmount(){
    let exchangeRate = this.form.controls['ExchangeRate'].value ? this.form.controls['ExchangeRate'].value : "";//null check for exch rate
    let buyAmount = this.form.controls['buyingAmount'].value ? this.form.controls['buyingAmount'].value : "" ; //null check for buying amount 
    let result =  (exchangeRate * (buyAmount).replace(/,/g, '')).toFixed(2); //selling amount = exchange rate * buying amount (remove commas and further patching in sell amount field)
    let sellAmountViewValue = this.formatValue(parseFloat(result)) ;
    this.form.patchValue({
      "SellAmount" : sellAmountViewValue
    })
  }   
     
  updateFieldNames(initiatedBy:string){
    this.labelName = initiatedBy;
  } 
  //onBlur event - agent acc number will gets populated based on agent name
  populateAgentAccNumber(accountNumber:any,id:any){
    this.store.setItem('AGENT_ID',id);
      this.form.patchValue({
        "AccountNumber":accountNumber
      })
  }

  //onSubmit - POST API CALL
  onSubmit(){
    this.dealService.AddDeal(this.buildDeal()).subscribe(data => {
      console.log(data);
      this.form.reset();
        this.dialogRef.close('save');
      this.alertService.clear();
    this.alertService.success("Added Successful!!");
    },
    //error handling completed on 04/07/2023
    (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent)
      }
    })
  }
  buildDeal(): AddDeal{
    return new AddDeal({
     "agentAccountNo" : this.form.controls['AccountNumber'].value,
     "initiatedBy" : this.form.controls['InitiatedBy'].value,
     "sellerCurrencyCode" : this.form.controls['Sell'].value,
     "buyerCurrencyCode" : this.form.controls['Buy'].value,
     "buyerAmount" :(this.form.controls['buyingAmount'].value).replace(/,/g, ''), //will remove commas separator if any .
     "buyerExchangeRate" : this.form.controls['ExchangeRate'].value,
     "handleBy": this.form.controls['handledBy'].value,
    })
    { 
   
     
  }
  }
}

