import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddPayee } from '../payeeModel/updatePayee';
import { PayeeService } from '../service/payee.service';

@Component({
  selector: 'app-payee',
  templateUrl: './payee.component.html',
  styleUrls: ['./payee.component.scss']
})
export class PayeeComponent  {
//  id!: string;
//  form: FormGroup = Object.create(null);
//  addPayee: AddPayee = new AddPayee();
//   constructor(private route: ActivatedRoute,private payeeService: PayeeService,private fb: FormBuilder,
//     private router: Router) { }

//   ngOnInit(): void {
//     this.form = this.fb.group({
//       AccountNumber: [null, Validators.compose([Validators.required])],
//       payeeName: [null, Validators.compose([Validators.required])],
//       PhoneNumber: [null, Validators.compose([Validators.required])] ,
//       EmailId: [null, Validators.compose([Validators.required])],
//       payeeAddress: [null, Validators.compose([Validators.required])],
//       payeeState: [null, Validators.compose([Validators.required])],
//       payeeCountry: [null, Validators.compose([Validators.required])],
//       bankName: [null, Validators.compose([Validators.required])],
//       swiftcode: [null, Validators.compose([Validators.required])],
//       bankAddress: [null, Validators.compose([Validators.required])] ,
//       bankCountry:[null, Validators.compose([Validators.required])]
//     })
//     this.id = this.route.snapshot.params['id']
//     this.payeeService.GetPayee(this.id).subscribe(data => {
//       this.addPayee = data;
//       this.form.patchValue({
//        "AccountNumber": this.addPayee.payeeInfo.accountNumber,
//        "payeeName": this.addPayee.payeeInfo.name,
//        "PhoneNumber": this.addPayee.payeeInfo.phoneNo,
//        "EmailId": this.addPayee.payeeInfo.emailId,
//      //  "payeeAddress": this.addPayee.payeeInfo.address.address,
//     //   "payeeState": this.addPayee.payeeInfo.address.state,
//     //   "payeeCountry": this.addPayee.payeeInfo.address.country,
//        "bankName": this.addPayee.bankInfo.name,
//        "swiftcode": this.addPayee.bankInfo.swiftCode,
//        "bankAddress": this.addPayee.bankInfo.branch,
//     //   "bankCountry":this.addPayee.bankInfo.country
//       });
//     },
//       error => console.log(error))

//   }
//   get f() { return this.form.controls; }
//   onSubmit(){
//     this.router.navigate(['payee/remit-money'])
//      this.payeeService.updatePayee(this.id , this.addPayee).subscribe((data)=> {
//        console.log(data);
//      },
//      (error) => console.log(error) ); 
//   }
}
