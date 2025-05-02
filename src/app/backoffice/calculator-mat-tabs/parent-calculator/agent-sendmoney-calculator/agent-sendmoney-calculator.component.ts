import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-agent-sendmoney-calculator',
  templateUrl: './agent-sendmoney-calculator.component.html',
  styleUrls: ['./agent-sendmoney-calculator.component.scss']
})
export class AgentSendmoneyCalculatorComponent implements OnInit {
  public form: FormGroup = Object.create(null);

  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {
    this.form = this.fb.group({

      agentAmountBalance: [""],
      deal1: [""],
      dealamount1: [""],
      dealRate1: [""],
      deal2: [""],
      dealamount2: [""],
      dealRate2:[""],
      agentSends:[{value: '', disabled:true}],
      payeeRecive:[{value: '', disabled:true}],
      dbsRate:[""],
      aptSends:[{value: '', disabled:true}],
      profitLoss: [{value: '', disabled:true}],
      agentAmount: [{value: '', disabled:true}],
      dealBalance1: [{value: '', disabled:true}],
      dealBalance2: [{value: '', disabled:true}],
    })
  }

  feedvalue(){
    this.form.patchValue({
      agentSends: parseFloat(this.form.controls['dealamount1'].value) +  parseFloat(this.form.controls['dealamount2'].value)
    });

    this.form.patchValue({
      payeeRecive: (this.form.controls['dealamount1'].value * this.form.controls['dealRate1'].value ) +
        (this.form.controls['dealamount2'].value *  this.form.controls['dealRate2'].value)
    });

  }

  value(){
    this.form.patchValue({
      aptSends: this.form.controls['payeeRecive'].value / this.form.controls['dbsRate'].value,
    });

    this.form.patchValue({
      profitLoss: this.form.controls['agentSends'].value - this.form.controls['aptSends'].value,
      agentAmount: this.form.controls['agentAmountBalance'].value - this.form.controls['agentSends'].value,
      dealBalance1: Math.abs(this.form.controls['deal1'].value - this.form.controls['dealamount1'].value),
      dealBalance2: Math.abs(this.form.controls['deal2'].value - this.form.controls['dealamount2'].value)
    });

  }

  resetData(){
    this.form.reset();
  }

}
