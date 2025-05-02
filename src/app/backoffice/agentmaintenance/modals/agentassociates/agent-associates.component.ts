import {  Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { noWhitespaceValidator } from 'src/app/shared/models/phone.model';
import { AgentUpdate , Associate } from '../../models/agent.model';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import moment from 'moment';
import { AgentMaintenanceService } from 'src/app/core/services/agentmaintenance.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogAdminComponent } from 'src/app/backoffice/shared/modals/errordialogadmin/error-dialog-admin.component';
import { nationalityArray } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-agent-associates',
  templateUrl: './agent-associates.component.html',
  styleUrls: ['./agent-associates.component.scss']
})
export class AgentAssociatesComponent implements OnInit {
  
  loader : boolean = false;
  public form: FormGroup = Object.create(null);
  public data: string = 'Agent Associates';
  maxDate = new Date(2005, 0, 1); // To allow 18+ age to do remittance
  saveAssociates : boolean = true;
  @Output() agentAssoicatesStatusChanged = new EventEmitter<string>();
  formStatus !: string;

   // Define FormArrays for dynamic sections
   ownerGroups!: FormArray;
   dealerGroups !: FormArray;
   runnerGroups !: FormArray;
   public ownerMainGroup :  FormGroup = Object.create(null);
   public dealerMainGroup : FormGroup = Object.create(null);
   public runnerMainGroup : FormGroup = Object.create(null);
   dealerDobDate = moment();
   ownerDobDate = moment();
   runnerDobDate = moment();
   associateId !: string;
   agentInquiry : any ;
  //  ownerAssociateId : any ;
  //  dealerAssociateId : any ;
  //  runnerAssociateId : any ;
   ownerDetails : any ;
   dealerDetails : any ;
   runnerDetails : any ;
   isScreenLoader = false ;
   

   nationalityArray : any[] = nationalityArray ;

   filteredMainOwnerNationalities : any[] = nationalityArray ;
   filteredMainDealerNationalities : any[] = nationalityArray ;
   filteredMainRunnerNationalities : any[] = nationalityArray ;
  

  constructor(private fb :FormBuilder,private agentMainteanceService: AgentMaintenanceService,private store : InMemoryCache,private dialog : MatDialog){}

  ngOnInit(){
    this.isScreenLoader = true ;
      // Initialize ownerGroups,runnerGroups,dealerGroups as an empty FormArray which will dynamic formgroups
    this.ownerGroups = this.fb.array([]);
    this.dealerGroups = this.fb.array([]);
    this.runnerGroups = this.fb.array([]); 

    //static fields ownerMainGroup , dealerMainGroup and runnerMainGroup
    this.ownerMainGroup = this.fb.group({
      fullName: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
      nric: [null ,[Validators.compose([Validators.required])]],
      dob: [null ,Validators.compose([Validators.required])],
      gender: [null ,Validators.compose([Validators.required])],
      email: [null ,[Validators.required,CustomValidators.email]],
      phoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
      nationality: [null ,[Validators.compose([Validators.required])]],
      associateId : [null],
    }),
    this.dealerMainGroup = this.fb.group({
        dealerFullname: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
        dealerNric: [null ,[Validators.compose([Validators.required])]],
        dealerDob: [null ,Validators.compose([Validators.required])],
        dealerGender: [null ,Validators.compose([Validators.required])],
        dealerEmail: [null ,[Validators.required,CustomValidators.email]],
        dealerPhoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
        dealerNationality: [null ,[Validators.compose([Validators.required])]],
        associateId : [null]
    }),
    this.runnerMainGroup = this.fb.group({
        runnerFullname: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
        runnerNric: [null ,[Validators.compose([Validators.required])]],
        runnerDob: [null ,Validators.compose([Validators.required])],
        runnerGender: [null ,Validators.compose([Validators.required])],
        runnerEmail: [null ,[Validators.required,CustomValidators.email]],
        runnerPhoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
        runnerNationality: [null ,[Validators.compose([Validators.required])]],
        associateId : [null]
    });
  // this.getAgentInquiry();
}
loadAgentInquiry(){
  this.getAgentInquiry();
}
getAgentInquiry(){
  //Agent Inquiry API call triggered onload .
  let agentId = this.store.getItem('AGENT_ID')
  this.agentMainteanceService.getAgentInquiry(agentId).subscribe((data:any)=>{
    this.agentInquiry = data ;
    this.isScreenLoader = false ;
    //to execute only when associate array is not null .
    if(data.associate != null){
     // this.ownerAssociateId = this.agentInquiry.associate.owner[0].associateId ; //taking associateId from first object of owner and will map this id when update agent api is called 2nd time
     // this.runnerAssociateId = this.agentInquiry.associate.runner[0].associateId ; //taking associateId from first object of runner and will map this id when update agent api is called 2nd time
     // this.dealerAssociateId = this.agentInquiry.associate.dealer[0].associateId ; //taking associateId from first object of dealer and will map this id when update agent api is called 2nd time

      this.ownerDetails = this.agentInquiry.associate.owner ? this.agentInquiry.associate.owner : [] ; //storing owner --> array of objects in ownerDetails variable 
      this.runnerDetails = this.agentInquiry.associate.runner ? this.agentInquiry.associate.runner : [] ; //storing runner --> array of objects in runnerDetails variable
      this.dealerDetails = this.agentInquiry.associate.dealer ? this.agentInquiry.associate.dealer : [] ; //storing dealer --> array of objects in dealerDetails variable
      //Always , we patch first object of every node --> "owner" , "runner" and "dealer" Main Form Groups . 
      if(this.ownerDetails.length != 0 ){
      this.ownerMainGroup.patchValue({
          fullName: this.ownerDetails[0].name ,
          nric:  this.ownerDetails[0].idNbr ,
          dob:  this.ownerDetails[0].dob ,
          gender:  this.ownerDetails[0].gender ,
          email: this.ownerDetails[0].emailID ,
          phoneNumber: this.ownerDetails[0].phoneNo ,
          nationality:  this.ownerDetails[0].nationality ,
          associateId : this.ownerDetails[0].associateId
      });
    }

    if(this.runnerDetails.length != 0 ){
      this.runnerMainGroup.patchValue({
        runnerFullname: this.runnerDetails[0].name ,
        runnerNric:  this.runnerDetails[0].idNbr ,
        runnerDob:  this.runnerDetails[0].dob ,
        runnerGender:  this.runnerDetails[0].gender ,
        runnerEmail: this.runnerDetails[0].emailID ,
        runnerPhoneNumber: this.runnerDetails[0].phoneNo ,
        runnerNationality:  this.runnerDetails[0].nationality ,
        associateId : this.runnerDetails[0].associateId
    });
  }

  if(this.dealerDetails.length != 0 ){
    this.dealerMainGroup.patchValue({
      dealerFullname: this.dealerDetails[0].name ,
      dealerNric:  this.dealerDetails[0].idNbr ,
      dealerDob:  this.dealerDetails[0].dob ,
      dealerGender:  this.dealerDetails[0].gender ,
      dealerEmail: this.dealerDetails[0].emailID ,
      dealerPhoneNumber: this.dealerDetails[0].phoneNo ,
      dealerNationality:  this.dealerDetails[0].nationality ,
      associateId : this.dealerDetails[0].associateId
  });
}

      //when we have more than or equal to two objects inside "owner" node , we first add owner dynamic fields and then patch 
       if(this.ownerDetails.length >= 2){
          this.addOwner('additional_owners') ;  
        }

        //when we have more than or equal to two objects inside "runner" node , we first add runner dynamic fields and then patch 
       if(this.runnerDetails.length >= 2){
        this.addRunner('additional_runners') ;  
      }

      //when we have more than or equal to two objects inside "dealer" node , we first add dealer dynamic fields and then patch 
      if(this.dealerDetails.length >= 2){
        this.addDealer('additional_dealers') ;  
      }

      

    }
   
    
  },
  (error:any)=>{
    this.isScreenLoader = false ;
    if(error.status != 401){
      this.dialog.open(ErrorDialogAdminComponent) ;
    }
  })
}

arr :any[] =  [];

// Methods to add owner dynamic fields in ownerGroups
addOwner(value : string) {
  if(value == "single_owner"){
// Create a new FormGroup for an owner
const ownerFormGroup = this.fb.group({
  fullName: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
  nric: [null ,[Validators.compose([Validators.required])]],
  dob: [null ,Validators.compose([Validators.required])],
  gender: [null ,Validators.compose([Validators.required])],
  email: [null ,[Validators.required,CustomValidators.email]],
  phoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
  nationality: [null ,[Validators.compose([Validators.required])]],
  associateId : [null]
});
// Add the new owner FormGroup to the ownerGroups FormArray
this.ownerGroups.push(ownerFormGroup);
  }
  //we patching datas of additional owners in this dynamic fields .
  if(value == "additional_owners"){
    this.ownerGroups.clear();
    let owners = this.ownerDetails;
    // Remove the first owner object from the array because first object will be patched in static fields .
    
   owners.shift();
   owners.forEach((owner:any) => {
      const ownerFormGroup = this.fb.group({
        fullName: [owner.name, [Validators.required, Validators.pattern('[a-zA-Z .]*$'), Validators.maxLength(50)]],
        nric: [owner.idNbr, [Validators.required]],
        dob: [owner.dob, [Validators.required]],
        gender: [owner.gender, [Validators.required]],
        email: [owner.emailID, [Validators.required,CustomValidators.email]],
        phoneNumber: [owner.phoneNo, [Validators.required, Validators.pattern("[0-9 ]*$")]],
        nationality: [owner.nationality, [Validators.required]],
        associateId : [owner.associateId]
      });
  
      this.ownerGroups.push(ownerFormGroup);
    });
  }
}
//method to remove section
removeOwner(index: number) {
  this.ownerGroups.removeAt(index);
}

addDealer(value : string){
  if(value == "single_dealer"){
  const dealerFormGroup = this.fb.group({
    dealerFullname: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
    dealerNric: [null ,[Validators.compose([Validators.required])]],
    dealerDob: [null ,Validators.compose([Validators.required])],
    dealerGender: [null ,Validators.compose([Validators.required])],
    dealerEmail: [null ,[Validators.required,CustomValidators.email]],
    dealerPhoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
    dealerNationality: [null ,[Validators.compose([Validators.required])]],
    associateId : [null]
  });

  this.dealerGroups.push(dealerFormGroup);
}

 //we patching datas of additional dealers in this dynamic fields .
 if(value == "additional_dealers"){
  this.dealerGroups.clear();
  const dealers = this.dealerDetails;
  // Remove the first owner object from the array because first object will be patched in static fields .
  dealers.shift();
  dealers.forEach((dealer:any) => {
    const dealerFormGroup = this.fb.group({
      dealerFullname: [dealer.name, [Validators.required, Validators.pattern('[a-zA-Z .]*$'), Validators.maxLength(50)]],
      dealerNric: [dealer.idNbr, [Validators.required]],
      dealerDob: [dealer.dob, [Validators.required]],
      dealerGender: [dealer.gender, [Validators.required]],
      dealerEmail: [dealer.emailID, [Validators.required,CustomValidators.email]],
      dealerPhoneNumber: [dealer.phoneNo, [Validators.required, Validators.pattern("[0-9 ]*$")]],
      dealerNationality: [dealer.nationality, [Validators.required]],
      associateId : [dealer.associateId]
    });

    this.dealerGroups.push(dealerFormGroup);
  });
}

}


removeDealer(index:number){
  this.dealerGroups.removeAt(index)
}

addRunner(value : string){
  if(value == "single_runner"){
  const runnerFormGroup = this.fb.group({
    runnerFullname: [null ,[Validators.compose([Validators.required,Validators.pattern('[a-zA-Z .]*$'),Validators.maxLength(50),this.removeSpaces,this.whitespaceValidator])]],
    runnerNric: [null ,[Validators.compose([Validators.required])]],
    runnerDob: [null ,Validators.compose([Validators.required])],
    runnerGender: [null ,Validators.compose([Validators.required])],
    runnerEmail: [null ,[Validators.required,CustomValidators.email]],
    runnerPhoneNumber: [null ,[Validators.compose([Validators.required,Validators.pattern("[0-9 ]*$"),this.removeSpaces,noWhitespaceValidator])]],
    runnerNationality: [null ,[Validators.compose([Validators.required])]],
    associateId : [null]
  });
  this.runnerGroups.push(runnerFormGroup)
}
//we patching datas of additional dealers in this dynamic fields .
if(value == "additional_runners"){
  this.runnerGroups.clear();
  const runners = this.runnerDetails;
  // Remove the first owner object from the array because first object will be patched in static fields .
  runners.shift();
  runners.forEach((runner:any) => {
    const runnerFormGroup = this.fb.group({
      runnerFullname: [runner.name, [Validators.required, Validators.pattern('[a-zA-Z .]*$'), Validators.maxLength(50)]],
      runnerNric: [runner.idNbr, [Validators.required]],
      runnerDob: [runner.dob, [Validators.required]],
      runnerGender: [runner.gender, [Validators.required]],
      runnerEmail: [runner.emailID, [Validators.required,CustomValidators.email]],
      runnerPhoneNumber: [runner.phoneNo, [Validators.required, Validators.pattern("[0-9 ]*$")]],
      runnerNationality: [runner.nationality, [Validators.required]],
      associateId : [runner.associateId]
    });

    this.runnerGroups.push(runnerFormGroup);
  });
}

}
removeRunner(index:number){
  this.runnerGroups.removeAt(index)
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
// nricIdValidator(control: AbstractControl) {
//     const pattern = /^[SFTG]\d{7}[A-Z]$/;
//     const isValid = pattern.test(control.value);
//     if (!isValid && control.value != "") { // To validate NRIC id pattern
     
//       return { 'validNRIC': true };
//     }
    
//     return null;
// }


//update info function
onSave(){
  
  this.agentMainteanceService.updateAssoicates(this.buildPayload()).subscribe((data:any)=>{
    this.formStatus = "Form Submitted Sucessfully"
    this.agentAssoicatesStatusChanged.emit('Completed');
this.associateId = data.associateId;
this.store.setItem("ASSOCIATE_ID",this.associateId)

  },
      //error handling 
      (error:any)=>{
        if(error.status != 401){
          this.dialog.open(ErrorDialogAdminComponent) ;
        }
      })
}


buildPayload():AgentUpdate{
 let agentId= this.store.getItem("AGENT_ID");
return new AgentUpdate ({
  "agentId": agentId ,
      "associate": this.buildAssociatesPayload(),
})
}
 // This function will be called automatically whenever the stepper changes in the parent component
 updateStatus(event : any) {

  // Listen for changes whenever the formcontrol value changes on the entire form
   if(this.form.touched == true && this.formStatus == "Form Submitted Sucessfully")
   {
    this.form.valueChanges.subscribe(() => { 
      this.agentAssoicatesStatusChanged.emit(this.form.valid ? 'Completed' : 'In Progress');  // Emit an stepper status to the parent-stepper component
    });
   }
   else{
    this.agentAssoicatesStatusChanged.emit('In Progress');
  }
}

buildAssociatesPayload(): Associate[]{
  //dob format YYYY-MM-DD Owner
  let ownerDob = "" ;  
  let dealerDob = "" ;
  let runnerDob = "" ;
if( this.ownerMainGroup.controls['dob'].value != null){
  this.ownerDobDate = moment(this.ownerMainGroup.controls['dob'].value);
    ownerDob = this.ownerDobDate.format("YYYY") + "-" + this.ownerDobDate.format("MM") + "-" +  this.ownerDobDate.format("DD");
}  
//dob format YYYY-MM-DD Dealer
if(this.dealerMainGroup.controls['dealerDob'].value != null){
  this.dealerDobDate = moment(this.dealerMainGroup.controls['dealerDob'].value);
  dealerDob = this.dealerDobDate.format("YYYY") + "-" + this.dealerDobDate.format("MM") + "-" +  this.dealerDobDate.format("DD"); 
}
//dob format YYYY-MM-DD Runner
if(this.runnerMainGroup.controls['runnerDob'].value != null){
this.runnerDobDate = moment(this.runnerMainGroup.controls['runnerDob'].value);
 runnerDob = this.runnerDobDate.format("YYYY") + "-" + this.runnerDobDate.format("MM") + "-" +  this.runnerDobDate.format("DD"); 
}
let associates: Associate[] = [];
//object push for Owner Main Group
 associates.push(new Associate({
  "associateId" : this.ownerMainGroup.controls['associateId'].value ? this.ownerMainGroup.controls['associateId'].value : null ,
  "name" : this.ownerMainGroup.controls['fullName'].value ,
  "jobTitle" : "OWNER" ,
  "dob" : ownerDob ,
  "gender" : this.ownerMainGroup.controls['gender'].value ,
  "idNumber" :this.ownerMainGroup.controls['nric'].value  ,
  "nationality" :this.ownerMainGroup.controls['nationality'].value  ,
  "emailId" :this.ownerMainGroup.controls['email'].value  ,
  "phoneNo" :this.ownerMainGroup.controls['phoneNumber'].value  
 }));

 //object push for Dealer Main Group
 associates.push(new Associate({
  "associateId" : this.dealerMainGroup.controls['associateId'].value ? this.dealerMainGroup.controls['associateId'].value : null ,
  "name" : this.dealerMainGroup.controls['dealerFullname'].value ,
  "jobTitle" : "DEALER" ,
  "dob" : dealerDob ,
  "gender" : this.dealerMainGroup.controls['dealerGender'].value ,
  "idNumber" :this.dealerMainGroup.controls['dealerNric'].value  ,
  "nationality" :this.dealerMainGroup.controls['dealerNationality'].value  ,
  "emailId" :this.dealerMainGroup.controls['dealerEmail'].value  ,
  "phoneNo" :this.dealerMainGroup.controls['dealerPhoneNumber'].value 
 }));

  //object push for Runner Main Group
 associates.push(new Associate({
  "associateId" : this.runnerMainGroup.controls['associateId'].value ? this.runnerMainGroup.controls['associateId'].value : null ,
  "name" : this.runnerMainGroup.controls['runnerFullname'].value ,
  "jobTitle" : "RUNNER" ,
  "dob" : runnerDob ,
  "gender" : this.runnerMainGroup.controls['runnerGender'].value ,
  "idNumber" :this.runnerMainGroup.controls['runnerNric'].value  ,
  "nationality" :this.runnerMainGroup.controls['runnerNationality'].value  ,
  "emailId" :this.runnerMainGroup.controls['runnerEmail'].value  ,
  "phoneNo" :this.runnerMainGroup.controls['runnerPhoneNumber'].value 
 }));

// to add associate objects for multiple owner
var ownerArray : any = this.ownerGroups.value; 

for (var i = 0; i < ownerArray.length; i++) { // loop will itereate corresponding multiple owner
  var ownerValue = ownerArray[i];
  let ownerDobDate = moment(ownerValue.dob);
  const dobOwner = ownerDobDate.format("YYYY") + "-" + ownerDobDate.format("MM") + "-" +  ownerDobDate.format("DD");
  var addOwner = new Associate({
    "associateId": ownerValue.associateId ? ownerValue.associateId : null,
    "name": ownerValue.fullName,
    "jobTitle": "OWNER",
    "dob": dobOwner,
    "gender": ownerValue.gender,
    "idNumber": ownerValue.nric,
    "nationality": ownerValue.nationality,
    "emailId": ownerValue.email,
    "phoneNo": ownerValue.phoneNumber
  });

  associates.push(addOwner);
}

// to add associate objects for multiple dealer
var dealerArray : any = this.dealerGroups.value;
for (var i = 0; i < dealerArray.length; i++) {  // loop will itereate corresponding multiple dealer
  var dealerValue = dealerArray[i];
  let dealerDobDate = moment(dealerValue.dealerDob);
  const dobDealer = dealerDobDate.format("YYYY") + "-" + dealerDobDate.format("MM") + "-" +  dealerDobDate.format("DD");
  var addDealer= new Associate({
    "associateId": dealerValue.associateId ? dealerValue.associateId : null,
    "name": dealerValue.dealerFullname,
    "jobTitle": "DEALER",
    "dob": dobDealer,
    "gender": dealerValue.dealerGender,
    "idNumber": dealerValue.dealerNric,
    "nationality": dealerValue.dealerNationality,
    "emailId": dealerValue.dealerEmail,
    "phoneNo": dealerValue.dealerPhoneNumber
  });
  associates.push(addDealer);
}

// to add associate objects for multiple runner
var runnerArray : any = this.runnerGroups.value;
for (var i = 0; i < runnerArray.length; i++) { // loop will itereate corresponding multiple runner
  var runnerValue = runnerArray[i];
  let runnerDobDate = moment(runnerValue.runnerDob);
  const dobRunner = runnerDobDate.format("YYYY") + "-" + runnerDobDate.format("MM") + "-" +  runnerDobDate.format("DD");
  var addRunner = new Associate({
    "associateId": runnerValue.associateId ? runnerValue.associateId : null,
    "name": runnerValue.runnerFullname,
    "jobTitle": "RUNNER",
    "dob": dobRunner,
    "gender": runnerValue.runnerGender,
    "idNumber": runnerValue.runnerNric,
    "nationality": runnerValue.runnerNationality,
    "emailId": runnerValue.runnerEmail,
    "phoneNo": runnerValue.runnerPhoneNumber
  });
  associates.push(addRunner);
}
// Filter out objects with empty values
associates = associates.filter((associate) => {
  return (
    associate.name.trim() !== "" &&
    associate.dob !== "Invalid date-Invalid date-Invalid date" &&
    associate.gender.trim() !== "" &&
    associate.idNumber.trim() !== "" &&
    associate.nationality.trim() !== "" &&
    associate.emailId.trim() !== "" &&
    associate.phoneNo.trim() !== ""
  );
});
 return associates;
}

//this function triggers when value entered in main owner nationality field 
filterMainOwnerNationality(nationality:HTMLInputElement){
  nationality.value = nationality.value.toUpperCase() ;
  if (nationality.value == '') {
    // If the search input is empty, show all nationalities
    this.filteredMainOwnerNationalities = this.nationalityArray;
}
else {
    // Filter nationality based on the search input
    this.filteredMainOwnerNationalities = this.nationalityArray.filter((v: any) => v.NATIONALITY.includes(nationality.value));
    if(this.filteredMainOwnerNationalities.length == 0){
      this.filteredMainOwnerNationalities = this.nationalityArray;
    }  
}
}

//this function triggers when value entered in main dealer nationality field 
filterMainDealerNationality(nationality:HTMLInputElement){
  nationality.value = nationality.value.toUpperCase() ;
  if (nationality.value == '') {
    // If the search input is empty, show all nationalities
    this.filteredMainDealerNationalities = this.nationalityArray;
}
else {
    // Filter nationality based on the search input
    this.filteredMainDealerNationalities = this.nationalityArray.filter((v: any) => v.NATIONALITY.includes(nationality.value));
    if(this.filteredMainDealerNationalities.length == 0){
      this.filteredMainDealerNationalities = this.nationalityArray;
    }  
}
}

//this function triggers when value entered in main runner nationality field 
filterMainRunnerNationality(nationality:HTMLInputElement){
  nationality.value = nationality.value.toUpperCase() ;
  if (nationality.value == '') {
    // If the search input is empty, show all nationalities
    this.filteredMainRunnerNationalities = this.nationalityArray;
}
else {
    // Filter nationality based on the search input
    this.filteredMainRunnerNationalities = this.nationalityArray.filter((v: any) => v.NATIONALITY.includes(nationality.value));
    if(this.filteredMainRunnerNationalities.length == 0){
      this.filteredMainRunnerNationalities = this.nationalityArray;
    }  
}
}



}