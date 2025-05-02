import { Component, HostListener, OnInit } from '@angular/core';
import { DailyExchangeRateSetup } from 'src/app/backoffice/exchangerates/model/exchangerate.model';
import { ExchangeRateService } from 'src/app/core/services/exchange-rate.service';

import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { CommonSearchFilterCard} from 'src/assets/styles/tables/table-styles';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { remittanceExchRateArray } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss', '../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class ExchangeRateComponent implements OnInit {
  dailyexchangeRateSetup : DailyExchangeRateSetup[] =  [];
  rates: any;
  p : number = 1 ;
  searchValue!: string;
  myDate:any= new Date();
  idrRate : any;
  myrRate : any;
  usdRate : any;
  inrRate : any;
  eurRate : any;
  canadaRate : any;
  chinaRate : any;
  myanmarRate : any;
  algeriaRate :any;
  hongKongRate : any;
  CCYCODE : any;
  idrImage : any;
  myrImage :any;
  errorMessage = false;
  loader : Boolean = false;
  currencyArray :any[] = remittanceExchRateArray ;
  
  constructor(private exchangeRateService: ExchangeRateService,private dialog: MatDialog,private headerService : TitleHeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Exchange Rate');
    this.loader = true;
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    setTimeout(() => {
      this.exchangeRateService.getExchangeRates().subscribe((data:any)=>{
        this.dailyexchangeRateSetup = data;
        this.rates = data.rates
        this.loader = false;
        console.log(data);
        data['rates'].forEach((obj:any) => {
          let loopedObject = this.currencyArray.filter(v => v.CURRENCYCODE == obj.CCYCODE) ;
          obj.CCYFLAG = loopedObject[0].FLAG ? loopedObject[0].FLAG : "" ; 
        })

  
  
  if(this.rates.EXCHRATE == ""){
  this.errorMessage = true;
  }
  // else{
  //   this.idrImage =  '/assets/images/payee.png';
  // }
        
       
      },
      //error handlling completed in 28/06/2023
      (error:any) =>{
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogComponent) ;
        }
      }
      )

    }, 500);



  }

  public getScreenWidth: any;
  public getScreenHeight: any;
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 348)+'px' , 'overflow-y' : 'auto' };
  }

  refresh(){
    this.loader = true;
    setTimeout(() => {
    this.exchangeRateService.getExchangeRates().subscribe((data:any)=>{
      this.dailyexchangeRateSetup = data;
      this.rates = data.rates
      this.loader = false;
      console.log(data);
      data['rates'].forEach((obj:any) => {
        let loopedObject = this.currencyArray.filter(v => v.CURRENCYCODE == obj.CCYCODE) ;
        obj.CCYFLAG = loopedObject[0].FLAG ? loopedObject[0].FLAG : "" ; 
      })


if(this.rates.EXCHRATE == ""){
this.errorMessage = true;
}
// else{
//   this.idrImage =  '/assets/images/payee.png';
// }
      
     
    },
    //error handling completed in 28/06/2023
    (error:any) =>{
      this.loader = false;
      if(error.status != 401){
        this.dialog.open(ErrorDialogComponent) ;
      }
    }
    )
  }, 500);
  }
  // urlImg: string = 'assets/styles/icons/flag-icon-css/flags/';
  // countryFlag(val:any){
  //     switch (val) {
  //       case 'IDR':
  //         this.urlImg += 'es.svg';
  //         break;
  
  //       case 'MYR':
  //         this.urlImg += 'uk.svg';
  //         break;
  
  //       case 'FR':
  //         this.urlImg += 'fr.svg';
  //         break;
        
  //       default:       
  //       this.urlImg = 'unknowImage.svg';
  //         break;
  //     }
  
  //     return this.urlImg;
  //   }
  
}
