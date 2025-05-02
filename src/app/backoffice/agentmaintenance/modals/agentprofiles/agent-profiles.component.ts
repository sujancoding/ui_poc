import { Component, EventEmitter,Input,OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { noWhitespaceValidator } from 'src/app/shared/models/phone.model';
import { countryArr } from 'src/assets/dropdownvalues';
import { AdminConfirmationDialogComponent } from '../adminconfirmationdialog/admin-confirmation-dialog.component';
import { AgentUpdate } from '../../models/agent.model';
import moment from 'moment';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';

@Component({
  selector: 'app-agent-profiles',
  templateUrl: './agent-profiles.component.html',
  styleUrls: ['./agent-profiles.component.scss']
})

  export class AgentProfilesComponent implements OnInit {
    public form: FormGroup = Object.create(null);
    nationality : any[]=countryArr ;
    tillStartDate !: Date
    tillEndDate !: Date
    showValidMessage : boolean = false;
    saveBioInfo  : boolean = true;
    formStatus !: string;
    isDisableActive : boolean = false;
    isDisableDeactive : boolean = false;
    @Output() agentProfileStatusChanged = new EventEmitter<any>();
    @Input() status !: string; 
    incDate = moment();
    validFrom = moment();
    validTill = moment();
    agentInquiry : any ;
    isScreenLoader : Boolean = false ;
    filteredCountries : any[] = countryArr ;
    filteredIncorporationCountriesArray : any[] = countryArr; // This array is used to display all the countries in Incorporation Place
    filterIssuingAuthorityCountries : any[] = countryArr; // This array is used to display all the countries in Issuing Authority Place
    agentStatus !: string;
    selectedValue !: string;
    typeOptions : any[] = [ // This is used to iterate and show these values in the type dropdown
      { label: 'Local Trading'},
      { label: 'Overseas Trading'},
      { label: 'Corresponding Account'},
    ]

    constructor(private fb: FormBuilder, public dialogRef: MatDialog,private agentMainteanceService :AgentMaintenanceService ,private store : InMemoryCache) { }
  
    ngOnInit(): void {
      this.form = this.fb.group({
        companyName: [null ,[Validators.compose([Validators.required])]],
        registrationNo: [null ,[Validators.compose([Validators.required]), Validators.pattern('^[a-zA-Z0-9 ]+$'),Validators.maxLength(20),this.removeSpaces,noWhitespaceValidator]],
        type: [null ,[Validators.compose([Validators.required])]],
        incPlace: [null ,[Validators.compose([Validators.required])]],
        issuingCountry :  [null ,[Validators.compose([Validators.required])]],
        remittanceLicense: [null ,Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z0-9 ]+"),Validators.maxLength(20),this.removeSpaces,noWhitespaceValidator])],
        incDate: [null ,Validators.compose([Validators.required]),],
        turnOver: [null ,[Validators.compose([Validators.required]), Validators.pattern('^[0-9 ]+$'),Validators.maxLength(15),this.removeSpaces,noWhitespaceValidator]],
        issuingAuthority: [null,Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9 _\\-@.,;:()/\'"]+$'),Validators.maxLength(20)])],
        validFrom: [null ,Validators.compose([Validators.required])],
        validTill: [null ,Validators.compose([Validators.required])],
        level: [null ,[Validators.compose([Validators.required,Validators.pattern('^[0-9 ]+$'),Validators.maxLength(256),this.removeSpaces,noWhitespaceValidator])]],
        unit: [null ,[Validators.compose([Validators.required, Validators.pattern('^[0-9 ]+$'),Validators.maxLength(256),this.removeSpaces,noWhitespaceValidator])]],
        buildingName: [null ,[Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*$'),Validators.maxLength(256),this.removeSpaces,this.whitespaceValidator])]],
        streetName: [null ,[Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+'),Validators.maxLength(256),this.removeSpaces,this.whitespaceValidator])]],
        country: [null ,[Validators.compose([Validators.required])]],
        postalCode : [null ,[Validators.compose([Validators.pattern('^[0-9 ]+$')])]],
        emailId : [null, [Validators.compose([Validators.required,Validators.email])]],
        phoneNo : [null, [Validators.compose([Validators.required, Validators.pattern('^[0-9 ]+$')])]],
        companyCountry :  [null,Validators.compose([Validators.pattern('[a-zA-Z .]*$')])], //newly added on 15Sep2023 , to search company country in Company Country Dropdown
        incorporationCountry : [null,Validators.compose([Validators.pattern('[a-zA-Z .]*$')])], //To search Incorporation country in Incorporation Dropdown
        issuingAuthorityCountry : [null,Validators.compose([Validators.pattern('[a-zA-Z .]*$')])] //To search IssuingAuthority country in Issuing Authority country Dropdown
      });

      this.isScreenLoader = true ;
      if(this.status == "Active"){
        this.isDisableDeactive =false;   // disable property of activate and deactive button 
        this.isDisableActive = true;
        this.agentStatus = "1";
      }
      if(this.status == "InActive"){
        this.isDisableDeactive =true;   // disable property of activate and deactive button 
        this.isDisableActive = false;
        this.agentStatus = "0";
      }
      
//agent inquiry api called and patching corresponding value to its fields .
     let agentId = this.store.getItem('AGENT_ID')
      this.agentMainteanceService.getAgentInquiry(agentId).subscribe((data:any)=>{
        this.agentInquiry = data ;
        this.isScreenLoader = false ;
        this.form.patchValue({
          companyName : this.agentInquiry.companyName ,
          registrationNo: this.agentInquiry.registrationNo ,
          phoneNo: this.agentInquiry.phoneNo,
          type: this.agentInquiry.type ,
          incPlace:  this.agentInquiry.incorporationPlace ,
          issuingCountry :  this.agentInquiry.issuingCountry , 
          remittanceLicense: this.agentInquiry.remittanceLicense ,
          incDate: this.agentInquiry.incorporationDate ,
          turnOver: this.agentInquiry.turnOver ,
          issuingAuthority: this.agentInquiry.issuingAuthority ,
          validFrom:  this.agentInquiry.validFrom ,
          validTill: this.agentInquiry.validTill ,
          level:  this.agentInquiry.address.level ,
          unit: this.agentInquiry.address.unit ,
          buildingName:  this.agentInquiry.address.buildingName ,
          streetName:  this.agentInquiry.address.street ,
          country: this.agentInquiry.address.country ,
          postalCode: this.agentInquiry.address.postalCode,
          emailId: this.agentInquiry.emailId ,
          companyCountry :  this.agentInquiry.address.country ,
        });
      },//error handling 
      (error:any)=>{
        this.isScreenLoader = false ;
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
        }
      })

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
          // if the value consists of whitespace at beginning of string , return an error object
          return { "isWhitespace": true };
        }
        // otherwise, return null (no error)
        return null;
        
      }
      phoneNumbersValidator(control: AbstractControl) {
      
        const value = control.value;
      
        if (value && value.match("^[0]+")) {
          // if the value consists of zero at beginning of string , return an error object
          return { "isStartzero": true };
        }
        const startsWithNumber = /^[0-9]/.test(value)
        if (value && startsWithNumber && value.length < 8) { // Company number start with number and the length is less than 6 , return a error object
          return { "minlength": true };
        }
        // otherwise, return null (no error)
        return null;
        
    }
    postalNumberValidator(control: AbstractControl){
      const value = control.value;
      const startsWithNum = /^[0-9]/.test(value)
      if (value && startsWithNum && value.length < 6) { // Postal code start with number and the length is less than 6 , return a error object
        console.log("The postal code value is" + value);
        
        return { "minLength": true };
        
        
      }
      // otherwise, return null (no error)
      return null;
      
    }
    noWhitespaceValidator(control: AbstractControl) {
      const isSpace = (control.value || '').match(/\s/g);
      if(!isSpace && control.value != ""){
        return isSpace ? {'whitespace': true} : null;
      }
      
      
    }

    //Update info Function
    onSave(){
      this.formStatus = "Form Submitted Sucessfully"
      this.agentProfileStatusChanged.emit('Completed');
      this.agentMainteanceService.updateProfile(this.buildPayload()).subscribe((data:any)=>{
       console.log("Agent Profile Update sucessfully");
       this.store.setItem("AGENT_FORM_SUBMITTED", "LOAD_AGENTLISTING")
      },
      //error handling 
      (error:any)=>{
        
        if(error.status != 401){
          this.dialogRef.open(ErrorDialogAdminComponent) ;
        }
      })
    }
    
   buildPayload():AgentUpdate{
    let agentId = this.store.getItem("AGENT_ID") ;
     //date format(YYYY/MM/DD)  
     this.incDate = moment(this.form.controls['incDate'].value);
     const incorporationDate = this.incDate.format('YYYY') + "-" + this.incDate.format('MM') + "-" + this.incDate.format('DD');
 
     this.validFrom = moment(this.form.controls['validFrom'].value);
     const validFromDate = this.validFrom.format('YYYY') + "-" + this.validFrom.format('MM') + "-" + this.validFrom.format('DD');
 
     this.validTill = moment(this.form.controls['validTill'].value);
     const validTillDate = this.validTill.format('YYYY') + "-" + this.validTill.format('MM') + "-" + this.validTill.format('DD');
   return new AgentUpdate({
      "agentId": agentId ,
      "companyName" : this.form.controls['companyName'].value,
      "registrationNo" : this.form.controls['registrationNo'].value ,
      "emailId" : this.form.controls['emailId'].value,
      "phoneNo" : this.form.controls['phoneNo'].value,
      "type": this.form.controls['type'].value,
      "incorporationDate": incorporationDate,
      "incorporationPlace": this.form.controls['incPlace'].value,
      "remittanceLicense": this.form.controls['remittanceLicense'].value,
      "turnOver": this.form.controls['turnOver'].value ,
      "validFrom": validFromDate,
      "validTill": validTillDate ,
      "issuingAuthority": this.form.controls['issuingAuthority'].value ,
      "issuingCountry": this.form.controls['issuingCountry'].value,
      "status": this.agentStatus,
      "address": {
          "level": this.form.controls['level'].value,
          "unit": this.form.controls['unit'].value ,
          "buildingName": this.form.controls['buildingName'].value,
          "street": this.form.controls['streetName'].value,
          "country": this.form.controls['country'].value,
          "postalCode": this.form.controls['postalCode'].value
      },
     
   })
   }
  //ValidStart Date -> whenever vaildstart date change the above function will trigger  
    public validStartDateChange(event: MatDatepickerInputEvent<any>):void{
      this.tillStartDate = event.value._d;
      if(new Date(this.tillStartDate).getTime() > new Date(this.tillEndDate).getTime()){ // The valid from Date should be greater than valid till date , the block will execute.
        console.log("Valid from date is less than valid till date");
        this.showValidMessage = true;
      }
      else{
        this.form.controls['validFrom'].setErrors(null);
        this.showValidMessage = false;
  
      }
    }

   //ValidEnd Date -> whenever vaildend date change the above function will trigger  
    public validEndDateChange(event: MatDatepickerInputEvent<any>): void {
      this.tillEndDate = event.value._d;
      this.showValidMessage = false;
  
    }

   // This function will be trigger automatically  based on the stepper changes in the parent component
   updateStatus(event: any) {
    

    // Listen for changes whenever the formcontrol value changes on the entire form
   if(this.form.touched == true &&   this.formStatus == "Form Submitted Sucessfully"
   ){
    this.form.valueChanges.subscribe(() => { 
      this.agentProfileStatusChanged.emit(this.form.valid ? 'Completed' : 'In Progress');  // Emit an stepper status to the parent-stepper component
    });
   }
   else{
    this.agentProfileStatusChanged.emit('In Progress');
  }
 
  }
  openDeactivated(){
    this.dialogRef.open(AdminConfirmationDialogComponent,{ 
    data: { activeAgent : true, agentData :  this.buildPayload()}
  })
  }
  openActivated(){
    this.dialogRef.open(AdminConfirmationDialogComponent,{ 
    data: { dectiveAgent : true , agentData : this.buildPayload()}
  })
  }

   //this function triggers when value entered in search country field 
   filterCountry(country:HTMLInputElement){
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

  //this function triggers when value entered in Search Incorporation country field
  filterIncorporationCountry(country:HTMLInputElement){
    country.value = country.value.toUpperCase() ;
    if (country.value == '') {
      // If the search input is empty, show all countries
      this.filteredIncorporationCountriesArray = this.nationality;
  }
  else {
      // Filter countries based on the search input
      this.filteredIncorporationCountriesArray = this.nationality.filter((v: any) => v.COUNTRY.includes(country.value));
      if(this.filteredIncorporationCountriesArray.length == 0){
        this.filteredIncorporationCountriesArray = this.nationality;
      }  
  }
  }

 //this function triggers when value entered in Search IssuingAuthority country field
  filterIssuingAuthorityCountry(country:HTMLInputElement){
    country.value = country.value.toUpperCase() ;
    if (country.value == '') {
      // If the search input is empty, show all countries
      this.filterIssuingAuthorityCountries = this.nationality;
  }
  else {
      // Filter countries based on the search input
      this.filterIssuingAuthorityCountries = this.nationality.filter((v: any) => v.COUNTRY.includes(country.value));
      if(this.filterIssuingAuthorityCountries.length == 0){
        this.filterIssuingAuthorityCountries = this.nationality;
      }  
  }
  }

  }