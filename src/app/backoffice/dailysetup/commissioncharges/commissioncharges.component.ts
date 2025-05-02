import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { AddCommissionComponent } from '../modals/addcommission/add-commission.component';
import { CommissionService } from 'src/app/core/services/commission.service';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';


@Component({
  selector: 'app-commissioncharges',
  templateUrl: './commissioncharges.component.html',
  styleUrls: ['./commissioncharges.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class CommissionchargesComponent implements OnInit {
  myDate:any = new Date ;
  userName : string = this.store.getItem('USERNAME');
  loader : Boolean = false;
  p: number = 1;
  commissionArrayList : any[] = [];
  eurpoeFlagSvg = 'assets/images/eu.svg' ;
  isDisableDeleteIcon : Boolean = true ;
  isFieldDisabled : Boolean = true ;
  isFieldReadOnly : Boolean = true;
  n : any;
  color !: boolean;
  isDisableAddButton : Boolean = true ;
  branchUserName = this.store.getItem('USERNAME');
  itemsPerPage = 20 ;
  indSharedFeeArray : any[] = [] ;
  oursFeeArray : any[] = [] ;
  benFeeArray : any[] = [] ;
  sharingTypeArray : any[] = [] ;
  currencyObject : any[] = [] ;
  indOrgShared !: string ;

  constructor(private titleHeaderService : TitleHeaderService,private store : InMemoryCache, private matDialog: MatDialog,
    private commissionService: CommissionService,private dialog : MatDialog) { }

    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }

  ngOnInit(): void {
    this.titleHeaderService.setTitle('Commission Charges');
     //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  
    //retrieve commission charges - service call 
    this.loader = true;
    this.commissionService.getCommission().subscribe((datas:any) =>{
      //Success
      this.loader = false;
      this.commissionArrayList = datas['data'];
    },
    //failure --> error handlig
    (error:any) =>{
      this.loader = false ;
      console.log("error handling done")
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent,{
          data : {errorMessage : error.errorMessage}
        }) ;
      }
    })
  
  
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

  changeTableHeight(){
    return (this.getScreenHeight - 115);
  }
  
  getOverFlow(){
    return 'auto';
  }
  //open the dialog and edit the record
  openEditDialog(event: MouseEvent, commissionList:any){
   // this.n = id;
    this.color = true;
    console.log(commissionList) ;
    let currencyCode = commissionList.key ; //currency
    commissionList.value ; //agent , ind and corp node details 
   //let position : any = event.clientY;
  //  //based on screen y axis
  //  if(event.clientY >= 590 && event.clientY <= 630){
  //   position = 500 ;
  //  } 
  //  if(event.clientY >= 631 && event.clientY <= 700){
  //   position = 600 ;
  //  } 
  //  if(event.clientY >= 960 && event.clientY <=1000){
  //   position = 720 ;
  //  }
   this.matDialog.open(AddCommissionComponent,{
      data : {isDataPass : commissionList , currencyCode : currencyCode },
      width: '1232px'

    }
    ).afterClosed().subscribe(result =>{
      console.log(result);
      if(result.response == "SUCCESS"){
        this.loader = true ;
        this.commissionService.getCommission().subscribe((datas:any)=>{
          this.loader = false;
         this.commissionArrayList = datas['data'];
    
      });
    }
    
    
    })
  }

  addCommission(){
    this.matDialog.open(AddCommissionComponent,{
      data : {},
      width : '1010px', 
    })
  }
}
