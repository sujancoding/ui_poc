import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editcommissioncharges',
  templateUrl: './editcommissioncharges.component.html',
  styleUrls: ['./editcommissioncharges.component.scss']
})
export class EditcommissionchargesComponent implements OnInit {
  public form : FormGroup = Object.create(null);
  currencyCode !: string ;
  flag !: string ;
  consumerRate : any;
  corporateRate : any;
  agentRate : any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      "currencyCode" : [null]
    })

    if(this.data){
     this.currencyCode = this.data.currencyCode ;
     this.flag = this.data.flag ;
     this.consumerRate = this.data.consumerRate ;
     this.corporateRate = this.data.corporateRate ;
     this.agentRate = this.data.agentRate ;
    }
  }

  onSubmit(){
    
  }

}
