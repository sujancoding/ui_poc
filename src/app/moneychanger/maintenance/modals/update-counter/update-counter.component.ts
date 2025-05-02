import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { AddCounter, UpdateCounter } from 'src/app/core/model/mcmaintenance/mcmaintenance.model';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';

@Component({
  selector: 'app-update-counter',
  templateUrl: './update-counter.component.html',
  styleUrls: ['./update-counter.component.scss']
})
export class UpdateCounterComponent implements OnInit {

  public form: FormGroup = Object.create(null);
  showRegister = true ;
  loader = false ;
  getCounterType : any[] = [
   { "viewValue" : "Wholesale Counter" , "internalValue" : "W" },
   { "viewValue" : "Retail Counter" , "internalValue" : "R"}
  ];
  showUpdateCounterContent = false ;
  showAddCounterContent = true ;
  isReadOnly = false ;

  constructor(private fb: FormBuilder,private counterMaintenanceService : MoneyChangerMaintenanceService,
    private dialog : MatDialog, public dialogRef: MatDialogRef<UpdateCounterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      counterId : [null,[Validators.compose([Validators.required])]],
      counterType :  [null,[Validators.compose([Validators.required])]],
      counterIp : [null,[Validators.compose([Validators.required]), Validators.pattern('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')]],
    });
    //data : {counterId : id , counterIp : ip, counterType : type}
    if(this.data.counterId != ""){
      this.showUpdateCounterContent = true ;
      this.isReadOnly = true ; //make counter id field as readable when its UPD mode .
      this.showAddCounterContent = false ;
       this.form.patchValue({
        "counterId" : this.data.counterId,
        "counterIp" : this.data.counterIp,
        "counterType": this.data.counterType,
       })
    }
  }

  onSubmit(){
    this.showRegister = false ;
    this.loader = true ;
    if(this.data.counterId != ""){
    //Update Counter Service call
      let counterId =  this.data.counterId ;
      this.counterMaintenanceService.updateCounter(this.buildUpdateCounterPayload(), counterId).subscribe((datas:any)=>{
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
      this.counterMaintenanceService.addCounter(this.buildPayload()).subscribe((datas:any)=>{
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

  //Add counter req payload
  buildPayload():AddCounter{
   return new AddCounter({
    "counterId" : this.form.controls['counterId'].value,
    "counterIp" : this.form.controls['counterIp'].value,
    "counterType": this.form.controls['counterType'].value,
   })
  }
//Update counter req payload
  buildUpdateCounterPayload():UpdateCounter{
    return new UpdateCounter({
      "counterIp" : this.form.controls['counterIp'].value,
      "counterType": this.form.controls['counterType'].value,
    })
  }

 

  onClose() {
      this.dialogRef.close('No Data');
  }


}
