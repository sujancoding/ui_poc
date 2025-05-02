import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AgentRemittance } from '../../models/agent.model';

@Component({
  selector: 'app-agent-remittance',
  templateUrl: './agent-remittance.component.html',
  styleUrls: ['./agent-remittance.component.scss']
})
export class AgentRemittanceComponent implements OnInit {
 
  agentName : string = this.store.getItem('USERNAME');
  check !: string;
  activeTabIndex : number = 0; // Set the default selected tab index

  constructor(private headerService : TitleHeaderService,private store : InMemoryCache,private router : Router) { }

  ngOnInit(): void {
    if(this.router.url == "/agent/agent-remittance"){
      this.headerService.setTitle('Remittance Fulfillment');
      this.check = 'fulfillment';
     let statusIndication = this.store.getItem("AGENT_INITIATE");
      if(statusIndication == "agent-intitated" ){
        this.activeTabIndex = 1;
        this.store.removeItem("AGENT_INITIATE");
      }
    }
    else if(this.router.url == "/agent/agent-remittance-history"){
      this.headerService.setTitle('Remittance History');
      this.check = 'history'
    }
  }
  
}
