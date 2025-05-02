import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetAccountSettlement } from 'src/app/core/model/orgsettlement/orgsettlement';
import { OrganisationSettlementService } from 'src/app/core/services/orgsettlement.service';
import { ErrorDialogAdminComponent } from '../errordialogadmin/error-dialog-admin.component';

@Component({
  selector: 'app-organisation-asset-account-settlement',
  templateUrl: './organisation-asset-account-settlement.component.html',
  styleUrls: ['./organisation-asset-account-settlement.component.scss']
})
export class OrganisationAssetAccountSettlementComponent implements OnInit {

  form: FormGroup = Object.create(null);
  showSubmitButton : boolean = true;
  submitButtonLoader : boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,public dialogRef: MatDialogRef<OrganisationAssetAccountSettlementComponent>,
  private orgSettlementService : OrganisationSettlementService,private _snackBar: MatSnackBar,private dialog : MatDialog) { }
// this is unused component we should remove this component once production is stable.
  ngOnInit(): void {
   this.form = this.fb.group({
      accountName: [null , [Validators.compose([Validators.required])]],
      accountNumber:[null , [Validators.compose([Validators.required])]],
      outstandingBalance: [null , [Validators.compose([Validators.required])]],
      settlementAmount:[null , [Validators.compose([Validators.required]),Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,9})?$')]],
      remarks:[null , [Validators.compose([Validators.required]),Validators.pattern('[a-zA-Z0-9 ,.:;-]*$')]],
    })
    if(this.data.rowData){
  
      this.form.controls['accountName'].setValue(this.data.rowData.ENTITYNAME);
      this.form.controls['accountNumber'].setValue(this.data.rowData.ACCOUNTNO);
      this.form.controls['outstandingBalance'].setValue(this.data.rowData.OUTSTANDINGBALANCE);
    }
    console.log(this.data);
  }
  get f() { return this.form.controls; }

  onSave(){
    this.submitButtonLoader = true;
    this.showSubmitButton = false;
    let accountNo : string = this.form.controls['accountNumber'].value ? this.form.controls['accountNumber'].value : "" ;
    this.orgSettlementService.assetAccountSettlement(accountNo , this.buildSettlement()).subscribe(data => {
      console.log(data);
      this.submitButtonLoader = false;
      this.showSubmitButton = true;
      if(data){
        this._snackBar.open("Withdrawal of " + this.form.controls['settlementAmount'].value +" SGD" + " from "+this.form.controls['accountName'].value +" was Successful !", "Ok", {
          duration:3000,
          panelClass: "green-notification-snackbar"
        });
      }
    },
     //error handling completed on 05-07-2023
  (error:any)=>{
    this.submitButtonLoader = false;
    this.showSubmitButton = true;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" } 
      }) ;
    }
  }
    )
  }
  buildSettlement() : AssetAccountSettlement{
    return new AssetAccountSettlement({
      "amount" : this.form.controls['settlementAmount'].value,
      // added remarks in settlement payload
      "remarks" : this.form.controls['remarks'].value
    })
  }

 

}
