import { Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganisationSettlementService } from 'src/app/core/services/orgsettlement.service';
import { ErrorDialogAdminComponent } from '../errordialogadmin/error-dialog-admin.component';
import { ResetAccountDetails } from 'src/app/transaction/model/TransactionModel';

@Component({
  selector: 'app-organisation-reset-account-balance',
  templateUrl: './organisation-reset-account-balance.component.html',
  styleUrls: ['./organisation-reset-account-balance.component.scss']
})
export class OrganisationResetAccountBalanceComponent implements OnInit {
  form: FormGroup = Object.create(null);
  submitButtonLoader : boolean = false;
  showBalance : boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,public dialogRef: MatDialogRef<OrganisationResetAccountBalanceComponent>,
  private orgSettlementService : OrganisationSettlementService,private _snackBar: MatSnackBar,private dialog : MatDialog) { }

  ngOnInit(): void {
    console.log(this.data)
      this.form = this.fb.group({
           accountNumber: [null , [Validators.compose([Validators.required])]],
           accountName: [null , [Validators.compose([Validators.required])]],
           balance : [null]
         })
         if(this.data.rowData){
          this.form.controls['accountNumber'].setValue(this.data.rowData.ACCOUNTNO);
          this.form.controls['accountName'].setValue(this.data.rowData.ENTITYNAME);
          this.form.controls['balance'].setValue(this.data.rowData.OUTSTANDINGBALANCE);
          if(this.data.rowData.ACCOUNTNO == "90013"){
            this.showBalance = true;
           }
           else{
            this.showBalance = false;
           }
         }
        }
// on save calling resetAccountBalance for reset the accounts balance for transaction profit loss, commision profit loss, expenses.
        onSave(){
          let accountNo = this.form.controls['accountNumber'].value ? this.form.controls['accountNumber'].value : "";
          this.orgSettlementService.resetAccountBalance(accountNo,this.buildResetAccountDeatails()).subscribe(data => {
            console.log(data);
            this.submitButtonLoader = false;
            this.dialogRef.close('SUCCESS')
          },
        (error:any)=>{
          this.submitButtonLoader = false;
          if(error.status != 401){
            this.dialogRef.close('FAILURE')
          this.dialog.open(ErrorDialogAdminComponent,{
            data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "" } 
          })
      }
        }
          )
         }
  buildResetAccountDeatails(): ResetAccountDetails {
    return new ResetAccountDetails({
      "outStandingBalance": 0.00,
      "openingBalance": 0.00,
      "debit": 0.00,
      "credit": 0.00
    })

  }
}
