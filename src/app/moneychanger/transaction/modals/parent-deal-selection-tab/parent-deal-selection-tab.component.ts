import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ShipmentDealsComponent } from '../shipment-deals/shipment-deals.component';
import { DealsComponent } from '../deals/deals.component';

@Component({
  selector: 'app-parent-deal-selection-tab',
  templateUrl: './parent-deal-selection-tab.component.html',
  styleUrls: ['./parent-deal-selection-tab.component.scss']
})
export class ParentDealSelectionTabComponent implements OnInit {

  check !: string;
  activeTabIndex : number = 0; // Set the default selected tab index --> Deal
  dealListings : any[] = [] ;
  flag : boolean = true;
  getCustomerId : string = "" ;
  shipmentDealListings : any[]= [];
  @ViewChild(DealsComponent) dealComponent!: DealsComponent;
  @ViewChild(ShipmentDealsComponent) shipmentComponent!: ShipmentDealsComponent;
  isDealLoaded = false;
  isShipmentLoaded = false;
  dealList : any[] = [] ;
  shipmentDeals : any[] = [];
  constructor(public dialogRef : MatDialogRef<ParentDealSelectionTabComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    
    //MC => Add Transaction => select customer and retrieve deals ..
    if(this.data.isTransactionReview){
      this.flag = true ;
      this.getCustomerId = this.data.customerId ? this.data.customerId : "" ;
    }
  }

  //function handling for after close deal list component
  dealEventHandler(e:any){
   this.dealListings = e ;
   this.dialogRef.close({ data : this.dealListings });
  }

  //function handling for after close shipmengt deal list component
  shipmentEventHandler(e:any){
    this.shipmentDealListings = e ;
    this.dialogRef.close({ data : this.shipmentDealListings });
  }
  onLoaded(listingResponse: any, flag:string ){
    
    if (flag === "DEAL") {
       this.dealList = listingResponse;
      this.isDealLoaded = true;
    } else if (flag === "SHIPMENT") {
      this.shipmentDeals = listingResponse;
      this.isShipmentLoaded = true;
    }
    if (this.isDealLoaded && this.isShipmentLoaded) {
      if (this.dealList.length == 0 && this.shipmentDeals.length == 0) {
        this.dialogRef.close();
      }
    }
  }

  //for tab changes , this function will trigger
  onTabChange(event: MatTabChangeEvent): void {
    this.activeTabIndex = event.index;
    console.log("Index"+this.activeTabIndex);
  }

  //Handle enter key will be triggered if user taps Enter button
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    if (this.activeTabIndex === 0) {
      this.dealComponent.handleKeyDownEvent();
    } else if (this.activeTabIndex === 1) {
      this.shipmentComponent.handleKeyDownEvent();
    }
  }
}
