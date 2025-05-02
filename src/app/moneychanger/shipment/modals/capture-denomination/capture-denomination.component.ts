import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';


@Component({
  selector: 'app-capture-denomination',
  templateUrl: './capture-denomination.component.html',
  styleUrls: ['./capture-denomination.component.scss','../../../../../assets/styles/tables/table-style.scss'],
})
export class CaptureDenominationComponent implements OnInit {
  form: FormGroup = Object.create(null);
  currencyArray : any[] = [] ;
  filteredOptions: Observable<string[]>[] = [];
  options: any[] = [];
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  denominationStorage : any ;
  isReadOnlyAmount = true;
  denominationValue: any[] = [];
  filteredDenominations : any[] = [] ;
  currencyValue !: string ;
  public getScreenHeight: any;
  shipmentStatus !: string ;
  isDisableAddNew : boolean = false ;
  isDisableRemoveIcon : boolean = false ;
  isReadOnly : boolean = false ;
  dealListings : any []  = [];
  isDisabled : boolean = true;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CaptureDenominationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private currencyMaintenanceService : MoneyChangerMaintenanceService,
    private dialog : MatDialog
   ) { }

   displayFn(ccyCode: any): string {
    return ccyCode && ccyCode ? ccyCode : '';
  }

   private _filterCurrencies(value: string): any[] {
    const filterValue = value.toUpperCase(); // input value changed to upper case for mat auto complete
    return this.currencyArray.filter(option =>
      option.ccyCode.includes(filterValue)
    );
  }

  ngOnInit(): void {

    this.autocompleteTrigger?.closePanel();

   

    this.form = this.fb.group({
      rows: this.fb.array([]) //Initially Array should be empty...
    });
    // getting deal listings from parent screen to compare parent screen deal and entered denomination are satisfy or not 
    this.dealListings = this.data.dealListings ? this.data.dealListings : []

    if(this.data.data.length > 0 && this.data.flag == "ADD"){  //denomination storage - Entry point Add shipment
      this.denominationStorage = this.data.data ? this.data.data : "" ;
      if(this.denominationStorage){
        this.denominationStorage.forEach((items:any, index:number) => {
          let amount = items.controls.amount.value ? items.controls.amount.value : "" ;
          let ccyCode = items.controls.ccyCode.value ? items.controls.ccyCode.value : "" ;
          let ccyValue = items.controls.ccyValue.value ? items.controls.ccyValue.value : 0 ;
          let count = items.controls.count.value ? items.controls.count.value : 0 ;
          let ccyNo = items.controls.ccyNo.value ? items.controls.ccyNo.value : "" ;
          this.rows.push(this.patchData(ccyCode, ccyValue, count, amount,ccyNo)) ;
         
  var obj = [{VALUE : ccyValue}]
  this.filteredDenominations[index] = obj ;

        })
        
      }
    }

    else if(this.data.data.length > 0 && this.data.flag == "UPD"){  //denomination storage - Entry point Update shipment
      this.denominationStorage = this.data.data ? this.data.data : "" ;
      this.shipmentStatus = this.data.shipmentStatus ;
      if(this.shipmentStatus == "IN-FLIGHT" || this.shipmentStatus == "DELIVERED" || this.shipmentStatus == "CANCELLED"){
        this.isDisableAddNew = true ;
        this.isDisableRemoveIcon = true ; //Disabling add new button and remove icon button when shipment status is IN-FLIGHT, DELIVERED or CANCELLED
        this.isReadOnly = true ; // read only fields --> ccy code , denominations dropdown , Quantity
      }
      if(this.denominationStorage){
        this.denominationStorage.forEach((items:any, index:number) => {
          let amount = items.amount ? items.amount : "" ;
          let ccyCode = items.ccyCode ? items.ccyCode : "" ;
          let ccyValue = items.ccyValue ? items.ccyValue : 0 ;
          let count = items.count ? items.count : 0 ;
          let ccyNo = items.ccyNo ? items.ccyNo : "" ;
          this.rows.push(this.patchData(ccyCode, ccyValue, count, amount,ccyNo)) ;
         
  var obj = [{VALUE : ccyValue}]
  this.filteredDenominations[index] = obj ;

        })
        
      }
    }
     
    // This service is called, to display all the currency codes in the mat-autocomplete panel
    this.currencyMaintenanceService.getCurrencyListings('','','').subscribe((datas:any)=>{
      this.currencyArray = datas['data'];
      this.options = this.currencyArray.map((currency: any) => currency.ccyCode); // Extract ccyCode and store in the options variable
      },
      (error:any)=>{
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
          }) ;
        }
       } ) ;

        //getScreenWidth and getScreenHeight will get the windows inner height and width.
      this.getScreenHeight = window.innerHeight;
      // in ngOninit we have to check this function to enable or disable button
      this.isDisableSave();
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }

//   {
//     "ccyNo": "101",
//     "ccyCode": "INR",
//     "count": "100",
//     "ccyValue": "100",
//     "amount": "1000.00",
//     "remarks": "NOTHING"
// },

  createRow(): FormGroup {
    return this.fb.group({
    ccyCode: ['' , [Validators.compose([Validators.required , Validators.pattern('[a-zA-Z .]*$')])]],
    ccyNo : ['' , [Validators.compose([Validators.required])]] ,
    ccyValue: [0 , [Validators.compose([Validators.required])]], //Denomination (Its a dropdwon)
    count: [0 , [Validators.compose([Validators.required, Validators.pattern('^[0-9 ]+$')])]],  //Quantity 
    amount: ['' , [Validators.compose([Validators.required])]]
    });
  }

  patchData(ccyCode:string, ccyValue:number, count : number, amount:number,ccyNo : string):FormGroup{
    return this.fb.group({
      ccyCode: [ccyCode , [Validators.compose([Validators.required , Validators.pattern('[a-zA-Z .]*$')])]],
      ccyNo : [ccyNo , [Validators.compose([Validators.required])]] ,
      ccyValue: [ccyValue , [Validators.compose([Validators.required])]], //Denomination (Its a dropdwon)
      count: [count , [Validators.compose([Validators.required, Validators.pattern('^[0-9 ]+$')])]],  //Quantity 
      amount: [this.formatValue(amount) , [Validators.compose([Validators.required])]]
    })
  }

  addRow(){
    this.rows.push(this.createRow());
    const index = this.rows.length - 1;
    this.initializeAutocomplete(index);
  }

  removeRecord(index: number){
    this.rows.removeAt(index);
    this.filteredDenominations.splice(index, 1);

    // while removing record we have to check this function to enable or disable button
    this.isDisableSave();
  }

  onDenominationChange(e:any,index:any){
    let amount: any;
  
  // Access the specific form group for the row at the given index
  const row = (this.form.get('rows') as FormArray).at(index) as FormGroup;

  // Get the values from the form controls within that form group
  let ccyValue = row.get('ccyValue')?.value || 0;
  let count = row.get('count')?.value || 0;

  if (ccyValue !== 0 && count !== 0) {
    // Calculate the amount
    let calculatedAmt = parseFloat(ccyValue) * parseFloat(count);
    amount = calculatedAmt.toFixed(2);

    // Update the 'amount' control in the specific row
    row.patchValue({
      "amount": this.formatValue(parseFloat(amount))
    });
  } else {
    // If either is empty, set the 'amount' control to an empty string
    row.patchValue({
      "amount": ""
    });
  }
  // after enter denomination value we have to check this function to enable or disable button
  this.isDisableSave();
}


//closing dialog window
onCloseDialog(){
   this.dialogRef.close({data : this.rows}) ;
}

// this function is called, when the currency code field is focused based on the index
initializeAutocomplete(index: number) {
  const control = this.rows.at(index).get('ccyCode');
  if (control) {
    this.filteredOptions[index] = control.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCurrencies(value))
    );
  }
}

// This function is triggered, when an option is selected from the mat-autocomplete panel
onOptionSelectedCustomer(e:any,index:number){
  console.log(index);
  // getting ccyNo as data attribute from html to patch corresponding ccyNo
  const selectedCcyNo = e.option._getHostElement().getAttribute('data-option-ccyNo');
  console.log(selectedCcyNo)
  // const selectedCurrencyCode = e.option.value; // the value of the selected currency code is stored and this is passed in the service arguement
  const row = (this.form.get('rows') as FormArray).at(index) as FormGroup;
  // const filteredArray = this.currencyArray.filter(v => v.ccyCode == selectedCurrencyCode) ;
  let ccyNo = "" ;
  // patching ccyNo
  if(selectedCcyNo){
     ccyNo = selectedCcyNo ;
     row.patchValue({
      "ccyNo" : ccyNo
      })
  }

  this.currencyMaintenanceService.getCurrencyValueInquiry(ccyNo).subscribe((datas:any)=>{
    this.denominationValue = datas['data'];
    this.filteredDenominations[index] = this.denominationValue ;
  },
  // Error handling
   (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
      }) ;
    }
   } 
)
// while changing currency we have to check this function to enable or disable button
 this.isDisableSave();
}

onSave(){
  this.dialogRef.close({data : this.rows});
}

 //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenHeight = window.innerHeight;
  }

changeTableHeight(){
  return { 'height': '513px' , 'overflow-y' : 'auto' }; 
}
changeDealTableHeight(){
  return { 'height': '242px' , 'overflow-y' : 'auto' ,  'margin-right': '14px',
    'margin-left': '14px','border': '1px solid gray'};
}

  // checking length of dealListing and this.row 
  // else button will be disabled.
  isDisableSave() {
      if (this.rows) {
        //Extracts all ccyNo from dealListings into an array (dealCcyNos).
        //eg : ['02','03','57']
        const dealCcyNos = this.dealListings.map(deal => deal.ccyNo);
        //Extracts all ccyNo from this.rows into an array (inputCcyNos).
        //eg : ['02','03','57']
        const inputCcyNos = this.rows.value.map((row: any) => row.ccyNo);

        // Check if all dealListings exist in input and input ccyNo are present in dealListing
        const isMatchingCcyNos = dealCcyNos.every(ccyNo => 
          inputCcyNos.map((ccy: any) => ccy.toUpperCase()).includes(ccyNo.toUpperCase())
      ) && 
      inputCcyNos.every((ccyNo: any) => 
          dealCcyNos.map(ccy => ccy.toUpperCase()).includes(ccyNo.toUpperCase())
      );
    
        // Calculate the total amount per currency in rows and converts to map... 
        // eg : MAP {"02" : 1000} key => ccyNo , value => Amount
        const denomTotals = this.rows.value.reduce((acc: Map<string, number>, row: any) => {
          const key = row.ccyNo.toUpperCase(); // Convert to uppercase
          const amount = parseFloat(row.amount.replace(/,/g, '')); // Remove commas and parse to float
          acc.set(key, (acc.get(key) || 0) + amount);
          return acc;
        }, new Map<string, number>());

        // Calculate the total amount per currency in DealListing and converts to map... 
        // eg : MAP {"02" : 1000} key => ccyNo , value => Amount
        const dealTotals = this.dealListings.reduce((acc: Map<string, number>, deal: any) => {
          const key = deal.ccyNo.toUpperCase(); // Convert to uppercase
          acc.set(key, (acc.get(key) || 0) + parseFloat(deal.amountF));
          return acc;
        }, new Map<string, number>());
        
    
        // Check if all deals match the summed denomination amounts
        const isMatchingAmounts = [...dealTotals.keys()].every(ccyNo => 
          denomTotals.has(ccyNo) && denomTotals.get(ccyNo) === dealTotals.get(ccyNo)
        );        
    
        // Set the flag based on both conditions
        this.isDisabled = !(isMatchingCcyNos && isMatchingAmounts);
        console.log(this.isDisabled);
      }
}
// this function will be called when we need comma seprator in amount
formatValue(value : any){
  return value.toLocaleString('en-US') ;
 }
}
