import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unposted-transaction',
  templateUrl: './unposted-transaction.component.html',
  styleUrls: ['./unposted-transaction.component.scss']
})
export class UnpostedTransactionComponent implements OnInit {
  transactionStatus !: string ;
  constructor(private router: Router) { }

  ngOnInit(): void {
    if(this.router.url == "/transaction/posted-transaction"){
      this.transactionStatus = "POSTED_TRANSACTIONS"
    }
    else if(this.router.url == "/transaction/unposted-transaction"){
      this.transactionStatus = "UNPOSTED_TRANSACTIONS"
    }
  }

}
