import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PayeeSearch } from 'src/app/backoffice/customer/model/customer.model';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { AddPayeeComponent } from 'src/app/payee/add-payee/add-payee.component';
import { AddPayee } from 'src/app/payee/payeeModel/updatePayee';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { AgentServiceService } from '../../agent/agent-service.service';
import { Payee } from '../../agent/models/agent.model';
import { PayeeService } from '../service/payee.service';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { getApplicantStatusBgColor, getApplicantStatusColor } from 'src/assets/transactionstatus';
import { relationArr } from 'src/assets/dropdownvalues';


@Component({
  selector: 'app-payee',
  templateUrl: './payee.component.html',
  styleUrls: ['./payee.component.scss', '../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class PayeeComponent implements OnInit {
  p: number = 1;
  itemsPerPage: number = 20; 
  id!: number;
  searchStatus !: string;
  payee: PayeeSearch[]=[];
  payeeSearch : PayeeSearch[]=[];
  showColumn: Boolean = true;
  showButton: Boolean = false;
  showOKButton : Boolean = false;
  showMatToolbar: Boolean = false;
  disableOkButton: Boolean = true;
  payeeId!: string;
  payeeName!: string;
  payeeAccNo!: string;
  payeeCountry!: string;
  payeeBankName!: string;
  payeeSwiftCode!: string;
  isActive = false;
  isDisableDeleteIcon : Boolean = true ;
  loader = false ;
  filterForm : FormGroup = Object.create(null);
  isDisableAddPayee = false ;
  disableDropdown : boolean = false;
  routingCode : string = "" ;
  relation:any []=relationArr;
  status : string ="";
 
  constructor(public dialogRef: MatDialog,private agentService: AgentServiceService,private route: ActivatedRoute,private headerService : TitleHeaderService,
   private payeeService: PayeeService, public dialog: MatDialogRef<PayeeComponent>,  @Inject(MAT_DIALOG_DATA) public data: any,private fb : FormBuilder,
   private store : InMemoryCache) { }

   handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Payee');
    this.searchStatus = "" ;
    let appStatus : string = this.store.getItem('APPLICATIONSTATUS') ? this.store.getItem('APPLICATIONSTATUS') : '' ;
    if(appStatus == "NEW" || appStatus == "PENDING"){
      this.isDisableAddPayee = true;
    }
    else{
      this.isDisableAddPayee = false ;
    }
    this.filterForm = this.fb.group({
      "payeeName" : [null,Validators.compose([Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')])],
    })
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    //if the agent opens > payee opens in Menu > function triggers
    if(!this.data.payeeTable){
      this.getPayeeDetails();
    }


   if(this.data.payeeSearch){
    this.headerService.setTitle('Send Money');
    this.showColumn = false;
    this.showMatToolbar = true;
    this.showButton = true;
    this.payee = this.data.payeeTable;
    this.disableDropdown = true; 
    this.searchStatus = "1"
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
  }
//responsvie table height based on windows inner height
  changeTableHeight() {
    return { 'height': (this.getScreenHeight - 208) + 'px', 'overflow-y': 'auto' };
  }
//STATUS color diff
getColor(value: any) {
  return getApplicantStatusColor(value);
  }

//bg color for status tags .
getBackgroundColor(status: string): string {
  return getApplicantStatusBgColor(status)
  }
  
  addPayee(){
    this.dialogRef.open(AddPayeeComponent, {
      panelClass: 'custom-modalbox',
      width:'1240px',
      height: '600px',
      data: {isreview: true}
     }).afterClosed().subscribe( val=>{
     setTimeout(() => {
      console.log(val);
      this.getPayeeDetails();
     }, 3000);
   
  })
  }
  editPayee(customerId:string, payeeId:string){
    this.payeeService.viewPayee(customerId,payeeId).subscribe((datas:any) =>{
    this.payeeSearch = datas['data'];
    this.dialogRef.open(AddPayeeComponent, {
      panelClass: 'custom-modalbox',
      width:'1240px',
      height: '600px',
      data: {rowData:this.payeeSearch,customerId:customerId,payeeId:payeeId}
     }).afterClosed().subscribe( val=>{
      this.getPayeeDetails();
     })
    },
    //error handling completed - 30/06/2023
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
     }
    );
  }
 
  getPayeeDetails(){
    this.loader = true ;
    var status : any ;
    if(this.searchStatus == ""){
      status =  '0,1';
    }
    if(this.searchStatus == "0"){
      status =  '0';
    }
    if(this.searchStatus == "1"){
      status =  '1';
    }
    setTimeout(() => {
      this.agentService.getPayeeListings(status).subscribe((datas:any) => {
        this.payee = datas['data'];
        this.loader = false ;
       },
         //error handling completed - 05/07/2023
      (error:any)=>{
        this.loader = false;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
        }
       }
       )
    }, 500);
   
  }

  
  //Agent > SendMoney > on SelectingRadio Button > function triggers
  radioSelected(payeeID:any,payeename:any,payeeaccNo:any,payeecountry:any,payeebank:any,payeeswiftcode:any, routingCode : any){
    this.showOKButton = true;
    this.disableOkButton = false;
    this.payeeId = payeeID;
    this.payeeName = payeename;
    this.payeeAccNo = payeeaccNo;
    this.payeeCountry = payeecountry;
    this.payeeBankName = payeebank;
    this.payeeSwiftCode = payeeswiftcode ? payeeswiftcode : "" ;
    this.routingCode = routingCode ? routingCode : "" ;
    console.log(this.payeeId +","+ this.payeeAccNo + "," + this.payeeName)
  }

  
  //on Click Ok button > navigate to SendMoney Screen (AGENT) with Payee Data
  navigateParentScreen(){
    let id = this.payeeId;
    let name = this.payeeName;
    console.log("value" + name);
    let status = '1';
      this.agentService.getPayee(status,id).subscribe((datas:any)=>{
          let show = true;
          this.payee = datas['data'];
          this.dialog.close({ payeeData: datas['data'], payeeId : id, payee_name: name , payee_accountNo: this.payeeAccNo, payee_country:this.payeeCountry ,payee_BankName:this.payeeBankName ,Payee_SwiftCode:this.payeeSwiftCode, Payee_show:show, 
            Payee_RoutingCode : this.routingCode
           });
   },
    //error handling completed - 05/07/2023
    (error:any)=>{
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
     }
   )
  }



  //agent > search filter > onClick Apply Filter button
  applyFilter(status:string){
    this.p = 1;
    let name : string = this.filterForm.controls['payeeName'].value ;
    let Status = status ? status : '';
    if(Status == "PENDING"){
      this.status='0'
    }
    else if (Status == "APPROVED") {
      this.status='1'
    }
    else {
      this.status='0,1'
    }
    let payeeName = name ? name : '';
    this.loader = true ;
      this.agentService.applyFilter(this.status,payeeName).subscribe((datas:any) => {
        this.payee = datas['data'];
        this.loader = false ;
       },
       (error:any) => { //error handling completed on 05/07/2023
        this.loader = false;
        if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
        }
       }
       )
    
  }
  getRelationDescription(code: string): string {
    let relationship = this.relation.find(item => item.CODE === code);
    return relationship ? relationship.RELATION : ""; // Fallback to code if no match is found
  }
}

