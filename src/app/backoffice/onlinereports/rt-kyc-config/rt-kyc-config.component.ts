import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { CancelTransactionComponent } from 'src/app/shared/modals/canceltransaction/cancel-transaction.component';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { RtAddKycConfigComponent } from '../../shared/modals/rt-add-kyc-config/rt-add-kyc-config.component';

@Component({
  selector: 'app-rt-kyc-config',
  templateUrl: './rt-kyc-config.component.html',
  styleUrls: ['./rt-kyc-config.component.scss','../../../../assets/styles/tables/table-style.scss']
})
export class RtKycConfigComponent implements OnInit {

 kycListings : any[] = [] ;
    isActive = false;
    p: number = 1;
    itemsPerPage: number = 20;
    loader : Boolean = false ;
    public getScreenWidth: any;
    public getScreenHeight: any;
    xpandStatus = false ;
    filterValues : any[] = [];
  
    constructor(private titleService : TitleHeaderService, private transactionService : TransactionService,
      private dialog : MatDialog, private fb : FormBuilder,
      private store : InMemoryCache) { }
  
     //The HostListener is a Decorator used for listening to the DOM,
    // and It provides a handler method to run when that event occurs.
    @HostListener('window:resize', ['$event'])
    onWindowResize() {
      this.getScreenWidth = window.innerWidth;
      this.getScreenHeight = window.innerHeight;
    }
  
    changeTableHeight(){
      return { 'height': (this.getScreenHeight - 157 )+'px' , 'overflow-y' : 'auto' }; 
    }
    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }
  
  ngOnInit(): void {
      this.titleService.setTitle('KYC Config') ;
 
      this.searchKycService() ;
  
        //getScreenWidth and getScreenHeight will get the windows inner height and width.
        this.getScreenWidth = window.innerWidth;
        this.getScreenHeight = window.innerHeight;
    }
    
    searchKycService(){
     setTimeout(() => {
       this.loader = true ;
      this.transactionService.searchKyc().subscribe((datas:any) => {
       //success case
        this.loader = false ;
        this.kycListings = datas['data'] ;
      },
      //error handling
      (error:any)=>{ //error handling
       this.loader = false ;
                if(error.status != 401){
                  this.dialog.open(ErrorDialogAdminComponent,{
                    data : { errorMessage : error.error.errorMessage ? error.error.errorMessage : "" }
                  }) 
                }
              }
     )
     }, 300);
     
    }
 
    openAddKycDialog(flag:string, id:string, label:string, minVolume:string, maxVolume:string,
     minFrequency:string, maxFrequency:string
    ){
 
      this.dialog.open(RtAddKycConfigComponent, {
        width: '615px',
        height: '365px',
        panelClass: 'custom-modalbox',
        data: { indicator: flag, id: id, label: label, minVolume: minVolume, maxVolume: maxVolume,
         minFrequency: minFrequency, maxFrequency: maxFrequency
         }
      }).afterClosed().subscribe((response: any) => {
        if (response && response.data != "error occurred") {
          this.searchKycService() ; //after adding category -> call search service again . 
        }
       
      })
      
    }
 
    openDeleteKycDialog(name:string, id:string){
       this.dialog.open(CancelTransactionComponent,{
         data : { kycLabel : name , kycId:id , branch : "RT" },
       })
       .afterClosed().subscribe((response:any) => {
         if (response && response != "API Failure") {
           this.searchKycService() ; //after delete category -> call search service again . 
         }
       })
  }

  formatNumberWithCommas(amount: string | number): string {
    return Number(amount).toLocaleString('en-US');
  }

}
