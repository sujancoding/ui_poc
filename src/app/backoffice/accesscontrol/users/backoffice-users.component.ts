import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { AddUserComponent } from '../../shared/modals/adduser/add-user.component';
import { StaffMaintenanceService } from 'src/app/core/services/staffmaintenance.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-backoffice-users',
  templateUrl: './backoffice-users.component.html',
  styleUrls: ['./backoffice-users.component.scss' , '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class BackofficeUsersComponent implements OnInit {
  isActive = false;
  loader : Boolean = false;
  p: number = 1;
  itemsPerPage: number = 20;
  searchStaffArray : any[] = [] ;
  filterForm : FormGroup = Object.create(null) ;
  

  constructor(private titleHeader : TitleHeaderService,public dialogRef: MatDialog,
    private staffService : StaffMaintenanceService, private store: InMemoryCache,private fb : FormBuilder) { }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  getStaffMaintenanceSearch(){
    this.loader = true ;
    setTimeout(() => {
      this.staffService.getStaffApi('').subscribe((datas:any)=>{
        this.loader = false ;
        this.searchStaffArray = datas['data'] ;
        datas['data'].filter((v:any)=> {
          if(v.status == '1'){
            v.status = "Active";
          }
          if(v.status == '0'){
            v.status = "InActive";
          }
        })
      },
       //error handling
     (error:any)=>{
      this.loader = false ;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
      )
    }, 200);
   
  }
  ngOnInit(): void {
    this.titleHeader.setTitle('Staff Maintenance');
    this.filterForm = this.fb.group({
      "staffName" : [null,Validators.compose([Validators.pattern("^[a-zA-Z ]+$")])],
    })
    this.getStaffMaintenanceSearch() ;

     //getScreenWidth and getScreenHeight will get the windows inner height and width.
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;
  }

   addUser(){
      this.dialogRef.open(AddUserComponent,{
        data : {userTest : true},
        panelClass: 'custom-modalbox',
        height:'550px',
        width:'970px'
      }).afterClosed().subscribe(res =>{
        if(res !=true && res != undefined){
          this.getStaffMaintenanceSearch() ;
        }
      })
   
   
  }

  updateUser(id:string){
    let staffId = id ? id : "" ;
    this.dialogRef.open(AddUserComponent,{
      data : {updateDetails : staffId},
      panelClass: 'custom-modalbox',
      height:'550px',
      width:'970px'
    }).afterClosed().subscribe(res =>{
      if(res !=true && res != undefined){
        this.getStaffMaintenanceSearch() ;
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
    return { 'height': (this.getScreenHeight - 216)+'px' , 'overflow-y' : 'auto' };
  }

   //STATUS color diff
 getColor(status: any) {
  switch (status) {
    case 'Active':
      return 'rgb(30 189 40)'; 
    case 'InActive':
      return 'red'
    default:
      return '';
  }
}
//bg color for status tags .
getBackgroundColor(status: string): string {
  switch (status) {
    case 'Active':
      return '#E1FCEF'; 
    case 'InActive':
      return '#FFEDDF'
    default:
      return '';
  }
  
}

//tool tip text value based on txnstatus ..
getTooltipText(status: string): string {
  switch (status) {
    case 'Active' :
      return "Active Staff's" ;

    case 'InActive':
      return "Deactivated Staff's";

  
    default:
      return ''; // Empty string as default tooltip text
  }
}

//apply filter
applyFilter(){
  this.loader = true ;
  let name = this.filterForm.controls['staffName'].value ? this.filterForm.controls['staffName'].value : "" ;
    setTimeout(() => {
      this.staffService.getStaffApi(name).subscribe((datas:any)=>{
        this.loader = false ;
        this.searchStaffArray = datas['data'] ;
        datas['data'].filter((v:any)=> {
          if(v.status == '1'){
            v.status = "Active";
          }
          if(v.status == '0'){
            v.status = "InActive";
          }
        })
      },
       //error handling
     (error:any)=>{
      this.loader = false ;
      if(error.status != 401){
        this.dialogRef.open(ErrorDialogAdminComponent) ;
      }
    }
      )
    }, 200);
   
}

}
