import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentServiceService } from 'src/app/agent/agent-service.service';
import { AgentSendMoney } from 'src/app/agent/models/agentsendmoney.model';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';

import { CancelDialogComponent } from '../../modals/cancel-dialog.component';
import { InMemoryCache } from '../../services/cache.service';
import { DataService } from '../../services/data.service';
import { CommissionchargesComponent } from 'src/app/backoffice/dailysetup/commissioncharges/commissioncharges.component';
import { CommissionService } from 'src/app/core/services/commission.service';
import { DatePipe } from '@angular/common';
import { roleIdDetails } from 'src/assets/userrole';
import { relationArr, sharingTypeValue } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-review-remittance',
  templateUrl: './review-remittance.component.html',
  styleUrls: ['./review-remittance.component.scss', '../../../../assets/styles/tables/table-style.scss'],
})
export class ReviewRemittanceComponent implements OnInit {
  contractsArray : any[] = [] ;
  payeeData : any ;
  userName !: string ;
  totalAmount : any ;
  arrayCount : any;
  customerType !: string ; 
  payeeId !: string ;
  isMocked !: string ;
  remarks !: string ;
  logo = 'assets/images/agent-review.png' ;
  fcyTotalAmount : any;
  payeeCountryCode !: string;
  typeOfPerson : any;
  adminFee : any;
  finalTotalAmount : any ;
  sendCurrencyCode !: string;
  isDisableSubmit : boolean = true;
  remitArray : any[]=[];
  initatedDate !: any;
  submitButtonLoader : boolean = false;
  showSubmitButton : boolean = true;
  originatedRemitter : any ;
  remitterDetailsInternalValue : any ;
  showCorporateFromAddress : Boolean = false ;
  showAgentRelatedFields : Boolean = false ;
  purposeOfRemittance !: string ;
  displaySharingType !: string ; 
  sharingType !: string ;
  sharingTypeValues = sharingTypeValue ;
  relation:any []=relationArr;

  constructor(private titleHeader: TitleHeaderService,private store: InMemoryCache,private commissionService: CommissionService,
    private agentService : AgentServiceService,private dataService: DataService,private dialog : MatDialog,private router : Router,private datePipe :DatePipe ) { }

  ngOnInit(): void {
    this.titleHeader.setTitle('Review') ;
    this.userName = this.store.getItem('USERNAME');
    this.remarks = this.store.getItem('REMARKS') ;
    this.fcyTotalAmount = this.store.getItem('TOTALAMOUNT_FOREIGNCCY');
    this.payeeCountryCode = this.store.getItem('SELECTED_CURRENCY') ;
    this.originatedRemitter = this.store.getItem('ORIGINATED_REMITTER') ? this.store.getItem('ORIGINATED_REMITTER') : "" ;
    this.purposeOfRemittance = this.store.getItem('AGENT_TT_PURPOSE_OF_REMITTANCE') ? this.store.getItem('AGENT_TT_PURPOSE_OF_REMITTANCE') : "" ;
    let status = '1';
    //Role
    let userRole = this.store.getItem('USER_ROLE') ? this.store.getItem('USER_ROLE') : "" ;
    //if role is 888 => Will display 'Agent From Address'
    if(userRole == roleIdDetails.AGENT){
      this.showAgentRelatedFields = true ;
      this.showCorporateFromAddress = false ;
    }
    //else => Will display 'Corporate From Address'
    else{
      this.showAgentRelatedFields = false ;
      this.showCorporateFromAddress = true ;
    }
    this.payeeId = this.store.getItem('SELECTED_PAYEEID') ;
      this.agentService.getPayee(status,this.payeeId).subscribe((datas:any)=>{
          this.payeeData = datas['data'];
          let payeeName = this.payeeData[0].NAME ;
          let relationCode = this.payeeData[0].RELATIONSHIP ? this.payeeData[0].RELATIONSHIP : "" ;

          this.store.setItem('PAYEENAME',payeeName);
          this.store.setItem('RELATIONSHIPCODE', relationCode)
         // this.store.removeItem('SELECTED_PAYEEID') ;
   },
   (error : any)=> {
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent)
    }
  }
   )
    //this.contractsArray = this.dataService.contractArray ;
    this.contractsArray = JSON.parse(this.store.getItem('CONTRACT_ARRAY'));
    this.remitArray =   JSON.parse(this.store.getItem('REMIT_RECIPT_ARRAY'));
    this.arrayCount = this.contractsArray.length ;
    this.totalAmount = this.contractsArray.reduce((acc, curr) => acc + curr.amount, 0);
    this.store.setItem('CUSTOMER_SENDS_AMOUNT',this.totalAmount);
      this.adminFee = this.store.getItem('ADMIN_FEE');
      
      this.sharingType = this.store.getItem('AGENT_SHARINGTYPE') ? this.store.getItem('AGENT_SHARINGTYPE') : "";
      if(this.sharingType == "1"){ //Its SHA
       this.displaySharingType = this.sharingTypeValues[0].shared ;
      }
      else if(this.sharingType == "2"){ //Its OUR
        this.displaySharingType = this.sharingTypeValues[0].our  ;
      }
      else if(this.sharingType == "3"){ // Its BEN
        this.displaySharingType = this.sharingTypeValues[0].they ;
      }
      else { // Its empty string , s .
        this.displaySharingType = "N/A"  ;
      }

      this.totalAmount = parseFloat(this.totalAmount).toFixed(2);
      this.finalTotalAmount = (parseFloat(this.adminFee) + parseFloat(this.totalAmount)).toFixed(2);
      this.store.setItem('FINAL_CUSTOMER_SENDS_AMOUNT',this.finalTotalAmount);
    console.log(this.totalAmount);
   //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;

  
  
  }
  onSelect(event : any){
  console.log("Please check the payment Agrement ");
  if(event.checked == true){
  this.isDisableSubmit = false;
  }
 else if(event.checked == false){
  this.isDisableSubmit = true;
  }
  }
  public getScreenWidth: any;
  public getScreenHeight: any;
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    console.log(this.getScreenHeight) ;
  }

  marginTopButton(){
    return {'margin-top': (this.getScreenHeight - 800) + 'px'};
  }
//ADD TRANSACTION API CALL - AGENT/CORPORATE
  onSubmit(){
    const role = this.store.getItem('USER_ROLE');
    let userId : string = this.store.getItem('USER_ID');
    this.sendCurrencyCode= this.store.getItem('PAYEEGETS_CURRENCY_CODE');
    this.remarks = this.store.getItem('REMARKS') ;
    var date = new Date() ;
    this.showSubmitButton = false;
    this.submitButtonLoader = true;
    this.initatedDate = this.datePipe.transform(date, 'd MMMM yyyy, h:mm a');
    this.store.setItem("TRANSACTION_INITIATED_DATE",this.initatedDate);
    if(this.originatedRemitter == "No Originated Remitter"){
      this.remitterDetailsInternalValue = "";
    }
    else{
      this.remitterDetailsInternalValue = this.originatedRemitter;
    }
    if (role  === roleIdDetails.AGENT) { //888 - agent
       this.customerType = "A"; //for agent send-money
       this.isMocked = "true" ;  //No need to show QR
    }
    if (role  === roleIdDetails.CORPORATE_OWNER || role  === roleIdDetails.CORPORATE_RUNNER || role  === roleIdDetails.CORPORATE_DEALER) {  //corporate - 555 - owner , 556-runner , 557-dealer
        this.customerType = "C"; //for corporate send-money
        this.isMocked = "" ;  //need to show QR
        this.store.removeItem('QR_EXPIRED');
    }
 this.agentService.agentSendMoney(this.buildPayload(),userId).subscribe(data => {
        console.log(data);
        this.submitButtonLoader = false;
        this.showSubmitButton = true;
        if(data){
          this.store.setItem('REFERENCE_NUMBER_ADMIN',data.transactionId);
          // this.store.removeItem('REMARKS') ;  dheepan changes : we want retrive  remarks in reciept screen
          // this.store.removeItem('TOTALAMOUNT_FOREIGNCCY') ; dheepan changes : we want retrive  Fcy totalAmount in reciept screen
        }
        if((role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER)){
          this.store.setItem('REF_ID',data.transactionId);
          this.store.setItem('QR',data.qrCode); //storing QR binary from response
          this.router.navigate(['profile/qr']) ;
        }
        else if( role == roleIdDetails.AGENT){
           this.store.setItem('REF_ID',data.transactionId);
           this.router.navigate(['admin/backoffice-receipt']);
        }
        else{ // if role other than 888/555/556/557 , the block will executed .
          this.store.setItem('REF_ID',data.transactionId);
          this.router.navigate(['admin/backoffice-receipt']);
       }
       },
       
       error =>{
        this.submitButtonLoader = false;
        this.showSubmitButton = true;
        // this.store.removeItem('TOTALAMOUNT_FOREIGNCCY') ;
        this.dialog.open(ErrorDialogAdminComponent);
       })
  }
  buildPayload():AgentSendMoney{
    return new AgentSendMoney({
       "customerType" : this.customerType,
       "payeeId": this.payeeId,
       "sendAmount": this.totalAmount, 
       "sendAmountF" : this.fcyTotalAmount ,
       "remarks": this.remarks,
       "contracts" : this.contractsArray ,
       "isMocked" : this.isMocked,
       "sendCurrencyCode" : this.sendCurrencyCode,
       "originatedRemitter"  : this.remitterDetailsInternalValue,
       "purposeOfRemittance" : this.purposeOfRemittance,
       "sharingType" : this.sharingType ,
       "forexBookingType" : "C" //'C'--> Its initiating transaction With contract ..
    })
   }

   openAlertDialog(){
    // this.store.removeItem('SELECTED_PAYEEID') ;
    // this.store.removeItem('REMARKS') ;
    // this.store.removeItem('REF_ID');
    // this.store.removeItem('QR'); //storing QR binary from response
    // this.router.navigate(['agent/agent-sendmoney']);
    this.dialog.open( CancelDialogComponent,{
      data :{reviewedBy : "AGENT"},
      width : "500px"
    })
   }
   getRelationDescription(code: string): string {
    let relationship = this.relation.find(item => item.CODE === code);
    return relationship ? relationship.RELATION : ""; // Fallback to code if no match is found
   }

}
