import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AcknowledgeTransactionComponent } from 'src/app/agent/modals/acknowledge-transaction/acknowledge-transaction.component';
import { OrganizationRemittance } from 'src/app/agent/models/agent.model';
import { AgentTable } from 'src/app/transaction/model/TransactionModel';

@Component({
  selector: 'app-agent-table',
  templateUrl: './agent-transactions.component.html',
  styleUrls: ['./agent-transactions.component.scss']
})
export class AgentTableComponent implements OnInit {
  p: number = 1;

  agentTransactions : OrganizationRemittance[]=[
  {txnId: "88966522",txnOn: "May 30,2022 07:52",sender: "Guy Hawkins",payeeAccountNo: "6055077055",payeeName: "Ms Jenny Wilson",bankName: "May Bank",swiftCode: "Swift Code",amount: "MYR",currency: "1,00,000",exchRate: "3.1708222",dealId: "567845",status: "Processed"},
  {txnId: "88966522",txnOn: "May 30,2022 07:52",sender: "Guy Hawkins",payeeAccountNo: "6055077055",payeeName: "Ms Jenny Wilson",bankName: "May Bank",swiftCode: "Swift Code",amount: "MYR",currency: "1,00,000",exchRate: "3.1708222",dealId: "567845",status: "Processed"},
  {txnId: "88966522",txnOn: "May 30,2022 07:52",sender: "Guy Hawkins",payeeAccountNo: "6055077055",payeeName: "Ms Jenny Wilson",bankName: "May Bank",swiftCode: "Swift Code",amount: "MYR",currency: "1,00,000",exchRate: "3.1708222",dealId: "567845",status: "Processed"},
  {txnId: "88966522",txnOn: "May 30,2022 07:52",sender: "Guy Hawkins",payeeAccountNo: "6055077055",payeeName: "Ms Jenny Wilson",bankName: "May Bank",swiftCode: "Swift Code",amount: "MYR",currency: "1,00,000",exchRate: "3.1708222",dealId: "567845",status: "Processed"},
  {txnId: "88966522",txnOn: "May 30,2022 07:52",sender: "Guy Hawkins",payeeAccountNo: "6055077055",payeeName: "Ms Jenny Wilson",bankName: "May Bank",swiftCode: "Swift Code",amount: "MYR",currency: "1,00,000",exchRate: "3.1708222",dealId: "567845",status: "Processed"},
  ]

  constructor(private dialog : MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(){
    this.dialog.open(AcknowledgeTransactionComponent, {
      data: { isreview: true },
      panelClass: 'custom-modalbox',
      width:'400px',
      height: '500px',
    })
  }

}
