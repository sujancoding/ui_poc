import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { RoleMaintenanceService } from 'src/app/core/services/rolemaintenance.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';
import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { AddRoleComponent } from '../modals/addrole/add-role.component';
import { getRoleTooltiptext, statusBgColor, statusColor } from 'src/assets/transactionstatus';

@Component({
  selector: 'app-role-maintenance',
  templateUrl: './role-maintenance.component.html',
  styleUrls: ['./role-maintenance.component.scss', '../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class RoleMaintenanceComponent implements OnInit {
  myDate:any= new Date();
  userName : string = this.store.getItem('USERNAME');
  loader = false ;
  isActive = false;
 
  public getScreenWidth: any;
  public getScreenHeight: any;
  searchRole : any[] = [] ;
  getRoleWithAccessControl : any[] = [] ;
  p: number = 1;
  itemsPerPage: number = 20;
  constructor(private store : InMemoryCache,private headerService : TitleHeaderService,private roleService: RoleMaintenanceService,
    private dialog : MatDialog) { }

    handlePageChange(event: any): void {
      this.p = event.pageIndex + 1;
    }
  ngOnInit(): void {
    this.headerService.setTitle('Role Maintenance');
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    //search table service call 
    this.loader = true ;
    setTimeout(() => {
      this.getSearchRoleApi();
    }, 400);
   
  }

  getSearchRoleApi(){
    this.roleService.getRoleSearch().subscribe((datas:any)=>{
      this.searchRole = datas['data'] ;
       //converting the values of response object as status="1" as active "0" as inactive.
       datas['data'].filter((v:any)=> {
        if(v.status == '1'){
          v.status = "Active";
        }
        if(v.status == '0'){
          v.status = "InActive";
        }
      })
      this.loader = false ;
    },
    //error handling 
    (error:any)=>{
      this.loader = false ;
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }
    )
  }
//STATUS color diff
getColor(status: string) : string{
 return statusColor(status)
}
//bg color for status tags .
getBackgroundColor(status: string): string {
 return statusBgColor(status)
  
}
//tool tip text value based on txnstatus ..
getTooltipText(status: string): string {
 return getRoleTooltiptext(status)
}
 
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (this.getScreenHeight - 165)+'px' , 'overflow-y' : 'auto' };
  }

  //edit dialog
  editDialog(roleId : string){
    //get role search will access control details service call .
    this.roleService.getRoleSearchWithAccessControl(roleId).subscribe((datas:any)=>{
      this.getRoleWithAccessControl = datas ;

      //opening dialog window
      const dialogRef = this.dialog.open(AddRoleComponent,{
        panelClass: 'custom-modalbox',
        height:'700px',
        width:'920px',
        data : {isRoleReview : datas}
      })
      dialogRef.afterClosed().subscribe((res)=>{
        if(res !=true && res != undefined){
          this.loader = true ;
          setTimeout(() => {
            this.getSearchRoleApi();
          }, 100);
        }
      })

    })
  
  }

  //add role dialog 
  openAddRole(){
    const dialogRef = this.dialog.open(AddRoleComponent,{
      panelClass: 'custom-modalbox',
      height:'700px',
      width:'920px',
      data : {isRoleReview : 'Add-Role'}
    })
    dialogRef.afterClosed().subscribe((res)=>{
      if(res !=true && res != undefined){
        this.loader = true ;
        setTimeout(() => {
          this.getSearchRoleApi();
        }, 100);
      }
    })
  }

}
