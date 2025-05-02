import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

import { PayeeService } from '../service/payee.service';

@Component({
  selector: 'app-payee-added',
  templateUrl: './payee-added.component.html',
  styleUrls: ['./payee-added.component.scss']
})
export class PayeeAddedComponent implements OnInit {
  
  nameTest:any;
  accNumTest:any;
  payeeNationality: any;
  bankName: any;
  bankSwiftcode: any;
  bankLocation: any;
  bankRoutingCode : string = "" ;
  relationship: string="";
  bankCodeType : string = "";

  constructor(private payeeService:PayeeService , private route: ActivatedRoute,private headerService : TitleHeaderService, private store : InMemoryCache,
    private router : Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('Payee');
    this.route.queryParams.subscribe((params: any)=> {
      console.log(params)
    this.nameTest = params.payee_name;
     this.accNumTest = params.account_no;
     this.payeeNationality = params.payee_nationality;
     this.bankName = params.bank_name;
     this.bankSwiftcode = params.bank_swiftcode;
     this.bankLocation = params.bank_location;
     this.bankRoutingCode = params.bank_routingCode ;
     this.relationship=params.relationship;
     // getting bank code type in param
     this.bankCodeType = params.bank_codeType;
    })

}

goBack(){
  let customerType : string = this.store.getItem('CUSTOMER_TYPE');
  if(customerType == "I"){
   this.router.navigate(['/dashboard/custdash']);
  }
  if(customerType == "C"){
   this.router.navigate(['/profile/corporate-dashboard']);
  }
}

}
