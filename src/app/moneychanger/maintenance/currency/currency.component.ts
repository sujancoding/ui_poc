import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';

import { UpdateCurrencyComponent } from '../modals/update-currency/update-currency.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UpdateCurrencyValueComponent } from '../modals/update-currency-value/update-currency-value.component';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss','../../../../assets/styles/tables/table-style.scss'],

})
export class CurrencyComponent implements OnInit {

  isActive!:false;
  loader : boolean= false;
  p: number = 1;
  itemsPerPage: number = 20;
  public getScreenWidth: any;
  public getScreenHeight: any;
  currencySearchRecords : any[] = [] ;
  public filterForm : FormGroup = Object.create(null);
  showToolBarContent= false ;
  options: any[] = [];
  filteredOptions!: Observable<any[]>;
  filteredCurrencyNameOptions !: Observable<any[]>;
  optionCurrencyName: any[] = [];

  constructor(private titleService : TitleHeaderService, private maintenanceService : MoneyChangerMaintenanceService,
    private dialog : MatDialog, private fb : FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CurrencyComponent>) { }

    displayFn(currencySearch: any): string {
      return currencySearch && currencySearch ? currencySearch : '';
    }

    displayCurrencyName(currencySearch: any): string {
      return currencySearch && currencySearch ? currencySearch : '';
    }
  
    // Function to filter options based on input value
  private _filter(value: string): any[] {
  const filterValue = value.toLowerCase();
  return this.options.filter(option => option.ccyCode.toLowerCase().includes(filterValue));
  }

  private _filterCurrencyName(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.optionCurrencyName.filter(option => option.ccyName.toLowerCase().includes(filterValue));
    }

  ngOnInit(): void {
    this.titleService.setTitle('Currency Maintenance') ;
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
     this.getScreenWidth = window.innerWidth;
     this.getScreenHeight = window.innerHeight;

     //filter form
     this.filterForm = this.fb.group({
      currencyNo : [null,Validators.maxLength(4)], // upadted validator maxlength as 4.
      currencyCode : [null],
      currencyName : [null],

    })

    //opening this currency component as modal dialog from add transaction screen 
    if(this.data.isCurrencyReviewFromExternal){
      this.showToolBarContent = true ;
      console.log("Open currency component as modal dialog successful !");
      if(this.data.screenName == 'AddTransaction'){
        this.titleService.setTitle('Add Transaction') ; //screen title define .
      } else if(this.data.screenName == 'AddDeal'){
        this.titleService.setTitle('Add Deal') ; //screen title define .
      }
    }
   
     //Currency search service call
     this.currencySearchService('','','','');
    

  }


  currencySearchService(ccyNo:string, ccyCode:string, ccyName:string,filterIndicator:string){
      //Currency search service call
      this.loader = true;
      setTimeout(() => {
       this.maintenanceService.getCurrencyListings(ccyNo, ccyCode, ccyName).subscribe((datas:any)=>{
         this.currencySearchRecords = datas['data'] ;
         this.loader = false;

         if(filterIndicator != "search-filter"){
    //Currency code mat auto complete implementation..
    this.options = this.currencySearchRecords.map(item => ({ccyCode : item.ccyCode})) ;
    this.filteredOptions = this.filterForm.controls['currencyCode'].valueChanges.pipe(
     startWith(''),
     map(value => {
       const currencyCode = typeof value === 'string' ? value : value?.ccyCode;
       return currencyCode ? this._filter(currencyCode as string) : this.options.slice();
     }),
   );

   //Currency name mat auto complete implementation..
   this.optionCurrencyName = this.currencySearchRecords.map(item => ({ccyName : item.ccyName})) ;
   this.filteredCurrencyNameOptions = this.filterForm.controls['currencyName'].valueChanges.pipe(
    startWith(''),
    map(value => {
      const currencyName = typeof value === 'string' ? value : value?.ccyName;
      return currencyName ? this._filterCurrencyName(currencyName as string) : this.optionCurrencyName.slice();
    }),
  );
         }
        
       },
       (error:any)=>{
        this.loader = false;
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
       }
       )
      }, 400);
  }
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }
  
  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 211) + 'px', 'overflow-y': 'auto' };
  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  //Open Add Currency Modal dialog for adding new Currency..
  openAddCurrency(ccyNo:string, ccyCode:string, ccyName:string,variancePercentage:any,varianceRate:any,units:string){
    this.dialog.open(UpdateCurrencyComponent,{
      width : '480px',
      panelClass: 'custom-modalbox',
      data : {currencyNumber : ccyNo , currencyCode : ccyCode, currencyName : ccyName, variancePercentage:variancePercentage,
        varianceRate : varianceRate, units : units }
    }).afterClosed().subscribe((response:any)=>{
      if(response == undefined){
       
      }
      else if (response == "No Data"){
        
      }
      else if(response.currencyNo !== undefined || response.currencyNo !== ""){
        this.currencySearchService('','','','');
      }
    })
  }

  //Open Add Currency value 
  openAddCurrencyValue(ccyNo:string, ccyCode:string, ccyName:string){
    console.log("Add denomination modal window") ;
    this.maintenanceService.getCurrencyValueInquiry(ccyNo).subscribe((datas:any)=>{
      if(datas){
        this.dialog.open(UpdateCurrencyValueComponent,{
          // width : '900px',
           height: '614px',
           panelClass: 'custom-modalbox',
           data : {ccyNo: ccyNo, ccyCode: ccyCode, ccyName : ccyName , data : datas['data']}
         })
      }
    },
    //error handling 
    (error:any)=>{
      this.loader = false ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data : error.error.errorMessage ? error.error.errorMessage : ""
        })
      }
    }
  )
  

  }

  //Search filter 
  searchFilter(){
    let currencyNumber = this.filterForm.controls['currencyNo'].value ? this.filterForm.controls['currencyNo'].value : "" ;
    let currencyCode = this.filterForm.controls['currencyCode'].value ? this.filterForm.controls['currencyCode'].value : "" ;
    let currencyName = this.filterForm.controls['currencyName'].value ? this.filterForm.controls['currencyName'].value : "" ;
    this.currencySearchService(currencyNumber, currencyCode, currencyName,'search-filter') ;
  }

  //on double click --> get the currency number and patch in parent screen (parent screen = "Add Transaction Component")
  getCurrency(ccyNo:string, ccyCode:string, ccyName:string){
   console.log("row clicked" + ccyNo + ccyCode) ;
   this.dialogRef.close({currencyNumber: ccyNo, currencyCode: ccyCode, currencyName: ccyName});
  }

  //close the modal dialog
  onClose(){
    this.dialogRef.close({currencyNumber : false});
  }

  //on selection currency code in auto complete field
onOptionSelectedCurrencyCode(e:any){
  console.log(e) ;
  console.log(e.option.viewValue) ;
 
}

//on selection currency name in auto complete field
onOptionSelectedCurrencyName(e:any){
  console.log(e) ;
  console.log(e.option.viewValue) ;
}

}
