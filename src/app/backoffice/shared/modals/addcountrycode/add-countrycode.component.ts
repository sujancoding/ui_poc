import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PostExchangeRateSetup } from 'src/app/backoffice/exchangerates/model/exchangerate.model';
import { ExchangeRateService } from 'src/app/core/services/exchange-rate.service';

@Component({
  selector: 'app-add-countrycode',
  templateUrl: './add-countrycode.component.html',
  styleUrls: ['./add-countrycode.component.scss']
})
export class AddCountrycodeComponent implements OnInit {

  form : FormGroup = Object.create(null);
  countryCode: string[] = ['EUR', 'CAD', 'CNY' , 'MMK','DZD','HKD'];
  filteredOptions!: Observable<string[]>;
  loader : Boolean = false;
  submitButton : Boolean = true;
  rateObject: any[] =[];

  constructor(private fb: FormBuilder,public dialog:MatDialogRef<AddCountrycodeComponent>,private exchangeRateService : ExchangeRateService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      "countryCode":[null,Validators.compose([Validators.required])],
      "exchangeRate" : [null,[Validators.pattern('^[0-9,]{0,6}(.[0-9]{0,9})?$')]]
    })
    // this.filteredOptions = this.form.controls.countryCode.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value || '')),
    // );
  }
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }
  onSubmit(){
    this.submitButton = false;
    this.loader = true;
    let countrycode = this.form.controls['countryCode'].value;
    let rate = this.form.controls['exchangeRate'].value;
    this.rateObject = [{'currencyCode': countrycode , 'rate': rate}]
    this.exchangeRateService.updateExchangeRate(this.buildDailyRateSetup()).subscribe(data => {
      this.loader = false;
      this.submitButton = true;
      console.log(data);
      this.dialog.close({SERVICE : 'SUCCESS' , data : data })
    })
   
    
  }
  buildDailyRateSetup():PostExchangeRateSetup{
    return new PostExchangeRateSetup({
      "rates": this.rateObject
    })
  }

}
