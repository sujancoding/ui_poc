import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { AgentServiceService } from '../agent-service.service';
import { AgentContract } from '../models/agentviewcontract';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
import { roleIdDetails } from 'src/assets/userrole';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { getContractBgcolor, getContractColor, getContractTooltiptext } from 'src/assets/transactionstatus';

@Component({
  selector: 'app-agent-view-contracts',
  templateUrl: './agent-view-contracts.component.html',
  styleUrls: ['./agent-view-contracts.component.scss', '../../../assets/styles/tables/table-style.scss',
    '../../../assets/styles/buttons/button.scss'
  ],
})
export class AgentViewContractsComponent implements OnInit {
  public getScreenWidth:any;
  public getScreenHeight:any;
  isActive!:false;
  message!:string ;
  showSuccessContract :Boolean = false;
  showCancelContract:boolean=false;
  showFetchedData : Boolean = true;
  noReportsData : Boolean = false ;
  getContracts : any[] = [] ;
  matspinner : Boolean = false ;
  searchContractNumber !: string ;
  searchStatus !: string ;
  isDisableAddContract : Boolean = false ;
 
  testArrays:AgentContract[]=[];
  agentLists : any[] = [
    // {"viewValue":"--Select--" , "internalValue":""},
    // {"viewValue":"Ameer Sultan" , "internalValue":"AMEER SULTAN"}
  ];
  searchAgent !: string ;
  showAgentFilter = false ;
  filterForm : FormGroup = Object.create(null);
  //new changes
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
  p: number = 1;
  itemsPerPage: number = 20; 

  entityId : any ;
  showClientRate : Boolean = false ;
  isWindowOpen : boolean = false ;

  constructor(private titleService : TitleHeaderService,private router : Router,private store : InMemoryCache,
    private matSnackbar : MatSnackBar,private agentService : AgentServiceService,private dialog: MatDialog,private fb : FormBuilder,
    private agentMaintenanceService : AgentMaintenanceService) { }


    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }

  ngOnInit(): void {
    this.titleService.setTitle('Contracts');

    //window.opener if condition to be added here...
    //Reason: Book contract was added in above shortcut link , so we should disable the 'Add contract' button from here or hide it...
    if(window.opener){
     this.isWindowOpen = true ;
    }
    else{
      this.isWindowOpen = false ;
    }
    this.filterForm = this.fb.group({
     "agentName" :[null],
     "contractNumber" : [null],
     "contractStatus" : [null] ,
     "startDate": [null,Validators.compose([Validators.required])],
     "endDate": [null, Validators.compose([Validators.required])]
    })

    this.filterValues = [];
     //End date field --> Max 30 days are allowed to select.
     this.minEndDate = new Date();
     this.maxEndDate = new Date(this.minEndDate.getTime() + 30 * 24 * 60 * 60 * 1000); //max end date is 8 days and exclude sat and sun
     
    // Patch the current date on page load
    const todayFormatted = new Date();
    this.filterForm.controls.startDate.setValue(todayFormatted);
    this.filterForm.controls.endDate.setValue(todayFormatted);
    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value)

     // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
     let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

     var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
     var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
 
     this.filterValues.push(obj1);
     this.filterValues.push(obj2); 

     let dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
     let dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

     


    this.searchStatus = "" ;
    this.searchAgent = "";

    let appStatus : string = this.store.getItem('APPLICATIONSTATUS') ? this.store.getItem('APPLICATIONSTATUS') : '' ;
    let roleId = this.store.getItem('USER_ROLE') ? this.store.getItem('USER_ROLE') : "";
    this.entityId = this.store.getItem('USER_ID');

    //checking corporate role
    if(roleId == roleIdDetails.CORPORATE_OWNER || roleId == roleIdDetails.CORPORATE_RUNNER || roleId == roleIdDetails.CORPORATE_DEALER ){
      this.showAgentFilter = false ;  //not showing agent name dropdown in search filters
      this.showClientRate = false ;   //not showing client rate column in table
      if(appStatus == "NEW" || appStatus == "PENDING"){
        this.isDisableAddContract = true;
      }
      else{
        this.isDisableAddContract = false ;
      }
    }

    //checking agent role
    else if(roleId == roleIdDetails.AGENT){
      this.showAgentFilter = false ;  //not showing agent name dropdown in search filters
      this.showClientRate = false ;   //not showing client rate column in table
    }
   
    //checking for backoffice role , obviously in else block.
    else {
       //Get Agent List API --> This API can be called only backoffice users
      this.agentMaintenanceService.getAgentListings().subscribe((datas:any)=>{
      this.agentLists = datas['data'] ;
    })
      this.entityId = "";
      this.showAgentFilter = true ;
      this.showClientRate = true ;
    }
    this.matspinner = true ;
    this.agentService.getForexInquiry(this.entityId,'','',dateGt,dateLt).subscribe((data:any)=>{
      this.matspinner = false ;
      this.noReportsData = false; 
      this.showFetchedData =  true ;
      this.getContracts = data['contracts'] ;
      this.recordsCount = this.getContracts.length ;
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
     //error handling done 05/07/2023
     (error:any) =>{
      this.matspinner = false;
      this.noReportsData = true; 
      this.showFetchedData =  false ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }
   )
 
    this.noReportsData = false; 
    this.showFetchedData =  true ;
   
  
   let cancelContract : string = this.store.getItem('CANCEL_CONTRACT');
   if(cancelContract != undefined || cancelContract != null) {
         this.store.removeItem('CANCEL_CONTRACT');
         this.message = cancelContract ;
         this.showCancelContract = true;
         setTimeout(() => {
          this.showCancelContract = false; 
         }, 4000);
         
  }
  else{
    this.showCancelContract = false;
  }

   
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    
    let timoutMessage = this.store.getItem('AGENT_BOOKCONTRACT_TIMEOUT') ;
    if(timoutMessage != undefined){
      this.store.removeItem('AGENT_BOOKCONTRACT_TIMEOUT');
      this.showCancelContract = true ;
      setTimeout(() => {
        this.showCancelContract = false; 
       }, 6000);
      this.message = timoutMessage ;
    }

    let contractSuccessfulMessage = this.store.getItem('AGENT_BOOKCONTRACT_INTIME') ;
    if(contractSuccessfulMessage != undefined){
      this.store.removeItem('AGENT_BOOKCONTRACT_INTIME');
      this.showSuccessContract = true ;
      setTimeout(() => {
        this.showSuccessContract = false; 
       }, 6000);
      this.message = contractSuccessfulMessage ;
      
    }
  }
 
    //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }
//responsvie table height based on windows inner height
  changeTableHeight() {
    return { 'height': (this.getScreenHeight - 280) + 'px', 'overflow-y': 'auto' };
  }
  overAllAlertBox(){
    return {  'text-align' : 'center' ,
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'margin-top': '-35px' 
    };
  }
  addContracts(){
    if(this.isWindowOpen == true){ //if component is inside window popup
      this.router.navigate(['rt-popups-window/book-contract']);
    }
    else{
      this.router.navigate(['agent/agent-add-deal']);
    }
  }
  close(){
    this.showCancelContract = false;
  }

   //STATUS color diff
 getColor(status: any) {
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



  applyFilter(contractId : string, contractStatus : string,entityName : string){
    this.xpandStatus = false ;
    this.p = 1;
    let userRole : string = this.store.getItem('USER_ROLE') ;
    let userName : string = this.store.getItem('USERNAME');
    if(userRole == roleIdDetails.CORPORATE_OWNER || userRole == roleIdDetails.CORPORATE_RUNNER || userRole == roleIdDetails.CORPORATE_DEALER){ //corporates
      entityName = userName ;
    }
    else if(userRole == roleIdDetails.AGENT){ //agents
      entityName = userName ;
    }
    else{ //backoffice
      entityName = entityName ;
    }
    let id = contractId ? contractId : '';
    let status = contractStatus ? contractStatus : '' ;
    let name = entityName ? entityName : '' ;
    this.matspinner = true ;

    // Clear the filters array 
    this.filterValues = [];
    if(this.filterForm.controls.startDate.value != null || this.filterForm.controls.endDate.value != null){
    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value);
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

    // this.patchStartDate = start_date._d.getDate() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getFullYear();
    // this.patchEndDate = end_date._d.getDate() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getFullYear();

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

    this.entityId = this.store.getItem('USER_ID');
    let roleId = this.store.getItem('USER_ROLE') ;
    if(roleId != roleIdDetails.AGENT && roleId != roleIdDetails.CORPORATE_OWNER && roleId != roleIdDetails.CORPORATE_RUNNER && roleId != roleIdDetails.CORPORATE_DEALER){
      this.entityId = ""
    } 

    if(name != "" && this.entityId == ""){
      const newFilterObject = { "fieldName": "Agent Name", "value": name };
      this.filterValues.push(newFilterObject);
    }
    if(contractStatus != ""){
      const newFilterObject = { "fieldName": "Contract Status", "value": contractStatus };
      this.filterValues.push(newFilterObject);
    }
    if(id != ""){
      const newFilterObject = { "fieldName": "Contract Number", "value": id };
      this.filterValues.push(newFilterObject);
    }

     
    this.agentService.getFilteredForexInquiry(id,status,name,this.dateGt,this.dateLt,this.entityId).subscribe((data:any) => {
      this.matspinner = false ;
      this.noReportsData = false; 
      this.showFetchedData =  true ;
      this.getContracts = data['contracts'] ;
      this.recordsCount = this.getContracts.length ;
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
    
     //error handling done 05/07/2023
     (error:any) =>{
      this.matspinner = false;
      this.noReportsData = true; 
      this.showFetchedData =  false ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    })
  }

  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;

  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateStartDate = event.value._d;
    this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 31 * 24 * 60 * 60 * 1000);
    // this.filterForm.controls['endDate'].setValue(this.maxEndDate);
  }

  resetFilter(){
    this.p = 1;
    this.entityId = this.store.getItem('USER_ID');
    let roleId = this.store.getItem('USER_ROLE') ;
    if(roleId != roleIdDetails.AGENT && roleId != roleIdDetails.CORPORATE_OWNER && roleId != roleIdDetails.CORPORATE_RUNNER && roleId != roleIdDetails.CORPORATE_DEALER){
      this.entityId = ""
    } 
    this.searchContractNumber = "" ;
    this.searchStatus = "" ;
    this.searchAgent = "" ;
  
    // this.filterForm.controls['startDate'].setValue(null) ;
    // this.filterForm.controls['endDate'].setValue(null) ;
    // this.dateGt = "" ;
    // this.dateLt = "" ;
    // this.minEndDate = null;
    // this.maxEndDate = null;

    const todayFormatted = new Date();
    this.filterForm.controls.startDate.setValue(todayFormatted);
    this.filterForm.controls.endDate.setValue(todayFormatted);
    var start_date: any = moment(this.filterForm.controls.startDate.value);
    var end_date: any = moment(this.filterForm.controls.endDate.value);
    this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
    this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();

     // Use toLocaleDateString to format the date as "dd/mm/yyyy"
     let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
     let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
     let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);

    //End date field --> Max 30 days are allowed to select.
    this.minEndDate = new Date()
    this.maxEndDate = new Date(this.minEndDate.getTime() + 30 * 24 * 60 * 60 * 1000);  //max end date is 8 days and exclude sat and sun

    this.xpandStatus = false ; //close panel
      //clear the filter object 
      this.filterValues = [] ;

        //pushing dates
        var obj1 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
        var obj2 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
        this.filterValues.push(obj1);
        this.filterValues.push(obj2);

      this.matspinner = true ;
      this.agentService.getFilteredForexInquiry(this.searchContractNumber,this.searchStatus,this.searchAgent,this.dateGt,this.dateLt,this.entityId).subscribe((data:any) => {
        this.matspinner = false ;
        this.noReportsData = false; 
        this.showFetchedData =  true ;
        this.getContracts = data['contracts'] ;
        this.recordsCount = this.getContracts.length ;
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
      
       //error handling done 05/07/2023
       (error:any) =>{
        this.matspinner = false;
        this.noReportsData = true; 
        this.showFetchedData =  false ;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
      })

  }

  onContractIdChange(){
    const contractIdControl = this.filterForm.controls['contractNumber'];
    // Get the current value of the input field and convert to uppercase .
    const inputText = contractIdControl.value;
    contractIdControl.setValue(inputText.toUpperCase());

    if (this.searchFieldTyped == true && inputText.length == 0) {
      this.filterValues = [];
      this.searchName = this.searchName ? this.searchName : "" ;
    this.searchStatus = this.searchStatus ? this.searchStatus : "";
    let contractId = contractIdControl.value ? contractIdControl.value : "" ;
    if(this.filterForm.controls.startDate.value != null || this.filterForm.controls.endDate.value != null){
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value);
      this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
      this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
  
      // this.patchStartDate = start_date._d.getDate() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getFullYear();
      // this.patchEndDate = end_date._d.getDate() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getFullYear();

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
      if(this.searchStatus != ""){
        const newFilterObject = { "fieldName": "Contract Status", "value": this.searchStatus };
        this.filterValues.push(newFilterObject);
      }
      if(contractId != ""){
        const newFilterObject = { "fieldName": "Contract Number", "value": contractId };
        this.filterValues.push(newFilterObject);
      }
//service call 
this.matspinner = true ;
this.agentService.getFilteredForexInquiry(this.searchContractNumber,this.searchStatus,this.searchAgent,this.dateGt,this.dateLt,this.entityId).subscribe((data:any) => {
  this.p = 1;
  this.matspinner = false ;
  this.noReportsData = false; 
  this.showFetchedData =  true ;
  this.getContracts = data['contracts'] ;
  this.recordsCount = this.getContracts.length ;
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

 //error handling done 05/07/2023
 (error:any) =>{
  this.matspinner = false;
  this.noReportsData = true; 
  this.showFetchedData =  false ;
  if(error.status != 401){
    this.dialog.open(ErrorDialogAdminComponent) ;
  }
})
      
    }
     // Check if the input has at least three characters and contains only alphabets
  if (inputText.length >= 3) {
    this.searchFieldTyped = true;  //once user entered more than 3 char , will call this variable 'searchFieldTyped' and give it as true signa
    this.filterValues = [];
    this.searchName = this.searchName ? this.searchName : "" ;
    this.searchStatus = this.searchStatus ? this.searchStatus : "";
    let contractId = contractIdControl.value ? contractIdControl.value : "" ;
    if(this.filterForm.controls.startDate.value != null || this.filterForm.controls.endDate.value != null){
      var start_date: any = moment(this.filterForm.controls.startDate.value);
      var end_date: any = moment(this.filterForm.controls.endDate.value);
      this.dateGt = start_date._d.getFullYear() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getDate();
      this.dateLt = end_date._d.getFullYear() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getDate();
  
      // this.patchStartDate = start_date._d.getDate() + "-" + (start_date._d.getMonth() + 1) + "-" + start_date._d.getFullYear();
      // this.patchEndDate = end_date._d.getDate() + "-" + (end_date._d.getMonth() + 1) + "-" + end_date._d.getFullYear();

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
      if(this.searchStatus != ""){
        const newFilterObject = { "fieldName": "Contract Status", "value": this.searchStatus };
        this.filterValues.push(newFilterObject);
      }
      if(contractId != ""){
        const newFilterObject = { "fieldName": "Contract Number", "value": contractId };
        this.filterValues.push(newFilterObject);
      }
//service call 
this.matspinner = true ;
this.agentService.getFilteredForexInquiry(this.searchContractNumber,this.searchStatus,this.searchAgent,this.dateGt,this.dateLt,this.entityId).subscribe((data:any) => {
  this.p = 1;
  this.matspinner = false ;
  this.noReportsData = false; 
  this.showFetchedData =  true ;
  this.getContracts = data['contracts'] ;
  this.recordsCount = this.getContracts.length ;
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

 //error handling done 05/07/2023
 (error:any) =>{
  this.matspinner = false;
  this.noReportsData = true; 
  this.showFetchedData =  false ;
  if(error.status != 401){
    this.dialog.open(ErrorDialogAdminComponent) ;
  }
})
  }
  }

  onContractIdUppercase(){
    const contractIdControl = this.filterForm.controls['contractNumber'];
    // Get the current value of the input field and convert to uppercase .
    const inputText = contractIdControl.value;
    contractIdControl.setValue(inputText.toUpperCase());
  }
  
  
}
