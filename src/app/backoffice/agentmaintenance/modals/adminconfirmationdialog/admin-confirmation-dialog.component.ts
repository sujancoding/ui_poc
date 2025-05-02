import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';

@Component({
  selector: 'app-admin-confirmation-dialog',
  templateUrl: './admin-confirmation-dialog.component.html',
  styleUrls: ['./admin-confirmation-dialog.component.scss']
})
export class 
AdminConfirmationDialogComponent implements OnInit {

  deactivateAgentFlag : boolean = false;
  activateAgentFlag : boolean  = false;
  loader : boolean = false;
  showConfirmButton : boolean = true;

  constructor( @Inject(MAT_DIALOG_DATA) public data : any,private agentMainteance : AgentMaintenanceService,private store : InMemoryCache
  ,private dialog : MatDialog) { }

  ngOnInit(): void {

    if(this.data.activeAgent){
      this.deactivateAgentFlag = true;
      this.activateAgentFlag = false;
    }
   if(this.data.dectiveAgent){
     this.deactivateAgentFlag = false;
     this.activateAgentFlag = true;
}
  }
  closeDeactivationDialog(){
    this.loader = true;
    this.showConfirmButton = false;
    this.data.agentData.status = "0"; // change status in update profile API
    let profileObj : any = this.data.agentData 
    console.log( "Agent Object"+ profileObj);
     this.agentMainteance.updateProfile(profileObj).subscribe((data:any)=>{
      this.loader = false;
      this.showConfirmButton = true ;
      if(data != undefined){
        this.store.setItem('DEACTIVATE_AGENT',data)
      }
      this.dialog.closeAll();
     },
     (error:any)=>{
      this.dialog.closeAll();
      this.loader = false;
      this.showConfirmButton = true
        if(error.status != 401){
         this.dialog.open(ErrorDialogAdminComponent)
        }
     })
    console.log("Agent deactivated successfully");
    
  }
  closeActivationDialog(){
    this.loader = true;
    this.showConfirmButton = false;
    this.data.agentData.status = "1"; // change status in update profile API
    let profileObj :any = this.data.agentData;
    console.log(profileObj);
    this.agentMainteance.updateProfile(profileObj).subscribe((data:any)=>{
    this.loader = false;
    this.showConfirmButton = true
      if(data != undefined){
         this.store.setItem("ACTIVATE_AGENT",data)
      }
      this.dialog.closeAll();
    },
    (error:any)=>{
      this.dialog.closeAll();
      this.loader = false;
      this.showConfirmButton = true
      if(error.status != 401){
       this.dialog.open(ErrorDialogAdminComponent)
      }
    })
    
    console.log("Agent Activated successfully");

  }

}
