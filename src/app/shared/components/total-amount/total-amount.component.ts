import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApproveTransaction, DealInfo } from 'src/app/core/model/approvetransaction/approvetransaction';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { InMemoryCache } from '../../services/cache.service';

@Component({
  selector: 'app-total-amount',
  templateUrl: './total-amount.component.html',
  styleUrls: ['./total-amount.component.scss']
})
export class TotalAmountComponent implements OnInit {
  


  constructor(private store : InMemoryCache) { 
    
  }
 
  ngOnInit(): void {
  
  }
 
}
