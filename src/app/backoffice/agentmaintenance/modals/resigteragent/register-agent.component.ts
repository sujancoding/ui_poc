import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { AddAgent } from '../../models/agent.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import countryCodeArray from 'src/assets/phonecountrycode.json' ;

@Component({
  selector: 'app-register-agent',
  templateUrl: './register-agent.component.html',
  styleUrls: ['./register-agent.component.scss']
})
export class RegisterAgentComponent implements OnInit {

  public form: FormGroup = Object.create(null);
  hide = true;
  showRegister = true ;
  loader = false ;
  phoneNumberCodes = countryCodeArray ;
  countryCode !: string ;

  constructor(private fb: FormBuilder,private agentMaintenanceService : AgentMaintenanceService,
    private dialog : MatDialog, public dialogRef: MatDialogRef<RegisterAgentComponent>) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.email, Validators.required])],
      password: [null, Validators.compose([Validators.minLength(8), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).{8,}$"), Validators.required, Validators.maxLength(16)])],
      phonenumber: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]+$"), Validators.maxLength(15)])],
      agentname: [null, Validators.compose([Validators.required])],
      phoneCountryCode : [null, Validators.compose([Validators.required])],
      Confirmation: [false, Validators.requiredTrue]
    });

      //onload --> patch SG country code 
      this.form.patchValue({
        "phoneCountryCode" :  "flag-icon flag-icon-sg",
      });
      this.countryCode = "+65" ;

  }

  onSubmit(){
    this.showRegister = false ;
    this.loader = true ;
     this.agentMaintenanceService.addNewAgent(this.buildPayload()).subscribe(data =>{
      this.showRegister = true ;
      this.loader = false ;
      this.dialogRef.close(data);
     },
      //error handling 
  (error:any)=>{
    this.showRegister = true ;
    this.loader = false ;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
     )
  }

  buildPayload(): AddAgent{
    let countryFlag = this.form.controls['phoneCountryCode'].value ? this.form.controls['phoneCountryCode'].value : "" ;
    let retrieveCountryArray : any[] = this.phoneNumberCodes.filter(v => v.FLAG == countryFlag) ;
    let value = retrieveCountryArray[0].code ? retrieveCountryArray[0].code : "" ;
    let countryCode = value.replace('+', ''); // Removing the '+' character
    console.log("country code value =", countryCode); 
   return new AddAgent({
    "agentName" : this.form.controls['agentname'].value ,
    "email" : this.form.controls['username'].value  ,
    "phone" :  this.form.controls['phonenumber'].value  ,
    "phoneCountryCode" : countryCode ,
    "password" : this.form.controls['password'].value  ,
    "customerType": "A" , //Hardcoded as "A" for agent register
    "address" : {
      "unit": "",
        "block": "",
       "buildingName": "",
        "street": "",
        "country": "",
        "postalCode": ""
    }
   })
  }

  onClose() {
      this.dialogRef.close('No Data');
  }

  onSelectPhoneCode(flag:string){
    var array :any[] = countryCodeArray.filter(v => v.FLAG == flag) ;
   if(array.length == 1){
    this.countryCode = array[0].code ;
   }
  }

}
