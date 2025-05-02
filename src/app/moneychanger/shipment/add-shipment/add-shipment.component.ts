import { Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { DealsmcComponent } from '../../deals/viewdealsmc/dealsmc.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { CustomerTableComponent } from 'src/app/backoffice/customer/customersearch/customer-table.component';
import { CustomerSearchService } from 'src/app/core/services/customersearch.service';
import { countryArr } from 'src/assets/dropdownvalues';
import { AddBagComponent } from '../modals/add-bag/add-bag.component';
import { CorporateService } from 'src/app/core/services/corporate.service';
import { CorporateCustomerInquiry } from 'src/app/core/model/corporatecustomerinquiry/corporatecustomerinquiry';
import { ShipmentMaintenanceService } from 'src/app/core/services/shipment.service';
import { Address, AddShipment, ContactDetails, Deals } from 'src/app/core/model/shipment/add-shipment.model';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceConfirmationComponent } from '../modals/invoice-confirmation/invoice-confirmation.component';
import { UpdateDeals, UpdateShipment } from 'src/app/core/model/shipment/update-shipment.model';
import { shipmentWeekestCurrencyCode } from 'src/assets/dropdownvalues';
import { CaptureDenominationComponent } from '../modals/capture-denomination/capture-denomination.component';
import { shipmentMultiplyCurrencies } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-add-shipment',
  templateUrl: './add-shipment.component.html',
  styleUrls: ['./add-shipment.component.scss','../../../../assets/styles/tables/table-style.scss'],

})
export class AddShipmentComponent implements OnInit, OnDestroy {

  public customerForm : FormGroup = Object.create(null);
  public airwayDetailsForm : FormGroup = Object.create(null);
  public getScreenHeight: any;
  public getScreenWidth: any;
  openCustomerSearchloader : boolean = false ;
  launchButton : boolean = true ;
  filteredOptions!: Observable<any[]>;
  customerSearchRecords : any[] = [] ;
  options: any[] = [];
  customerId !: string ;
  customerPhnNo : string = "";
  customerNricNo !: string;
  customerName : string = "" ;
  customerNationality !: string ;
  customerType !: string ;
  retrievedCustomerCode !: string ;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  dealListings : any[] = [] ;
  modifiedDealListings : any[] = [];
  tableLoader = false;
  p: number = 1;
  itemsPerPage: number = 20;
  selectedValue !: string;
  filteredCountries : any[] = countryArr ;
  country : any[] = countryArr ;
  bagSequenceRow : any[] = [] ;
  customerInquiry : CorporateCustomerInquiry = new CorporateCustomerInquiry() ;
  primaryAddress : any[] = [] ;
  mappingAddress : Address = new Address() ;
  mappingContactDetails : ContactDetails = new ContactDetails() ;
  public tableForm = new FormGroup({});
  shippedDate : any;
  shipmentInquiry : any;
  showShipmentSearch = true;
  showMatToolbar = false;
  showUndoButton : Boolean[] = [];
  dealListingsBackup : any[] = [];
  shipmentId !: string ;
  shipmentStatusOptions = [
    { value: '1', label: 'INITIATED' , isDisable:false },
    { value: '2', label: 'IN-FLIGHT' , isDisable:false },
    { value: '3', label: 'DELIVERED' , isDisable:false },
    { value: '5', label: 'CANCELLED' , isDisable:false }
  ];
  statusFormControl = new FormControl('');
  weekestCurrencyCode = shipmentWeekestCurrencyCode ;
  readOnly = false;
  isDisableButtons = false;
  readOnlyDetails = false;
  isDisableOptions= false; //import/export and bank name dropdown
  denominationArray : any[] = [] ;
  denominationStorageArray : any[] = [] ;
  isDisableRemoveIcon = false;
  screenFlag = "ADD";
  multiplyDealCurrencies = shipmentMultiplyCurrencies ;
  shipmentStatus !: string ;
  selectedOption : String = "E";
  bankName : string = "";
  bankNameArray = [
    {VALUE : "DBS"},
    {VALUE : "OCBC"}
  ]
  isDisabled : boolean = false;
  consolidatedArray : any[]= []; // denomination to sent consolidated
  isDenominationCaptured : boolean = false;
  constructor(private titleService : TitleHeaderService, private fb : FormBuilder, private dialog : MatDialog, 
  private customerSearchService : CustomerSearchService,
    private corporateService : CorporateService, private shipmentService: ShipmentMaintenanceService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public dialogRef: MatDialogRef<AddShipmentComponent>,
     private store : InMemoryCache, private route: ActivatedRoute
  ) { }


  ngOnDestroy(): void {
   console.log("Component destroyed");
  }

  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 374 )+'px' , 'overflow-y' : 'auto' }; 
  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  displayFn(customerSearch: any): string {
    return customerSearch && customerSearch.NAME ? customerSearch.NAME : '';
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.NAME.toLowerCase().includes(filterValue));
    }

  ngOnInit(): void {
    this.titleService.setTitle('Add Shipment') ;

    //Customer Form Group
    this.customerForm = this.fb.group({
      "customerNameControl" : [null, [Validators.compose([Validators.required])]],
      "shippingAddress" : [null, [Validators.compose([Validators.required])]], 
      "shippedDate" : [null, [Validators.compose([Validators.required])]] ,
      "bankName" : ["DBS", [Validators.compose([Validators.required])]] 
    })

    //Airway Form Group
    this.airwayDetailsForm = this.fb.group({
      "flightNo" : [null, [Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 _\\-@.,;:()/\'"]+$')])]], // MENTION VALIDATION DETAIL--> This field is required and allows alphanumeric with specific special characters ._ @ , ; : / - ()
      "referenceNumber" : [null, [Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 _\\-@.,;:()/\'"]+$')])]], // MENTION VALIDATION DETAIL --> This field is required and allows alphanumeric with specific special characters ._ @ , ; : / - ()
      "destinationCountry" : [null, [Validators.compose([Validators.required])]], //MENTION VALIDATION DETAIL--> This field is only required, no validation pattern
      "destinationSearchCountry" : [null, Validators.compose([Validators.pattern('[a-zA-Z .]*$')])], //MENTION VALIDATION DETAIL--> This is required and allows only Alphabets
    })


  

    this.customerForm.patchValue({
      "shippedDate" : new Date()
    })

     //customer search service call (pull corporate and active) and implemented auto complete ..


    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    //this if will be satisified when entry flow is Search Shipment > onClick Edit icon > navigate to add shipment screen and patch values
      this.route.queryParams.subscribe(params => {
        if (params['shipmentId'] != null || params['shipmentId'] != undefined) { // Only when the shipmentId is there it will satisfy this If condition
      this.titleService.setTitle('Update Shipment') ;
      this.screenFlag = "UPD";
      this.isDisableOptions = true ;
      this.showShipmentSearch = false;
       this.readOnly = true; // shipped date and customer name are readonly
       this.isDisableButtons = true; // open customer serach button and shipped date datepicker toggle
       this.isDisableRemoveIcon = true; // Deal listing table > remove icon
      let updateShipmentResponse = this.store.getItem('SHIPMENT_UPDATE');// Retrieved the response that we stored in search shipment
      let updateShipmentdata = JSON.parse(updateShipmentResponse);
      this.shipmentInquiry = updateShipmentdata;
      this.customerId = this.shipmentInquiry.customerId ? this.shipmentInquiry.customerId : "";
      this.shipmentId = this.shipmentInquiry.shipmentId ? this.shipmentInquiry.shipmentId : "" ;
      this.selectedOption = this.shipmentInquiry.shipmentType ? this.shipmentInquiry.shipmentType : "E" ;
      //BE will send shipping address value in level element (inside address node)
      let shippingAddress = this.shipmentInquiry.address.level == 0 || this.shipmentInquiry.address.level == null ? '' : this.shipmentInquiry.address.level;
      let frameShippingAddress = shippingAddress ;
      const selectedCustomerName: any = { NAME : this.shipmentInquiry.address.name ? this.shipmentInquiry.address.name : "Customer Name Not Found" };
      this.customerName = this.shipmentInquiry.address.name ? this.shipmentInquiry.address.name : "";
      this.customerForm.patchValue({
        
        "customerNameControl" : selectedCustomerName,
        "shippedDate" : this.shipmentInquiry.shippedDate,
        "shippingAddress" : frameShippingAddress,
        "bankName" : this.shipmentInquiry.bankName ? this.shipmentInquiry.bankName : "DBS" ,
      })
      
      this.customerPhnNo = this.shipmentInquiry.contactDetails.phoneNbr;

      this.airwayDetailsForm.patchValue({
      "flightNo" : this.shipmentInquiry.flightNo,
      "referenceNumber" : this.shipmentInquiry.referenceNumber,
      "destinationCountry" : this.shipmentInquiry.destination
      })
      
      this.bagSequenceRow = this.shipmentInquiry.baggageDetails;

      this.mappingContactDetails = new ContactDetails({
        ctryCode : this.shipmentInquiry.contactDetails.ctryCode ,
        phoneNbr : this.shipmentInquiry.contactDetails.phoneNbr ,
        emailId : this.shipmentInquiry.contactDetails.emailId
      });

      let status = this.shipmentInquiry.status ? this.shipmentInquiry.status : "1" ;
      this.shipmentStatus = status ;
      if(status == "IN-FLIGHT"){
        this.readOnlyDetails = true; // shipping address, flightNo, airway reference no, destination values and field, add bag details. chips, rate(USD)
        this.shipmentStatusOptions = [
        { value: '1', label: 'INITIATED' , isDisable:true },
        { value: '2', label: 'IN-FLIGHT' , isDisable:false },
        { value: '3', label: 'DELIVERED' , isDisable:false },
        { value: '5', label: 'CANCELLED' , isDisable:false }
        ];
      }
      else if(status == "DELIVERED"){
        this.readOnlyDetails = true; // shipping address, flightNo, airway reference no, destination values and field, add bag details. chips, rate(USD)
        this.shipmentStatusOptions = [
        { value: '1', label: 'INITIATED' , isDisable:true },
        { value: '2', label: 'IN-FLIGHT' , isDisable:true },
        { value: '3', label: 'DELIVERED' , isDisable:false },
        { value: '5', label: 'CANCELLED' , isDisable:true } //Once delivered, we cant change status ...
        ];
      }
      else if(status == "CANCELLED"){
        this.readOnlyDetails = true; // shipping address, flightNo, airway reference no, destination values and field, add bag details. chips, rate(USD)
        this.shipmentStatusOptions = [
        { value: '1', label: 'INITIATED' , isDisable:true },
        { value: '2', label: 'IN-FLIGHT' , isDisable:true },
        { value: '3', label: 'DELIVERED' , isDisable:true },
        { value: '5', label: 'CANCELLED' , isDisable:false }
        ];
      }
      else { //INITIATED
        this.shipmentStatusOptions = [
        { value: '1', label: 'INITIATED' , isDisable:false },
        { value: '2', label: 'IN-FLIGHT' , isDisable:false },
        { value: '3', label: 'DELIVERED' , isDisable:false },
        { value: '5', label: 'CANCELLED' , isDisable:false }
        ];
      }
      let statusNo = this.shipmentStatusOptions.filter(v => v.label == status) ;
      this.statusFormControl.setValue(statusNo[0].value);
      
      this.dealListings = this.shipmentInquiry.dealDetails ;


      this.dealListingsBackup = this.dealListings;
      let backupDealSearch = JSON.stringify(this.dealListingsBackup) ;
      this.store.setItem('DEAL_LIST_BACKUP',backupDealSearch);

   this.dealListings.forEach((item,index)=>{
     const rateUsdControlName = `rateUsd${index}`;    //In Iterate formfield based on index, we add formcontrol for individual field like buyRate0,buyRate1,.....
         
         this.tableForm.addControl(rateUsdControlName, new FormControl(item.exchRateF, Validators.compose([Validators.required , Validators.pattern(/^\d{0,5}(\.\d{1,6})?$/) ,Validators.maxLength(16) ])  ));
        //  this.tableForm.patchValue({
        //   rateUsdControlName : item.exchRateF
        //  })

        this.denominationStorageArray = this.shipmentInquiry.denomination ? this.shipmentInquiry.denomination : [] // denomination values.
        this.denominationArray = this.shipmentInquiry.denomination ? this.shipmentInquiry.denomination : [] ;
  
   })
   this.autocompleteTrigger?.closePanel();
  

  }
});
    //}
  }

  responsiveExpansionPanel(){
    return { 
     // "background-color" : "rgb(245 245 245)",
     // "width" : (this.getScreenWidth - 320) + 'px',
      "border-radius": "7px",
      "margin-top" : "15px",
      "margin-left" : "10px",
      "margin-right" : "10px",
      "border" : "1px solid #c7c7c7",
      "height" : (this.getScreenHeight - 600) + 'px',
      'overflow-y': 'scroll'
  }
  }

  //Customer name field > Auto complete > When option is selected > this function triggers .
  onOptionSelectedCustomer(e:any){
    console.log(e.option.viewValue) ;
    let customerName = e.option.viewValue ? e.option.viewValue : "" ;
    
    // Split the string by colon and space
  let partsArray  = customerName.split(': ');
  // Extract the ID (assuming it's the second part)
  this.customerId = partsArray[1].trim();


        if(this.customerId){   //if valid customerId --> call customer inquiry service and open deal window .
          //call customer inquiry API --> Corporate
          this.callCustomerInquiryService('C',this.customerId,'') ;
        
        }
  }

  callDealInquiryService(customerId:string){
    //(ccyCode:string,customerId:string, customerName:string, buySellInd:string, status:string, id:string,dateGt:any, dateLt:any)
    this.dialog.open(DealsmcComponent,{
        data : {isTransactionReview : true , customerId :  customerId , isAddShipmentReview:true},
        panelClass: 'custom-modalbox',
       })
      .afterClosed().subscribe((response : any)=>{
        //After deal screen modal window is closed , again the auto complete suggestion was reflected in customer name field - Fixed
          this.autocompleteTrigger.closePanel();
          // when we have record in denomination and unexpectedly deleted all deals in table
          // again we have to call this function to enable button. 
          this.isDisableSave()
     
        if(response){
          if(response.data){
          //  this.dealListings = response.data ; //dealListings for iterating in table
          let listArray :any[] = response.data ;

          // Filter out items from listArray that already exist in dealListings based on dealItemId ...
    listArray = listArray.filter(item => 
      !this.dealListings.some(deal => deal.dealItemId == item.dealItemId)
  );

          console.log(response.data)
          if(listArray.length >= 1){
            this.dealListings = [...this.dealListings, ...listArray.map(item => ({ 
              "buySellInd" : item.buySellInd? item.buySellInd : "",
              "ccyNo" : item.ccyNo? item.ccyNo : "",
              "ccyCode" : item.ccyCode? item.ccyCode : "",
              "ccyName" : item.ccyName ? item.ccyName : "" ,
              "amountF" : item.balanceAmountF? item.balanceAmountF : "",
              "exchRate" :item.exchRate? item.exchRate : "",
              "amountL" : item.amountL? item.amountL : "",
              "valueDate" : item.valueDate? item.valueDate : "",
              "remarks" : item.remarks? item.remarks : "",
              "dealItemId" : item.dealItemId ? item.dealItemId : "",
              "actualAmountF" : this.weekestCurrencyCode.includes(item.ccyCode) ? (item.balanceAmountF * 1000) : item.balanceAmountF ,//newly added to use in add shipment request payload . 
              "actualAmount" : item.balanceAmountF? item.balanceAmountF : ""
             }))];

             this.dealListingsBackup = this.dealListings;
             let backupDealSearch = JSON.stringify(this.dealListingsBackup) ;
             this.store.setItem('DEAL_LIST_BACKUP',backupDealSearch);
          }

          this.dealListings.forEach((item,index)=>{
            const rateUsdControlName = `rateUsd${index}`;    //In Iterate formfield based on index, we add formcontrol for individual field like buyRate0,buyRate1,.....
                
                this.tableForm.addControl(rateUsdControlName, new FormControl(null, Validators.compose([Validators.required , Validators.pattern(/^\d{0,5}(\.\d{1,6})?$/) ,Validators.maxLength(16) ])  ));
         
          })

            console.log("Deal data Ok") ;
          }
          else{
            console.log("Deal data Not Ok") ;
          }
       }
     })
  }

   callCustomerInquiryService(customerType:string,customerId:string,result:any){
    if(customerType == "C"){ //for current req : only to support corporate customer for cargo .
        this.corporateService.getCorporateCustomerInquiry(customerId).subscribe(data => {
          console.log(data) ;
          this.customerInquiry = data ;

          this.customerId = data.customerId ? data.customerId : "Customer ID Not Specified" ;
          this.customerName = data.companyName ? data.companyName : "Customer Name Not Found" ;
          this.customerPhnNo = data.phone.phoneNo ? data.phone.phoneNo : "Contact Number Not Found"
          const selectedCustomerName: any = { NAME : data.companyName ? data.companyName : "Customer Name Not Found" };
          this.mappingContactDetails = new ContactDetails({
            ctryCode : data.phone.phoneCountryCode ,
            phoneNbr : data.phone.phoneNo ,
            emailId : data.email.emailId
          })
          
          let frameShippingAddress = "" ;

          this.primaryAddress = data.address.filter(v => v.isprimary == "Y") ; //filter address where isPrimary is Y .

           if(this.primaryAddress.length >= 1){

            let buildingName = this.primaryAddress[0].block ? this.primaryAddress[0].block : "" ; //add null check for all
            let streetName = this.primaryAddress[0].streetName ? this.primaryAddress[0].streetName : "" ;
            let level = this.primaryAddress[0].level ? this.primaryAddress[0].level : "";
            let unit = this.primaryAddress[0].unit ? this.primaryAddress[0].unit : ""; 
            let postalCode = this.primaryAddress[0].postalCode ? this.primaryAddress[0].postalCode : "" ;
            let country = this.primaryAddress[0].country ? this.primaryAddress[0].country : "" ;

            frameShippingAddress = buildingName + "," + streetName + "," + level + "-" + unit + "," + postalCode + "," + country ;
           }
           else{
            console.log("no primary address found") ;
           }
          this.customerForm.patchValue({
            customerNameControl: selectedCustomerName,
            shippingAddress : frameShippingAddress
           });
           
           //shipping address format --> <blk><streetname> , floor-unit number, postal code , country .
          this.customerType = data.customerType ? data.customerType : "Customer Type Not Found" ;
         

          console.log("customer search data Ok") ;
          //call deal master api only when manualSettlementFlag is false
            this.callDealInquiryService(customerId) ;

        }) 
      
    }
  }

@HostListener('document:keydown', ['$event'])
handleKeyUpEvent(event: KeyboardEvent) {

  //open customer search
    if(event.key == "F1"){
    event.preventDefault(); // Prevent default browser behavior
    //whenever user clicks F1 , Initially will check if there are any modal is opened , if any modal opened , will not trigger operCustomerSeacrh function
    if(this.dialog.openDialogs.length == 0){
      this.openCustomerSearch()
    }
    }
  }

  openCustomerSearch(){
    let status = "1";
    this.openCustomerSearchloader = true ;
    this.launchButton = false ;
 
    const dialogRef = this.dialog.open(CustomerTableComponent,{
      data:{mcAddDealCustomerReview: true , customerTable: [],  titleName : 'Add Shipment'},
      panelClass: 'custom-modalbox',
      width:'1255px',
    })
    dialogRef.afterOpened().subscribe(() => {
      this.openCustomerSearchloader = false;
      this.launchButton = true;
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      let res = result.customerId ? result.customerId : "";
      if(res != ""){
        this.retrievedCustomerCode = res ;
          //call customer inquiry API --> Corporate
          this.callCustomerInquiryService('C',res,result) ;
   
      }
      else{
       console.log("No data") ;
      }
    })
    
    
    
    }

  contentScrollable(){
    return {'height': '117px','position':'relative','opacity':'2'}
  }

  filterDestinationCountry(country:HTMLInputElement){
    country.value = country.value.toUpperCase() ;
    if (country.value == '') {
      // If the search input is empty, show all countries
      this.filteredCountries = this.country;
  }
  else {
      // Filter countries based on the search input
      this.filteredCountries = this.country.filter((v: any) => v.COUNTRY.includes(country.value));
      if(this.filteredCountries.length == 0){
        this.filteredCountries = this.country;
      }  
  }
  }

  openAddBag(indicator:string,record:any){
    this.dialog.open(AddBagComponent, {
      width:'500px',
      panelClass: 'custom-modalbox',
      data : {indicatorFlag: indicator , chipData:record}
    }).afterClosed().subscribe((data:any) =>{
      //After closing Add Bag flow..
      if(data && data.bagObject != "No Data" && data.buttonFlagIndicator == "Add" ){
        let findBagIndex = this.bagSequenceRow.findIndex(v => v.number == data.bagObject.number) ;
        //we should find any exisiting bag no in bag sequence array and latest bag no in bagObject should not be same..because Bag Number is UNIQUE IN SERVER
        // If the bag number doesn't already exist in the sequence array, add the bagObject to the sequence.
        if(findBagIndex == -1){
          this.bagSequenceRow.push(data.bagObject) ;
          //duplicated bag no aren't allowed .
        }
        console.log(this.bagSequenceRow) ;
      }
       //After closing Update Bag flow..
      else if(data && data.bagObject != "No Data" && data.buttonFlagIndicator == "Update" ){
       //while update shipment scenario, made bag number as primary key .
         this.bagSequenceRow.forEach(v => { 
          if(v.number == data.bagObject.number){
            v.number = data.bagObject.number,
            v.dimension = data.bagObject.dimension,
            v.weight = data.bagObject.weight
          }
       })

       console.log(this.bagSequenceRow) ;
      }
    })
  }

  
//remove chip - bag details chips
  removeChip(removedObject:any,index:number){
    console.log(removedObject) ;
    console.log(index) ;
   this.bagSequenceRow.splice(index,1)
  }

  //On Blur --> Rate USD field in deal table .
  onBlurRate(e:any,i:number,rateUsd:number,amountF:number,actualAmount:number,ccyCode:string){
    this.dealListings[i].exchRateF = rateUsd ;  //rate in USD mapped in exchRateF element (dealListings)
    let updateShipmentFlow = this.data.isEditShipmentReview ;
    this.multiplyDealCurrencies ; // You will find array of strings in this ref variable ...
    if(rateUsd){ //If user entered rateUsd
    if(actualAmount && updateShipmentFlow){  //When Rate USD was changed when entry point is Shipment search > Update Shipment
      //Here update code --> If f.currency included in this array (multiplyDealCurrencies) :
      // perform calculation : actualAmount * rateUsd else actualAmount / rateUsd ;
      if (this.multiplyDealCurrencies.includes(ccyCode)) { // Check whether the ccyCode is included in the multipleDealCurrencies Array
        // If the currency is in the array, perform multiplication
        this.dealListings[i].amount = (actualAmount * rateUsd).toFixed(2);
      } else{
        // If the currency is not in the array, perform division 
        this.dealListings[i].amount = (actualAmount / rateUsd).toFixed(2) ;
    }
  }
    else{  //When Rate USD was changed when entry point is Add Shipment
      //Here update code --> If f.currency included in this array (multiplyDealCurrencies) :
      // perform calculation : amountF * rateUsd else amountF / rateUsd ;
      if (this.multiplyDealCurrencies.includes(ccyCode)) { // Check whether the ccyCode is included in the multipleDealCurrencies Array
        // If the currency is in the array, perform multiplication
        this.dealListings[i].amount = (amountF * rateUsd).toFixed(2);
      }else{
        // If the currency is not in the array, perform division
      this.dealListings[i].amount = (amountF / rateUsd).toFixed(2) ;
      }
    }
  }
    //PLS VALIDATE THOROUGHLY USING DEBUG AND VERIFY ITS WORKING....
    console.log(this.dealListings) ;
    // after table populated while enter RATE USD
    // we should check this function to enable or disable button
    this.isDisableSave();
  }

   //remove specific record 
   removeRecord(index:any){
    console.log(index) ;
    this.dealListings.splice(index,1) ;
    // the control keys follow a pattern like "control0", "control1", etc.
  const controlKey = `rateUsd${index}`;

  if (this.tableForm.contains(controlKey)) {
    this.tableForm.patchValue({ [controlKey]: '' }); // Patch empty string
    this.tableForm.removeControl(controlKey);
    // on removing record we should enable or disable button
    this.isDisableSave();
  } else {
    console.log(`Control with key ${controlKey} not found in tableForm`);
  }

  }


  //on save shipment --> call add shipment service..
  onSaveShipment(){
   
    this.shipmentService.addShipment(this.buildPayload(),this.customerId).subscribe((data:any)=>{
      if(data){
        this.dialog.open(InvoiceConfirmationComponent, {
          disableClose : true,
          width:'500px',
          height: '164px',
          panelClass: 'custom-modalbox',
          data : {shipmentId: data.shipmentId}
        }).afterClosed().subscribe((data:any) => {
          let shipmentId = data.shipmentId ;
          if(data.message == "receipt-downloaded" && shipmentId){
         this.shipmentService.shipmentDownloadReceipt(shipmentId).subscribe((data:ArrayBuffer)=>{
          // Handle the ArrayBuffer data here
          const blob = new Blob([data], { type: 'application/pdf' });
        
          // Create a File with a specified filename
          const filename = `${this.shipmentId}-RECEIPT.pdf` ;
    
          const file = new File([blob], filename, { type: 'application/pdf' });
    
          // Create a data URL from the File
          const url = URL.createObjectURL(file);
    
          // Open the PDF in a new tab or download as needed
          window.open(url);

          this.router.navigate(['shipment/search']); 
         },
         (error:any)=>{
          if(error.status != 401){
            this.dialog.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
            }) ;
          }
         } 
        )
          }
          else if(data.message == "receipt-not-downloaded"){
            this.router.navigate(['shipment/search']);
          }
        })
      }
      //Once service is success ..
      // Open a modal winow saying "do you want to print receipt for this shipment ?" 
      // Component : InvoiceConfirmationComponent
      // after closed --> receipt download - ngOnDestroy and navigate back to search shipment .
      // after closed --> receipt not downloaded - ngOnDestroy and navigate back to search shipment .

    },
   //error Handling
   (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
      }) ;
    }
   } 
  )
  }

  buildPayload():AddShipment{
    var shipped_date: any = moment(this.customerForm.controls.shippedDate.value);
    this.shippedDate = shipped_date.format('YYYY-MM-DD'); 
    this.bankName = this.customerForm.controls['bankName'].value ;
     return new AddShipment({
       "customerId": this.customerId,
       "shippedDate": this.shippedDate, //new field and map its form control
       "status": "1", //hardcoded
       "flightNo": this.airwayDetailsForm.controls['flightNo'].value,
       "referenceNumber": this.airwayDetailsForm.controls['referenceNumber'].value,
       "destination": this.airwayDetailsForm.controls['destinationCountry'].value,
       "address": this.buildAddress(),
       "contactDetails" : this.mappingContactDetails,
       "baggageDetail" : this.bagSequenceRow,
       "deals" : this.buildDealDetailsPayload(),
       "denomination" :  this.buildDenominationPayload(), // newly added denomination details
       "shipmentType" : this.selectedOption ,
       "bankName" : this.bankName

     })
  }

  buildAddress(): Address {
    let shippingAddress = this.customerForm.controls['shippingAddress'].value;
    //This should be the format of shipping address in Add shipment > buildingName + "," + streetName + "," + level + "-" + unit + "," + postalCode + "," + country ;

    let address = new Address({
      "name": this.customerName,
      "level": shippingAddress,
      "unit": "",
      "block": "",
      "street": "",
      "city": "",
      "state": "",
      "country": "",
      "postalCode": "",
    });
    this.mappingAddress = address;
    return address
  }

  buildDealDetailsPayload():Deals[]{
    let dealList = this.dealListings ;
    console.log(dealList) ;
   // Extracting specific properties from each object
   this.modifiedDealListings = dealList.map(item => {
  return {
    "dealItemId": item.dealItemId,
    "buySellInd": item.buySellInd,
    "ccyNo": item.ccyNo,
    "ccyCode": item.ccyCode,
    "amountL": item.amountL, // sgd
      //Here update code for amount element --> If f.currency included in this array (multiplyDealCurrencies) :
      // perform calculation : actualAmountF * exchRateF else actualAmountF / exchRateF ;
      //usd --> actualAmountF is declared already in dealListing response and performed the calculation for amountF (weekest ccy and non-weekest ccy)
    "amount": this.multiplyDealCurrencies.includes(item.ccyCode) ? (item.actualAmountF * item.exchRateF).toFixed(2) : (item.actualAmountF / item.exchRateF).toFixed(2), // Calculate based on whether it's in the multiply currencies list 
    "exchRateF": item.exchRateF, 
    "exchRateL": item.exchRateL, 
    "valueDate": item.valueDate,
    "remarks": item.remarks,
    "multiplyDealAmount" : this.weekestCurrencyCode.includes(item.ccyCode) ? "1000" : "1" //map either 1 or 1000, based on this condition --> weekest ccy '1000' else '1' .
  };
});

    return this.modifiedDealListings
  }


  //Disable/enable button when all details are valid
  isDisableSaveBtn():Boolean{
   let isCustomerFormValid = this.customerForm.valid ;
   let isAirwayFormValid = this.airwayDetailsForm.valid ;
   let isTableFormValid = this.tableForm.valid ;
   let baggageArrayLength = this.bagSequenceRow.length ;
   let dealArrayLength = this.dealListings.length ;
   let denominationArrayLength = this.denominationArray.length;
   let isDenominationArrayValid: boolean= false  ;
   if(denominationArrayLength >=1){
    isDenominationArrayValid = this.denominationArray.every(item => {
      return item.ccyCode != '' && item.ccyNo != '' && item.ccyValue > 0 && item.count > 0 && item.amount != '';
    //   ccyCode: ['' , [Validators.compose([Validators.required , Validators.pattern('[a-zA-Z .]*$')])]],
    // ccyNo : ['' , [Validators.compose([Validators.required])]] ,
    // ccyValue: [0 , [Validators.compose([Validators.required])]], //Denomination (Its a dropdwon)
    // count: [0 , [Validators.compose([Validators.required, Validators.pattern('^[0-9 ]+$')])]],  //Quantity 
    // amount: ['' , [Validators.compose([Validators.required])]]
    });
   }
   if(isCustomerFormValid == true && isAirwayFormValid == true && isTableFormValid == true && baggageArrayLength >=1 && 
    dealArrayLength >= 1 && isDenominationArrayValid){
      return false; //enable save/print (or) Update button
    }
    else{
      return true ; //disable save/print (or) Update button
    }
  }

  goToShipmentSearch(){
    //navigation to shipment search TODO
    this.router.navigate(['shipment/search']);
  }

  //Update shipment service
  updateShipment(){
   this.shipmentService.updateShipment(this.buildUpdateShipmentPayload(),this.shipmentId).subscribe((data:any)=>{
    console.log(data);
    if(data){
      this.dialog.open(InvoiceConfirmationComponent, { //Entry point > search shipment > onClick edit icon > update > Open invoice confirmation dialog 
        disableClose : true,
        width:'500px',
        height: '184px',
        panelClass: 'custom-modalbox',
        data : {shipmentId: data.shipmentId}
      }).afterClosed().subscribe((data:any) => {
        let shipmentId = data.shipmentId ;
        if(data.message == "receipt-downloaded" && shipmentId){
       this.shipmentService.shipmentDownloadReceipt(shipmentId).subscribe((data:ArrayBuffer)=>{
        // Handle the ArrayBuffer data here
        const blob = new Blob([data], { type: 'application/pdf' });
      
        // Create a File with a specified filename
        const filename = `${this.shipmentId}-RECEIPT.pdf` ;
  
        const file = new File([blob], filename, { type: 'application/pdf' });
  
        // Create a data URL from the File
        const url = URL.createObjectURL(file);
  
        // Open the PDF in a new tab or download as needed
        window.open(url);

        this.router.navigate(['shipment/search']); 
       },
       (error:any)=>{
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
          }) ;
        }
       } 
      )
        }
        else if(data.message == "receipt-not-downloaded"){
          this.router.navigate(['shipment/search']);
        }
      })
    }
    //success case .
   },
   //error handling
   (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
      }) ;
    }
   } 
  
  )
  }


  buildUpdateShipmentPayload():UpdateShipment{
    var shipped_date: any = moment(this.customerForm.controls.shippedDate.value);
    this.shippedDate = shipped_date.format('YYYY-MM-DD'); 
    return new UpdateShipment({
      //build here .
      "customerId": this.customerId,
      "shippedDate": this.shippedDate, //new field and map its form control
      "status": this.statusFormControl.value, //status Value sent dynamically
      "flightNo": this.airwayDetailsForm.controls['flightNo'].value,
      "referenceNumber": this.airwayDetailsForm.controls['referenceNumber'].value,
      "destination": this.airwayDetailsForm.controls['destinationCountry'].value,
      "address": this.buildAddress(),
      "contactDetails" : this.mappingContactDetails,
      "baggageDetail" : this.bagSequenceRow,
      "deals" : this.buildUpdateDealDetailsPayload(),
      "denomination" : this.isDenominationCaptured ? this.buildDenominationPayload() : this.denominationArray, // newly added denomination details
      "bankName" : this.customerForm.controls['bankName'].value,
      "shipmentType" : this.selectedOption 
  })
  }

  buildUpdateDealDetailsPayload():UpdateDeals[]{
    let dealList = this.dealListings ;
    console.log(dealList) ;
   // Extracting specific properties from each object
   this.modifiedDealListings = dealList.map(item => {
  return {
    "dealItemId": item.dealItemId,
    "buySellInd": item.buySellInd,
    "ccyNo": item.ccyNo,
    "ccyCode": item.ccyCode,
    "amountL": item.amountL, // sgd
    "amount": item.amount, //usd
    "amountF" : item.amountF,
    "exchRateF": item.exchRateF,
    "exchRateL": item.exchRateL,
    "valueDate": item.valueDate,
    "remarks": item.remarks,
    "multiplyDealAmount" : this.weekestCurrencyCode.includes(item.ccyCode) ? "1000" : "1" //map either 1 or 1000, based on this condition --> weekest ccy '1000' else '1' .
  };
});

    return this.modifiedDealListings
  }

  calculateFamount(fAmount:number, i:number, rateUsd:number, ccyCode:string){
    this.dealListings[i].amountF = fAmount * 1000 ;
    let calculatedfAmount = fAmount * 1000;
    this.showUndoButton[i] = true;
    if(rateUsd){ //Check user entered Rate (USD) value
    //Here update code --> If f.currency included in this array (multiplyDealCurrencies) :
      // perform calculation : calculatedfAmount * rateUsd else calculatedfAmount / rateUsd ;
    // Check if the currency is in the shipmentMultiplyCurrencies array
  if (this.multiplyDealCurrencies.includes(ccyCode)) {
    // If the currency is in the array, perform multiplication
    this.dealListings[i].amount = (calculatedfAmount * rateUsd).toFixed(2);
  } else {
    // If the currency is not in the array, perform division
    this.dealListings[i].amount = (calculatedfAmount / rateUsd).toFixed(2);
  }
}
  }

  undoFamount(fAmount:number, i:number, rateUsd:number, ccyCode:string){
    let backupDeal = this.store.getItem('DEAL_LIST_BACKUP')
    let parsedDealBackup = JSON.parse(backupDeal)
    this.dealListings[i].amountF = parsedDealBackup[i].amountF
    let undoFamount = parsedDealBackup[i].amountF
    this.showUndoButton[i] = false;
    if(rateUsd){ //Check user entered Rate (USD) value
    //Here update code --> If f.currency included in this array (multiplyDealCurrencies) :
      // perform calculation : undoFamount * rateUsd else undoFamount / rateUsd ;
       // Check if the currency is in the shipmentMultiplyCurrencies array
  if (this.multiplyDealCurrencies.includes(ccyCode)) {
    // If the currency is in the array, perform multiplication
    this.dealListings[i].amount = (undoFamount * rateUsd).toFixed(2);
  } else{
    // If the currency is not in the array, perform division
    this.dealListings[i].amount = (undoFamount / rateUsd).toFixed(2) ;
  }
}
  }

  onCaptureDenomination(){
    this.dialog.open(CaptureDenominationComponent,{
      panelClass: 'custom-modalbox',
      width:'1255px',
      height : '885px',
      data : {data : this.denominationStorageArray ? this.denominationStorageArray : [],flag: this.screenFlag , shipmentStatus : this.shipmentStatus ? this.shipmentStatus : "" , dealListings :this.dealListings},// When open capture shipment modal again after details given, display those given details from denominationStorageArray
      disableClose : true
    }).afterClosed().subscribe((datas:any)=>{
      if(datas.data){
        let denominationFormArray : any[] = datas.data.controls ; // will contain FormGroup .. in a array of elements format
       if(this.screenFlag == "ADD"){
        this.denominationStorageArray = datas.data.controls ; // will contain FormGroup .. in a array of elements format
       }
       else if(this.screenFlag == "UPD"){ // added for update flow --> we need to update the latest denomination storage array once dialog is closed 
        this.denominationStorageArray = [] ;
        this.denominationStorageArray = datas.data.value ;
        this.isDenominationCaptured = true;
       }

       this.denominationArray = [];


        denominationFormArray.forEach(items => {
          let receivedObject = items.controls

          // Creating an object to store the values
          let storedValues = {
            amount: receivedObject.amount.value,
            ccyCode: receivedObject.ccyCode.value,
            ccyNo: receivedObject.ccyNo.value,
            ccyValue: receivedObject.ccyValue.value, //number
            count: receivedObject.count.value, //number
          };

          this.denominationArray.push(storedValues) ; // To send the denomination details as an array of objects during save and update
        })
        console.log(this.denominationArray);
        
      }
      // after captured denomination we have to call this function to enable or disable button
      this.isDisableSave();
    })
  }

  

  // {
  //   "customerId": "Ce2ace57b31",
  //   "shippedDate": "2024-08-08",
  //   "status": "1",
  //   "flightNo": "S543F34",
  //   "referenceNo": "21",
  //   "destination": "UAE",
  //   "address": {
  //     "name": "Leo",
  //     "unit": "23",
  //     "block": "B",
  //     "buildingName": "APT",
  //     "street": "Main road",
  //     "city": "Trichy",
  //     "state": "Tamilnadu",
  //     "country": "India",
  //     "postalCode": "620001"
  //   },
  //   "contactDetails": {
  //     "ctryCode": "1400",
  //     "phoneNbr": "9944672345",
  //     "emailId": "leoprakash22@gmail.com"
  //   },
  //   "baggageDetail": [
  //     {
  //       "number": "1",
  //       "weight": "89",
  //       "dimension": "7*12*23"
  //     }
  //   ],
  //   "deals": [
  //     {
  //       "dealItemId": "37172284054001",
  //       "buySellInd": "S",
  //       "ccyNo": "1",
  //       "ccyCode": "SGD",
  //       "amountL": "3243.433",
  //       "amountF": "2323",
  //       "exchRateF": "1.00",
  //       "exchRateL": "4223.22",
  //       "valueDate": "2024-08-05",
  //       "remarks": "salary"
  //     }
  //   ]
  // }
  
  onEnterKey(event: any, value : any) {
    if (event.key === 'Enter') {
      if(value !== ''){
        this.onCustomerNameInputChange(value);
      }
    }
  }
  onCustomerNameInputChange(value:any){
    
      // Convert to string if it's a number to handle numeric inputs
      const inputValue = value.toString().trim();
      
      // Check if the input contains only numbers
      const isNumber = /^\d+$/.test(inputValue);
      
      // Check if the input contains only letters (and spaces)
      const isString = /^[a-zA-Z\s]*$/.test(inputValue);
    
      if (isNumber) {
        console.log('Input is a number');
        // checking minimum length
        if(inputValue.length>=1){
        // call customer Search
        let customerType = ""
        let status = "1";
        this.customerSearchService.getCustomerSearch(customerType,status,"",inputValue).subscribe((datas:any)=>{
         this.customerSearchRecords = datas['data'] ;
          // mat auto complete implementation..
        this.options = this.customerSearchRecords.map(item => ({NAME : item.NAME, CUSTOMERID: item.CUSTOMERID, ALIASNAME: item.ALIASNAME})) ;
        this.filteredOptions = this.customerForm.controls['customerNameControl'].valueChanges.pipe(
         startWith(''),
         map(value => {
          return typeof value === 'string' ? this._filter(value) : this.options.slice();
         }),
       );
        (error:any)=>{
          if(error.status != 401){
            this.dialog.open(ErrorDialogAdminComponent,{
              data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
            }) ;
          }
        }
      }
      )
        }
      } else if (isString) {
        console.log('Input is a string containing only letters');
        // checking minimum length 
        if(inputValue.length>=3){
         // call customer Search
         let customerType = ""
         let status = "1";
         this.customerSearchService.getCustomerSearch(customerType,status,inputValue,"").subscribe((datas:any)=>{
          this.customerSearchRecords = datas['data'] ;
         // mat auto complete implementation..
        this.options = this.customerSearchRecords.map(item => ({NAME : item.NAME, CUSTOMERID: item.CUSTOMERID, ALIASNAME: item.ALIASNAME})) ;
        this.filteredOptions = this.customerForm.controls['customerNameControl'].valueChanges.pipe(
         startWith(''),
         map(value => {
          return typeof value === 'string' ? this._filter(value) : this.options.slice();
         }),
       );
         (error:any)=>{
           if(error.status != 401){
             this.dialog.open(ErrorDialogAdminComponent,{
               data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
             }) ;
           }
         }
       }
       )
        }
        else if (inputValue.length < 3) {
          console.log("enter atleast 3 characters");
          this.customerForm.controls['customerNameControl'].setValidators([Validators.minLength(3)]);
          this.customerForm.controls['customerNameControl'].updateValueAndValidity(); 
             }
      } else {
        console.log('Input contains mixed or special characters');
      }
    }
    onSelectionChange(event: any) {
      console.log("Selected Value:", event.value);
      this.selectedOption = event.value
    }
    isDisableSave() {
      if (this.denominationArray) {
        // Calculate the total amount per currency in rows and converts to map... 
        // eg : MAP {"02" : 1000} key => ccyNo , value => Amount
        const denomTotals = this.denominationArray.reduce((acc: Map<string, number>, row: any) => {
          const key = row.ccyNo.toUpperCase(); // Convert to uppercase
          const amount = typeof row.amount == 'string' ? parseFloat(row.amount.replace(/,/g, '')) : parseFloat(row.amount); // Remove commas and parse to float
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
        const isMatchingAmounts = dealTotals.size === denomTotals.size &&  // Ensure both maps have the same number of keys
        [...denomTotals.keys()].every(ccyNo => 
            dealTotals.has(ccyNo) && dealTotals.get(ccyNo) === denomTotals.get(ccyNo)
        );        
    
        // Set the flag based on both conditions
        this.isDisabled = ! isMatchingAmounts;
        console.log(this.isDisabled);
      }
    }

    // this function will be called when save changes / update button clicked
    buildDenominationPayload(){
      // for every object in denomination array will checked for repetaed ccyNo and Denomination
      this.denominationArray.forEach((row: any) => {
       
          // if object does not exist in consolidated array object will be pushed into it.
          this.consolidatedArray.push({
            ccyNo: row.ccyNo,
            ccyCode: row.ccyCode,
            ccyValue: row.ccyValue,
            amount: parseFloat(row.amount.replace(/,/g, '')),
            count: parseInt(row.count, 10)
          });
        
      });

      console.log(this.consolidatedArray);
      // consolidated array will be returned to buildPayload.
      return this.consolidatedArray;
          }
}


//README :
// Change descripion : 
// you have changes in following functions :
// calculateFamount() , undoFamount() , onBlurRate() , onSaveShipment() >>> buildDealPayload()
