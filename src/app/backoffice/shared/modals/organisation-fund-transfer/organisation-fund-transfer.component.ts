import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganisationSettlementService } from 'src/app/core/services/orgsettlement.service';
import { ErrorDialogAdminComponent } from '../errordialogadmin/error-dialog-admin.component';
import { AssetAccountSettlement } from 'src/app/core/model/orgsettlement/orgsettlement';

@Component({
  selector: 'app-organisation-fund-transfer',
  templateUrl: './organisation-fund-transfer.component.html',
  styleUrls: ['./organisation-fund-transfer.component.scss']
})
export class OrganisationFundTransferComponent implements OnInit {

    form: FormGroup = Object.create(null);
    showSubmitButton : boolean = true;
    submitButtonLoader : boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,public dialogRef: MatDialogRef<OrganisationFundTransferComponent>,
      private orgSettlementService : OrganisationSettlementService,private _snackBar: MatSnackBar,private dialog : MatDialog
  ) { }

  ngOnInit(): void {
      this.form = this.fb.group({
              fromAccountName: [null , [Validators.compose([Validators.required])]],
              toAccountName: [null , [Validators.compose([Validators.required])]],
              toAccountNumber : [null , [Validators.compose([Validators.required])]],
              transferFund: [null ,[Validators.compose([Validators.required]),Validators.pattern('[0-9 ./]*$')]],
              outstandingBalance:[null],
            })
            if(this.data.rowData){
          
              this.form.controls['fromAccountName'].setValue(this.data.rowData.ENTITYNAME);
              this.form.controls['toAccountName'].setValue('APT Account in DBS');
              this.form.controls['toAccountNumber'].setValue(this.data.rowData.ACCOUNTNO);
              this.form.controls['outstandingBalance'].setValue(this.data.rowData.OUTSTANDINGBALANCE)
            }
            console.log(this.data);
           
  }

  get f() { return this.form.controls; }

  // on save -> call fund transfer API
        onSave(){
          this.submitButtonLoader = true;
          this.showSubmitButton = false;
          let accountNo : string = this.form.controls['toAccountNumber'].value ? this.form.controls['toAccountNumber'].value : "" ;
          this.orgSettlementService.assetAccountSettlement(accountNo , this.buildSettlement()).subscribe(data => {
            console.log(data);
            this.submitButtonLoader = false;
            this.showSubmitButton = true;
            this.dialogRef.close('SUCCESS');
            if(data){
              this._snackBar.open("Transfer Fund of " + this.form.controls['transferFund'].value +" SGD" + " to "+this.form.controls['toAccountName'].value +" was Successful !", "Ok", {
                duration:3000,
                panelClass: "green-notification-snackbar"
              });
            }
          },
        (error:any)=>{
          this.submitButtonLoader = false;
          this.showSubmitButton = true;
          if(error.status != 401){
            this.dialogRef.close('FAILURE')
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" } 
          }) 
      }
        }
          )
        }
        buildSettlement() : AssetAccountSettlement{
          return new AssetAccountSettlement({
            "amount" : this.form.controls['transferFund'].value ? this.form.controls['transferFund'].value : "",
            "remarks" :  "",
            "mode" : "C" // Payout for fund transfer
          })
        }
      
       
    

}
