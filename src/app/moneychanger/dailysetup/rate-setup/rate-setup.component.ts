import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { SavedDialogBoxComponent } from 'src/app/backoffice/shared/modals/saved-dialog-box.component';
import { MoneyChangerUpsertRate } from 'src/app/core/model/mcdailysetup/dailysetup.model';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerDailySetupService } from 'src/app/core/services/mcdailysetup.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import {  flagCountryArray } from 'src/assets/dropdownvalues';
import { NoteDialogComponent } from '../../modals/note-dialog/note-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-rate-setup',
  templateUrl: './rate-setup.component.html',
  styleUrls: ['./rate-setup.component.scss','../../../../assets/styles/tables/table-style.scss'],
  
})
export class RateSetupComponent implements OnInit {

  isActive = false;
  isDisableFilter : Boolean = true ;
  form : FormGroup = Object.create(null);
  myDate:any= new Date();
  userName : string = this.store.getItem('USERNAME');
  ratesArray :any = [];
  newArray   :any = [];
  dailyexchangeRateSetup: any[] = [];
  newlyaddedRates : any = [];
  currencyCode !: string ;
  loader : Boolean = false;
  newAddedCurrency : any = {};
  currentRowIndex!: number;
  public getScreenWidth: any;
  public getScreenHeight: any;
  buyRate !: any;
  sellRate !: any;
  systemBuyRate !: any;
  systemSellRate !: any;
  pattern = /^(?:\d{0,5}\.\d{1,6}|\d{1,5})$/  ; // It covers various cases of decimal numbers
  public tableForm!: FormGroup<any>;
  currencyArrayList  : any[] = [] ;
  flagIconArray : any[] = flagCountryArray;
  isTodayOffer !: string ;
  color = "primary";
  filterForm : FormGroup = Object.create(null) ;
  todaysOfferObj : any ;
  originalValues: any[] = []; // Store original values for comparison
  invalidRows: any[] = []; // Store invalid currency numbers

  constructor(private fb : FormBuilder,private exchangeRateService: MoneyChangerDailySetupService,public dialogRef: MatDialog,private store: InMemoryCache,
    private headerService : TitleHeaderService,private dialog: MatDialog, private snackBar : MatSnackBar) { 
      // this.currencyArrayList.forEach((value, i) => {
      //   this.tableForm.addControl(i.toString(), new FormControl(value, [Validators.pattern(/^(\d+(\.\d{0,6})?|\.\d{1,6})$/),Validators.maxLength(16)]));
      // });

      dialogRef.afterAllClosed.subscribe(() => {
        if(this.store.getItem('SERVICE_FAILED') != undefined){
          this.store.removeItem('SERVICE_FAILED');
          this.loader = false;
        }
      })
  }
 
  
  ngOnInit(): void {

    this.tableForm = this.fb.group({
      exchRates: this.fb.array([]) 
   });

    //Filter form group
    this.filterForm = this.fb.group({
      currencyCode : [null],
      units : [null],
    });
   
    //building a form and validations
    this.headerService.setTitle('Exchange Rate Setup');
  
    //onLoad > retrieve exchaneg rates from server
  this.callRetrieveRatesApi() ;
   
   
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
    return { 'height': (this.getScreenHeight - 218) + 'px', 'overflow-y': 'auto',
      'overflow-x' : 'auto' , 'width' : '100%'
     };
  }
  
 
  
  
  onToggleChange(event:any,index:number) {
    console.log("Toggle Value: ", event.checked);
    this.isTodayOffer = event.checked ? event.checked : "false" ;
    this.isTodayOffer = this.isTodayOffer.toString() ;
    this.todaysOfferObj = {"todaysOffer" : this.isTodayOffer , "index": index} ;
    // this value should be patched for that paticular Form Group's TODAYSOFFER form control
    // after updated only this will be considered as modified value.
    const exchangeRatesArray = this.tableForm.get('exchRates') as FormArray;    
    exchangeRatesArray.at(index).get('todaysOffer')?.patchValue(this.isTodayOffer);

  }
  


   onSave(ccyNo : string,ccyCode : string ,buyRate : any,sellRate : any, displayOrder:any,index:number,systemBuyRate : any,systemSellRate : any){ 
    displayOrder = displayOrder ? displayOrder : "" ;
    buyRate = buyRate ? this.removeCommas(buyRate) : "" ;
    sellRate = sellRate ? this.removeCommas(sellRate) : "" ;
    systemBuyRate = systemBuyRate ? this.removeCommas(systemBuyRate) : "" ;
    systemSellRate = systemSellRate ? this.removeCommas(systemSellRate) : "" ;
    if(this.pattern.test(buyRate) && this.pattern.test(sellRate) && displayOrder != "" &&
    this.pattern.test(systemBuyRate) && this.pattern.test(systemSellRate)  ){ //Buy rate, sell rate and order fields are mandatory..
    this.loader = true; 
    console.log("checking on save function")
    console.log("Exchange rate is valid format");
    this.isTodayOffer = this.isTodayOffer ? this.isTodayOffer : "" ; //true
    let indexValue = this.todaysOfferObj ? this.todaysOfferObj.index : -1 ; //6
    if(indexValue != index){
      this.isTodayOffer = this.currencyArrayList[index].TODAYSOFFER ? this.currencyArrayList[index].TODAYSOFFER : "" ;
    }
    else if(this.isTodayOffer == ""){
      this.isTodayOffer = this.currencyArrayList[index].TODAYSOFFER ? this.currencyArrayList[index].TODAYSOFFER : "" ;
    }
    else if(indexValue == index){ //change event occured in onToggleChange function..
      this.isTodayOffer = this.isTodayOffer ;
    }
   
    this.newArray = [
      {
      'ccyNo':ccyNo, 
      'currencyCode':ccyCode , 
      'buyRate':buyRate , 
      'sellRate':sellRate , 
      'systemConventionBuyRate':systemBuyRate , 
      'systemConventionSellRate':systemSellRate , 
      "todaysOffer" : this.isTodayOffer ? this.isTodayOffer : ""  , 
      "displayOrder": displayOrder ? displayOrder : "" 
    }
  ];
    setTimeout(() => {
      //service call ..
      this.exchangeRateService.updateExchangeRate(this.buildDailyRateSetup()).subscribe(data => {
        console.log(data);
        this.loader=false
        let ccyCode = this.filterForm.controls['currencyCode'].value ? this.filterForm.controls['currencyCode'].value : "" ;
          //updating the latest response in orginalValues array...
            this.originalValues[index] = {
              ccyNo: ccyNo,
              buyRate: buyRate,
              sellRate: sellRate,
              systemBuyRate: systemBuyRate,
              systemSellRate: systemSellRate,
              displayOrder: displayOrder,
              todaysOffer: this.isTodayOffer
              // Update any other fields
            };
      
        this.snackBar.open(`${ccyCode} rate saved successfully !` , "Ok",{
          panelClass: "green-notification-snackbar",
          duration: 2000
        }) ;
      },
      //error handling completed on 04/07/2023
      (error:any)=>{
        this.loader = false ;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent,{
            data : error.error.errorMessage ? error.error.errorMessage : ""
          })
        }
      })
    }, 500);
}
else if(displayOrder == ""){
  console.log("Order should not be empty");
  this.loader = false; 
  this.dialogRef.open(SavedDialogBoxComponent,{
    panelClass: 'custom-modalbox',
    width: '417px',
    height: '145px',
    data: "Order should not be empty",
  })
}
  else if((buyRate != "" && sellRate != "") || (systemBuyRate != "" && systemSellRate != "")){
    console.log("Exchange rate is invalid format");
    this.loader = false; 
    this.dialogRef.open(SavedDialogBoxComponent,{
      panelClass: 'custom-modalbox',
      width: "346px",
      height: "153px",
      data: "Please Validate ExchangeRate",
    });
  }
  else if((buyRate == "" && sellRate == "") || (systemBuyRate == "" && systemSellRate == "")){
    console.log("You Not Entered ExchangeRate");
    this.loader = false; 
    this.dialogRef.open(SavedDialogBoxComponent,{
      panelClass: 'custom-modalbox',
      width: '417px',
      height: '145px',
      data: "The ExchangeRate should not be empty",
    })
  }
  else if((buyRate == "" || sellRate == "") || (systemBuyRate == "" || systemSellRate == "")){
    console.log("Either rate Not Entered");
    this.loader = false; 
    this.dialogRef.open(SavedDialogBoxComponent,{
      panelClass: 'custom-modalbox',
      width: '417px',
      height: '145px',
      data: "Please enter both rates",
    })
  }
 
   }

   buildDailyRateSetup():MoneyChangerUpsertRate{
    return new MoneyChangerUpsertRate({
      "rates": this.newArray
    })
  }

  openNoteDialog(){
    this.dialog.open(NoteDialogComponent,{
      panelClass : 'new-dialog',
      width: '375px',
    
    })
  }
  get currencyRatesFormArray() {
    return this.tableForm.get('exchRates') as FormArray;
  }
  callRetrieveRatesApi(){
     // ccyCode , units
     this.loader = true ;
     let ccyCode = this.filterForm.controls['currencyCode'].value ? this.filterForm.controls['currencyCode'].value : "" ;
     let units = this.filterForm.controls['units'].value ? this.filterForm.controls['units'].value : "" ;
     let displayRate = false;
     this.exchangeRateService.getExchangeRates(ccyCode,units,displayRate).subscribe((data:any)=>{
       this.currencyArrayList = data['rates'];
       this.loader = false;
       const flagMap = new Map(this.flagIconArray.map(flag => [flag.CCYCODE, flag.FLAG || "flag-unavailable"]));
    
    // Clear original values array
    this.originalValues = [];
    // Form Array should be cleared before calling callRetrieveRatesApi to avoid duplicate form fields.
    (this.tableForm.get('exchRates') as FormArray).clear();
       this.currencyArrayList.forEach((item, index)=> {
        item.FLAG = flagMap.get(item.CCYCODE) || "flag-unavailable";
        const currencyCode = item.CCYCODE;
        // Need to Change display order as string for displaying Zero in Form field. 
         if(item?.DISPLAYORDER !== null){
          item.DISPLAYORDER = item.DISPLAYORDER.toString()
         } 
         // Add form group to form array
         this.currencyRatesFormArray.push(
          this.fb.group({
            CCYNO: [item.CCYNO],
            CCYCODE: [currencyCode],
            UNITS: [item.UNITS],
            buyRate: [item?.BUYRATE ? item.BUYRATE : null, [Validators.required, Validators.pattern(/^\d{0,5}(,\d{3})*(\.\d{1,6})?$/), Validators.maxLength(16)]],
            sellRate: [item?.SELLRATE ? item.SELLRATE : null, [Validators.required, Validators.pattern(/^\d{0,5}(,\d{3})*(\.\d{1,6})?$/), Validators.maxLength(16)]],
            systemBuyRate: [item?.SYSTEMCONVENTIONBUYRATE ? item.SYSTEMCONVENTIONBUYRATE : null, [Validators.required, Validators.pattern(/^\d{0,5}(,\d{3})*(\.\d{1,6})?$/), Validators.maxLength(16)]],
            systemSellRate: [item?.SYSTEMCONVENTIONSELLRATE ? item.SYSTEMCONVENTIONSELLRATE : null, [Validators.required, Validators.pattern(/^\d{0,5}(,\d{3})*(\.\d{1,6})?$/), Validators.maxLength(16)]],
            displayOrder: [item?.DISPLAYORDER || null, [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(16)]],
            todaysOffer: [item.TODAYSOFFER],
            UPDATEDBY: [item.UPDATEDBY]
          })
        );

                // Extract values and use default empty string if not available
                const ccyNo = item.CCYNO || null;
                const buyRate = item.BUYRATE || null;
                const sellRate = item.SELLRATE || null; 
                const systemBuyRate = item.SYSTEMCONVENTIONBUYRATE || null;
                const systemSellRate = item.SYSTEMCONVENTIONSELLRATE || null;
                const displayOrder = item.DISPLAYORDER || null;
                const todaysOffer = item.TODAYSOFFER || '' ;

        // Store original values for change detection
        this.originalValues.push({
          ccyNo ,
          buyRate,
          sellRate,
          systemBuyRate,
          systemSellRate,
          displayOrder,
          todaysOffer
          // ... other fields you want to track
        });
        
                

         })
       
         //FROM THESE ABOVE TWO ARRAY OBJECTS, CCYCODE IS COMMON ELEMENT
      
      
        
          console.log(this.currencyArrayList) ;
         
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
  searchFilter(){
    this.callRetrieveRatesApi() ;
  }
 
  //on blur buy rate --> if system convention buy rate is null or empty , patch the buy rate value in system convention buy rate . 
  onBlurBuyRate(buyRate:any,index:any, ccyNo:any){

    buyRate = buyRate ? this.removeCommas(buyRate) : "";
    let storedSystemBuyRate : any = "" ;
    let ratesArrayList = this.originalValues.filter(v => v.ccyNo == ccyNo) ; //orginalValue holds the latest response .
    storedSystemBuyRate = ratesArrayList[0].systemBuyRate ? ratesArrayList[0].systemBuyRate : "" ;
    const exchangeRatesArray = this.tableForm.get('exchRates') as FormArray;
    console.log("on blur buy rate", buyRate)
    console.log("on blur system buy rate", storedSystemBuyRate)
    if (buyRate != "" && storedSystemBuyRate == "") {   // patch system buy rate field only if suppose system buy rate is empty string onload .
      if (this.pattern.test(buyRate)) { // pattern check for buy rate (date validation) .
        exchangeRatesArray.at(index).get('systemBuyRate')?.patchValue(buyRate);
      }
    }

  }

  //on blur sell rate --> if system convention sell rate is null or empty , patch the sell rate value in system convention sell rate . 
  onBlurSellRate(sellRate:any, index:any, ccyNo:any){

    sellRate = sellRate ? this.removeCommas(sellRate) : "";
    let storedSystemSellRate : any = "" ;
    let ratesArrayList = this.originalValues.filter(v => v.ccyNo == ccyNo) ; //orginalValue holds the latest response .
    storedSystemSellRate = ratesArrayList[0].systemSellRate ? ratesArrayList[0].systemSellRate : "" ;

    console.log("on blur sell rate",sellRate)
    console.log("on blur system sell rate",storedSystemSellRate)
    const exchangeRatesArray = this.tableForm.get('exchRates') as FormArray;

    if (sellRate != "" && storedSystemSellRate == "") {   // // patch system sell rate field only if suppose system sell rate is empty string onload .
      if (this.pattern.test(sellRate)) { // pattern check for sell rate (date validation) .
        exchangeRatesArray.at(index).get('systemSellRate')?.patchValue(sellRate);
      }
    }

  }


     // Check if a specific row has been modified
  isRowModified(index: number): boolean {
    console.log("is row modified") ;
    const formGroup = this.currencyRatesFormArray.at(index) as FormGroup;
    const original = this.originalValues[index];
    
    return (
      // The value should be checked as a string because previously, when checking values as numbers, 1 and 1.00 were considered different.
      //  Changing the type to a string ensures an accurate comparison.
      String(this.removeCommas(formGroup.get('buyRate')?.value)) !== String(original.buyRate) ||
      String(this.removeCommas(formGroup.get('sellRate')?.value)) !== String(original.sellRate) ||
      String(this.removeCommas(formGroup.get('systemBuyRate')?.value)) !== String(original.systemBuyRate) ||
      String(this.removeCommas(formGroup.get('systemSellRate')?.value)) !== String(original.systemSellRate) ||
      Number(formGroup.get('displayOrder')?.value) !== Number(original.displayOrder) ||
      String(formGroup.get('todaysOffer')?.value) !== String(original.todaysOffer)

      // Add any other fields you want to track
    );
  }


  // Get all modified rows
  getModifiedRows() {
    const modifiedRows = [];
    console.log("getting the modified rows") ;
    for (let i = 0; i < this.currencyRatesFormArray.length; i++) {
      if (this.isRowModified(i)) {
        const formGroup = this.currencyRatesFormArray.at(i) as FormGroup;
        if (!formGroup.valid) { //checking one by one using index 'i'
          const ccyNo = formGroup.get('CCYNO')?.value || `Row ${i + 1}`; // Get currency number or fallback to row index
          this.invalidRows.push(ccyNo);
        }
        modifiedRows.push({
          index: i,
          ccyNo: formGroup.get('CCYNO')?.value,
          currencyCode: formGroup.get('CCYCODE')?.value,
          buyRate: this.removeCommas(formGroup.get('buyRate')?.value), 
          sellRate:  this.removeCommas(formGroup.get('sellRate')?.value),
          systemConventionBuyRate:  this.removeCommas(formGroup.get('systemBuyRate')?.value),
          systemConventionSellRate:  this.removeCommas(formGroup.get('systemSellRate')?.value),
          displayOrder: formGroup.get('displayOrder')?.value,
          todaysOffer: formGroup.get('todaysOffer')?.value
          // Add any other fields you need
        });
      }
    }
    
    return modifiedRows;
  }
  
  // Handler for overall save button
  overAllSave() {
    const modifiedRows = this.getModifiedRows();
    console.log('Modified rows:', modifiedRows);
    // before calling API we should check modified rows has values and there must be no invalid rows.
    if (modifiedRows.length > 0 && this.invalidRows.length == 0) {
      // Here you would typically send these changes to your API
      this.loader = true ;
      let finalizedRow = modifiedRows.map(({ index, ...rest }) => rest);
      console.log(finalizedRow);
      this.newArray=finalizedRow;
      setTimeout(() => {
        //service call ..
        this.exchangeRateService.updateExchangeRate(this.buildDailyRateSetup()).subscribe(data => {
          console.log(data);
          this.loader=false;
          this.snackBar.open("Rates saved successfully !" , "Ok",{
            panelClass: "green-notification-snackbar",
            duration: 2000
          }) ;
         // after saved rates this.newArray should be empty
         this.newArray=[]
        // After successful save, update the original value
         modifiedRows.forEach(row => {
        this.originalValues[row.index] = {
          ccyNo : row.ccyNo,
          buyRate: row.buyRate,
          sellRate: row.sellRate,
          systemBuyRate: row.systemConventionBuyRate,
          systemSellRate: row.systemConventionSellRate,
          displayOrder: row.displayOrder,
          todaysOffer: row.todaysOffer
          // Update any other fields
        };
      });
        },
        //error handling completed on 04/07/2023
        (error:any)=>{
          this.loader = false ;
          if(error.status != 401){
            this.dialogRef.open(ErrorDialogAdminComponent,{
              data : error.error.errorMessage ? error.error.errorMessage : ""
            })
          }
        })
      }, 500);
      
    } 
    // if we have invalid rows .
    else if (this.invalidRows.length > 0) {
      const message = this.invalidRows.length === 1
        ? `Currency No: ${this.invalidRows[0]} has invalid data. Please correct it.`
        : `Currency Nos: ${this.invalidRows.join(', ')} have invalid data. Please correct them.`;
      
      this.snackBar.open(message, 'Close', {
        duration: 5000,
        panelClass: "orange-notification-snackbar",
      });
    }
    
    else {
      console.log('No changes detected');
      this.snackBar.open("No changes detected !" , "Ok",{
        panelClass: "orange-notification-snackbar",
        duration: 2000
      }) ;
    }
    this.invalidRows=[];
  }

// To remove commas from the value.
removeCommas(value: any): string {
  if(value != null){ 
// Changed the return type from number to string and ensured the value is treated as a string before removing commas.
// if we remove comma in string type it will return 1,000.00 as '1000.00'
    return String(value.replace(/,/g, ''));
  }
  return value
}

// formatValue(value: any) { //this functions helps to append commas seperators
//   if(value!=""){
//     //if we have integer part and decimal part we have to split integer and decimal
//     let parts = value.split('.'); 
//     // after splitting into two parts we are adding commas to integer part
//     let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
//     // After adding commas to the integer part, we need to check whether we have both parts: the integer and the decimal.
//     // If both parts exist, we should return the integer with the decimal; otherwise, return only the integer.
//     return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart; // Reattach decimal part if present
//   }
// }

}
