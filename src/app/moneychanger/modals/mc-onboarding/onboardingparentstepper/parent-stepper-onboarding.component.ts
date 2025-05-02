import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { PersonalInfoComponent } from 'src/app/onboarding/individual/basic-info/basic-info.component';
import { IdentitydocumentComponent } from 'src/app/onboarding/individual/documents/document-uploader.component';
import { AddressComponent } from 'src/app/onboarding/individual/sow/sourceofwealth.component';
import { RegistrationComponent } from '../../registration/registration.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CorporateRegistrationComponent } from '../../corporateregistration/corporate-registration.component';
import { CompanyProfileComponent } from 'src/app/onboarding/corporate/profile/company-profile.component';
import { CompanyAssociateComponent } from 'src/app/onboarding/corporate/sow/company.associate.component';
import { CompanyDocumentsComponent } from 'src/app/onboarding/corporate/documents/company-documents.component';
import { DocumentsIndividualMcComponent } from '../documentsindividual/documents-individual-mc.component';

@Component({
  selector: 'app-parent-stepper-onboarding',
  templateUrl: './parent-stepper-onboarding.component.html',
  styleUrls: ['./parent-stepper-onboarding.component.scss']
})
export class ParentStepperOnboardingComponent implements OnInit , AfterViewInit {

  //consumer onboarding variables 
  @ViewChild('appRegister') appRegister !: RegistrationComponent
  @ViewChild('indProfile') indProfile !: PersonalInfoComponent;
  @ViewChild('sourceOfWealth') sourceOfWealth !: AddressComponent;
  @ViewChild('documents') documents !: DocumentsIndividualMcComponent;
  @ViewChild('stepper') stepper!: MatStepper;
  registrationStatus : string = 'In Progress'
  profileStatus: string = 'Pending';
  sourceOfWealthStatus: string = 'Pending';
  documentStatus: string = 'Pending';
  customerType !: string ;

  //corporate onboarding variables 
  @ViewChild('appCorpRegister') appCorpRegister !: CorporateRegistrationComponent
  @ViewChild('companyProfile') companyProfile !: CompanyProfileComponent;
  @ViewChild('companyAssociates') companyAssociates !: CompanyAssociateComponent;
  @ViewChild('companyDocuments') companyDocuments !: CompanyDocumentsComponent;
  @ViewChild('corpStepper') corpStepper !: MatStepper;
  corpRegistrationStatus : string = 'In Progress'
  companyProfileStatus : string = 'Pending';
  companyAssociatesStatus : string = 'Pending';
  companyDocumentsStatus : string = 'Pending';

  showConsumerContent : boolean = false ;
  showCorporateContent : boolean = false ;
  componentIndicator !: string ;
 
  
  
  constructor(private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if(this.data.appOnboardingForMc == "I"){
      this.customerType = "Consumer" ;
       this.componentIndicator = "I" ;
       this.showConsumerContent = true;
       this.showCorporateContent = false;
    }
    else if(this.data.appOnboardingForMc == "C"){
      this.customerType = "Corporate" ;
      this.componentIndicator = "C" ;
      this.showCorporateContent = true;
      this.showConsumerContent = false;
    }
  }

   // It will trigger when change detection occur after it completes initialization of component's view and its child views
   ngAfterViewInit() {
    //consumer onboarding
    if( this.componentIndicator == "I" ){
      this.appRegister.registrationStatusChanged.subscribe((status : string) =>{
        this.registrationStatus = status ;
      })
      this.indProfile.basicProfileStatusChanged.subscribe((status: string) => {
        this.profileStatus = status;
      });
      this.sourceOfWealth.sourceOfWealthStatusChanged.subscribe((status: string) => {
        this.sourceOfWealthStatus = status;
      });
      this.documents.documentStatusChanged.subscribe((status: string) => {
        this.documentStatus = status;
      });
    }

    //corporate onboarding
    else if( this.componentIndicator == "C" ){
    this.appCorpRegister.corpRegistrationStatusChanged.subscribe((status : string) =>{
      this.corpRegistrationStatus = status ;
    });
    this.companyProfile.companyProfileStatusChanged.subscribe((status: string) => {
      this.companyProfileStatus = status;
    });
    this.companyAssociates.companyAssociatesStatusChanged.subscribe((status: string) => {
      this.companyAssociatesStatus = status;
    });
    this.companyDocuments.companyDocumentsStatusChanged.subscribe((status: string) => {
      this.companyDocumentsStatus = status;
    });
  }
  }

  //status color
  getColor(status: string) {
    switch (status) {
      case 'Submitted':
        return '#20C374'
      case 'In Progress':
        return '#123969'
      case 'Pending':
        return '#BDBDBD'
      case 'Completed':
        return '#20C374'
      case 'Active':
        return 'rgb(30 189 40)';
      case 'InActive':
        return 'red'
      default: return ''


    }
  }

  //status background-color
  getBackgroundColor(status: string) {
    switch (status) {
      case 'Submitted':
        return '#E6FBF1'
      case 'In Progress':
        return '#F6F4FD'
      case 'Pending':
        return '#FFFFFF'
      case 'Completed':
        return '#E6FBF1'
      case 'Active':
        return '#E1FCEF';
      case 'InActive':
        return '#FFEDDF'
      default: return ''

    }
  }

 //The function will trigger whenever stepper changes
 onSelectionChange(event: any) {
  // Call the respective functions in the child components based on the active step index
  console.log("stepper changes triggered I") ;
  const activeStepIndex = event.selectedIndex;
  switch (activeStepIndex) {
    case 0:
      this.appRegister.updateStatus(event); 
      break;
    case 1:
      this.indProfile.updateStatus(event); 
      break;
    case 2:
      this.sourceOfWealth.updateStatus(event);
      break;
    case 3:
      this.documents.updateStatus(event);
      break;
  }
  if(activeStepIndex == 1){
    this.indProfile.loadApplicationInquiryMcOnboarding() ;
  }
  if(activeStepIndex == 2){
    this.sourceOfWealth.loadApplicationInquiryMcOnboarding() ;
  }
 // Trigger the function in the child component associated with the "Agent Documents" step
 if (activeStepIndex == 3) {
  this.documents.callApplicationInquiryAp(); 
}

}

//The function will trigger whenever corporate stepper changes
onCorporateSelectionChange(event: any){
 // Call the respective functions in the child components based on the active step index
 console.log("stepper changes triggered C") ;
 const activeStepIndex = event.selectedIndex;
 switch (activeStepIndex) {
   case 0:
     this.appCorpRegister.updateStatus(event); 
     break;
   case 1:
     this.companyProfile.updateStatus(event); 
     break;
   case 2:
     this.companyAssociates.updateStatus(event);
     break;
   case 3:
     this.companyDocuments.updateStatus(event);
     break;
 }
 if(activeStepIndex == 1){
  this.companyProfile.loadApplicationInquiryMcOnboarding() ;
}
 if(activeStepIndex == 2){
   this.companyAssociates.loadApplicationInquiryMcOnboarding() ;
 }
 if(activeStepIndex == 3){
  this.companyDocuments.callApplicationInquiryApi("NEW");
 }
}

  
}
