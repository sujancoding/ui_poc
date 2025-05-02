import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MoneyChangerMaintenanceService } from 'src/app/core/services/mcmaintenance.service';

import { UpdateCounterComponent } from '../modals/update-counter/update-counter.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { roleIdDetails } from 'src/assets/userrole';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss','../../../../assets/styles/tables/table-style.scss'],

})
export class CounterComponent implements OnInit {

  isActive!:false;
  loader : boolean= false;
  p: number = 1;
  itemsPerPage: number = 20;
  public getScreenWidth: any;
  public getScreenHeight: any;
  counterSearchRecords : any[] = [] ;
  public filterForm : FormGroup = Object.create(null);
  getCounterType : any[] = [];
  loginResCounterType !: string ;
  userRole !: string ;

  constructor(private titleService : TitleHeaderService, private maintenanceService : MoneyChangerMaintenanceService,
    private dialog : MatDialog, private fb : FormBuilder, private store : InMemoryCache) { }

  ngOnInit(): void {
    this.titleService.setTitle('Counter Maintenance') ;
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
     this.getScreenWidth = window.innerWidth;
     this.getScreenHeight = window.innerHeight;

     //filter form
     this.filterForm = this.fb.group({
      counterId : [null],
      counterType : [null],
      counterIp : [null,[Validators.compose([Validators.pattern('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$')])]],

    })

    this.loginResCounterType = this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";
    this.userRole = this.store.getItem('USER_ROLE') ? this.store.getItem('USER_ROLE') : "" ;
    if(this.loginResCounterType == "W"){
     this.getCounterType = [
      { "viewValue" : "Wholesale Counter" , "internalValue" : "W" },
     ]
    }
     if(this.loginResCounterType == "R"){
     this.getCounterType = [
      { "viewValue" : "Retail Counter" , "internalValue" : "R"}
     ]
    }
    if(this.userRole == roleIdDetails.STAFF_OWNER){ //444
      this.getCounterType = [
   { "viewValue" : "Wholesale Counter" , "internalValue" : "W" },
   { "viewValue" : "Retail Counter" , "internalValue" : "R"}
      ];
    }
    if(this.userRole == roleIdDetails.STAFF_ADMIN){ //333
      this.getCounterType = [
   { "viewValue" : "Wholesale Counter" , "internalValue" : "W" },
   { "viewValue" : "Retail Counter" , "internalValue" : "R"}
      ];
    }

    this.filterForm.patchValue({ counterType : this.loginResCounterType})
    
     //Counter search service call
     this.counterSearchService('',this.loginResCounterType,'');
    

  }


  counterSearchService(counterId:string, counterType:string, counterIp:string){
      //Counter search service call
      this.loader = true;
      setTimeout(() => {
       this.maintenanceService.getCounterListings(counterId, counterType, counterIp).subscribe((datas:any)=>{
         this.counterSearchRecords = datas['data'] ;
         this.loader = false;
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
    return { 'height': (this.getScreenHeight - 210) + 'px', 'overflow-y': 'auto' };
  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  //Open Add Counter Modal dialog for adding new counter..
  openAddCounter(id:string, ip:string, type:string){
    this.dialog.open(UpdateCounterComponent,{
      width : '480px',
      panelClass: 'custom-modalbox',
      data : {counterId : id , counterIp : ip, counterType : type}
    }).afterClosed().subscribe((response:any)=>{
      if(response == undefined){
       
      }
      else if (response == "No Data"){
        
      }
      else if(response.counterId !== undefined || response.counterId !== ""){
        this.counterSearchService('',this.loginResCounterType,'');
      }
    })
  }

  //Search filter 
  searchFilter(){
    let counterId = this.filterForm.controls['counterId'].value ? this.filterForm.controls['counterId'].value : "" ;
    let counterIp = this.filterForm.controls['counterIp'].value ? this.filterForm.controls['counterIp'].value : "" ;
    let counterType = this.filterForm.controls['counterType'].value ? this.filterForm.controls['counterType'].value : "" ;
    this.counterSearchService(counterId, counterType, counterIp) ;
  }
}
