import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { UpdateDealMc } from 'src/app/core/model/mcdeals/mcdeals.model';
import { MoneyChangerDealsService } from 'src/app/core/services/mcdeals.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-edit-deal-mc',
  templateUrl: './edit-deal-mc.component.html',
  styleUrls: ['./edit-deal-mc.component.scss']
})
export class EditDealMcComponent implements OnInit {

  dealForm : FormGroup = Object.create(null) ;
  isReadOnly = true ;
  currencyArray : any[] = [] ;
  isReadOnlyField = false ;
  showEditableMode = true ;
  showCancelBtn = false ;
  customerId !: string ;
  customerType !: string ;
  dealItemsArray : any[] = [] ;
  dealItemId !: string ;
  dealId !: string ;
  status !: string ;
  statusList : any[] = [
    {"value" : "1" , "description" : "OPEN"},
    {"value" : "2" , "description" : "REALISED"},
    {"value" : "3" , "description" : "PARTIAL"},
    {"value" : "4" , "description" : "CANCELLED"},
    {"value" : "5" , "description" : "DELETED"},
    {"value" : "6" , "description" : "CLOSED"},
  ];
//   Number	Status
// 1	OPEN
// 2	REALISED
// 3	PARTIAL
// 4	CANCELLED
// 5	DELETED
// 6	CLOSED

  constructor(private fb : FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
  private dealService : MoneyChangerDealsService, private dialog : MatDialog,
  private dialogRef: MatDialogRef<EditDealMcComponent>, private alertService : AlertService) { }

  ngOnInit(): void {

    this.dealForm = this.fb.group({
      "type" : [null,[Validators.compose([Validators.required])]],
      "currencyNo" :[null,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'),Validators.maxLength(4)])]], // Validation pattern change, only alphanumeric allowed
      "currencyCode" :[null,[Validators.compose([Validators.required])]],
      "fAmount" : [null,[Validators.compose([Validators.required])]],
      "rate" : [null,[Validators.compose([Validators.required])]],
      "lAmount" : [null,[Validators.compose([Validators.required])]],
      "valueDate" : [null,[Validators.compose([Validators.required])]],
      "remarks" :  [null, [Validators.pattern('^[a-zA-Z0-9 _\\-@.,;:()/\'"]+$'),Validators.maxLength(50)]], // Biz told, it is non-mandatory

    })

  //   {
  //     "dealItemId": "37170548223701",
  //     "dealId": "371705482237",
  //     "status": "CLOSED",
  //     "customerId": "C1525f3bf17",
  //     "customerName": "GH ORG",
  //     "customerType": "C",
  //     "buySellInd": "S",
  //     "ccyNo": "5",
  //     "ccyCode": "GBP",
  //     "exchRate": 1.695000,
  //     "amountF": 10000.00,
  //     "amountL": 16950.00,
  //     "utilizedAmountF": 10000.00,
  //     "balanceAmountF": 0.00,
  //     "valueDate": "2024-01-18",
  //     "remarks": "ALL IN 20S",
  //     "createdBy": "DEALER AMBROSE TEST",
  //     "createdDate": "2024-01-17T17:03:57",
  //     "updatedBy": "DEALER AMBROSE TEST",
  //     "updatedDate": "2024-01-17T17:14:26"
  // },

    if(this.data.records){
      this.currencyArray = this.data.currencyRecords ;

      if(this.data.anySignal == "cancel-deal"){
          this.isReadOnlyField = true ;
          this.showCancelBtn = true ;
          this.showEditableMode = false ;
      }
      console.log(this.data.records) ;
      this.customerId = this.data.records[0].customerId ; //storing customerId
      this.customerType = this.data.records[0].customerType ; //storing customer type
      this.dealItemId = this.data.records[0].dealItemId ; //storing dealItemId 
      this.dealId = this.data.records[0].dealId ; //storing dealId 
      let statusArray :any[] = this.statusList.filter(v => v.description == this.data.records[0].status) ;
      this.status = statusArray[0].value ; //storing status in numeric .
  
      this.dealForm.patchValue({
        "type" : this.data.records[0].buySellInd,
      "currencyNo" : this.data.records[0].ccyNo,
      "currencyCode" : this.data.records[0].ccyCode,
      "fAmount" : this.formatValue(this.data.records[0].amountF),
      "rate" : this.data.records[0].exchRate,
      "lAmount" : this.formatValue(this.data.records[0].amountL),
      "valueDate" : this.data.records[0].valueDate,
      "remarks" : this.data.records[0].remarks,
      })
    }
   
  }

  //input event triggered on currency number is changed ..
  onCurrencyNumberChange(){
    let currencyNo : any ;
      currencyNo = this.dealForm.controls['currencyNo'].value ?  this.dealForm.controls['currencyNo'].value : "" ;
      let result = this.currencyArray.filter(v => v.ccyNo == currencyNo) ;
      if(result.length == 1){
        let currencyCode = result[0].ccyCode ;
        this.dealForm.patchValue({
          "currencyCode" : currencyCode ? currencyCode : ""
        })
      }
      else{
        this.dealForm.patchValue({
          "currencyCode" :  ""
        })
      }


   

  }

  //user input f amount and calculate l.amount = f.amount * rate
  onFAmountChange(){
      let lAmount : any ;
      let fAmount = this.dealForm.controls['fAmount'].value ? this.dealForm.controls['fAmount'].value : "" ;
      let rate = this.dealForm.controls['rate'].value ? this.dealForm.controls['rate'].value : "" ;
      if(fAmount != "" && rate != ""){
        let f_Amt = fAmount.replace(/,/g, '') ;
        let calculatedAmt = parseFloat(f_Amt) * parseFloat(rate) ;
        lAmount = calculatedAmt.toFixed(2)
      
        this.dealForm.patchValue({
          "lAmount" : this.formatValue(parseFloat(lAmount))
        })
      }
      else{
        this.dealForm.patchValue({
          "lAmount" : ""
        })
      }
   

  
   
  }

  formatValue(value : any){
    return value.toLocaleString('en-US') ;
   }

   //update deal for both datas update and cancel deal 
   updateDeal(indicator:string){
    this.dealService.updateDeal(this.dealId,this.buildUpdateDealPayload(indicator)).subscribe((datas:any)=>{
      this.dialogRef.close({response:datas.dealId}) ;
    },
    (error:any)=>{
      this.dialogRef.close() ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
     }
    )
   }

   buildUpdateDealPayload(indicator:string):UpdateDealMc{
    if(indicator == "CANCEL_DEAL"){
     this.status = "4"
    }
    let valueDate = moment(this.dealForm.controls['valueDate'].value);
    const validTillDate = valueDate.format('YYYY') + "-" + valueDate.format('MM') + "-" + valueDate.format('DD')
    this.dealItemsArray.push({
      dealItemId : this.dealItemId ,
      buySellInd : this.dealForm.controls['type'].value ,
      status : this.status ,
      ccyNo : this.dealForm.controls['currencyNo'].value ,
      ccyCode : this.dealForm.controls['currencyCode'].value ,
      amountF : (this.dealForm.controls['fAmount'].value).replace(/,/g, '') ,
      exchangeRate : this.dealForm.controls['rate'].value ,
      valueDate : validTillDate ,
      remarks : this.dealForm.controls['remarks'].value ,
    })
    return new UpdateDealMc({
      "customerId" : this.customerId ,
      "customerType" : this.customerType ,
      "dealItems" : this.dealItemsArray
    })
   }
}

// dealItemId !: string ;
// buySellInd !: string ;
// status !: string ;
// ccyNo !: string ;
// ccyCode !: string ;
// amountF !: string ;
// exchangeRate !: string ;
// valueDate !: string ;
// remarks !: string ;