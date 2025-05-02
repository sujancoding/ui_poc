import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, interval } from 'rxjs';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerDailySetupService } from 'src/app/core/services/mcdailysetup.service';
import { WindowManagementService } from 'src/app/shared/services/popupwindow.service';

import {  flagCountryArray } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-display-rates-window',
  templateUrl: './display-rates-window.component.html',
  styleUrls: ['./display-rates-window.component.scss'],

})
export class DisplayRatesWindowComponent implements OnInit {
  isActive = false;
  myDate:any= new Date();
  currencyCode !: string;
  loader : Boolean = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  notesArray : any[] = [] ;
  notesValue !: string ;
  flagIconArray : any[] = flagCountryArray ;
  currencyRatesArray: any[] = [] ; //this variable used to iterated in HTML .
  time!: string;
  private clockSubscription!: Subscription;
  payNowImage = 'assets/images/gallery/payNow.png' ;
  displayedRecords: any[] = [];
  currentIndex = 0;
  recordsPerPage : number = 23;
  timerId: any = "";
  private subscription!: Subscription;
  private readonly intervalTime = 10000; // 10 seconds
 

  constructor(private titleService: TitleHeaderService, private exchangeRateService : MoneyChangerDailySetupService,
    private dialog : MatDialog,private windowManagementService: WindowManagementService) { }

  ngOnInit(): void {
 
    this.titleService.setTitle('Display Rates') ;
  //getScreenWidth and getScreenHeight will get the windows inner height and width.
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
    this.updateTime();
    // Update time every second
    this.clockSubscription = interval(1000).subscribe(() => {
      this.updateTime();
    });

    //get notes API
    this.exchangeRateService.getNotes().subscribe((datas:any) =>{
      this.notesArray = datas['data'] ;
      this.notesValue = this.notesArray[0].TODAYSNOTE ? this.notesArray[0].TODAYSNOTE : "" ;
    },
  )

    this.loader = true;
    //onLoad > retrieve exchaneg rates from server
    this.callRetrieveRates(); //initiall call for one time ..
     // Set up the interval to call the API every two seconds
this.subscription = interval(this.intervalTime).subscribe(() => {
this.callRetrieveRates();
});
   
  }



  updateDisplayedRecords() {
    this.displayedRecords = this.currencyRatesArray.slice(
      this.currentIndex, //0
      this.recordsPerPage //23
      //this.currentIndex + this.recordsPerPage
    );
    //this is for next navigation automatically , now its disabled .
    // this.currentIndex += this.recordsPerPage;
    // if (this.currentIndex >= this.currencyRatesArray.length) {
    //   this.currentIndex = 0; // Reset index if all records have been displayed
    // }
  }

  // getTableCellPadding(){
  //   let tableHeight = this.getScreenHeight - 260 ;
  //   console.log(tableHeight) ;
  //   const styles = {
  //   'text-align': 'center',
  //   'padding': "9px",
  //   'font-family': 'Roboto',
  //   'font-weight': '540',
  //   'font-size': '20px',
  //   'border': '0.1px solid #1b1b1b',
  //   'overflow' : 'hidden'
    
  //   }
  //   return styles ;
  // }
  //The HostListener is a Decorator used for listening to the DOM,
// and It provides a handler method to run when that event occurs.
@HostListener('window:resize', ['$event'])
onWindowResize() {
  this.getScreenWidth = window.innerWidth;
  this.getScreenHeight = window.innerHeight;
 
 // this.updateDisplayedRecords();
  
}


  changeTableHeight(){
    return (this.getScreenHeight - 260);
  }
  
  getOverFlow(){
    return 'auto';
  }
 
  updateTime() {
    const currentDate = new Date();
    this.time = currentDate.toLocaleTimeString();
  }

  ngOnDestroy() {
    // Unsubscribe from the clock subscription to prevent memory leaks
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
    // Unsubscribe from the retrive rates interval 
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  //On reload - triggered get rates API
  reloadRates(){
 this.callRetrieveRates();

 //get notes API
 this.exchangeRateService.getNotes().subscribe((datas:any) =>{
  this.notesArray = datas['data'] ;
  this.notesValue = this.notesArray[0].TODAYSNOTE ? this.notesArray[0].TODAYSNOTE : "" ;
},
)
  }

  callRetrieveRates(){
    let ccyCode = "" ;
    let units = "" ;
    let displayRate = true;
    this.stopTimer() ;
    this.exchangeRateService.getExchangeRates(ccyCode,units,displayRate).subscribe((data:any)=>{
      this.loader = false;
      this.currencyRatesArray = [];
      this.displayedRecords = [];
      this.currencyRatesArray = data['rates'] ;
      // // Function to filter out invalid rates , ie supressing records where BUYRATE or SELLRATE are zero,
      // this.currencyRatesArray = data['rates'].filter((rate:any) => {
      //   const buyRate = rate.BUYRATE;
      //   const sellRate = rate.SELLRATE;
      //   return buyRate != "0" && sellRate != "0"
      // })
      console.log(this.currencyRatesArray)
    
      if(this.currencyRatesArray.length != 0){
        this.currencyRatesArray.forEach((item:any) => {
          const currencyCode = item.CCYCODE;
          let flagArray = this.flagIconArray ;
           
           // Find the corresponding flag icon based on currency code
           const indexNumber = flagArray.findIndex(item => item.CCYCODE === currencyCode);
           if(indexNumber != -1){
            let flagName = flagArray[indexNumber].FLAG;
            item.FLAG = flagName ? flagName : ""
           }
           else{
            item.FLAG = "flag-unavailable" ;
           }
  
        })
      }
    console.log(this.currencyRatesArray);
  
     this.updateDisplayedRecords(); // Next page navigation. Disable it for now.
    
  //  this.timerId = setInterval(() => {
  //     this.updateDisplayedRecords();
  //   }, 10000); // Update every 10 seconds --> needs to be changed , think
     
        
      },
      //error handling done 28/06/2023
      (error:any) =>{
        this.loader = false ;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent,{
            data : error.error.errorMessage ? error.error.errorMessage : ""
          }) ;
        }
      })
  }

  // Function to stop the timer
stopTimer() {
  clearInterval(this.timerId);
}

formatValue(value: any) { //this functions helps to append commas seperators
  if(value!=""){
    //if we have integer part and decimal part we have to split integer and decimal
    let parts = value.split('.'); 
    // after splitting into two parts we are adding commas to integer part
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    // After adding commas to the integer part, we need to check whether we have both parts: the integer and the decimal.
    // If both parts exist, we should return the integer with the decimal; otherwise, return only the integer.
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart; // Reattach decimal part if present
  }
}

}
