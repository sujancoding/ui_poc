import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddStaff, UpdateStaff } from 'src/app/core/model/staffmaintenance/staff.model';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { RoleMaintenanceService } from 'src/app/core/services/rolemaintenance.service';
import { StaffMaintenanceService } from 'src/app/core/services/staffmaintenance.service';
import { noWhitespaceValidator, postalNumberValidator, removeSpaces, whitespaceValidator } from 'src/app/shared/models/phone.model';
import { countryArr, nricRegex } from 'src/assets/dropdownvalues';
import { ErrorDialogAdminComponent } from '../errordialogadmin/error-dialog-admin.component';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import countryCodeArray from 'src/assets/phonecountrycode.json' ;
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  form : FormGroup = Object.create(null);
  
  nationality : any[]=countryArr ;
  filteredCountries: any[] = countryArr;
  searchRole : any[] = [];
  roleDescription !: string ;
  hide = true;
  staffInquiry : any ;
  showPassword = true ;
  retrievedDesignation !: string ;
  isReadOnly : Boolean = false ;
  addStaffModal = true ;
  updateStaffModal = false;
  staffId !: string ;
  statusArray = [{id : "1" , status : 'ACTIVE'},{id : "0" , status : 'INACTIVE'}];
  selectedStatusId : any ;
  productCode !: string ;
  phoneNumberCodes = countryCodeArray ;
  countryCode !: string ;
  
  constructor(private fb: FormBuilder, private titleHeader : TitleHeaderService,public dialogRef: MatDialogRef<AddUserComponent>,
    private staffService: StaffMaintenanceService, private roleService : RoleMaintenanceService,
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog : MatDialog,private store : InMemoryCache) { }

  ngOnInit(): void {
    this.titleHeader.setTitle('Staff Maintenance');
    var regex = nricRegex ;
    this.form = this.fb.group({
      staffName:[null, [Validators.compose([Validators.required]), Validators.pattern('^[a-zA-Z\. ]*$')]],
      idNbr : [null ,[Validators.compose([Validators.required,Validators.pattern(regex),removeSpaces])]],
      emailAddress : [null, [Validators.required, Validators.email]],
      phoneNo:[null,Validators.compose([Validators.required,Validators.pattern("^[0-9 ]+$")])],
      phoneCountryCode : [null ,[Validators.compose([Validators.required])]],
      password: [null, Validators.compose([Validators.minLength(8), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).{8,}$"), Validators.required, Validators.maxLength(16)])],
      level: [null ,[Validators.compose([Validators.required,Validators.pattern('^[0-9 ]+$'),Validators.maxLength(10),removeSpaces, noWhitespaceValidator])]],
      unit: [null ,[Validators.compose([Validators.required, Validators.pattern('^[0-9 ]+$'),Validators.maxLength(10),removeSpaces,noWhitespaceValidator])]],
      buildingName: [null ,[Validators.compose([Validators.required])]],
      streetName: [null ,[Validators.compose([Validators.required,Validators.maxLength(40),removeSpaces,whitespaceValidator])]],
      country: [null ,[Validators.compose([Validators.required])]],
      postalCode :[null, [Validators.compose([Validators.required,Validators.pattern('^[0-9 ]+$'),postalNumberValidator,removeSpaces,noWhitespaceValidator])]],
      roleName :[null,Validators.compose([Validators.required])],
      status : [null],
      staffCountry :[null,Validators.compose([Validators.pattern('[a-zA-Z .]*$')])] //newly added on 15 Sep2023 , to search staff country in Company Country Dropdown
    });

      //onload --> patch SG country code 
      this.form.patchValue({
        "phoneCountryCode" :  "flag-icon flag-icon-sg",
      });
      this.countryCode = "+65" ;

    this.productCode = this.store.getItem('PRODUCT_CODE_BIZ'); //Either RT or MC
    if(this.productCode == "RT"){
      this.searchRole = [
        {"roleId" : "222" , "roleName" : "TELLER"}, 
        {"roleId" : "333" , "roleName" : "ADMIN"}, 
        {"roleId" : "444" , "roleName" : "HEAD"}
      ];
    }
    if(this.productCode == "MC"){
      this.searchRole = [
        {"roleId" : "601" , "roleName" : "DEALER"}, 
        {"roleId" : "602" , "roleName" : "REALISER"}, 
        {"roleId" : "333" , "roleName" : "ADMIN"}, //MC Admin changed Admin , so Admin is common for both RT and MC <10 Jan 2024>
        {"roleId" : "444" , "roleName" : "HEAD"}
      ]
    }
 
    if(this.data.updateDetails != "" && this.data.updateDetails != undefined){
      this.updateStaffModal = true ;
      this.addStaffModal = false ;
      this.showPassword = false ;
      this.isReadOnly = true ;
      this.staffId = this.data.updateDetails ;
      this.staffService.staffInquiryApi(this.staffId).subscribe((datas:any)=>{
       this.staffInquiry = datas ;
       this.form.controls['password'].clearValidators();
       this.form.controls['password'].updateValueAndValidity();
       this.retrievedDesignation = this.staffInquiry.designation ;
       if(this.staffInquiry.status == "1"){
        this.selectedStatusId = "1" ;
        this.form.patchValue({
          status: "1" ,
        });
       }
       else if(this.staffInquiry.status == "0"){
        this.selectedStatusId = "0" ;
        this.form.patchValue({
          status: "0" ,
        });
       }
       //finding the mobile country using inquiry response and country arr .
       let code = this.staffInquiry.mobileCountryCode ? this.staffInquiry.mobileCountryCode : "" ;
       let getFlag = "flag-icon flag-icon-sg" ;
       this.countryCode = "+65" ;
       if(code != ""){
        let value = "+" + code; //concatenate + and code ==> O/p : "+91" ;
        var array : any[] = this.phoneNumberCodes.filter(v => v.code == value) ;
        let flag = array[0].FLAG ? array[0].FLAG : "" ; 
        let countryCode = array[0].code ? array[0].code : "" ; 
        getFlag = flag ;
        this.countryCode = countryCode ;
       }
       this.form.patchValue({
         staffName: this.staffInquiry.staffName ,
         idNbr: this.staffInquiry.idNumber,
         emailAddress: this.staffInquiry.emailId,
         phoneNo: this.staffInquiry.mobileNo,
         phoneCountryCode : getFlag  ,
         level:this.staffInquiry.address.addressLine1 ,
         unit: this.staffInquiry.address.addressLine2,
         buildingName: this.staffInquiry.address.addressLine3,
         streetName: this.staffInquiry.address.addressLine4,
         country: this.staffInquiry.address.country,
         postalCode: this.staffInquiry.address.postalCode,
         staffCountry : this.staffInquiry.address.country,
       })
        //search role service call  //date : 05-09-2023, change desc : service call is removed for get role api and three values hard coded now as thahir sir said .
   // this.roleService.getRoleSearch().subscribe((datas:any)=>{
        let role : any[] = this.searchRole ;
      let getRoleObject = role.filter((v:any)=> v.roleName == this.retrievedDesignation) ;
     // this.searchRole = getRoleObject ;
      // Create a concatenated value
      const selectedRoleId = getRoleObject[0].roleId ;
      const selectedValue = `${selectedRoleId}`;

       // Use the setValue method on the form control to set the value
      this.form.controls['roleName'].setValue(selectedValue);
  //  },
    //error handling 
  //  (error:any)=>{
   //   if(error.status != 401){
   //     this.dialog.open(ErrorDialogAdminComponent) ;
  //    }
  //  }
 //   )
      },
      //error handling 
    (error:any)=>{
      if(error.status != 401){
        if(error.error.errorMessage){
        this.dialog.open(ErrorDialogAdminComponent,{
           data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Issue Occured.." }
         }) ;
        }
      }
    }
      )
    }
    else{
      this.updateStaffModal = false ;
      this.addStaffModal = true ;
      this.showPassword = true ;
      this.isReadOnly = false ;
    }


    
  }

  //add staff api
  onSubmit(){
    //using roleId , map and fecth the role desc .
    let roleId = this.form.controls['roleName'].value ;
    if(this.searchRole != undefined || this.searchRole != null){
      var roleObj = this.searchRole.filter((v:any)=> v.roleId == roleId) ;
      this.roleDescription = roleObj[0].roleName ;

    }
     this.staffService.addStaffApi(this.buildPayload()).subscribe((data:any)=>{
      this.dialogRef.close(data) ;
     },
     //error handling
     (error:any)=>{
      if(error.status != 401){
        if(error.error.errorMessage){
        this.dialog.open(ErrorDialogAdminComponent,{
         data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Issue Occured.." }
       }) ;
      }
      }
    }
     )
  }

  buildPayload():AddStaff{
    let countryFlag = this.form.controls['phoneCountryCode'].value ? this.form.controls['phoneCountryCode'].value : "" ;
    let retrieveCountryArray : any[] = this.phoneNumberCodes.filter(v => v.FLAG == countryFlag) ;
    let value = retrieveCountryArray[0].code ? retrieveCountryArray[0].code : "" ;
    let countryCode = value.replace('+', ''); // Removing the '+' character
    console.log("country code value =", countryCode); 

    return new AddStaff({
      "staffName":  this.form.controls['staffName'].value,
           "mobileNo": this.form.controls['phoneNo'].value,
           "mobileCountryCode" : countryCode ,
           "emailId" : this.form.controls['emailAddress'].value,
           "password" : this.form.controls['password'].value,
           "idNumber": this.form.controls['idNbr'].value, 
           "designation": this.roleDescription ,
           "roleId" : this.form.controls['roleName'].value,
           "customerType" : "S" , //Hardcoded as "S" for Backoffice (Staff) register .
           "address": {
               "addressLine1": this.form.controls['level'].value,
               "addressLine2": this.form.controls['unit'].value,
               "addressLine3": this.form.controls['buildingName'].value,
               "addressLine4": this.form.controls['streetName'].value,
               "country": this.form.controls['country'].value,
               "postalCode": this.form.controls['postalCode'].value
           }
    })
  }



onStatusSelectionChange(){
  this.selectedStatusId = this.form.controls['status'].value;
}
onUpdateStaffChanges(){
    //using roleId , map and fecth the role desc .
    let roleId = this.form.controls['roleName'].value ;
    if(this.searchRole != undefined || this.searchRole != null){
      var roleObj = this.searchRole.filter((v:any)=> v.roleId == roleId) ;
      this.roleDescription = roleObj[0].roleName ;

    }
  let staffId = this.staffId ;
  this.staffService.updateStaffApi(this.buildUpdateStaffPayload(), staffId).subscribe((data:any)=>{
    this.dialogRef.close(data) ;
  },
  //error handling 
  (error:any)=>{
    if(error.status != 401){
      if(error.error.errorMessage){
      this.dialog.open(ErrorDialogAdminComponent,{
         data :{ errorMessage : error.error.errorMessage ? error.error.errorMessage : "Issue Occured.." }
       }) ;
      }
    }
  }
  )
}

buildUpdateStaffPayload() : UpdateStaff{
 return new UpdateStaff({
  "staffName":  this.form.controls['staffName'].value,
  "mobileNo": this.form.controls['phoneNo'].value,
  "emailId" : this.form.controls['emailAddress'].value,
  "idNumber": this.form.controls['idNbr'].value, 
  "designation": this.roleDescription ,
  "status" : this.selectedStatusId,
  "roleId" : this.form.controls['roleName'].value,
  "address": {
      "addressLine1": this.form.controls['level'].value,
      "addressLine2": this.form.controls['unit'].value,
      "addressLine3": this.form.controls['buildingName'].value,
      "addressLine4": this.form.controls['streetName'].value,
      "country": this.form.controls['country'].value,
      "postalCode": this.form.controls['postalCode'].value
  }
 })
}

//this function triggers when value entered in search  country field 
filterStaffCountry(country:HTMLInputElement){
  country.value = country.value.toUpperCase() ;
  if (country.value == '') {
    // If the search input is empty, show all countries
    this.filteredCountries = this.nationality;
}
else {
    // Filter countries based on the search input
    this.filteredCountries = this.nationality.filter((v: any) => v.COUNTRY.includes(country.value));
    if(this.filteredCountries.length == 0){
      this.filteredCountries = this.nationality;
    }  
}
}

onSelectPhoneCode(flag:string){
  var array :any[] = countryCodeArray.filter(v => v.FLAG == flag) ;
 if(array.length == 1){
  this.countryCode = array[0].code ;
 }
}

}
