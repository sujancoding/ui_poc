
import { Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import _ from 'lodash';
import { AgentServiceService } from 'src/app/agent/agent-service.service';
import { AgentList, RetrieveDeals } from 'src/app/backoffice/dailysetup/model/deal';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { SavedDialogBoxComponent } from 'src/app/backoffice/shared/modals/saved-dialog-box.component';
import { AgentApproveTransaction, ApproveTransaction, ApproveTransactionDbs, DealInfo } from 'src/app/core/model/approvetransaction/approvetransaction';
import { NewDealService } from 'src/app/core/services/new-deal.service';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { TransactionData } from 'src/app/dashboards/model/approveddashboard';
import { InMemoryCache } from '../../services/cache.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { foreignCurrencyArr } from 'src/assets/dropdownvalues';
import { TransactionSuspiciousRemarksComponent } from 'src/app/backoffice/remittance/unpostedtransaction/modals/transaction-suspicious-remarks/transaction-suspicious-remarks.component';

@Component({
  selector: 'app-agent-card',
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss']
})
export class AgentCardComponent implements OnInit {
  
  getAgents : AgentList [] = [];
  getExternalPartyAgent : any[] = [];
  retrieveDeals : RetrieveDeals[]=[];
  balance = 0;
  dealBalanceF = 0 ;
  contractBalance : number = 0;
  @Input() public transactionIdsLength : any;
  @Input() public transactionIds : any;
  @Input() public totalAmount :any;
  @Input() public adminFee : any ; 
  @Input() public fetchBuyCurrencyCode :any;
  @Input() public entityType : any;
  @Input() public payeeGets !: number;
  @Input() public transactionTypeIndicator : any ;
  @Output() public TransactionEventEmitter =  new EventEmitter();
  approveTransaction : ApproveTransaction[] = [];
  p: number = 1;
  loadDeals : Boolean = false;
  postButtonLoader : Boolean = false;
  showPostButton : Boolean = true;
  showSelectDeals : Boolean = false;
  //manualExchangeRate  : Boolean = false;
  //manualContractId : Boolean = false;
  agentList : Boolean = false;
  agentListForAgents : Boolean = false;
  agentId !: string;
  disableCheckBox : Boolean =false;
  arr : any[] = [];
  poppedArr : string[] = [];
  checkboxList :string[] = [];
  dealIds : any[]=[];
  showValidation = false;
  //disableButton : Boolean = true;
  searchTransaction : TransactionData[]=[];
  counter: number =0;
  public contractsForm : FormGroup = Object.create(null);
  agentApproveTransaction : AgentApproveTransaction[] = [];
  exchangeRate !: any;
  rate : string = "";
  account : string = "";
  agentName : string = "";
  selectedAgentName !: string;
  totalContractAmount !: number;
  removeValues: any[] = [];
  contractDealOne :any = {};
  contractDealTwo :any = {};
  errorMsg : any ;
  firstContractAmt : any = 0 ;
  secondContractAmt : any = 0 ;
  getContracts : any[] = [];
  showContracts : Boolean = false ;
  isDisableContractTable : Boolean = false;
  isDisableDealTable : Boolean = false ;
  checkedarray!: boolean[];
  selectedEntity : string = '';
  disableSubmit : Boolean = true ;
  diasbleDropdown : boolean = false;
  checked = false;
  suspiciousChecked = false;
  indeterminate = false;
  disabled = false;
  isDisablePosting = true ;
  showApproveTxnButton : Boolean = true ;
  dbsSupportedCurrencies = foreignCurrencyArr ;
  isSuspicious : string = "N";
  isApproveChecked : boolean = false;
  susRemarks : string = "";
  agentCommission = new FormControl('',[Validators.required,this.numberWithTwoDecimalsValidator]);
  showAgentCommission : Boolean = false;

  constructor(public dialog: MatDialog,private dealService : NewDealService,private store:InMemoryCache,private fb : FormBuilder,
    private transactionService: TransactionService,private _snackBar: MatSnackBar,private dialogRef : MatDialog,private agentService: AgentServiceService) { }
  
  openDialog(){
    this.dialog.open(SuccessDialogComponent)
  }
  ConvertToInt(val:any){
    if(val == "" || val == undefined){
      val = 0;
      return parseInt(val);
    }
    else{
      return parseInt(val);
    } 
    
  }
  ngOnInit(): void {
   //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;
   console.log(this.getScreenHeight);
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
  responsiveCard(){
    return { 'background-color': '#ffffff' ,
      'border': '1px solid #dedede',
      'border-radius': '7px',
    'margin-top': '-5px', 'height': (this.getScreenHeight - 690) + 'px'
  }
  }  
  contentScrollable(){
    return {'height': (this.getScreenHeight - 747)+'px','overflow-y': 'auto'}
  }
 

  //get agent api fired and want only the record in which ENTITYNAME is 'DBS';
  getExternalAgent(){
    this.dealService.getAgentList().subscribe((datas:any) =>{
      this.getExternalPartyAgent = datas['data'];
      this.getExternalPartyAgent = this.getExternalPartyAgent.filter(v => v.ENTITYNAME == "DBS");
      if(this.entityType == "I" ){
        this.selectedEntity = ''; // set DBS as the default value for the dropdown
        console.log(this.selectedEntity);
      }
      else if(this.entityType == "A" || this.entityType == "C"){
        this.selectedEntity = this.getExternalPartyAgent[0].ENTITYNAME; // set DBS as the default value for the dropdown
        console.log(this.getExternalPartyAgent);
      }
    },
     //error handling done on 03-07-2023
     (error:any) =>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }
    )
  }
   //implemented ngOnChanges cause transactionsIds are changing asynchronously from parent component !
   ngOnChanges(){

     //new change on 27 Nov 2023 , based on access control dtls , need to hide and show the approve button .
     let hasSpecificItem : string = this.store.getItem('UNPOSTED_APPROVE_BUTTON_ACCESS_CONTROL') ? this.store.getItem('UNPOSTED_APPROVE_BUTTON_ACCESS_CONTROL') : "" ;
       //we should show this approve btn only when hasSpecificItem is true and executed ..
       if(hasSpecificItem == "true"){
        this.showApproveTxnButton = true ;
       }
        if(hasSpecificItem == "false"){
        this.showApproveTxnButton = false ;
       }
       console.log("ngOnchanges") ;

    if(this.entityType == "I" || (this.entityType == "C" && this.transactionTypeIndicator == "D" )){ //consumer or corporate without contract
      this.checkedarray = [];
      this.dealIds = [];
      this.retrieveDeals = [];
      this.balance = 0;
      this.arr = [];
      if(this.transactionIdsLength == 0){
        this.disableSubmit = true;
        this.showContracts = false;
        this.showSelectDeals = false;
        this.isDisablePosting = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.diasbleDropdown = true;
      }
      if(this.transactionIdsLength >= 1){
        this.disableSubmit = true;
        this.isDisablePosting = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.showContracts = false;
        this.showSelectDeals = false;
        this.diasbleDropdown = false;
      }
      let isDbsSupportedCurrency : Boolean = this.dbsSupportedCurrencies.includes(this.fetchBuyCurrencyCode);
      if(isDbsSupportedCurrency == true){ //USD , GBP , AUD , HKD , CHF ..
        this.showAgentCommission = false; //Agent commission fee should NOT be collected if its CONTRACT flow...
        this.showContracts = false;
        this.showSelectDeals = false;
        this.agentList = false;  //no need to show Ameer sulthan , purnama , etc..
      this.agentListForAgents = true; //show DBS as agent
      this.getExternalAgent();
     // this.manualExchangeRate = false;
     
      }
      else{   //MYR , THB
        this.showAgentCommission = true; //Agent commission fee should be collected if its DEAL flow...
        this.showContracts = false;
        this.showSelectDeals = false;
        this.agentList = true;
        this.agentListForAgents = false;
      // this.manualExchangeRate = false;
      this.dealService.getAgentList().subscribe((datas:any) =>{
        this.getAgents = datas['data'];
        this.getAgents = this.getAgents.filter((v:any) => v.ENTITYNAME != "DBS");
      },
       //error handling done on 03-07-2023
     (error:any) =>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }
      )
      }
     
  }
   else if(this.entityType == "A" || (this.entityType == "C" && this.transactionTypeIndicator != "D" )){ //agent or corporate with contract
    this.showAgentCommission = false; //Agent commission fee should NOT be collected if its CONTRACT flow...
    this.disableSubmit = true;  //submit button is disabled using scss class
    this.agentList = false;
    this.agentListForAgents = true; //DBS
    this.getExternalAgent();
     this.arr = [];
     this.dealIds = [];
     this.retrieveDeals = [];
     this.balance = 0;
  
     //this.manualExchangeRate = true;
     if(this.transactionIdsLength == 0){
      this.disableSubmit = true;
      this.showContracts = false;
      this.showSelectDeals = false;
      this.isDisablePosting = true;
      this.checked = false;
      this.suspiciousChecked = false;
      this.susRemarks = "";
      this.isSuspicious = "N";
      this.diasbleDropdown = true;
    }
    if(this.transactionIdsLength >= 1){
      //this.disableSubmit = false;
      this.showContracts = false;
      this.showSelectDeals = false;
      this.diasbleDropdown = false;
    }
    
  }
    this.transactionIds;
    this.transactionIdsLength;
    this.fetchBuyCurrencyCode;

    if(this.fetchBuyCurrencyCode != undefined){
      this.dealIds = [];
      this.retrieveDeals = [];
      this.balance = 0;
    }
   
   
  }
  
    //reset the agent card fields if there is no transaction selected
  //   if(this.entityType =='A'){
  //     this.agentName = "";
  //   if(this.transactionIdsLength == 0){
  //     this.rate = "";
  //     this.account = "";
  //     this.agentName = "";
  //   }
  //   if(this.transactionIdsLength > 0 && (this.rate != "" && this.rate != null) && this.account != "" && this.agentName != "" ){
  //     this.disableSubmit = false;
  //   }
  // }
  
 
  //!POST TRANSACTION ==> APPROVAL OF TRANSACTION
  onSubmit(){
    console.log("onSubmit");
if(this.entityType == "I" || (this.entityType == 'C' && this.transactionTypeIndicator == "D") ){  //Consumer
  let isDbsSupportedCurrency : Boolean = this.dbsSupportedCurrencies.includes(this.fetchBuyCurrencyCode);
   if(isDbsSupportedCurrency == true){ //USD , GBP , AUD , HKD , CHF ..
    this.dealIds;
    this.postButtonLoader = true;
    this.showPostButton = false;
   //approve transaction using DBS - Service call
      this.transactionService.approveTransactionDbs(this.buildDbsApproveTransaction()).subscribe(data =>{
        console.log(data);
        this.postButtonLoader = false;
        this.showPostButton = true;
        this.approveTransaction = data;
        this.dealIds = [];
        this.retrieveDeals = [];
        this.payeeGets = 0;
        this.totalAmount = 0;
       let sucessResult : any[] =  data.authorizationStatuses.filter((v:any) => v.result == "000");
       let failureResult : any[] =  data.authorizationStatuses.filter((v:any) => v.result == "001");
       this.isSuspicious = "N"; // after successful save marking isSuspicious as "N"
       this.susRemarks = "";
        if(sucessResult.length > 0){
          this.dialogRef.open(SavedDialogBoxComponent, {
            panelClass: 'custom-modalbox',
            width:'322px',
            height:'140px',
            data : "Open Saved Dialog"
           })
               this.TransactionEventEmitter.emit('Refresh');
            }
            else if(failureResult.length > 0){
              
              let errorMessage = data.authorizationStatuses[0].message ? data.authorizationStatuses[0].message : "" ;
              this.dialogRef.open(ErrorDialogAdminComponent, {
                data : {errorMessage : errorMessage},
                panelClass: 'custom-modalbox',
                height:'320px',
                width:'550px'
               })
                }
      },
      (error:any) => { //error handling completed on 03-07-2023
        this.postButtonLoader = false;
        this.showPostButton = true;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
          }) , this.dealIds = []
        }
        } 
      )
   }
   else{  //MYR , THB
    this.dealIds;
    this.postButtonLoader = true;
    this.showPostButton = false;
   //approve transaction using Deals - Service call
      this.transactionService.approveTransaction(this.buildPostTransactionDeals()).subscribe(data =>{
        console.log(data);
        this.postButtonLoader = false;
        this.showPostButton = true;
        this.approveTransaction = data;
        this.dealIds = [];
        this.retrieveDeals = [];
        this.payeeGets = 0;
        this.totalAmount = 0;
        let sucessResult : any[] =  data.authorizationStatuses.filter((v:any) => v.result == "000");
        let failureResult : any[] =  data.authorizationStatuses.filter((v:any) => v.result == "001");
        this.isSuspicious = "N";  // after successful save marking isSuspicious as "N"
        this.susRemarks = "";
          if(sucessResult.length > 0){
          this.dialogRef.open(SavedDialogBoxComponent, {
            panelClass: 'custom-modalbox',
            width:'322px',
            height:'140px',
            data : "Open Saved Dialog"
           })
               this.TransactionEventEmitter.emit('Refresh');
            }
          
            else if(failureResult.length > 0){
              let errorMessage = data.authorizationStatuses[0].message ? data.authorizationStatuses[0].message : "" ;
              this.dialogRef.open(ErrorDialogAdminComponent, {
                data : {errorMessage : errorMessage},
                panelClass: 'custom-modalbox',
                height:'320px',
                width:'550px'
               })
                }
      },
      (error:any) => { //error handling completed on 03-07-2023
        this.postButtonLoader = false;
        this.showPostButton = true;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
          }) , this.dealIds = []
        }
      } 
      )
    this.postButtonLoader = false;
    this.showPostButton = true;
   }
  
  }
  else{
    //On Click Post button > if Customer Type == C || I then below code triggers 
    if((this.entityType == 'C' && this.transactionTypeIndicator != "D") || this.entityType == 'A'){
    this.postButtonLoader = true;
    this.showPostButton = false;
    setTimeout(() => {
      this.transactionService.agentApproveTransaction(this.buildPostTransaction()).subscribe(data =>{
        console.log(data);
        this.postButtonLoader = false;
        this.showPostButton = true;
        this.approveTransaction = data;
        this.dealIds = [];
        this.retrieveDeals = [];
        // this.payeeGets = 0;
        // this.totalAmount = 0;
        let sucessResult : any[] =  data.authorizationStatuses.filter((v:any) => v.result == "000");
        let failureResult : any[] =  data.authorizationStatuses.filter((v:any) => v.result == "001");
        this.isSuspicious = "N";  // after successful save marking isSuspicious as "N"
        this.susRemarks = "";
          if(sucessResult.length > 0){
            this.payeeGets = 0;
            this.totalAmount = 0;
          this.dialogRef.open(SavedDialogBoxComponent, {
            panelClass: 'custom-modalbox',
            width:'322px',
            height:'140px',
            data : "Open Saved Dialog"
           })
               this.TransactionEventEmitter.emit('Refresh');
            }
           
            else if(failureResult.length > 0){
              let errorMessage = data.authorizationStatuses[0].message ? data.authorizationStatuses[0].message : "" ;
              this.dialogRef.open(ErrorDialogAdminComponent, {
                data : {errorMessage : errorMessage},
                panelClass: 'custom-modalbox',
                height:'320px',
                width:'550px'
               })
                }
      },
      
      (error:any) => { //error handling completed on 03-07-2023 
        this.checkedarray = [];
        this.retrieveDeals = [];
        this.payeeGets = 0;
        this.totalAmount = 0;
        this.postButtonLoader = false;
        this.showPostButton = true;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
          }) , this.dealIds = []
        }
      } )
    }, 1000);
    }  
  
 
  
  }
}
 //Agent / Corporate
  buildPostTransaction():AgentApproveTransaction{
    return new AgentApproveTransaction({
      "agentId": "A31011",
      "suspicious" : this.isSuspicious  ? this.isSuspicious : "N",
      "susRemarks" : this.susRemarks ? this.susRemarks : "",
      "transactionIds": this.transactionIds,
  })
}

//Approve transaction -> consumer via deals - 'MYR','THB'
buildPostTransactionDeals():ApproveTransaction{
  return new ApproveTransaction({
    "agentId" : this.selectedAgentName,
    "suspicious" : this.isSuspicious  ? this.isSuspicious : "N",
    "susRemarks" : this.susRemarks ? this.susRemarks : "",
    "transactionIds": this.transactionIds,
    "deals" : this.dealIds,
    "agentCommPerTxn" : this.agentCommission.value ? this.agentCommission.value : "0"
})
}

 
  buildDbsApproveTransaction():ApproveTransactionDbs{
    return new ApproveTransactionDbs({
      "agentId": this.selectedAgentName,
      "suspicious" : this.isSuspicious  ? this.isSuspicious : "N",
      "susRemarks" : this.susRemarks ? this.susRemarks : "",
      "transactionIds": this.transactionIds,
      "contracts": this.dealIds
    })
  }
 
//this function triggers ==> selecting the agent name and fetching the deal list based on selecting the agent name 
  getDeals(agentId : any){
    this.isDisablePosting = true;
    this.selectedAgentName = agentId;
    //this.manualContractId = false;
      this.showSelectDeals = true;
      this.showContracts = false;
      this.isDisableDealTable = false ;
    this.loadDeals = true
    this.arr = [];
    this.dealIds = [];
    this.checkedarray = [];
    this.disableSubmit = true;
    this.balance = 0;
    this.agentId = agentId;
    let sellerCCYCode = this.fetchBuyCurrencyCode;
    if(this.transactionIdsLength == 0){
      this._snackBar.open("Please select Transactions", "Ok", {
        duration:3000,
        panelClass: "red-notification-snackbar"
      });
    }
    else{
      setTimeout(() => {
        this.dealService.getDeals(agentId,sellerCCYCode).subscribe((datas:any) =>{
          this.loadDeals = false;
          this.checked = false ;
          this.suspiciousChecked = false;
          this.susRemarks = "";
          this.isSuspicious = "N";
          this.retrieveDeals = datas['data'].filter((v:any) => v.DEALBALANCE != 0);
          if(this.retrieveDeals.length == 0){
            this._snackBar.open("No Deals for this Selected Country Code", "Ok", {
              duration:3000,
              panelClass: "red-notification-snackbar"
            });
          }
        },
         //error handling done on 03-07-2023
     (error:any) =>{
      this.loadDeals = false;
      this.checked = false ;
      this.suspiciousChecked = false;
      this.susRemarks = "";
      this.isSuspicious = "N";
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }
        )
      }, 1000);
  }
}
  
  
 
//checkbox ==> selection of deals 
selectedDeal(e:any,id : any, dealBalance:any, dealBalanceF : any){
  //when checkbox is checked
    if(e.checked === true){
      let amount = dealBalance;
      this.dealIds.push({id,amount});
      this.arr.push({dealBalance});
      
      this.balance = parseFloat(dealBalance) + this.balance;   //Calculating SGD DEAL BALANCE
      this.dealBalanceF = parseFloat(dealBalanceF) + this.dealBalanceF; //Calculating FCY DEAL BALANCE

      if(this.transactionIdsLength == 0){
        this.disableSubmit = true;
      }
      //enabling button only when dealbalanceF is greater than or equal to payee gets total amount
      if(this.dealBalanceF >= this.payeeGets){
        this.disableSubmit = false;
       }
       else if(this.balance == 0 || this.dealBalanceF == 0){
        this.disableSubmit = true;
       }
       else if(this.dealBalanceF < this.payeeGets){
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
        this._snackBar.open("Deal Balance should be more than or equal to FCY Amount Required", "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
       }
       //throw error when deal selection exceeded above 3
      if(this.arr.length > 2){
        this._snackBar.open("maximum selection of two deals is allowed", "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false ;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
        return false
    }
    }
 //when checkbox is unchecked
    if(e.checked === false){
      const index = this.dealIds.findIndex(v => v.id == id);//Find the index of stored transactionid
      const dealBalanceIndex = this.arr.findIndex(v => v.dealBalance == dealBalance);
      this.dealIds.splice(index, 1); // Then remove the transactionId which is been unselected
      this.arr.splice(dealBalanceIndex,1);
      let poppedBalance = dealBalance;
      this.balance = this.balance - dealBalance;  //calculating dealbalance in SGD
      this.dealBalanceF = this.dealBalanceF - dealBalanceF ;  //calculating dealbalance in FCY
      if(this.dealBalanceF >= this.payeeGets){
        this.disableSubmit = false;
       }
       else if(this.balance == 0 || this.dealBalanceF == 0){
        this.disableSubmit = true;
       }
       else if(this.dealBalanceF < this.payeeGets){
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false ;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
        this._snackBar.open("Deal Balance should be more than or equal to FCY Amount Required", "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
       }
      this.poppedArr = this.arr.filter(v => v !== poppedBalance);
      if(this.poppedArr.length <= 2 && this.poppedArr.length !=0){
        // this._snackBar.open("deal selected , you can proceed now", "Ok", {
        //   duration: 2000,
        //   panelClass: "green-notification-snackbar"
        // });
      }
      else if(this.poppedArr.length == 0){
        this.disableSubmit = true;
        this._snackBar.open("Please Select a Deal", "", {
          duration: 2000,
          panelClass: "orange-notification-snackbar"
        });
      }
       //throw error when deal selection exceeded above 3
       if(this.arr.length > 2){
        this._snackBar.open("maximum selection of two deals is allowed", "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
        return false
    }
    if(this.arr.length == 0){
      this.checked = false;
      this.suspiciousChecked = false;
      this.susRemarks = "";
      this.isSuspicious = "N";
      this.disableSubmit = true;
      this.isDisablePosting = true;
    }
      this.arr = this.poppedArr;
    }
    console.log(this.dealIds);
}

//checkbox ==> selection of contracts 
selectedContract(e:any,contractId : any, dealBalance:any,contractBalance:any){
  //when checkbox is checked
    if(e.checked === true){
      let amount = dealBalance; //deal balance is SGD
      this.dealIds.push({contractId,amount});
      this.arr.push({dealBalance});
      this.balance = parseFloat(dealBalance) + this.balance;  //SGD
      this.contractBalance = parseFloat(contractBalance) + this.contractBalance ;  //USD
      if(this.transactionIdsLength >= 1){
        this.disableSubmit = false;
        //enabling button only when contractBalance is greater than or equal to payee gets
      if(this.contractBalance >= this.payeeGets){
        this.disableSubmit = false;
       }
       else if(this.contractBalance == 0){
        this.disableSubmit = true;
       }
       else if(this.contractBalance < this.payeeGets){
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
        this._snackBar.open(`Contract Balance should be more than '${this.fetchBuyCurrencyCode}' Amount Required`, "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
       }
       //throw error when deal selection exceeded above 3
      if(this.arr.length > 2){
        this._snackBar.open("maximum selection of two contracts is allowed", "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
        return false
    }
      }
      else if(this.transactionIds == 0){
        this._snackBar.open("Please select transaction Id", "Ok", {
          duration: 2000,
          panelClass: "red-notification-snackbar"
        });
        this.disableSubmit = true;
        return false
      }
      
    }
 //when checkbox is unchecked
    if(e.checked === false){
      if(this.transactionIdsLength >= 1){
      const index = this.dealIds.findIndex(v => v.contractId == contractId);//Find the index of stored transactionid
      const dealBalanceIndex = this.arr.findIndex(v => v.dealBalance == dealBalance);
      this.dealIds.splice(index, 1); // Then remove the transactionId which is been unselected
      this.arr.splice(dealBalanceIndex,1);
      let poppedBalance = dealBalance;
      this.balance = this.balance - parseFloat(dealBalance);  //SGD
      this.contractBalance = this.contractBalance - parseFloat(contractBalance) ;  //USD
      if(this.contractBalance >= this.payeeGets){
        this.disableSubmit = false;
       }
       else if(this.contractBalance == 0){
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
       }
       else if(this.contractBalance < this.payeeGets){
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
        this._snackBar.open(`Contract Balance should be more than '${this.fetchBuyCurrencyCode}' Amount Required`, "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
       }
      this.poppedArr = this.arr.filter(v => v !== poppedBalance);
      if(this.poppedArr.length <= 2 && this.poppedArr.length !=0){
        // this._snackBar.open("deal selected , you can proceed now", "Ok", {
        //   duration: 2000,
        //   panelClass: "green-notification-snackbar"
        // });
      }
      else if(this.poppedArr.length == 0){
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
        this._snackBar.open("Please Select a Contract", "", {
          duration: 2000,
          panelClass: "orange-notification-snackbar"
        });
      }
       //throw error when deal selection exceeded above 3
       if(this.arr.length > 2){
        this._snackBar.open("maximum selection of two contracts is allowed", "Ok", {
          duration: 3000,
          panelClass: "red-notification-snackbar"
        });
        this.disableSubmit = true;
        this.checked = false;
        this.suspiciousChecked = false;
        this.susRemarks = "";
        this.isSuspicious = "N";
        this.isDisablePosting = true;
        return false
    }
      this.arr = this.poppedArr;
    }
    console.log("contract ID Array = " + this.dealIds);
      if(this.transactionIdsLength == 0){
      this._snackBar.open("Please select transaction Id", "Ok", {
        duration: 2000,
        panelClass: "red-notification-snackbar"
      });
      this.checked = false;
      this.suspiciousChecked = false;
      this.susRemarks = "";
      this.isSuspicious = "N";
      this.isDisablePosting = true;
      this.disableSubmit = true;
      return false
    }
  }
 
}
//UNUSED FUNCTION FOR NOW
//this function triggers - when DBS is selected as agent and selecting that contract IDS
// selectOtherContract(e:any , contractId : any , amount:any,contractType:string){
// //when checkbox is checked
// if(e.checked === true){
//   if(this.transactionIdsLength == 0){
//     this.disableSubmit = true;
//   }
//   if(contractType == "firstContract"){
//     this.removeValues.push({contractId});
//   }
//   if(contractType == "secondContract"){
//     this.removeValues.push({contractId});
//   }
//    //throw error when deal selection exceeded above 3
//   if(this.arr.length > 2){
//     this._snackBar.open("maximum selection of two deals is allowed", "Ok", {
//       duration: 3000,
//       panelClass: "red-notification-snackbar"
//     });
//     this.disableSubmit = true;
// }
// }
// //when checkbox is unchecked
// if(e.checked === false){
//   if(contractType == "firstContract"){
//     this.contractDealOne = {};
//   }
//   if(contractType == "secondContract"){
//     this.contractDealTwo = {};
//   }
//   if(this.balance >= this.totalAmount){
//     this.disableSubmit = false;
//    }
//    else if(this.balance == 0){
//     this.disableSubmit = true;
//    }
//    else if(this.balance < this.totalAmount){
//     this.disableSubmit = true;
//     this._snackBar.open("Deal Balance should be more than LCY Amount Required", "Ok", {
//       duration: 3000,
//       panelClass: "red-notification-snackbar"
//     });
//    }
//   this.poppedArr = this.arr.filter(v => v !== e);
//   if(this.poppedArr.length <= 2 && this.poppedArr.length !=0){
//     // this._snackBar.open("deal selected , you can proceed now", "Ok", {
//     //   duration: 2000,
//     //   panelClass: "green-notification-snackbar"
//     // });
//   }
  
//   if(contractType == "firstContract"){
//     this.removeValues.pop();
//   }
//   if(contractType == "secondContract"){
//     this.removeValues.pop();
//   }
//   this.arr = this.poppedArr;
// }
// //if both deals are unselected- disable approve button
// if(this.contractDealOne.contractId == undefined && this.contractDealTwo.contractId == undefined){
//   this.disableSubmit = true;
// }
// else{
//   this.disableSubmit = false;
// }
// console.log(this.dealIds);
// }
//enteredFirstAmount : number = 0;
//enteredSecondAmount : number = 0;
// onBlurOtherContracts(contractId : any , amount : any,exchangeRate:any,contractType : string){
//     this.enteredFirstAmount = amount;
//     if(contractId != '' && amount != '' && exchangeRate != ''){
//      this.contractDealOne.contractId = contractId;
//      this.contractDealOne.amount = amount;
//      this.contractDealOne.exchangeRate = exchangeRate;
//       this.disableSubmit = false;
//       if(Number(this.enteredFirstAmount) + Number(this.enteredSecondAmount) <= this.totalAmount){
//         this.disableSubmit = true;
//       }
//       }
//       else{
//         this.disableSubmit = true;
//         //Please Enter both Contract Id, Amount and ERT",
//       }
//   console.log(this.contractDealOne);
// }

// onBlurOtherContracts2(contractId : any , amount : any,exchangeRate:any,contractType : string){
//  this.enteredSecondAmount = amount;
//     if(contractId != '' && amount != '' && exchangeRate != ''){
//       this.contractDealTwo.contractId = contractId;
//       this.contractDealTwo.amount = amount;
//       this.contractDealTwo.exchangeRate = exchangeRate;
//       this.disableSubmit = false;
//       if( Number(this.enteredFirstAmount) + Number(this.enteredSecondAmount) <= this.totalAmount){
//         this.disableSubmit = true;
//       }
//       }
//       else{
//         this.disableSubmit = true;
//         // this._snackBar.open("Please Enter both Contract Id and Amount", "Ok", {
//         //   duration: 3000,
//         //   panelClass: "orange-notification-snackbar"
//         // });
      
//   }
//     console.log(this.contractDealTwo);
// }

enableButton(entityId : any){
  this.isDisablePosting = true;
  //call forex inquiry table here 
  this.checkedarray = [];
  this.arr = [];
  this.disableSubmit = true;
  this.selectedAgentName = entityId ;
  if(this.entityType == "I"  || (this.entityType == "C" && this.transactionTypeIndicator == "D" )){
    if(this.transactionIdsLength >=1){
    this.isDisableContractTable = false;
    this.showContracts = true ;
    this.showSelectDeals = false;
    this.loadDeals = true;
    let entityId : any = 'APT';
   let ccyPair = this.fetchBuyCurrencyCode + "SGD" ;
   let status = "ACTIVE,ENDS TODAY,EXPIRED" ;  //OPEN CHANGED TO ACTIVE
    this.agentService.getForexInquiry(entityId,ccyPair,status,"","").subscribe((data:any)=>{
      this.loadDeals = false;
      this.checked = false ;
      this.suspiciousChecked = false;
      this.susRemarks = "";
      this.isSuspicious = "N";
      this.getContracts = data['contracts'] ;
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
    (error:any) =>{ //error handling completed on 03-07-2023
      this.loadDeals = false;
      this.checked = false ;
      this.suspiciousChecked = false;
      this.susRemarks = "";
      this.isSuspicious = "N";
      let errorMessage ;
      if(error.status != 401){
         errorMessage = "" ;
         this.dialogRef.open(ErrorDialogAdminComponent,{
          data: errorMessage
        })
      }
    }
    )
  }
}
  else if(this.entityType == "A" || (this.entityType == "C" && this.transactionTypeIndicator != "D" )){
      this.disableSubmit = false;  //enabling/disabling approve transaction button
    if(this.transactionIdsLength >= 1){
    this.isDisableContractTable = true;
    this.showContracts = true ;
    this.showSelectDeals = false;
    let entityId : any = 'APT';
    let ccyPair = this.fetchBuyCurrencyCode + "SGD" ;
    let status = "ACTIVE,ENDS TODAY,EXPIRED" ;
    this.agentService.getForexInquiry(entityId,ccyPair,status,"","").subscribe((data:any)=>{
      //this.matspinner = false;
      this.getContracts = data['contracts'] ;
      this.checked = false ;
      this.suspiciousChecked = false;
      this.susRemarks = "";
      this.isSuspicious = "N";
      this.checkedarray = [];
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
    (error:any) =>{
      let errorMessage ;
      this.checked = false ;
      this.suspiciousChecked = false;
      this.susRemarks = "";
      this.isSuspicious = "N";
      if(error.status != 401){
         errorMessage = "" ;
         this.dialogRef.open(ErrorDialogAdminComponent,{
          data: errorMessage
        })
      }
    }
    )
  }
}
  
    

  // if((bankRate != "" && bankRate != null) && bankAcc != "" && bankName != ""){
  //   if(this.transactionIdsLength >=1){
  //   this.disableSubmit = false;
  //   }
  // }
  // else this.disableSubmit = true;
}

withdrawAction(){
  this.isDisablePosting = true ;
  this.checked = false ;
  this.suspiciousChecked = false;
  this.susRemarks = "";
  this.isSuspicious = "N";
  this.agentCommission.setValue('') ;
}

// this will be called when approve transaction is checked
approvalCheckBox(e:any){
  //checking if it is checked 
  if(e.checked == true){
    this.isApproveChecked = true;
    //if suspicious also checked remarks should not be empty
  if(this.isSuspicious == "Y" && this.susRemarks != ""){
   this.isDisablePosting = false ;
  }
  // if it is checked and suspicious is not checked we can enable approve button
  else if( this.isSuspicious == "N"){
    this.isDisablePosting = false ;
  }
}
  // if is not checked disable 
  else if(e.checked == false){
    this.isDisablePosting = true ;
    this.isApproveChecked = false;
  }
}
// if suspicious check box is checked marking transaction as suspicious
markAsSuspicious(e:any){

  // if it is checked disable post button
  if(e.checked == true){
    this.isSuspicious = "Y";
    this.isDisablePosting = true ;
    console.log(this.isSuspicious)
   }
   // if it is unchecked marking suspicious as "N"
   // enable post button according to approve transaction check box;
   else if(e.checked == false){
     this.isSuspicious = "N";
     this.susRemarks = "";
     if(this.isApproveChecked == true){
      this.isDisablePosting = false ;
     }
    else if(this.isApproveChecked == false){
      this.isDisablePosting = true ;
     }
     console.log(this.isSuspicious)
  }
}

// this function will be caleed when remarsk button is clicked
openRemarks(){
   this.dialogRef.open(TransactionSuspiciousRemarksComponent, {
    width:"400px",
    height:"215px",
    panelClass: 'custom-modalbox',
    data:{susRemarks : this.susRemarks ? this.susRemarks : "" }
      })
      .afterClosed().subscribe((response)=>{
        console.log(response);
        if(response){
          // storing response in suspicous remarks
          this.susRemarks = response.remarks;
          // if approve transaction check box is checked enable post transaction button
          if(this.isApproveChecked == true){
          this.isDisablePosting = false;
          }
          // else disable post transaction button
          else{
          this.isDisablePosting = true;
        }
      }
      })
}
numberWithTwoDecimalsValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (value === null || value === undefined || value === '') {
    return null; // Allow empty values (if required)
  }

  const regex = /^\d+(\.\d{1,2})?$/; // Only numbers with up to 2 decimal places

  if (!regex.test(value)) {
    return { invalidNumber: 'Only numbers with up to 2 decimal places are allowed' };
  }

  const numericValue = parseFloat(value);

  if (numericValue > 10) {
    return { maxLimit: 'Value must be less than or equal to 10' };
  }

  return null; // Valid case
}


conditionAgentCommission(): boolean {
  const value : any= this.agentCommission.value;

  // Ensure the field is not empty, follows number pattern, and is ≤ 10
  if (!value || isNaN(value) || value > 10) {
    return true; // Disable button if conditions fail
  }

  return false; // Enable button if conditions pass
 }

}
