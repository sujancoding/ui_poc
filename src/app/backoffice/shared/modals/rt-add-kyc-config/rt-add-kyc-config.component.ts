import { Component, Inject, OnInit } from '@angular/core';
import { ErrorDialogAdminComponent } from '../errordialogadmin/error-dialog-admin.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { KycAdd, KycUpdate } from 'src/app/core/model/mckyc-config/kyc-config.model';

@Component({
  selector: 'app-rt-add-kyc-config',
  templateUrl: './rt-add-kyc-config.component.html',
  styleUrls: ['./rt-add-kyc-config.component.scss']
})
export class RtAddKycConfigComponent implements OnInit {
 public form: FormGroup = Object.create(null);
    showSubmit = true ;
    loader = false ;
    showUpdateContent = false ;
    showAddContent = true ;
    isReadOnly = false ;
    kycId : string = "" ;

  constructor(private fb: FormBuilder,private rtReportService : TransactionService,
      private dialog : MatDialog, public dialogRef: MatDialogRef<RtAddKycConfigComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.fb.group({
          label : [null,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z 0-9 ,.:;-]+$'), Validators.maxLength(30)])]], 
          minVolume :  [null,[Validators.compose([Validators.required, Validators.pattern('^[0-9 ,]+$'), Validators.maxLength(30)])]],
          maxVolume : [null,[Validators.compose([Validators.required, Validators.pattern('^[0-9 ,]+$')]),Validators.maxLength(30)]],
          minFrequency : [null,[Validators.compose([Validators.required, Validators.pattern('^[0-9 ,]+$'), Validators.maxLength(30)])]],
          maxFrequency :  [null,[Validators.compose([Validators.required, Validators.pattern('^[0-9 ,]+$'), Validators.maxLength(30)])]], 
        });

        if(this.data){
          if(this.data.indicator == "UPD"){
             this.kycId = this.data.id ;
             this.showUpdateContent = true ;
             this.showAddContent = false ;
             this.isReadOnly = true ; //make label is readable when its update

             //patch form
             this.form.patchValue({
               label : this.data.label,
               minVolume : this.formatPatchAmount(this.data.minVolume),
               maxVolume :  this.formatPatchAmount(this.data.maxVolume),
               minFrequency :  this.formatPatchAmount(this.data.minFrequency),
               maxFrequency : this.formatPatchAmount(this.data.maxFrequency),
             })
          }
          else if(this.data.indicator == "ADD"){
            this.showUpdateContent = false ;
             this.showAddContent = true ;

          }
        }
  }

  onSave(flag:string){
    this.loader = true ;
    this.showSubmit = false ;
    if(flag == "ADD"){
     this.rtReportService.addKyc(this.buildAddPayload()).subscribe(data => {
       //success case
       this.loader = false ;
       this.showSubmit = true ;
       this.dialogRef.close({data:data}) ;
     },
    (error:any)=>{ //error handling
      this.dialogRef.close({data:"error occurred"}) ;
          if(error.status != 401){
            this.loader = false ;
            this.showSubmit = true ;
            this.dialog.open(ErrorDialogAdminComponent,{
              data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
            }) 
          }
        }
    )
    }
    else if(flag == "UPD"){
      this.rtReportService.updateKyc(this.buildUpdatePayload()).subscribe(data => {
        //success case
        this.loader = false ;
        this.showSubmit = true ;
        this.dialogRef.close({data:data}) ;
      },
     (error:any)=>{ //error handling
       this.dialogRef.close({data:"error occurred"}) ;
           if(error.status != 401){
             this.loader = false ;
             this.showSubmit = true ;
             this.dialog.open(ErrorDialogAdminComponent,{
               data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
             }) 
           }
         }
     )
    }

  }

  buildAddPayload():KycAdd{
    return new KycAdd({
    "label" : this.form.controls['label'].value ? this.form.controls['label'].value : "" , 
    "minAmount" : this.form.controls['minVolume'].value ? this.removeCommas(this.form.controls['minVolume'].value) : "" , 
    "maxAmount" : this.form.controls['maxVolume'].value ? this.removeCommas(this.form.controls['maxVolume'].value) : "" , 
    "minFrequency" : this.form.controls['minFrequency'].value ? this.removeCommas(this.form.controls['minFrequency'].value) : "" , 
    "maxFrequency" : this.form.controls['maxFrequency'].value ? this.removeCommas(this.form.controls['maxFrequency'].value) : "" , 
    })
  }

  buildUpdatePayload():KycUpdate{
    return new KycUpdate({
      "id": this.kycId ? this.kycId : "" ,
      "minAmount": this.form.controls['minVolume'].value ? this.removeCommas(this.form.controls['minVolume'].value) : "",
      "maxAmount": this.form.controls['maxVolume'].value ? this.removeCommas(this.form.controls['maxVolume'].value) : "",
      "minFrequency": this.form.controls['minFrequency'].value ? this.removeCommas(this.form.controls['minFrequency'].value) : "",
      "maxFrequency": this.form.controls['maxFrequency'].value ? this.removeCommas(this.form.controls['maxFrequency'].value) : "",
    })
  }
  
  onClose() {
    this.dialogRef.close();
}

//formatting amount to commas seperations.
formatAmount(val:any, formControlName:string) {
  let value = val ;
  value = value.replace(/,/g, ''); // Remove existing commas
  if (!isNaN(value) && value !== '') {
    this.form.controls[`${formControlName}`].setValue(Number(value).toLocaleString('en-US'), { emitEvent: false });
  }
}

//while framing request body --> remove commas from all amounts and share in request .
removeCommas(value: string): string {
  return value ? value.replace(/,/g, '') : value;
}

//formatting amount to commas seperations while onload when entry point is UPDATE.
formatPatchAmount(val:any) {
  let value = val ;
  return Number(value).toLocaleString('en-US');
}

}
