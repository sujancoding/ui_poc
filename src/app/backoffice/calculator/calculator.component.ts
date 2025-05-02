import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  value: any;
  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      custSends: [""],
      exchRate: [""],
      payeeGets: [{value: '', disabled:true}],
      agentExchRate: [""],
      sell: [{value: '', disabled:true}],
      profitLoss: [{value: '', disabled:true}],
      bankAmount: [{value: '', disabled:true}],
      agent: [{value: '', disabled:true}],
      totalAmount:[""],
      sendAmount:[{value: '', disabled:true}],
      dealBalance: [{value: '', disabled:true}],
    })
  }
  payeeGets(){
    this.form.patchValue({
      payeeGets:this.form.controls['custSends'].value * this.form.controls['exchRate'].value
    })
  }
  agentRate(){
    this.form.patchValue({
      sell:this.form.controls['payeeGets'].value / this.form.controls['agentExchRate'].value
    });
    this.form.patchValue({
      profitLoss:this.form.controls['custSends'].value - this.form.controls['sell'].value
    });
    this.form.patchValue({
      bankAmount:this.form.controls['custSends'].value
    });
    this.form.patchValue({
      agent:this.form.controls['sell'].value
    });
    this.form.patchValue({
      sendAmount:this.form.controls['sell'].value
    });
  }
  balance(val1:number,val2:number){
    this.form.patchValue({
      dealBalance:val1-val2
    });
  }
  resetData(){
    this.form.reset();
  }

 }

