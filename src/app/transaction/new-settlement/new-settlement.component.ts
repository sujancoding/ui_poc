import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AgentSettlement, NewSettlement } from '../model/TransactionModel';
import { AgentSettlementService } from 'src/app/core/services/agentsettlement.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';

@Component({
  selector: 'app-new-settlement',
  templateUrl: './new-settlement.component.html',
  styleUrls: ['./new-settlement.component.scss', '../../../assets/styles/tables/table-style.scss']
})
export class NewSettlementComponent implements OnInit {

  form: FormGroup = Object.create(null);
  agentSettlement: AgentSettlement = new AgentSettlement();
  id!: string;
  showSubmitButton : boolean = true;
  submitButtonLoader : boolean = false;
  settlementTypeArray : any[] = [
    {"description":"Collection", "value" : "C"},
    {"description":"Payout", "value" : "P"}
  ];
  showCollectionIcon = false ;
  showHelpIcon = true ;
  showPayoutIcon = false ;


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,public dialogRef: MatDialogRef<NewSettlementComponent>,
  private agentSettlementService: AgentSettlementService,private store : InMemoryCache,private _snackBar: MatSnackBar,private dialog : MatDialog) { }

  ngOnInit(): void {
   this.form = this.fb.group({
      agentName: [null , [Validators.compose([Validators.required])]],
      agentID : [null , [Validators.compose([Validators.required])]],
      AccountNumber:[null , [Validators.compose([Validators.required])]],
      OutstandingBalance: [null , [Validators.compose([Validators.required])]],
      SettlementAmount:[null , [Validators.compose([Validators.required]),Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,9})?$')]],
      settlementType : [null, [Validators.compose([Validators.required])]],
      remarks : [null, Validators.compose([Validators.maxLength(40),Validators.pattern('^[a-zA-Z0-9 ,.:;-]+$')])]
    })
    if(this.data.rowData){
   
      this.form.controls['agentName'].setValue(this.data.rowData.ENTITYNAME);
      this.form.controls['agentID'].setValue(this.data.rowData.ENTITYID);
      this.form.controls['AccountNumber'].setValue(this.data.rowData.ACCOUNTNO);
      this.form.controls['OutstandingBalance'].setValue(this.data.rowData.OUTSTANDINGBALANCE);
    }
    console.log(this.data);
  }
  get f() { return this.form.controls; }

  onSave(){
    this.submitButtonLoader = true;
    this.showSubmitButton = false;
    this.store.setItem('AGENTID',this.form.controls['agentID'].value);
    this.agentSettlementService.postAgentSettlement(this.buildSettlement()).subscribe(data => {
      console.log(data);
      this.submitButtonLoader = false;
      this.showSubmitButton = true;
      if(data){
        this._snackBar.open("Settlement of " + this.form.controls['SettlementAmount'].value +" SGD" + " to "+this.form.controls['agentName'].value +" was Successful !", "Ok", {
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
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  }
    )
  }
  buildSettlement() : NewSettlement{
    return new NewSettlement({
      "amount" : this.form.controls['SettlementAmount'].value,
      "mode" : this.form.controls['settlementType'].value,
      //added remarks in manual settelment post api.
      "remarks" : this.form.controls['remarks'].value ? this.form.controls['remarks'].value : ""
    })
  }

  selectSettlementType(){
    let settlementType = this.form.controls['settlementType'].value ? this.form.controls['settlementType'].value : "" ;
    if(settlementType == "C"){
    this.showCollectionIcon = true;
    this.showHelpIcon = false ;
    this.showPayoutIcon = false ;
    }
    else if(settlementType == "P"){
      this.showCollectionIcon = false;
      this.showHelpIcon = false ;
      this.showPayoutIcon = true ;
    }
  }

}
