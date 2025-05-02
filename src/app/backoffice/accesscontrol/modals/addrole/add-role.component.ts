import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { AccessControlModel, AddRole, UpdateRole } from 'src/app/core/model/rolemaintenance/role.model';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { RoleMaintenanceService } from 'src/app/core/services/rolemaintenance.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CommonSearchFilterCard } from 'src/assets/styles/tables/table-styles';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss' , '../../../../../assets/styles/tables/table-style.scss'],
  styles : [CommonSearchFilterCard]
})
export class AddRoleComponent implements OnInit  {

  form :  FormGroup = Object.create(null);
  getAccessControlList : any[] = [] ;
  getFunctionList : any[] = [] ;
  // accessList : any[] = [
  //   {"ACTION" : "VIEW"},
  //   {"ACTION" : "EDIT"}
  // ];
  loader = false ;
  manualRecords : any[] = [] ;
  isActive = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  buildAccessControlsArray : any[] = [] ;
  getActionList : string[] = [] ;
  isFieldDisabled = false ;
  editRolePairs = false ;
  addRolePairs = false ;
  roleId : string = '' ;
  isReadOnly = false ;
  datasFulfilled = true ;
  datasNotFound = false ;
  p: number = 1;
  itemsPerPage: number = 20;
  statusArray = [{
  status : "ACTIVE" ,id : "1"},
  {status : "INACTIVE" ,id : "0"}];
  showStatusDropdown : boolean = false;
  productCodeList : any[] = [] ;
  getAccessControlListResponse : any ;

  constructor(private fb : FormBuilder,private roleService : RoleMaintenanceService,private dialog : MatDialog,
    private headerService : TitleHeaderService,public dialogRef: MatDialogRef<AddRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private alertService : AlertService) { }
 

  ngOnInit(): void {
    this.form = this.fb.group({
      "roleId" : [null, [Validators.compose([Validators.required])]],
      "roleCode" : [null, [Validators.compose([Validators.required])]],
      "roleName" : [null, [Validators.compose([Validators.required])]],
      "module" : [null, [Validators.compose([Validators.required])]],
      "function" : [null, [Validators.compose([Validators.required])]],
      "status" : [null],
      "productCode" : [null]
     // "access" : [null, [Validators.compose([Validators.required])]]
    });

    this.headerService.setTitle('Role Maintenance');
    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

    if(this.data.isRoleReview != "Add-Role"){ //edit role block
      console.log(this.data.isRoleReview) ;
      this.showStatusDropdown = true;
      this.editRolePairs = true ;
      this.manualRecords = this.data.isRoleReview.accessControlDtl ;
      this.isReadOnly = true ;
      if(this.manualRecords){
        this.datasFulfilled = true ;
        this.datasNotFound = false ;
        this.form.patchValue({
          "roleId" :  this.data.isRoleReview.roleId,
          "roleCode" : this.data.isRoleReview.roleName,
          "roleName" : this.data.isRoleReview.roleDescription,
          "status" : this.data.isRoleReview.status
        })
        this.roleId = this.data.isRoleReview.roleId ;
        // Iterate through objv using forEach and push objects into buildAccessControlsArray
     this.manualRecords.forEach(item => {
      if (item.id !== undefined) {
       this.buildAccessControlsArray.push({
          "accessControlId": item.id
         });
 }
});
      }
      else{
        this.datasFulfilled = false ;
        this.datasNotFound = true ;
      }
     

console.log(this.buildAccessControlsArray);
      this.getAccessControlListApi() ;
    }
    else{  //this block executes , when Add role button is clicked in search role screen .
      this.showStatusDropdown = false;
      this.addRolePairs = true ;
      this.isFieldDisabled = true ;
      this.isReadOnly = false ;
      this.getAccessControlListApi() ;
    }
  }

   // Function to handle changes in the mat-select dropdown
   onActionChange(newValue: string, record: any) {
    record.ACTION = newValue;
  }

  getAccessControlListApi(){
    //Get Access Control List API call .
    console.log("Get Access Control List API fired .")
this.roleService.getAccessControlList().subscribe((datas:any)=>{
  this.getAccessControlListResponse = datas['accessControls'] ; 
// Extracting product codes and Storing product codes in this.productCode array
this.productCodeList = Object.keys(datas.accessControls); // ["rt", "mc"]
  console.log(this.productCodeList) ;
},
(error:any)=>{
  if(error.status != 401){
    this.dialog.open(ErrorDialogAdminComponent,{
      data :{ errorMessage : "Problem in Get Access Control!" }
    }) ;
  }
}
)
  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

   //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  changeTableHeight(){
    return { 'height': (302)+'px' , 'overflow-y' : 'auto' };
  }

  removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
  }
  whitespaceValidator(control: AbstractControl) {
    const value = control.value;
  
    if (value && value.match("^[ .]+")) {
      // if the value consists of whitespace or fullstop at beginning of string , return an error object
      return { "isWhitespace": true };
    }
    // otherwise, return null (no error)
    return null;
    
  }

  //add role api call .
  onSave(){
    this.roleService.addRole(this.buildPayload()).subscribe((datas:any)=>{
      console.log(datas) ;
      this.dialogRef.close(datas) ;

    },
    
    (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    })
  }

  buildPayload() : AddRole{
    return new AddRole({
      "roleId" : this.form.controls['roleId'].value, // role id is decided by the client side .
      "roleName" : this.form.controls['roleCode'].value,
      "roleDescription" : this.form.controls['roleName'].value,
      "accessControls" : this.buildAccessControlsArray 
    })
  }

 

  moduleSelection(moduleKey : any){
   let module = moduleKey._value ;
   this.getFunctionList = this.getAccessControlList[module] ;
   console.log(this.getFunctionList) ;
  }

  functionSelection(functionKey : any){
    let selectedFunctionValue = functionKey._value ;
   // Find the corresponding object from the 'getFunctionList' array based on the selected "Function" NAME
  const selectedFunctionObject = this.getFunctionList.find((obj: any) => obj.NAME === selectedFunctionValue);

    // If you have multiple objects with the same NAME, use the ID to find the exact object
    if (selectedFunctionObject) {
      const actions = Array.isArray(selectedFunctionObject.ACTION) ? selectedFunctionObject.ACTION : [selectedFunctionObject.ACTION];

      // Clear the existing action list
      this.getActionList = [];
  
      // Push the actions to the action list
      this.getActionList = actions;

    }
  
  }

  addRecord(){
    this.loader = true ;
    setTimeout(() => {
      this.getFunctionList ;
      let module = this.form.controls['module'].value ? this.form.controls['module'].value : "" ;
      let functionVal =   this.form.controls['function'].value ? this.form.controls['function'].value : ""  ;
   //   let access = this.form.controls['access'].value ? this.form.controls['access'].value : "" ;
      
      if(module != "" && functionVal != ""){
      let getFunctionListObj =  this.getFunctionList.filter(v => v.name === functionVal) ;
      let accessId = getFunctionListObj[0].accessId ;
      let filteredObj =  this.manualRecords.filter(v => v.accessId == accessId) ;
      if(filteredObj.length >= 1){ //restricting user not to add duplicated records .
        this.alertService.clear() ;
        this.alertService.info('Record already exists for the given accessId.')
          this.loader = false ;
      }
      else
      {
        this.alertService.clear() ;
        let retrievedObj = this.getFunctionList.filter(v => v.name === functionVal) ;
        let name = functionVal  ;
        let accessId = retrievedObj[0].accessId ;
        let action = retrievedObj[0].action ;
          //taking access control id based on function id and will be sent in add role api (req)
          let arr = this.getFunctionList.filter(v => v.name === functionVal) ;
          let internalAccessControlId = arr[0].id ;
          this.buildAccessControlsArray.push({"accessControlId":internalAccessControlId})
          
          var obj = {"module" : module , "name" : name , "accessId": accessId , "action":action , "id": internalAccessControlId}
          this.manualRecords.push(obj) ;
          this.loader = false ;
      
          this.getFunctionList = [] ; //empty the function array once object is pushed
          this.getActionList = [] ; //empty the action array once object is pushed
          //empty the value and clear validations for module , function and access dropdown field .
          this.form.controls['module'].setValue(null) ;
          this.form.controls['function'].setValue(null) ;
         // this.form.controls['access'].setValue(null) ;
          this.form.controls['module'].clearValidators() ;
          this.form.controls['function'].clearValidators()  ;
        //  this.form.controls['access'].clearValidators()  ;
          this.form.controls['module'].updateValueAndValidity() ;
          this.form.controls['function'].updateValueAndValidity()  ;
         // this.form.controls['access'].updateValueAndValidity()  ;
    
        }
      }
     else{
        this.loader = false ;
        this.alertService.clear() ;
        this.alertService.info('Please provide all mandatory datas .') ;
      }
    }, 500);
  
  }

  deleteRecord(functionValue : string,id : any){
    const searchFunctionIndex = this.manualRecords.findIndex(item => item.name === functionValue);
    const searchAccessIdIndex = this.manualRecords.findIndex(item => item.id === id);

    if (searchFunctionIndex !== -1) {
      // Remove the object with the function using pop()
      this.manualRecords.splice(searchFunctionIndex, 1);
    }
    if(searchAccessIdIndex !== -1){
      this.buildAccessControlsArray.splice(searchAccessIdIndex,1) ;
    }
  }
  
  isDisabledSubmit() : Boolean{
    return this.manualRecords.length <= 0;
  }

  updateChanges(){
    let userId = this.roleId ;
    this.roleService.updateRole(this.buildUpdateRolePayload(),userId).subscribe((datas:any)=>{
      console.log(datas) ;
      this.dialogRef.close(datas) ;

    },
    
    (error:any)=>{
      if(error.status != 401){
        this.dialog.open(ErrorDialogAdminComponent) ;
      }
    }) 
  }

  buildUpdateRolePayload():UpdateRole{
   return new UpdateRole({
    "accessControls" : this.buildAccessControlsArray,
    "status" : this.form.controls['status'].value
   })
  }

  //based on product code selection -> iterate functions dropdown 
  productCodeSelection(productCode:string){
   console.log(productCode);
   if(productCode == "rt"){
    let rtArray  = this.getAccessControlListResponse['rt'] ; 
    this.getAccessControlList = rtArray ; //assigning to function dropdown .
   }
   else if(productCode == "mc"){
    let mcArray = this.getAccessControlListResponse['mc'] ; 
    this.getAccessControlList = mcArray ;   //assigning to function dropdown .
   }
  }
}
