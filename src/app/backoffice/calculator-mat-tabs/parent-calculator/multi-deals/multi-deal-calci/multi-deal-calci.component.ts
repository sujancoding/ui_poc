import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multi-deal-calci',
  templateUrl: './multi-deal-calci.component.html',
  styleUrls: ['./multi-deal-calci.component.scss']
})
export class MultiDealCalciComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  value: any;
  constructor(private fb: FormBuilder) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      custSends: [""],
      exchRate: [""],
      payeeGets: [{value: '', disabled:true}],
      dealBalance1: [""],
      deal_1Rate: [""],
      dealBalance2: [""],
      deal_2Rate: [""],
      dealAmount_SGD:[{value: '', disabled:true}],
      dealAmount_FCY:[{value: '', disabled:true}],
      reducedBalance:[{value: '', disabled:true}],
      reducedDealBalance:[{value: '', disabled:true}],
      finalBalance:[{value: '', disabled:true}],
      sell: [{value: '', disabled:true}],
      profitLoss: [{value: '', disabled:true}],
      bankAmount: [{value: '', disabled:true}],
      verification:[{value: '', disabled:true}],
    })
  }
  payeeGets(){
    this.form.patchValue({
      payeeGets:this.form.controls['custSends'].value * this.form.controls['exchRate'].value
    })
  }

  deal1(){
    this.form.patchValue({
      dealAmount_SGD:this.form.controls['dealBalance1'].value
    });
    this.form.patchValue({
      dealAmount_FCY:this.form.controls['dealBalance1'].value * this.form.controls['deal_1Rate'].value
    });
    this.form.patchValue({
      reducedBalance:this.form.controls['payeeGets'].value - this.form.controls['dealAmount_FCY'].value
    });
    this.form.patchValue({
      reducedDealBalance:this.form.controls['reducedBalance'].value / this.form.controls['deal_2Rate'].value
    });
    this.form.patchValue({
      finalBalance:Math.abs(this.form.controls['dealBalance2'].value - this.form.controls['reducedDealBalance'].value)
    });
    this.form.patchValue({
      sell: parseFloat(this.form.controls['dealBalance1'].value) +  parseFloat(this.form.controls['reducedDealBalance'].value)
    });
    this.form.patchValue({
      profitLoss:this.form.controls['custSends'].value - this.form.controls['sell'].value
    });
    this.form.patchValue({
      bankAmount:this.form.controls['custSends'].value
    });
    this.form.patchValue({
      verification:(this.form.controls['dealBalance1'].value * this.form.controls['deal_1Rate'].value ) +(this.form.controls['reducedDealBalance'].value * this.form.controls['deal_2Rate'].value)
    });
  }

  resetData(){
    this.form.reset();
  }

 }


