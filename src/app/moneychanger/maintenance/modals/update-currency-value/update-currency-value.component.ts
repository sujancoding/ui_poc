import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { ActiveCurrencyValue, InActiveCurrencyValue, UpdateCurrencyValue } from 'src/app/core/model/mcmaintenance/mcmaintenance.model';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';



@Component({
  selector: 'app-update-currency-value',
  templateUrl: './update-currency-value.component.html',
  styleUrls: ['./update-currency-value.component.scss','../../../../../assets/styles/tables/table-style.scss'],

})
export class UpdateCurrencyValueComponent implements OnInit {

  form!: FormGroup;
 
  currencyNo !: string ;
  currencyCode !: string ;
  currencyName !: string ;
  currencyValueRecords : any[] = [] ;

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any , private maintenanceService: MoneyChangerMaintenanceService,
    private dialogRef : MatDialogRef<UpdateCurrencyValueComponent>, private dialog : MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      rows: this.fb.array([])
    });

    if(this.data.data){
      this.currencyNo = this.data.ccyNo ? this.data.ccyNo : "" ;
      this.currencyCode = this.data.ccyCode ? this.data.ccyCode : "" ;
      this.currencyName = this.data.ccyName ? this.data.ccyName : "" ;

      this.currencyValueRecords = this.data.data ? this.data.data : [] ;
      if(this.currencyValueRecords.length >= 1){
        this.currencyValueRecords.forEach(items => {
          let currencyValue = items.VALUE ? items.VALUE : "" ;
          let status = items.STATUS ? items.STATUS : "" ;
           this.rows.push(this.patchRow(currencyValue, status))
        })
      }

    }
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }
  
  createRow(): FormGroup {
    return this.fb.group({
      currencyValue: [null, this.currencyValidator],
      status : [true]
    });
  }

  patchRow(currencyValue:number, status:string): FormGroup {
    return this.fb.group({
      currencyValue: [currencyValue, this.currencyValidator],// only numbers allowed
      status : [status == '1'] //if status is 1 --> checkbox should be selected .
    });
  }

  //Add row button clicked...
  addRow() {
    this.rows.push(this.createRow());
  }

  //Removing a rew from table...
  removeRow(index: number) {
    this.rows.removeAt(index);
  }



  //Save -> trigger upsert API 
  onSave(){
    console.log(this.rows) ;
    let rowData = this.rows.value ? this.rows.value : "";

    let filterActiveStatus = [] ;
    let filterInActiveStatus  = [] ;

    filterActiveStatus = rowData.filter((v:any) => v.status == true) ;
    filterInActiveStatus = rowData.filter((v:any) => v.status == false) ;

    this.maintenanceService.updateCurrencyValue(this.buildPayload(filterActiveStatus, filterInActiveStatus), this.currencyNo).subscribe((data)=>{
      if(data){ //success case
        this.dialogRef.close() ;
      }
    },
  //error handling 
  (error:any)=>{
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent,{
        data : error.error.errorMessage ? error.error.errorMessage : ""
      })
    }
  }
  )
    
  }

  buildPayload(filterActiveStatus:any, filterInActiveStatus:any) : UpdateCurrencyValue{
    return new UpdateCurrencyValue({
  currencyNo : this.currencyNo ? this.currencyNo : "" ,
  activeCurrencyValue : this.buildActiveCurrencyValue(filterActiveStatus),  //ACTIVE STATUS to pass in this payload...
  inActiveCurrencyValue : this.buildInActiveCurrencyValue(filterInActiveStatus) //INACTIVE STATUS to pass in this payload...

    })
  }

  buildActiveCurrencyValue(filterActiveStatus:any[]) : ActiveCurrencyValue[]{
    let activeCurrencyValue : ActiveCurrencyValue[] = [] ; 
    filterActiveStatus.forEach(items => {
      activeCurrencyValue.push(new ActiveCurrencyValue({
        ccyValue : parseFloat(items.currencyValue)
       }));
    })
   return activeCurrencyValue ;
  }

  buildInActiveCurrencyValue(filterInActiveStatus : any[]) :InActiveCurrencyValue[]{
    let inActiveCurrencyValue : InActiveCurrencyValue[] = [] ;
    filterInActiveStatus.forEach(items => {
      inActiveCurrencyValue.push(new InActiveCurrencyValue({
        ccyValue : parseFloat(items.currencyValue)
       }))
    })
   return inActiveCurrencyValue ;
  }
  
  currencyValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null; // Allow empty value
  
    const alphabetPattern = /^[a-zA-Z]+$/; // Only alphabets
    const decimalPattern = /^(0|[1-9][0-9]*)?(\.[0-9]{1,2})?$/; // Valid decimal format
  
    if (alphabetPattern.test(control.value)) {
      return { onlyAlphabets: true }; // Error for alphabets
    }
  
    if (!decimalPattern.test(control.value)) {
      return { invalidDecimal: true }; // Error for incorrect decimal format
    }
  
    return null; // No error
  }
  

}
