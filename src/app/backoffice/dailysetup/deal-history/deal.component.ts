import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddDealComponent } from '../../shared/modals/add-deal.component';
import { AddDeal, AgentList, RetrieveDeals } from '../model/deal';
import { NewDealService } from 'src/app/core/services/new-deal.service';
import { DealBookingComponent } from '../deal-booking/deal-booking.component';
import _ from 'lodash';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { organisation , initiatedBy, dealSearchFilterCurrency } from 'src/assets/dropdownvalues';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RetrieveTransactionInquiry } from 'src/app/agent/models/agent.model';
import { AgentServiceService } from 'src/app/agent/agent-service.service';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
import { ViewDealSummaryComponent } from '../modals/view-deal-summary/view-deal-summary.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss','../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],
  
})
export class DealComponent implements OnInit {
  p: number = 1;
  isActive = false;
  agentName !: string;  //agent initiated tab
  getDeals: RetrieveDeals[] = []; 
  getAgentDeal : RetrieveDeals[] = []; 
  getAgents : AgentList[]=[];
  myDate:any= new Date();
  selectedStatus !: string;
  organisationName : string = organisation;
  initiatedBy : string[] = initiatedBy;
  selectedType : any;
  selectedDealStatus : any;
  loadOrgInitiated : Boolean = false;
  loadAgentInitiated : Boolean = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  filterForm : FormGroup = Object.create(null);
  getTransactionInquiry : RetrieveTransactionInquiry[] = [] ;
  expandedRecord: any; // Store the currently expanded record
  loading: boolean = false;
  selectedCountryCode !: string;
  selectedForeginCurrency = new FormControl('');
  currencyCodeArray: any[] = dealSearchFilterCurrency ;
  minStartDate!: Date;
  maxStartDate!: Date;
  minEndDate!: any;
  maxEndDate!: any;
  validateEndDate: any;
  validateStartDate: any;
  xpandStatus = false;
  filterValues: any[] = [];
  sendCurrency: string = '';
  recordsCount: any = '';
  searchFieldTyped: Boolean = false;
  finalTransactionStatusArray: any = "";
  patchStartDate: any = "";
  patchEndDate: any = "";
  dateGt: any = "";
  dateLt: any = "";
  searchName : any ;
  itemsPerPage = 20 ;
  checkBoxArray : any[] = [] ;
  averageRate : number = 0 ;
  searchDealId : string = ""

  constructor(public dialogRef: MatDialog,private router: Router,private dealService: NewDealService,private fb : FormBuilder,
    private datePipe: DatePipe,private store:InMemoryCache,private headerService : TitleHeaderService,private snackBar: MatSnackBar,
    private agentService : AgentServiceService) { 
      this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    }

    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }


  ngOnInit(): void {
    this.headerService.setTitle('Deals');
    this.filterForm = this.fb.group({
      "agentName" : [null,Validators.compose([Validators.pattern("^[a-zA-Z ]+$")])],
      "startDate": [null],
      "endDate": [null],
      "dealId" : [null,Validators.compose([Validators.pattern("^[0-9]+$")])]
    })
    
    //onLoad - org deal summary api call
     this.getOrganisationDeal();
     this.selectedDealStatus = 'INPROGRESS';
     let dealStatus = "Pending" ;
     var onLoadObj = {"fieldName" : "Deal Status" , "value" : dealStatus} ;
     this.filterValues.push(onLoadObj) ;
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

  changeTableHeight() {
    return { 'height': (this.getScreenHeight - 288) + 'px', 'overflow-y': 'auto' };
  }
  //this function called in ngOnInit , onLoad - deal summary api call 
  getOrganisationDeal(){
    this.loadOrgInitiated = true;
    setTimeout(() => {
      this.dealService.getDealSummary(this.selectedStatus,this.organisationName).subscribe((datas:any) => {
        this.getDeals = datas['data'];
        this.recordsCount = this.getDeals.length ;
        this.loadOrgInitiated = false;
        this.store.setItem('DealSummary',datas['data']);
        },
         //error handling completed on 05/07/2023
     (error:any)=>{
      this.loadOrgInitiated = false ;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent)
      }
    }
        )
    }, 800);
  }

  getAgentDeals(){
    this.loadAgentInitiated = true;
    setTimeout(() => {
      this.dealService.getDealSummary(this.selectedStatus,'Agent').subscribe((datas:any) => {
        this.getAgentDeal = datas['data'];
        this.loadAgentInitiated = false;
        this.store.setItem('DealSummary',datas['data']);
        })
    }, 800);
  }

 //add new deals => add icon button clicked 
  addDeal(){
      //get agent list in dropdown
      this.dealService.getAgentList().subscribe((datas:any) =>{
        this.getAgents = datas['data'];
        this.getAgents = this.getAgents.filter((v:any) => v.ENTITYNAME != "DBS");
        this.dialogRef.open(AddDealComponent, {
          data : {agentData : this.getAgents},
          panelClass: 'custom-modalbox',
          height:'325px',
          width:'1250px'
         })
         .afterClosed().subscribe( val=>{
          console.log(val);
          this.getOrganisationDeal();
        //  this.getAgentDeals(); therefore we will not call agent deals here !
          this.headerService.setTitle('Deals');
       
      })
      },
       //error handling done on 03-07-2023
     (error:any) =>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
      )
     
    }
    onChange(event: MatTabChangeEvent) {
      const tab = event.tab.textLabel;
      console.log(tab);
      this.selectedType = '';
      this.selectedDealStatus = '';
      if(tab=== this.organisationName + " Initiated Deals")
       {
        this.getOrganisationDeal();
        }
        if(tab==="Agent Initiated Deals")
        {
          this.getAgentDeals();
         }
    } 

    resetFilter(){
      this.xpandStatus = false ; //close panel
      //clear the filter object and push new .
      this.filterValues = [] ;
      this.selectedDealStatus = 'INPROGRESS';
      let dealStatus = "Pending" ;
      var onLoadObj = {"fieldName" : "Deal Status" , "value" : dealStatus} ;
      this.filterValues.push(onLoadObj) ;

      this.searchName = "" ;
      let initiatedBy = this.organisationName ;
      this.selectedForeginCurrency.setValue('');
      var sendCcy = '';
      this.sendCurrency = "" ;
      this.selectedCountryCode = "" ;
      this.filterForm.controls['startDate'].setValue(null) ;
      this.filterForm.controls['endDate'].setValue(null) ;
      this.dateGt = "" ;
      this.dateLt = "" ;
      this.maxEndDate = null;
      this.minEndDate = null;
      this.searchDealId = "";

    
      this.loadOrgInitiated = true;

      setTimeout(() => {
        this.dealService.filteredDealSummary(this.searchName,this.selectedDealStatus,initiatedBy,sendCcy,this.dateGt,this.dateLt,this.searchDealId).subscribe((datas:any) => {
          this.getDeals = datas['data'];
          this.recordsCount = this.getDeals.length ;
           // Reset page to 1
          this.p = 1;
          this.loadOrgInitiated = false;
          this.store.setItem('DealSummary',datas['data']);
    
          },
           //error handling completed on 04/07/2023
(error:any)=>{
  this.loadOrgInitiated = false;
if(error.status != 401){
  this.dialogRef.open(ErrorDialogAdminComponent)
}
}
          )
      }, 1000);


    }
    applyFilter(dealStatus:string,initiatedBy:string){
      //null or undefined check
      let name : string = this.filterForm.controls['agentName'].value ;
      name = name ? name : "" ;
      dealStatus = dealStatus ? dealStatus : "" ; 
      this.selectedCountryCode = this.selectedCountryCode ? this.selectedCountryCode : "" ;
      this.xpandStatus = false ; //close the expansion panel
      if (this.selectedCountryCode != "") {
        const index = this.currencyCodeArray.findIndex((v: any) => v.FLAG == this.selectedCountryCode);
        this.sendCurrency  = this.currencyCodeArray[index].CURRENCYCODE;
      }
      else {
        this.sendCurrency = "";
      }
      // Clear the filters array 
    this.filterValues = [];
    if(this.filterForm.controls.startDate.value != null || this.filterForm.controls.endDate.value != null){
    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value);
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

     // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     this.patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
     this.patchEndDate =  end_date._d.toLocaleDateString('en-GB', options);

    if(this.patchStartDate == 'NaN-NaN-NaN'){
      this.patchStartDate = "" ;
    }
    if(this.patchEndDate == 'NaN-NaN-NaN'){
      this.patchEndDate = "" ;
    }
     //pushing dates
     var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
     var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
     this.filterValues.push(obj1);
     this.filterValues.push(obj2);
    }
    else{
      this.dateGt = "" ;
      this.dateLt = "" ;
    }
    if(name != ""){
      const newFilterObject = { "fieldName": "Agent Name", "value": name };
      this.filterValues.push(newFilterObject);
    }
    if(dealStatus != ""){
      let externalDealStatus = "" ;
      if(dealStatus == "INPROGRESS"){
        externalDealStatus = "Pending" ;
      }
      else if(dealStatus == "CLOSED"){
        externalDealStatus = "Completed" ;
      }
      else if(dealStatus == "CANCELLED"){
        externalDealStatus = "Cancelled" ;
      }
      const newFilterObject = { "fieldName": "Deal Status", "value": externalDealStatus };
      this.filterValues.push(newFilterObject);
    }
    if(this.sendCurrency != ""){
      const newFilterObject = { "fieldName": "Foreign Currency", "value": this.sendCurrency };
      this.filterValues.push(newFilterObject);
    }
    if(this.searchDealId != ""){
      const newFilterObject = { "fieldName": "Deal Id", "value": this.searchDealId };
      this.filterValues.push(newFilterObject);
    }
   
      if(initiatedBy == 'ORG'){
        let initiatedBy = 'APT';
        this.loadOrgInitiated = true;
            setTimeout(() => {
              this.dealService.filteredDealSummary(name,dealStatus,initiatedBy,this.sendCurrency,this.dateGt,this.dateLt,this.searchDealId).subscribe((datas:any) => {
                this.getDeals = datas['data'];
                this.recordsCount = this.getDeals.length ;
                 // Reset page to 1
                this.p = 1;
                this.loadOrgInitiated = false;
                this.store.setItem('DealSummary',datas['data']);
          
                },
                 //error handling completed on 04/07/2023
     (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent)
      }
    }
                )
            }, 1000);
      }
      if(initiatedBy == 'Agent'){
        this.loadOrgInitiated = true;
            setTimeout(() => {
              this.dealService.filteredDealSummary(name,dealStatus,initiatedBy,this.sendCurrency,this.dateGt,this.dateLt,this.searchDealId).subscribe((datas:any) => {
                this.getDeals = datas['data'];
                this.recordsCount = this.getDeals.length ;
                this.loadOrgInitiated = false;
                this.store.setItem('DealSummary',datas['data']);
                
                },
                 //error handling completed on 04/07/2023
     (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent)
      }
    }
                )
            }, 1000);
      }
    
    }

    toggleExpansionPanel(record: any): void {
      let selectedDealId = record.DEALID;
      this.loading = true;
      setTimeout(() => {
        this.agentService.getTransactionInquiry(selectedDealId).subscribe((datas:any)=>{
          this.getTransactionInquiry = datas['data'] ;
          this.loading = false;
        }, //error handling completed on 05/07/2023
        (error:any)=>{
          this.loading = false ;
         if(error.status != 401){
           this.dialogRef.open(ErrorDialogAdminComponent)
         }
       })
      }, 400);
      
      if (this.expandedRecord === record) {
        this.expandedRecord = null; // Collapse the panel if it's already expanded
      } else {
        this.expandedRecord = record; // Expand the panel for the clicked record
      }
    }

    selectCurrencyCode(flag: string) {
      this.selectedCountryCode = flag;
    }

    public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
      this.validateEndDate = event.value._d;
      this.filterForm.controls['startDate'].setValidators(Validators.required);
      this.filterForm.controls['startDate'].updateValueAndValidity();
  
    }
    public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
      this.validateStartDate = event.value._d;
      this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
      this.maxEndDate = new Date(this.minEndDate.getTime() + 31 * 24 * 60 * 60 * 1000);
      if( this.filterForm.controls['endDate'].value == null){
        this.filterForm.controls['endDate'].setValidators(Validators.required);
        this.filterForm.controls['endDate'].updateValueAndValidity(); 
      }
    }
  
    onCustomerNameChange() {
      const agentNameControl = this.filterForm.controls['agentName'];
      // Get the current value of the input field and convert to uppercase .
      const inputText = agentNameControl.value;
      agentNameControl.setValue(inputText.toUpperCase());

      if (this.searchFieldTyped == true && inputText.length == 0) {
        this.filterValues = [];
        this.searchName = this.searchName ? this.searchName : "" ;
      this.selectedDealStatus = this.selectedDealStatus ? this.selectedDealStatus : "";
      this.sendCurrency = this.sendCurrency ? this.sendCurrency : "" ;
      if(this.filterForm.controls.startDate.value != null || this.filterForm.controls.endDate.value != null){
        var start_date: any = moment(this.filterForm.controls.startDate.value);
        var end_date: any = moment(this.filterForm.controls.endDate.value);
        this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
        this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
    
         // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     this.patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
     this.patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

        if(this.patchStartDate == 'NaN-NaN-NaN'){
          this.patchStartDate = "" ;
        }
        if(this.patchEndDate == 'NaN-NaN-NaN'){
          this.patchEndDate = "" ;
        }
         //pushing dates
         var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
         var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
         this.filterValues.push(obj1);
         this.filterValues.push(obj2);
        }
        else{
          this.dateGt = "" ;
          this.dateLt = "" ;
        }
        if(this.searchName != ""){
          const newFilterObject = { "fieldName": "Agent Name", "value": this.searchName };
          this.filterValues.push(newFilterObject);
        }
        if(this.selectedDealStatus != ""){
          let externalDealStatus = "" ;
          if(this.selectedDealStatus == "INPROGRESS"){
            externalDealStatus = "Pending" ;
          }
          else if(this.selectedDealStatus == "CLOSED"){
            externalDealStatus = "Completed" ;
          }
          else if(this.selectedDealStatus == "CANCELLED"){
            externalDealStatus = "Cancelled" ;
          }
          const newFilterObject = { "fieldName": "Deal Status", "value": externalDealStatus };
          this.filterValues.push(newFilterObject);
        }
        if(this.sendCurrency != ""){
          const newFilterObject = { "fieldName": "Foreign Currency", "value": this.sendCurrency };
          this.filterValues.push(newFilterObject);
        }
        if(this.searchDealId != ""){
          const newFilterObject = { "fieldName": "Deal Id", "value": this.searchDealId };
          this.filterValues.push(newFilterObject);
        }
//service call 
          let initiatedBy = 'APT';
          this.loadOrgInitiated = true;
              setTimeout(() => {
                this.dealService.filteredDealSummary(this.searchName,this.selectedDealStatus,initiatedBy,this.sendCurrency,this.dateGt,this.dateLt,this.searchDealId).subscribe((datas:any) => {
                  this.getDeals = datas['data'];
                  this.recordsCount = this.getDeals.length ;
                   // Reset page to 1
                  this.p = 1;
                  this.loadOrgInitiated = false;
                  this.store.setItem('DealSummary',datas['data']);
            
                  },
                   //error handling completed on 04/07/2023
       (error:any)=>{
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent)
        }
      }
                  )
              }, 1000);
        
      }
       // Check if the input has at least three characters and contains only alphabets
    if (inputText.length >= 3 && /^[a-zA-Z ]+$/.test(inputText)) {
      this.searchFieldTyped = true;  //once user entered more than 3 char , will call this variable 'searchFieldTyped' and give it as true signa
      this.filterValues = [];
      this.searchName = this.searchName ? this.searchName : "" ;
      this.selectedDealStatus = this.selectedDealStatus ? this.selectedDealStatus : "";
      this.sendCurrency = this.sendCurrency ? this.sendCurrency : "" ;
      if(this.filterForm.controls.startDate.value != null || this.filterForm.controls.endDate.value != null){
        var start_date: any = moment(this.filterForm.controls.startDate.value);
        var end_date: any = moment(this.filterForm.controls.endDate.value);
        this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
        this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
    
         // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     this.patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
     this.patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
       
        if(this.patchStartDate == 'NaN-NaN-NaN'){
          this.patchStartDate = "" ;
        }
        if(this.patchEndDate == 'NaN-NaN-NaN'){
          this.patchEndDate = "" ;
        }
         //pushing dates
         var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": this.patchStartDate };
         var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": this.patchEndDate };
         this.filterValues.push(obj1);
         this.filterValues.push(obj2);
        }
        else{
          this.dateGt = "" ;
          this.dateLt = "" ;
        }
        if(this.searchName != ""){
          const newFilterObject = { "fieldName": "Agent Name", "value": this.searchName };
          this.filterValues.push(newFilterObject);
        }
        if(this.selectedDealStatus != ""){
          let externalDealStatus = "" ;
          if(this.selectedDealStatus == "INPROGRESS"){
            externalDealStatus = "Pending" ;
          }
          else if(this.selectedDealStatus == "CLOSED"){
            externalDealStatus = "Completed" ;
          }
          else if(this.selectedDealStatus == "CANCELLED"){
            externalDealStatus = "Cancelled" ;
          }
          const newFilterObject = { "fieldName": "Deal Status", "value": externalDealStatus };
          this.filterValues.push(newFilterObject);
        }
        if(this.sendCurrency != ""){
          const newFilterObject = { "fieldName": "Foreign Currency", "value": this.sendCurrency };
          this.filterValues.push(newFilterObject);
        }
        if(this.searchDealId != ""){
          const newFilterObject = { "fieldName": "Deal Id", "value": this.searchDealId };
          this.filterValues.push(newFilterObject);
        }
//service call 
          let initiatedBy = 'APT';
          this.loadOrgInitiated = true;
              setTimeout(() => {
                this.dealService.filteredDealSummary(this.searchName,this.selectedDealStatus,initiatedBy,this.sendCurrency,this.dateGt,this.dateLt,this.searchDealId).subscribe((datas:any) => {
                  this.getDeals = datas['data'];
                  this.recordsCount = this.getDeals.length ;
                   // Reset page to 1
                   this.p = 1;
                  this.loadOrgInitiated = false;
                  this.store.setItem('DealSummary',datas['data']);
            
                  },
                   //error handling completed on 04/07/2023
       (error:any)=>{
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent)
        }
      }
                  )
              }, 1000);
        

    }
    }
 
  //In html --> bind this function in selectionChange event...
  onSelectCheckBox(event: any, record: any, index: number, dealId:string) {

    // Check if there are already selected records
  if (this.checkBoxArray.length > 0) {
    const firstSelectedCurrency = this.checkBoxArray[0].BUYCURRENCY;

    // If the new record's BUYCURRENCY is different, prevent selection
    if (record.BUYCURRENCY !== firstSelectedCurrency) {
      // Uncheck the checkbox
      event.source.checked = false;
      // Optionally, you could show a tooltip or other UI indication
      console.log('Selection restricted: Different foreign currency selection not allowed.');
      this.snackBar.open("Selection restricted: Different foreign currency selection not allowed.", "Ok",{
        duration : 4000,
        panelClass : 'action-restricted-snackbar'
      })
      return;
    }
  }


    if(event.checked == true){

       // Check if the record is already in the checkBoxArray array to avoid duplication
    if (!this.checkBoxArray.find(deal => deal.DEALID == dealId)) {
      this.checkBoxArray.push(record);
    }

     // this.checkBoxArray.push(record) ;
    }
    else if(event.checked == false){

      let indexValue = this.checkBoxArray.findIndex(v => v.DEALID == dealId) ;
      if(indexValue != -1){
        this.checkBoxArray.splice(indexValue, 1) ;
      }
    }
    console.log(this.checkBoxArray) ;

    // Calculate the sum of DEALBALANCEF and DEALBALANCE
    const totalDealBalanceF = this.checkBoxArray.reduce((sum, deal) => sum + deal.DEALBALANCEF, 0);
    const totalDealBalance = this.checkBoxArray.reduce((sum, deal) => sum + deal.DEALBALANCE, 0);

    // Calculate the average rate
     this.averageRate = totalDealBalance > 0 ? totalDealBalanceF / totalDealBalance : 0;

    console.log('Average Rate:', this.averageRate);

    //1. retrieve the selected object using 'record' parameter and store it in this reference variable 'checkBoxArray' .
    //2. use 'event' parameter to find user selected the checkbox or unselected the checkbox using event.checked .
    //3. if event.checked is true --> push the record in checkBoxArray array .
    //4. if event.checked is false --> splice the record from checkBoxArray array using index .
    //5. for each selection --> calculate avg rate : Sum of deal balance in FCY / Sum of deal balance in SGD
  }


  openDealSummary(){
    this.dialogRef.open(ViewDealSummaryComponent,{
      width:"600px",
      panelClass: 'custom-modalbox',
      data : {isDealReview : true, selectedRecordsArray : this.checkBoxArray, averageRate: this.averageRate}
    })
  }

  isDealSelected(dealId: string): boolean {
    return !!this.checkBoxArray.find(deal => deal.DEALID == dealId);
  }

  //round negative value in DEALBALANCE element in response.
  roundNegative(value: number): number {
    return value < 0 ? 0 : value;
  }

}
