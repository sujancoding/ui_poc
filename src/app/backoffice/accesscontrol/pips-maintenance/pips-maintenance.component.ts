import { Component, HostListener, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { PipsMaintenanceService } from 'src/app/core/services/pipsmaintenance.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import {  UpdatePips } from 'src/app/core/model/pipsmaintenance/pipsmaintenance.model';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dbsSupportedCurrencyPairs } from 'src/assets/dropdownvalues';


@Component({
  selector: 'app-pips-maintenance',
  templateUrl: './pips-maintenance.component.html',
  styleUrls: ['./pips-maintenance.component.scss' , '../../../../assets/styles/tables/table-style.scss'],
  styles : [ CommonSearchFilterCard]
})
export class PipsMaintenanceComponent implements OnInit {

  isActive: Boolean = false;
  searchPips: any[] = [];
  itemsPerPage: number = 20;
  p: number = 1;
  loader: boolean = false;
  expandedRecord: any; // Store the currently expanded record
  marginTier !: string;
  currencyPair !: string;
  enteredPipsValue: any;
  flagArrayList = dbsSupportedCurrencyPairs ;
  currencyPairsArray = dbsSupportedCurrencyPairs ;
  selectedCurrencyCode !: string;
  selectedCountryCode !: string ;
  flagSelection !: string ;
  getCurrencyPair !: string ;
  finalFlagSelection !: string ;
  public form : FormGroup = Object.create(null)


  constructor(private pipsService: PipsMaintenanceService, private dialog: MatDialog,
    private headerService: TitleHeaderService,private fb : FormBuilder) { }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  getFlagClass(currencyPair: string): string {
    const matchingCurrency = this.flagArrayList.find(item => item.CURRENCYCODE == currencyPair);
    return matchingCurrency ? matchingCurrency.FLAG : '';
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      "pipsRate":[null,Validators.pattern(/^\d*\.?\d+$/)]
    });
    this.headerService.setTitle('Pips Maintenance');
    this.selectedCurrencyCode = "USDSGD" ;
    this.selectedCountryCode = "flag-icon flag-icon-us";
    this.flagSelection = "flag-icon flag-icon-us" ;
    //retrieve pips Service call
    this.loader = true;
    setTimeout(() => {
      this.pipsService.getPips().subscribe((datas: any) => {
        this.searchPips = datas['data'];
         // Find the matching currency code in the first array of objects
       const index = this.currencyPairsArray.findIndex((item:any) => item.FLAG == "flag-icon flag-icon-us");
       this.getCurrencyPair = this.currencyPairsArray[index].CURRENCYCODE
       let searchPipsArray = this.searchPips.filter(v => v.PIPSCCYPAIR == this.getCurrencyPair)
       this.searchPips = searchPipsArray ;
       this.finalFlagSelection = "flag-icon flag-icon-us" ;
      this.loader = false;
      },
        (err: any) => {
          this.loader = false;
          if (err.status != 401) {
            this.dialog.open(ErrorDialogAdminComponent);
          }
        })
    }, 300);

    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }
  public getScreenWidth: any;
  public getScreenHeight: any;
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

 

  toggleExpansionPanel(record: any): void {
    if (this.expandedRecord === record) {
      this.expandedRecord = null; // Collapse the panel if it's already expanded
    } else {
      this.expandedRecord = record; // Expand the panel for the clicked record
      this.enteredPipsValue = record.PIPSRATE; // Initialize enteredPipsValue with PIPSRATE
    }
  }
  changeTableHeight() {
    return { 'height': (this.getScreenHeight - 214) + 'px', 'overflow-y': 'auto' };
  }
  //search button clicked .
  searchCurrencyPair() {
    this.finalFlagSelection = this.flagSelection
    //call the search pips for every applied search 
    this.loader = true;
    setTimeout(() => {
      this.pipsService.getPips().subscribe((datas: any) => {
        this.searchPips = datas['data'];
         // Find the matching currency code in the first array of objects
    const index = this.currencyPairsArray.findIndex((item:any) => item.FLAG == this.flagSelection);
    this.getCurrencyPair = this.currencyPairsArray[index].CURRENCYCODE
    let searchPipsArray = this.searchPips.filter(v => v.PIPSCCYPAIR == this.getCurrencyPair)
    this.searchPips = searchPipsArray ;
        this.loader = false;
      },
        (err: any) => {
          this.loader = false;
          if (err.status != 401) {
            this.dialog.open(ErrorDialogAdminComponent);
          }
        })
    }, 300);
  }

  //upsert pips api .
  saveChanges(record: any) {
    this.marginTier = record.CUSTMARGINRATE ? record.CUSTMARGINRATE : "";
    this.currencyPair = record.PIPSCCYPAIR ? record.PIPSCCYPAIR : "";
    this.pipsService.updatePips(this.buildPayload()).subscribe(data => {
      console.log(data);
      this.expandedRecord = null;
       //call the search pips for every applied search 
    this.loader = true;
    setTimeout(() => {
      this.pipsService.getPips().subscribe((datas: any) => {
        this.searchPips = datas['data'];
         // Find the matching currency code in the first array of objects
    const index = this.currencyPairsArray.findIndex((item:any) => item.FLAG == this.finalFlagSelection);
    this.getCurrencyPair = this.currencyPairsArray[index].CURRENCYCODE
    let searchPipsArray = this.searchPips.filter(v => v.PIPSCCYPAIR == this.getCurrencyPair)
    this.searchPips = searchPipsArray ;
        this.loader = false;
      },
        (err: any) => {
          this.loader = false;
          if (err.status != 401) {
            this.dialog.open(ErrorDialogAdminComponent);
          }
        })
    }, 300);
     
    },
      (error: any) => {
        this.loader = false;
        if (error.status != 401) {
          this.dialog.open(ErrorDialogAdminComponent);
        }
      }
    )
  }

  buildPayload(): UpdatePips {
    return new UpdatePips({
      "pipsData": [
        {
          "ccyPair": this.currencyPair,
          "marginRate": this.marginTier,
          "pips": this.enteredPipsValue
        }
      ]
    })
  }

  selectedCurrencyPair(flag : string){
    this.flagSelection = flag ;
  }

}
