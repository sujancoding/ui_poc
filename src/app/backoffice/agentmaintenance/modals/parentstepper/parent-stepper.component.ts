import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AgentProfilesComponent } from '../agentprofiles/agent-profiles.component';
import { AgentAssociatesComponent } from '../agentassociates/agent-associates.component';
import { AgentDocumentsComponent } from '../agentdocuments/agent-documents.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-parent-stepper',
  templateUrl: './parent-stepper.component.html',
  styleUrls: ['./parent-stepper.component.scss']
})


export class ParentStepperComponent implements OnInit {

  @ViewChild('agentProfile') agentProfile !: AgentProfilesComponent;
  @ViewChild('agentAssoicates') agentAssoicates !: AgentAssociatesComponent;
  @ViewChild('agentDocument') agentDocument !: AgentDocumentsComponent;
  @ViewChild('stepper') stepper!: MatStepper;
  profileStatus: string = 'In Progress';
  assoicatesStatus: string = 'Pending';
  documentStatus: string = 'Pending';
  agentName !: string;
  agentStatus !: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.agentName = this.data.agentName;
    this.agentStatus = this.data.status;
  }

  // It will trigger when change detection occur after it completes initialization of component's view and its child views
  ngAfterViewInit() {
    this.agentProfile.agentProfileStatusChanged.subscribe((status: string) => {
      this.profileStatus = status;
    });
    this.agentAssoicates.agentAssoicatesStatusChanged.subscribe((status: string) => {
      this.assoicatesStatus = status;
    });
    this.agentDocument.agentDocumentsStatusChanged.subscribe((status: string) => {
      this.documentStatus = status;
    });
  }

  //status color
  getColor(status: string) {
    switch (status) {
      case 'In Progress':
        return '#123969'
      case 'Pending':
        return '#BDBDBD'
      case 'Completed':
        return '#20C374'
      case 'Active':
        return 'rgb(30 189 40)';
      case 'InActive':
        return 'red'
      default: return ''


    }
  }

  //status background-color
  getBackgroundColor(status: string) {
    switch (status) {
      case 'In Progress':
        return '#F6F4FD'
      case 'Pending':
        return '#FFFFFF'
      case 'Completed':
        return '#E6FBF1'
      case 'Active':
        return '#E1FCEF';
      case 'InActive':
        return '#FFEDDF'
      default: return ''

    }
  }


  //The function will trigger whenever stepper changes
  onSelectionChange(event: any) {
    // Call the respective functions in the child components based on the active step index
    const activeStepIndex = event.selectedIndex;
    switch (activeStepIndex) {
      case 0:
        this.agentProfile.updateStatus(event); // for agent-profile
        break;
      case 1:
        this.agentAssoicates.updateStatus(event); // for agent-assoicates
        break;
      case 2:
        this.agentDocument.updateStatus(event);  //for agent-Documents
        break;
    }
    // Trigger the function in the child component associated with the "Agent Documents" step
   if (activeStepIndex == 2) {
      this.agentDocument.onloadDocuments(); 
   }
   if(activeStepIndex == 1){
    this.agentAssoicates.loadAgentInquiry()
   }
    
  }


}
