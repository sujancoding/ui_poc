import { Component, OnInit } from '@angular/core';
import { Agent } from '../transaction/model/TransactionModel';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
  p: number = 1;
  agent: Agent[] = [
    {id:1 ,agentId: "100100200",name: "Crown Silcom limited",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    {id:1 ,agentId: "100100200",name: "DBS",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    {id:1 ,agentId: "100100200",name: "Expenses",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    {id:1 ,agentId: "100100200",name: "OCBC",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    {id:1 ,agentId: "100100200",name: "RHB Bank Berhad",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    {id:1 ,agentId: "100100200",name: "Crown Silcom limited",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    {id:1 ,agentId: "100100200",name: "Expenses",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    {id:1 ,agentId: "100100200",name: "Crown Silcom limited",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    {id:1 ,agentId: "100100200",name: "Amir Sultan SDN",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    {id:1 ,agentId: "100100200",name: "Crown Silcom limited",status: "Active",mobileNumber: "(215)424-7763",country: "MALAYSIAN"},
    ]

  constructor() { }

  ngOnInit(): void {
  }

}
