
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export class BagDetails{
  number !: string ; 
  weight !: string ; 
  dimension !: string ; 
  primaryNumber !: number ;
} 

@Component({
  selector: 'app-add-bag',
  templateUrl: './add-bag.component.html',
  styleUrls: ['./add-bag.component.scss']
})
export class AddBagComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  bagObject = new BagDetails();
  buttonName : string = "" ;
  toolBarName : string = "" ;
  isReadOnly : boolean = false ; //This property bind with Bag number field ..
  

  constructor(public dialogRef: MatDialogRef<AddBagComponent>, private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
    "bagNo" : [null, [Validators.compose([Validators.required, Validators.pattern('^[0-9 /]+$')])]],
    "bagDimension" : [null, [Validators.compose([Validators.required, Validators.pattern('^[0-9 *]+$')])]],
    "bagWeight" : [null, [Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9. ]+$')])]]
    })

    if(this.data.indicatorFlag == "UPD"){
       //Update Baggage flow 
       this.buttonName = "Update" ;
       this.toolBarName = "Edit Bag" ;
       if(this.data.chipData){
        this.form.patchValue({
          bagNo : this.data.chipData.number,
          bagDimension : this.data.chipData.dimension,
          bagWeight : this.data.chipData.weight
        })
        if(this.data.chipData.number){
          this.isReadOnly = true ; // made bag number field as not editable in order to avoid conflict issue while updating , here bag number acts as UNIQUE KEY ...
        }
       }
    }
    else if(this.data.indicatorFlag == "ADD"){
      //Add Baggage flow 
      this.buttonName = "Add" ;
      this.toolBarName = "Add Bag" ;
      this.isReadOnly = false ;  //Bag number can be editable when adding new bag flow...
    }
  }

  onClose() {
    this.dialogRef.close('No Data');
}

addBagDetails(buttonFlag:string){

    let bagNo = this.form.controls['bagNo'].value ;
    let bagDimension = this.form.controls['bagDimension'].value ;
    let bagWeight = this.form.controls['bagWeight'].value ;
    let isFormValid : boolean = this.form.valid ;
    if(isFormValid == true){
      this.bagObject.number = bagNo ;
      this.bagObject.dimension = bagDimension ;
      this.bagObject.weight = bagWeight ;
      console.log(this.bagObject) ;

      this.dialogRef.close({ bagObject : this.bagObject , buttonFlagIndicator : buttonFlag});
    }
    // {"number":"1" , "weight":"56.8kg", "dimension":"65*78*77"} ;
  

 
  
}
}
