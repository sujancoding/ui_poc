import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {DailyExchangeRateSetup, ExchangeRates, PostExchangeRateSetup, Rates } from './model/exchangerate.model';
import { ExchangeRateService } from 'src/app/core/services/exchange-rate.service';
import { SavedDialogBoxComponent } from '../shared/modals/saved-dialog-box.component';
import { AddCountrycodeComponent } from '../shared/modals/addcountrycode/add-countrycode.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';


import { ErrorDialogAdminComponent } from '../shared/modals/errordialogadmin/error-dialog-admin.component';
import { remittanceExchRateArray } from 'src/assets/dropdownvalues';


@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss','../../../assets/styles/tables/table-style.scss'  ],
})
export class ExchangeRateComponent implements OnInit {
  isActive = false;
  isDisableFilter : Boolean = true ;
  form : FormGroup = Object.create(null);
  myDate:any= new Date();
  userName : string = this.store.getItem('USERNAME');
  ratesArray :any = [];
  newArray   :any = [];
  dailyexchangeRateSetup: DailyExchangeRateSetup[] = [];
  newlyaddedRates : any = [];
  currencyCode !: string;
  loader : Boolean = false;
  p: number = 1;
  newAddedCurrency : any = {};
  currentRowIndex!: number;
  public getScreenWidth: any;
  public getScreenHeight: any;
  forwardRate !: any;
  backwardRate !: any;
  pattern = /^(\.\d+|\d+(\.\d+)?)$/; 
  public tableForm !: FormGroup<any>;
  currencyArrayList = remittanceExchRateArray ;
  itemsPerPage = 22 ;
  backwardRatePattern = /^\d*(\.\d{1,10})?$/;
  notAllowedKeys : any[] = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  showGreetingCard : boolean = true ;
  showUpdateFlag : boolean = false ;

  
  constructor(private fb : FormBuilder,private exchangeRateService: ExchangeRateService,public dialogRef: MatDialog,private store: InMemoryCache,
     private alertService : AlertService,private headerService : TitleHeaderService,private dialog: MatDialog , @Inject(MAT_DIALOG_DATA) public data: any ) { 
      
      this.tableForm = this.fb.group({
        forwardRate: [null],
        backwardRate: [null],
      });

      this.currencyArrayList.forEach((value, i) => {
        this.tableForm.addControl(i.toString(), new FormControl(value, [Validators.pattern(/^\d+(\.\d{0,10})?$/),Validators.maxLength(16)]));
      });

      dialogRef.afterAllClosed.subscribe(() => {
        if(this.store.getItem('SERVICE_FAILED') != undefined){
          this.store.removeItem('SERVICE_FAILED');
          this.loader = false;
        }
      })
  }
 
  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void {
    // this.tableForm = this.fb.group({
    //   forwardRate : [null],
    //   backwardRate : [null],
    // }) ;


    if(this.data?.isUpdateExchRateReview){
     this.showGreetingCard = false ;
     this.showUpdateFlag = true ;
     this.headerService.setTitle(this.data.screenTitleName) ;
    }
    else{
      this.headerService.setTitle('Daily Exchange Rate');
    }

    this.currencyArrayList.forEach((value, index) => {
      const forwardRateControlName = `forwardRate${index}`;    //In Iterate formfield based on index, we add formcontrol for invidual field like forwardRate0,forwardRate1,.....
      const backwardRateControlName = `backwardRate${index}`;    //In Iterate formfield based on index, we add formcontrol for invidual field like backwardRate0,backwardRate1,.....

      this.tableForm.addControl(forwardRateControlName, new FormControl(value, Validators.compose([Validators.pattern(/^\d+(\.\d{0,10})?$/),Validators.maxLength(16)])));
      this.tableForm.addControl(backwardRateControlName, new FormControl(value , [Validators.pattern(/^\d+(\.\d{0,10})?$/),Validators.maxLength(16)]));
    });
    //building a form and validations
   
    this.loader = true;
    //onLoad > retrieve exchaneg rates from server
    setTimeout(() => {
      this.exchangeRateService.getExchangeRates().subscribe((data:any)=>{
        let array : any = data['rates'];
        this.loader = false;
          // Iterate through the second array of objects
          if(array != null){
            array.forEach((rate:any) => {
              // Find the matching currency code in the first array of objects
                 const index = this.currencyArrayList.findIndex(item => item.CURRENCYCODE === rate.CCYCODE);
                this.currencyArrayList[index].UPDATEDBY = rate.UPDATEDBY; // new changes - add element update by 
            
              // If a matching currency code was found, update the exchange rate
              if (index !== -1) {
                this.currencyArrayList[index].EXCHRATE = rate.EXCHRATE;
                let calculateForwardRate = rate.EXCHRATE;
                this.tableForm.controls[`forwardRate${index}`].patchValue(calculateForwardRate);   
                if(rate.EXCHRATE != 0){
                  let calculateRate = 1/rate.EXCHRATE;
                   let calculateBackwardRate = calculateRate.toFixed(10)
                  this.tableForm.controls[`backwardRate${index}`].patchValue(calculateBackwardRate);
                }
               else if(rate.EXCHRATE == 0){
                this.tableForm.controls[`backwardRate${index}`].patchValue("");
                this.tableForm.controls[`forwardRate${index}`].patchValue("");
        
               }
              }
              
            });
          }
         
    
    console.log(this.currencyArrayList);
        
          console.log(data);
       
          
        },
        //error handling done 28/06/2023
        (error:any) =>{
          this.loader = false ;
          if(error.status != 401){
            this.dialog.open(ErrorDialogAdminComponent) ;
          }
        })
    }, 500);
   
   
  //getScreenWidth and getScreenHeight will get the windows inner height and width.
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
    }

//The HostListener is a Decorator used for listening to the DOM,
// and It provides a handler method to run when that event occurs.
@HostListener('window:resize', ['$event'])
onWindowResize() {
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
}


  changeTableHeight(){
    return (this.getScreenHeight - 115);
  }
  
  getOverFlow(){
    return 'auto';
  }
 
  
  

   onSave(ccyCode : string ,rate1 : any,rate2 : any){
    if(this.pattern.test(rate1) && this.backwardRatePattern.test(rate2) ){
    let rate = this.currencyArrayList[this.currentRowIndex].EXCHRATE;
    this.loader = true; 
    console.log("Exchange rate is valid format");
    this.newArray = [{'currencyCode':ccyCode , 'rate':rate }];
    setTimeout(() => {
      this.exchangeRateService.updateExchangeRate(this.buildDailyRateSetup()).subscribe(data => {
        this.loader = false;
        console.log(data);
        this.dialogRef.open(SavedDialogBoxComponent, {
         panelClass: 'custom-modalbox',
         width:'322px',
         height:'140px',
         data: "Open Saved Dialog",
        })
      },
      //error handling completed on 04/07/2023
      (error:any)=>{
        this.loader = false ;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent)
        }
      })
    }, 500);
}
  else if(rate1 != "" && rate2 != ""){
    console.log("Exchange rate is invalid format");
    this.loader = false; 
    this.dialogRef.open(SavedDialogBoxComponent,{
      panelClass: 'custom-modalbox',
      width: "346px",
      height: "153px",
      data: "Please Validate ExchangeRate",
    });
  }
  else if(rate1 == "" && rate2 == ""){
    console.log("You Not Entered ExchangeRate");
    this.loader = false; 
    this.dialogRef.open(SavedDialogBoxComponent,{
      panelClass: 'custom-modalbox',
      width: '417px',
      height: '145px',
      data: "The ExchangeRate should not be empty",
    })
  }
  else{
    console.log("Rate doesn't match the pattern")
  }
   }

   buildDailyRateSetup(){
    return new PostExchangeRateSetup({
      "rates": this.newArray
    })
  }
  // resetField(index:any){
  //   this.currencyArrayList[index].EXCHRATE = '';
  //   const control = this.tableForm.get(index.toString());
  //   control?.reset();
  //   control?.setValue(this.currencyArrayList[index]);
  // }
//   "{ 
//     ""rates"" : [
//         {
//             ""currencyCode"" : ""USD"",
//             ""rate"" : ""3.02""
//         },{
//             ""currencyCode"" : ""MYR"",
//             ""rate"" : ""3.02""
//         }
//     ]
// }"
calculateForwardRate(rate : any ,index : number,e : KeyboardEvent){
  console.log(e);
  if(!this.notAllowedKeys.includes(e.key)){
    console.log(`Key pressed: ${e.key}`);
    let amount : number = parseFloat(rate); 
    const backwardRateControlName = `backwardRate${index}`;
    this.currencyArrayList[index].EXCHRATE = amount; // updating the rate in currencyArraylist
    if(rate != ""){
      if(rate == "0"){
        this.tableForm.controls[backwardRateControlName].patchValue(amount);
      }
      else{
      let calculateRate = 1/amount;
      let calculateForwardRate = calculateRate.toFixed(10)
      this.tableForm.controls[backwardRateControlName].patchValue(calculateForwardRate);
      }
    }
    else if(rate == ""){
        this.tableForm.controls[backwardRateControlName].patchValue("");
    }
  }
  else{
    console.log("You have entered an incorrect number")
  }
}
calculateBackwardRate(rate : any ,index : number,e : KeyboardEvent){
  console.log(e);
  if (!this.notAllowedKeys.includes(e.key)) {
    // Your logic for handling the allowed keys
    console.log(`Key pressed: ${e.key}`);
    let amount : number = parseFloat(rate);
    const forwardRateControlName = `forwardRate${index}`;
    if(rate != ""){
      if(rate == "0"){
        this.tableForm.controls[forwardRateControlName].patchValue(amount);
      }
      else{
     let calculateRate =  1/amount;
     let calculateBackwardRate = calculateRate.toFixed(10)
     this.currencyArrayList[index].EXCHRATE= calculateBackwardRate // updating the rate in currencyArraylist
     this.tableForm.controls[forwardRateControlName].patchValue(calculateBackwardRate);
      }
  
   }
   else if(rate == ""){
    this.tableForm.controls[forwardRateControlName].patchValue("");
   }
  }
  else{
    console.log("You have entered an incorrect number")
  }
}
}

