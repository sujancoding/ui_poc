import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, interval } from 'rxjs';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerDailySetupService } from 'src/app/core/services/mcdailysetup.service';
import { WindowManagementService } from 'src/app/shared/services/popupwindow.service';

import { flagCountryArray } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-display-rates',
  templateUrl: './display-rates.component.html',
  styleUrls: ['./display-rates.component.scss','../../../../assets/styles/tables/table-style.scss'],
  
})
export class DisplayRatesComponent implements OnInit , OnDestroy{
  isActive = false;
  myDate:any= new Date();
  currencyCode !: string;
  loader : Boolean = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  currencyRatesArray: any[] = [] ; //this variable used to iterated in HTML .
  time!: string;
  private clockSubscription!: Subscription;
  flagIconArray : any[] = flagCountryArray ;
  notesArray : any[] = [] ;
  notesValue !: string ;
  

  constructor(private titleService: TitleHeaderService, private exchangeRateService : MoneyChangerDailySetupService,
    private dialog : MatDialog,private windowManagementService: WindowManagementService) { }

  ngOnInit(): void {

    this.titleService.setTitle('Display Rates') ;

    this.updateTime();
    // Update time every second
    this.clockSubscription = interval(1000).subscribe(() => {
      this.updateTime();
    });

    //Get Notes API .
    this.exchangeRateService.getNotes().subscribe((datas:any) =>{
      this.notesArray = datas['data'] ;
      this.notesValue = this.notesArray[0].TODAYSNOTE ? this.notesArray[0].TODAYSNOTE : "" ;
    },
  )
  
  
    this.loader = true;
    //onLoad > retrieve exchaneg rates from server
    setTimeout(() => {
      let ccyCode =  "" ;
      let units =  "" ;
      let displayRate = true;
      this.exchangeRateService.getExchangeRates(ccyCode, units, displayRate ).subscribe((data:any)=>{
        this.currencyRatesArray = data['rates']
        // // Function to filter out invalid rates , ie supressing records where BUYRATE or SELLRATE are zero.
        // this.currencyRatesArray = data['rates'].filter((rate:any) => {
        //   const buyRate = rate.BUYRATE;
        //   const sellRate = rate.SELLRATE;
        //   return buyRate != "0" && sellRate != "0"
        // })
        console.log(this.currencyRatesArray)
        this.loader = false;
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
        
          console.log(data);
       
          
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
    return (this.getScreenHeight - 240);
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
  }

  //open rates window..new
  openRatesWindow(){
    console.log("Open Rates window");
    this.windowManagementService.openRatesWindow() ;
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
