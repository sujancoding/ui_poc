import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { AddCurrency, UpdateCurrency } from 'src/app/core/model/mcmaintenance/mcmaintenance.model';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';
import { noWhitespace } from 'src/app/shared/models/phone.model';

@Component({
  selector: 'app-update-currency',
  templateUrl: './update-currency.component.html',
  styleUrls: ['./update-currency.component.scss']
})
export class UpdateCurrencyComponent implements OnInit {

  public form: FormGroup = Object.create(null);
  showRegister = true ;
  loader = false ;
  showUpdateCurrencyContent = false ;
  showAddCurrencyContent = true ;
  isReadOnly = false ;

  constructor(private fb: FormBuilder,private mcMaintenanceService : MoneyChangerMaintenanceService,
    private dialog : MatDialog, public dialogRef: MatDialogRef<UpdateCurrencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      currencyNo : [null,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(4), this.noWhitespaceAllowed])]], // Validation pattern change, only alphanumeric allowed and maxlength as 4.
      currencyCode :  [null,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')])]],
      currencyName : [null,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 .,:;-]+$')]),Validators.maxLength(40)]],
      units : [null,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]), this.noWhitespaceAllowed]],
      variance :  [null,[Validators.compose([Validators.required, Validators.pattern(/^(100(?:\.0{1,2})?|[1-9]?\d(?:\.\d{1,2})?)$/)])]], //enter a valid number between 1 and 100.
      exchRate : [null,[Validators.compose([Validators.required, Validators.pattern('^\\d{1,4}\\.\\d{1,6}$')])]], // Max 4 digits before the decimal and max 6 digits after
   //   major :  [null,[Validators.compose([Validators.required])]],
     // minor : [null,[Validators.compose([Validators.required])]],
    });
    //data : {currencyNumber : ccyNo , currencyCode : ccyCode, currencyName : ccyName, major : currencyMajor, minor : currencyMinor}
    if(this.data.currencyNumber != ""){
      this.showUpdateCurrencyContent = true ;
      this.showAddCurrencyContent = false ;
      this.isReadOnly = true ;
       this.form.patchValue({
        "currencyNo" : this.data.currencyNumber,
        "currencyCode" : this.data.currencyCode,
        "currencyName": this.data.currencyName,
        "units" : this.data.units,
        "variance" : this.data.variancePercentage,
        "exchRate" : this.data.varianceRate
    })
    }
  }

  onSubmit(){
    this.showRegister = false ;
    this.loader = true ;
    if(this.data.currencyNumber != ""){
    //Update Counter Service call
      let currencyNumber =  this.data.currencyNumber ;
      this.mcMaintenanceService.updateCurrency(this.buildUpdateCurrencyPayload(), currencyNumber).subscribe((datas:any)=>{
       this.dialogRef.close(datas);
       this.showRegister = true ;
       this.loader = false ;
      },
      (error:any)=>{
        this.loader = false;
        this.showRegister = true ;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
       }
      )
    } 
    else{
      //Add Counter Service call
      this.mcMaintenanceService.addCurrency(this.buildPayload()).subscribe((datas:any)=>{
       this.dialogRef.close(datas);
       this.showRegister = true ;
       this.loader = false ;
      },
      (error:any)=>{
        this.loader = false;
        this.showRegister = true ;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
       }
      )
    }
    
   
  }

  //Add currency req payload
  buildPayload():AddCurrency{
   return new AddCurrency({
    "currencyNo" : this.form.controls['currencyNo'].value,
    "currencyCode" : this.form.controls['currencyCode'].value,
    "currencyName": this.form.controls['currencyName'].value,
    "units" : this.form.controls['units'].value,
    "variancePercentage" : this.form.controls['variance'].value,
      "varianceRate" : this.form.controls['exchRate'].value
   // "major" : this.form.controls['major'].value,
    //"minor": this.form.controls['minor'].value,
   })
 
  }
//Update currency req payload
buildUpdateCurrencyPayload():UpdateCurrency{
    return new UpdateCurrency({
      "currencyCode" : this.form.controls['currencyCode'].value,
      "currencyName": this.form.controls['currencyName'].value,
      "units" : this.form.controls['units'].value,
      "variancePercentage" : this.form.controls['variance'].value,
      "varianceRate" : this.form.controls['exchRate'].value
    //  "major" : this.form.controls['major'].value,
     // "minor": this.form.controls['minor'].value,
    })
  }

 

  onClose() {
      this.dialogRef.close('No Data');
  }
  // added for no white space allowed
  noWhitespaceAllowed(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      // Check for any spaces in the string
      if (/\s/.test(control.value)) {
        return { 'whitespace': true }; // Invalid due to any whitespace
      }
    }
    return null; // Valid if no whitespace exists
  }
}
