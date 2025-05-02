import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AgentServiceService } from 'src/app/agent/agent-service.service';
import { PayeeSearch } from 'src/app/backoffice/customer/model/customer.model';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { ErrorDialogComponent } from 'src/app/onboarding/modals/errordialog.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { relationArr,countryArr, swiftCodeFilterArray, bankCodeTypeArr,  } from 'src/assets/dropdownvalues';
import { AddPayee, Address, BankInfo, PayeeInfo} from '../payeeModel/updatePayee';
import { PayeeService } from '../service/payee.service';
import { roleIdDetails } from 'src/assets/userrole';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { SavedDialogBoxComponent } from 'src/app/backoffice/shared/modals/saved-dialog-box.component';
import { SuccessDialogComponent } from 'src/app/shared/components/success-dialog/success-dialog.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-add-payee',
  templateUrl: './add-payee.component.html',
  styleUrls: ['./add-payee.component.scss']
})
export class AddPayeeComponent implements OnInit {

addpayee: AddPayee = new AddPayee();
searchPayee : PayeeSearch = new PayeeSearch();
public form: FormGroup = Object.create(null);
flag: Boolean = false;
adminAddPayeeflag : Boolean = false;
isReadOnly : Boolean = false;
custLoader : Boolean = false;
isDisabled : Boolean = true;
viewPayeeButton : Boolean = false;
id!:number;
viewPayeeFlag: Boolean = false;
loader : Boolean = false;
payeeId : any;
customerId:any;
SavebyCustomer: Boolean = true;
country: string[] = countryArr;
selectedCustomerId !: string;
selectedPayeeId !: string;
currencyCode !: string;
showBankCountry = true ;
filteredRelation:any []=relationArr; 
filteredCountries: any[] = countryArr;
filteredPayeeBankCountries : any[] = countryArr ;
swiftcodeFilterArray : any[] = swiftCodeFilterArray;  
options: any[] = []; 
filteredOptions!: Observable<any[]>;
bankCodeType : any[] = bankCodeTypeArr;
codeLabel : string = "Routing Code" ;



  constructor(private router:Router,private payeeService:PayeeService,private alertService:AlertService,private agentService: AgentServiceService
   , private fb:FormBuilder,private route: ActivatedRoute,@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<AddPayeeComponent> , private store : InMemoryCache,
   private headerService : TitleHeaderService,private snackbar: MatSnackBar , private dialog : MatDialog) {
     
     }

     displayFn(swiftcodeSearchValue: any): string {
      return swiftcodeSearchValue && swiftcodeSearchValue ? swiftcodeSearchValue : '';
    }
     
    private _filter(value: string): any[] {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.value.toLowerCase().includes(filterValue));
      }
    
    
 
  ngOnInit(): void {
    //building form and validations
    this.headerService.setTitle('Add Payee');
    this.form = this.fb.group({
      AccountNumber: [null, [Validators.compose([Validators.required]),Validators.pattern('^[a-zA-Z0-9]+$')]],
      payeeName: [null, [Validators.compose([Validators.required]),Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')]], // newly changed, payeename field we allow alphanumeric
      relation: [null, [Validators.compose([Validators.required])]],
      phonenumber: [null, [Validators.compose([Validators.pattern('^[0-9 \-\']+')])]],
      EmailId: [null, Validators.compose([Validators.email])],
      payeeAddress: [null, [Validators.compose([Validators.required]),Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')]],
      payeeState: [null, [Validators.compose([Validators.required]),Validators.pattern('^[a-zA-Z \-\']+'),Validators.maxLength(20)]],
      payeeCountry: [null, [Validators.compose([Validators.required]),Validators.pattern('^[a-zA-Z \-\']+')]],
      bankName: [null, [Validators.compose([Validators.required]),Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')]],
      swiftcode: [null, [ Validators.compose([Validators.pattern('^[a-zA-Z0-9]+$')])]],
      routingCode : [null,[ Validators.compose([Validators.pattern('^[0-9 \-\']+')])]] ,
      bankAddress: [null, [Validators.compose([Validators.required]),Validators.pattern('^[a-zA-Z0-9 +?:().,/-]+$')]],
      bankCountry: [null, [Validators.compose([Validators.required])]],
      beneficiaryCountry : [null, [Validators.compose([Validators.pattern('^[a-zA-Z \-\']+')])]],  //added on 14 Sep 2023 , user can search payee country and fetch it .
      beneficiaryBankCountry : [null, [Validators.compose([Validators.pattern('^[a-zA-Z \-\']+')])]],  //added on 14 Sep 2023 , user can search payee bank country and fetch it .
      codeType : [""]

    })

     // Swift Code mat auto complete implementation..
     this.options = this.swiftcodeFilterArray.map(item => ({value : item.value})) ;
     this.filteredOptions = this.form.controls['swiftcode'].valueChanges.pipe(
      startWith(''),
      map(res => {
        const value = typeof res === 'string' ? res : res?.value;
        return res ? this._filter(value as string) : this.options.slice();
      }),
    );

    console.log(this.data);
    let role = this.store.getItem('USER_ROLE');
    if(role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER ){
      this.country = countryArr ; //USD,UK,AUD,CHF
    }
    else{
      this.country = countryArr ; //MYR,THB,IDR
    }
         //Agent -888                   //Corporate -> All 3 - 555,556,557
    if(role == roleIdDetails.AGENT || role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER){
       this.showBankCountry = false;
       this.form.controls['bankCountry'].clearValidators();
       this.form.controls['bankCountry'].updateValueAndValidity();
    }
    else if(role && role != roleIdDetails.AGENT && role != roleIdDetails.CORPORATE_OWNER && role != roleIdDetails.CORPORATE_RUNNER && role != roleIdDetails.CORPORATE_DEALER){   // if role other than 888/555/556/557 , the block will executed .
      this.showBankCountry = true;
    }
    

   //consumer -> view payee - mobile device
   this.customerId = this.route.snapshot.params['customerId'];
   this.payeeId = this.route.snapshot.params['payeeId'];
   this.store.setItem('PAYEEID',this.payeeId)
   if(this.customerId != undefined && this.payeeId != undefined){
    this.headerService.setTitle('View Payee');
   this.payeeService.viewPayee(this.customerId,this.payeeId).subscribe((datas:any) =>{
    this.searchPayee = datas['data'];
    this.store.setItem('PAYEE_PHONENO',datas['data'][0].PHONENBR);
    this.store.setItem('RELATIONSHIPCODE',datas['data'][0].RELATIONSHIP);
    if(datas.data[0].STATUS == "ACTIVE"){
      this.isDisabled = false;
    }
    this.isReadOnly = true;
    this.SavebyCustomer = false;
    this.viewPayeeButton = true;
    this.form.patchValue({
      "AccountNumber": datas.data[0].ACCOUNTNBR,
      "payeeName":  datas.data[0].NAME,
      "phonenumber": datas.data[0].PHONENBR,
      "relation":datas.data[0].RELATIONSHIP ? datas.data[0].RELATIONSHIP : "",
      "EmailId": datas.data[0].EMAILID,
      "payeeAddress":datas.data[0].ADDRESS,
      "payeeState" :datas.data[0].STATE,
      "payeeCountry" : datas.data[0].COUNTRY,
      "bankName": datas.data[0].BANKNAME,
      "swiftcode": datas.data[0].SWIFTCODE ? datas.data[0].SWIFTCODE : "",
      "routingCode" : datas.data[0].ROUTINGCODE ? datas.data[0].ROUTINGCODE : "" , //change done for routing code
      "bankAddress" : datas.data[0].BRANCHNAME,
      "bankCountry": datas.data[0].COUNTRY,
      "beneficiaryBankCountry" : datas.data[0].COUNTRY,
      "beneficiaryCountry" : datas.data[0].COUNTRY,
      "codeType" : datas.data[0].BANKBRANCHTYPE ? datas.data[0].BANKBRANCHTYPE : "" 
    })
    // patching label name According to BANKBRANCHTYPE
    this.codeLabel = this.getBankCodeDescription(datas.data[0].BANKBRANCHTYPE);
  
   },
   
   (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogComponent) ;
    }
   })
  }

 //agent - view payee   
    if(this.data.rowData){
      this.country = countryArr ; //USD,UK,AUD,CHF
      this.selectedCustomerId  = this.data.customerId;
      this.selectedPayeeId  = this.data.payeeId;
      this.headerService.setTitle('Payee');
      this.viewPayeeFlag =true;
      this.SavebyCustomer = false;
      
      const index = countryArr.findIndex(obj => obj.COUNTRY === this.data.rowData[0].COUNTRY);
      if(index != -1){ //issue fix here...
      this.currencyCode = countryArr[index].CURRENCYCODE ;
      }
      
      this.form.patchValue({
        "AccountNumber": this.data.rowData[0].ACCOUNTNBR,
        "payeeName":  this.data.rowData[0].NAME,
        "phonenumber": this.data.rowData[0].PHONENBR,
        "relation":this.data.rowData[0].RELATIONSHIP ? this.data.rowData[0].RELATIONSHIP : "",
        "EmailId": this.data.rowData[0].EMAILID,
        "payeeAddress":this.data.rowData[0].ADDRESS,
        "payeeState" :this.data.rowData[0].STATE,
        "payeeCountry" : this.data.rowData[0].COUNTRY,
        "bankName": this.data.rowData[0].BANKNAME,
        "swiftcode": this.data.rowData[0].SWIFTCODE ? this.data.rowData[0].SWIFTCODE : "",
        "routingCode" : this.data.rowData[0].ROUTINGCODE ? this.data.rowData[0].ROUTINGCODE : "" , //change done for routing code
        "bankAddress" : this.data.rowData[0].BRANCHNAME,
        "bankCountry": this.data.rowData[0].COUNTRY,
        "beneficiaryBankCountry" : this.data.rowData[0].COUNTRY,
        "beneficiaryCountry" : this.data.rowData[0].COUNTRY,
        "codeType" : this.data.rowData[0].BANKBRANCHTYPE ? this.data.rowData[0].BANKBRANCHTYPE : ""
  
      })
          // patching label name According to BANKBRANCHTYPE
      this.codeLabel = this.getBankCodeDescription(this.data.rowData[0].BANKBRANCHTYPE);
    }
 
    //agent - add payee
    if(this.data.isreview){
      this.country = countryArr ; //USD,UK,AUD,CHF
      this.headerService.setTitle('Payee');
      this.flag =true;
      this.SavebyCustomer = false;
      }

      //customer search - add payee
    if(this.data.addPayeeModal){
      this.headerService.setTitle('Customers');
      if(this.data.customerType == "C"){
        this.country = countryArr ; //USD,UK,AUD,CHF
        this.showBankCountry = false;
        this.form.controls['bankCountry'].clearValidators();
        this.form.controls['bankCountry'].updateValueAndValidity();
      }
      this.adminAddPayeeflag =true;
      this.SavebyCustomer = false;
    }  
  }
//function -> add payee via backoffice
  addPayeeBackoffice(){
    this.payeeService.AddPayeeBackoffice(this.buildPayee()).subscribe(data => {
      console.log(data);
       this.store.setItem('PAYEE_ID',data.payeeId);
       this.dialog.open(SuccessDialogComponent, {
        panelClass: 'custom-modalbox',
        width:'322px',
        height:'140px',
        data: "Payee added by BackOffice",
       })
    },
    //error handling - completed
    (error:any) => { 
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
        }) ;
      }
     })
  }

  //function -> agent - add payee
  addBeneficiary(){
    this.payeeService.AddPayeebyAgent(this.buildPayee()).subscribe(data => {
      console.log(data);
      this.alertService.clear()
      this.alertService.success("Registration Successful!!");
      this.dialogRef.close({data : data})
      
    },
    (error:any) => {
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ; // new change desc : we will open desktop based error dialog component for agent add payee 
      }
   
     })
    }
   //function - agent - upadate payee 
  updateBeneficiary(){
    this.payeeService.updatePayee(this.selectedCustomerId,this.selectedPayeeId,this.buildPayee()).subscribe(data =>{
      console.log(data);
    },
     //error handling completed - 05/07/2023
     (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
     }
    )
  
  }

  //on change code type dropdown -> will dynamically change label name for next field which is 'routingCode'
  onChangeCodeType(){
    // on changeing Code type patching Description as label.
    let codeTypeValue  = this.form.controls['codeType'].value ? this.form.controls['codeType'].value : "" ;
    let codeTypeDescription = "";
    if (codeTypeValue) {
      const selectedCodeType = this.bankCodeType.filter(item => item.VALUE === codeTypeValue);
      codeTypeDescription = selectedCodeType ? selectedCodeType[0].DESCRIPTION : "";
    }
    this.codeLabel = codeTypeDescription;
    if(this.codeLabel == ""){
      this.codeLabel = "Routing Code" ;
    }
   }

  onClickPayeeCountry(){
    let payeeCountry = this.form.controls['payeeCountry'].value ;
    let array = countryArr.filter(v => v.COUNTRY == payeeCountry);
    this.currencyCode = array[0].CURRENCYCODE ;
    console.log(this.currencyCode);
  }
  onSubmit(){
    this.SavebyCustomer = false;
    this.custLoader = true;
   this.payeeService.AddPayee(this.buildPayee()).subscribe(data => {
    console.log(data);
    this.SavebyCustomer = true;
    this.custLoader = false;
     //  this.payeeId = this.payeeId.push(data.payeeId);
     this.store.setItem('PAYEE_ID',data.payeeId);
     const selectedCode = this.form.controls['relation'].value ? this.form.controls['relation'].value : "";
     let relationShipDesc = this.getRelationDescription(selectedCode) ;
     // sending bank code type in Query params.
     const selectedbankCode =  this.form.controls['codeType'].value ? this.form.controls['codeType'].value : ""
     let bankCodeTypeDesc = this.getBankCodeDescription(selectedbankCode)
      this.router.navigate(['/payee/payee-receipt'],{queryParams:
        { 'payee_name': this.form.controls['payeeName'].value , 'account_no':this.form.controls['AccountNumber'].value,'payee_nationality':this.form.controls['payeeCountry'].value,'bank_name':this.form.controls['bankName'].value,'bank_swiftcode':this.form.controls['swiftcode'].value ? this.form.controls['swiftcode'].value : "",'bank_location':this.form.controls['bankCountry'].value,'relationship': relationShipDesc,
          'bank_routingCode' : this.form.controls['routingCode'].value ? this.form.controls['routingCode'].value : "",'bank_codeType' : bankCodeTypeDesc
        }})
  
  },
  //error handling completed - 30/06/2023
  error => {
    console.log(error.message);
    this.SavebyCustomer = true;
    this.custLoader = false;
    if(error.status != 401){
      this.dialog.open(ErrorDialogComponent);
    }
   })
  
  }

  buildPayee(): AddPayee{
    return new AddPayee({
      "payeeInfo" : this.buildPayeeInfo(),
      "bankInfo" : this.buildBankInfo()
    })
  }
 
  buildPayeeInfo(): PayeeInfo{
    return new PayeeInfo({
      "name": this.form.controls['payeeName'].value ,
      "accountNumber": this.form.controls['AccountNumber'].value ,
      "relationship":this.form.controls['relation'].value ? this.form.controls['relation'].value : '', 
      "phoneNo" : this.form.controls['phonenumber'].value ,
      "emailId" : this.form.controls['EmailId'].value , 
      "currencyCode": this.currencyCode,
      "address": this.buildAddress(),
      
    }
    )
  }
  buildAddress(): Address{
    return new Address({
      "address": this.form.controls['payeeAddress'].value ,
      "state": this.form.controls['payeeState'].value ,
      "country": this.form.controls['payeeCountry'].value ,
    })
  }  
  buildBankInfo(): BankInfo{
   return new BankInfo({
     "name": this.form.controls['bankName'].value ,
     "branch": this.form.controls['bankAddress'].value ,
     "swiftCode": this.form.controls['swiftcode'].value ? this.form.controls['swiftcode'].value : "" ,
     "routingCode" : this.form.controls['routingCode'].value ? this.form.controls['routingCode'].value : "",
     "bankBranchType" : this.form.controls['codeType'].value ? this.form.controls['codeType'].value : "",
     //"country": this.form.controls['bankCountry'].value
   })
  }
  navigateSendMoney(){
    let customerStatus = this.store.getItem('CUSTOMER_STATUS');
    let customerType = this.store.getItem('CUSTOMER_TYPE')
    this.viewPayeeButton = false;
    this.loader = true;
    if(customerStatus == "ACTIVE"){
    this.router.navigate(['payee/remit-money']);
    this.viewPayeeButton = true;
     this.loader = false;
    }
    else if(customerStatus == "INACTIVE"){
     this.snackbar.open("You can't do Remittance now, unless your account is activated! " , "Ok");
     this.viewPayeeButton = true;
     this.loader = false;
    }
    if(customerType == "C"){
     this.router.navigate(['agent/agent-sendmoney']);
    }
    else if(customerType == "I"){
      this.router.navigate(['payee/remit-money']);
    }
  }
//this function triggers when value entered in search payee country field 
  filterPayeeCountry(country:HTMLInputElement){
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

  //this function triggers when value entered in search payee bank country field 
  filterPayeeBankCountry(country:HTMLInputElement){
    country.value = country.value.toUpperCase() ;
    if (country.value == '') {
      // If the search input is empty, show all countries
      this.filteredPayeeBankCountries = this.country;
  }
  else {
      // Filter countries based on the search input
      this.filteredPayeeBankCountries = this.country.filter((v: any) => v.COUNTRY.includes(country.value));
      if(this.filteredPayeeBankCountries.length == 0){
        this.filteredPayeeBankCountries = this.country;
      }  
  }
  }
  
 
  getRelationDescription(code: string): string {
    let relationship = this.filteredRelation.find(item => item.CODE === code);
    return relationship ? relationship.RELATION : ""; // Fallback to code if no match is found
  }
// getting bank code description.
  getBankCodeDescription(code : string):string {
    if(code){
    let bankCodeType = this.bankCodeType.filter((v) => v.VALUE === code);
     return  bankCodeType ? bankCodeType[0].DESCRIPTION : "";
    }
    return "Routing Code"
    }
  
}
