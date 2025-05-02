import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommissionService } from 'src/app/core/services/commission.service';
import { CommissionReq } from '../../model/commission.model';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { remittanceExchRateArray } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-add-commission',
  templateUrl: './add-commission.component.html',
  styleUrls: ['./add-commission.component.scss', '../../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class AddCommissionComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  currencyCode !: string;
  flag !: string;
  consumerRate: any;
  corporateRate: any;
  agentRate: any;
  selectedCountryCode: any;
  isReadOnly: Boolean = false;
  getcurrencycode !: string ;
  countryCode: any[] = remittanceExchRateArray ;
  commissionArrayList : any[] = [] ;
  currencyFlag : string = "" ;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddCommissionComponent>,private fb: FormBuilder,
  private commissionService : CommissionService,private matDialog : MatDialog) { }

  ngOnInit(): void {
    this.form = this.fb.group({
  
      "consumerOrgShared": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "consumerOrgOurs": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "consumerOrgThey": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],

      "consumerBankShared": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "consumerBankOurs": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "consumerBankThey": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],

      "corporateOrgShared": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "corporateOrgOurs": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "corporateOrgThey": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],

      "corporateBankShared": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "corporateBankOurs": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "corporateBankThey": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],

      "agentOrgShared": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "agentOrgOurs": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "agentOrgThey": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],

      "agentBankShared": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "agentBankOurs": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
      "agentBankThey": ['', [Validators.compose([Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)])]],
    })


    if (this.data.currencyCode != undefined) {
      this.isReadOnly = true;
      this.selectedCountryCode = this.data.currencyCode ? this.data.currencyCode : "";
     let currencyArray = this.countryCode.filter((v:any) => v.CURRENCYCODE == this.data.currencyCode) ;
      this.currencyFlag = currencyArray[0].FLAG ;
     // this.commissionArrayList = this.data.isDataPass ;
      this.commissionArrayList.push(this.data.isDataPass) ;
      this.form.patchValue({
        "currencyCode": this.data.flag,
        "consumerOrgShared": this.commissionArrayList[0].value.individual.orgShared,
        "consumerOrgOurs": this.commissionArrayList[0].value.individual.orgOurs,
        "consumerOrgThey": this.commissionArrayList[0].value.individual.orgThey,
  
        "consumerBankShared": this.commissionArrayList[0].value.individual.bankShared,
        "consumerBankOurs": this.commissionArrayList[0].value.individual.bankOurs,
        "consumerBankThey": this.commissionArrayList[0].value.individual.bankThey,
  
        "corporateOrgShared": this.commissionArrayList[0].value.corporate.orgShared,
        "corporateOrgOurs": this.commissionArrayList[0].value.corporate.orgOurs,
        "corporateOrgThey": this.commissionArrayList[0].value.corporate.orgThey,
  
        "corporateBankShared": this.commissionArrayList[0].value.corporate.bankShared,
        "corporateBankOurs": this.commissionArrayList[0].value.corporate.bankOurs,
        "corporateBankThey": this.commissionArrayList[0].value.corporate.bankThey,
  
        "agentOrgShared": this.commissionArrayList[0].value.agent.orgShared,
        "agentOrgOurs": this.commissionArrayList[0].value.agent.orgOurs,
        "agentOrgThey": this.commissionArrayList[0].value.agent.orgThey,
  
        "agentBankShared": this.commissionArrayList[0].value.agent.bankShared,
        "agentBankOurs": this.commissionArrayList[0].value.agent.bankOurs,
        "agentBankThey": this.commissionArrayList[0].value.agent.bankThey,
       
      })

    }
    else {
      this.isReadOnly = false;
      //onOpen modal dialog - show VN code
      this.form.patchValue({
        "currencyCode": "flag-icon flag-icon-vn"
      })
      this.selectedCountryCode = "";
    }

  }

  //function => no white space allowed in orgname field
  nonWhitespaceRegExp(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? { 'whitespace': true } : null;
  }
  // function => if the value consists only of zeros in field
  allZerosValidator(control: FormControl) {
    const value = control.value;

    if (value && value.match(/^0+$/)) {
      // if the value consists only of zeros, return an error object
      return { "allZeros": true };
    }

    // otherwise, return null (no error)
    return null;
  }


  onSubmit() {

//Service call
    this.commissionService.updateCommission(this.buildPayload()).subscribe(data =>{
      console.log(data);
      this.dialogRef.close({response : data.status});
    },
    
     //error handling done 28/06/2023
     (error:any) =>{
      this.dialogRef.close() ;
      if(error.status != 401){
        this.matDialog.open(ErrorDialogAdminComponent) ;
      }
    }
    )

  }

  buildPayload():CommissionReq{
  return new CommissionReq({
    "rate":{
      "individual": [
        {
          "org": this.form.controls['consumerOrgShared'].value,
          "bank": this.form.controls['consumerBankShared'].value,
          "sharingType": "1" //Shared
        },
        {
          "org": this.form.controls['consumerOrgOurs'].value,
          "bank": this.form.controls['consumerBankOurs'].value,
          "sharingType": "2" //Ours
        },
        {
          "org": this.form.controls['consumerOrgThey'].value,
          "bank": this.form.controls['consumerBankThey'].value,
          "sharingType": "3" //They
        }
      ],
      "corporate": [
        {
          "org": this.form.controls['corporateOrgShared'].value,
          "bank": this.form.controls['corporateBankShared'].value,
          "sharingType": "1" //Shared
        },
        {
          "org": this.form.controls['corporateOrgOurs'].value,
          "bank": this.form.controls['corporateBankOurs'].value,
          "sharingType": "2" //Ours
        },
        {
          "org": this.form.controls['corporateOrgThey'].value,
          "bank": this.form.controls['corporateBankThey'].value,
          "sharingType": "3" //They
        },
      ],
      "agent": [
        {
          "org": this.form.controls['agentOrgShared'].value,
          "bank": this.form.controls['agentBankShared'].value,
          "sharingType": "1" //Shared
        },
        {
          "org": this.form.controls['agentOrgOurs'].value,
          "bank": this.form.controls['agentBankOurs'].value,
          "sharingType": "2" //Ours
        },
        {
          "org": this.form.controls['agentOrgThey'].value,
          "bank": this.form.controls['agentBankThey'].value,
          "sharingType": "3" //They
        },

      ]
    },
    "ccy": this.selectedCountryCode
  })
  }

 


}
