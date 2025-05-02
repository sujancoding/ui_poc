import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { roleIdDetails } from 'src/assets/userrole';

@Component({
  selector: 'app-vertical-header',
  templateUrl: './vertical-header.component.html',
  styleUrls: [],
})

export class VerticalAppHeaderComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  appSteps : any;
  showCorporateLinks : Boolean = false;
  showIndividualLinks : Boolean = false;
  employeeWelcomeMessage : Boolean = false;
  userName : string = this.store.getItem('USERNAME') ? this.store.getItem('USERNAME') : "";
  showLanguage : Boolean = true;
  counterTypeMessage = false ;
  counterType =  this.store.getItem('RESPONSE_COUNTER_TYPE') ? this.store.getItem('RESPONSE_COUNTER_TYPE') : "";

 counterTypeTransform(value:string){
  if (value == 'W') {
    return ' - WholeSale Counter';
  } else if (value == 'R') {
    return ' - Retail Counter';
  } else {
    return '';
  }
  }

  // This is for Notifications
  // tslint:disable-next-line - Disables all
  notifications: Object[] = [

    {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM',
    }
  ];
textPosition(){
  let role : string = this.store.getItem('USER_ROLE');
  switch(role){
    case  '111' :  //consumer
    return '';
       case '555' :  //corporate
       return '-105px';
       case '556' :  //corporate
       return '-105px';
       case '557' :  //corporate
       return '-105px';
   }
}
  ngOnInit():void{
     let role : string = this.store.getItem('USER_ROLE');
     if(role == roleIdDetails.CORPORATE_OWNER || role == roleIdDetails.CORPORATE_RUNNER || role == roleIdDetails.CORPORATE_DEALER){ //corporate - 555 - owner , 556-runner , 555-dealer
      this.showCorporateLinks = true;
      this.employeeWelcomeMessage = true;
      this.counterTypeMessage = false ;
     }
    else if(role == roleIdDetails.CONSUMER){     //consumer - 111
      this.showIndividualLinks = true;
      this.counterTypeMessage = false ;
     }
     else if(role == roleIdDetails.AGENT){   //agent - 888
      this.showIndividualLinks = false;
      this.showCorporateLinks = false;
      this.employeeWelcomeMessage = true;
      this.showLanguage = false;
      this.counterTypeMessage = false ;
     }
     else{    //backoffice
      this.showIndividualLinks = false;
      this.showCorporateLinks = false;
      this.employeeWelcomeMessage = true;
      this.showLanguage = false;
      this.counterTypeMessage = true ;
     }
     
  }

  // This is for Mymessages
  // tslint:disable-next-line - Disables all
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.png',
      status: 'online',
      from: 'APT',
      subject: 'new rate for you sepecifically',
      time: '9:30 AM',
    }
  ];

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: 'us',
    },

    {
      language: 'Chinese',
      code: 'de',
      icon: 'de',
    },
  ];

  constructor(private translate: TranslateService, private router: Router, private authService: AuthenticationService,private store: InMemoryCache) {
    translate.setDefaultLang('en');
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  bioInfo(){
    if(this.store.getItem('APPLICATIONSTATUS') == "NEW" || this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
      const  applicationId = this.store.getItem('APPLICATION_ID');
      if(applicationId != undefined){
        this.router.navigate([`/profile/personalinfo/${applicationId}`],{queryParams:{"application":applicationId}});
      }
    }
    if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') == "ACTIVE"){
      const customerId = this.store.getItem('CUSTOMER_ID');
      if(customerId != undefined){
        this.router.navigate([`/profile/personalinfo/${customerId}`],{queryParams:{"customer":customerId}});
      }
    }
    
  }
  sow(){
    if(this.store.getItem('APPLICATIONSTATUS') == "NEW" || this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
      const  applicationId = this.store.getItem('APPLICATION_ID');
      if(applicationId != undefined){
        this.router.navigate([`/profile/address/${applicationId}`],{queryParams:{"application":applicationId}});
      }
    }
    if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') == "ACTIVE"){
      const customerId = this.store.getItem('CUSTOMER_ID');
      if(customerId != undefined){
        this.router.navigate([`/profile/address/${customerId}`],{queryParams:{"customer":customerId}});
      }
    }
   
  }

  documents(){
    if(this.store.getItem('APPLICATIONSTATUS') == "NEW" || this.store.getItem('APPLICATIONSTATUS') == "PENDING"){
      const  applicationId = this.store.getItem('APPLICATION_ID');
      if(applicationId != undefined){
        this.router.navigate([`/profile/documentUpload/${applicationId}`],{queryParams:{"application":applicationId}});
      }
    }
    if(this.store.getItem('APPLICATIONSTATUS') == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') == "ACTIVE"){
      const customerId = this.store.getItem('CUSTOMER_ID');
      if(customerId != undefined){
        this.router.navigate([`/profile/documentUpload/${customerId}`],{queryParams:{"customer":customerId}});
      }
    } 
     
  }

  goToDeleteAccount(){
    this.router.navigate(['feature/delete-account']) ;
  }
  

  companyProfile(){
    const applicationStatus = this.store.getItem('APPLICATIONSTATUS');
    const  applicationId = this.store.getItem('APPLICATION_ID');
    const customerId = this.store.getItem('CUSTOMER_ID');
    if(applicationStatus == "NEW"){
    if(applicationId != undefined){
      this.router.navigate([`/profile/company-profile/${applicationId}`],{queryParams:{"application":applicationId}});
    }
  }
  if(applicationStatus == "PENDING"){
    if(applicationId != undefined){
      this.router.navigate([`/profile/company-profile/${applicationId}`],{queryParams:{"application":applicationId}});
    }
  }
  if(applicationStatus == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') =="ACTIVE"){
    if(customerId != undefined){
      this.router.navigate([`/profile/company-profile/${customerId}`],{queryParams:{"customer":customerId}});
    }
  }
  }

  companyAssociates(){
    const applicationStatus = this.store.getItem('APPLICATIONSTATUS');
    const  applicationId = this.store.getItem('APPLICATION_ID');
    const customerId = this.store.getItem('CUSTOMER_ID');
    if(applicationStatus == "NEW"){
    if(applicationId != undefined){
      this.router.navigate([`/company/company-associate/${applicationId}`],{queryParams:{"application":applicationId}});
    }
  }
  if(applicationStatus == "PENDING"){
    if(applicationId != undefined){
      this.router.navigate([`/company/company-associate/${applicationId}`],{queryParams:{"application":applicationId}});
    }
  }
  if(applicationStatus == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') =="ACTIVE"){
    if(customerId != undefined){
      this.router.navigate([`/company/company-associate/${customerId}`],{queryParams:{"customer":customerId}});
    }
  }
  }

  companyDocuments(){
    const applicationStatus = this.store.getItem('APPLICATIONSTATUS');
    const  applicationId = this.store.getItem('APPLICATION_ID');
    const customerId = this.store.getItem('CUSTOMER_ID');
    if(applicationStatus == "NEW"){
    if(applicationId != undefined){
      this.router.navigate([`/profile/corporate-documents/${applicationId}`],{queryParams:{"application":applicationId}});
    }
  }
  if(applicationStatus == "PENDING"){
    if(applicationId != undefined){
      this.router.navigate([`/profile/corporate-documents/${applicationId}`],{queryParams:{"application":applicationId}});
    }
  }
  if(applicationStatus == "APPROVED" || this.store.getItem('CUSTOMER_STATUS') =="ACTIVE"){
    if(customerId != undefined){
      this.router.navigate([`/profile/corporate-documents/${customerId}`],{queryParams:{"customer":customerId}});
    }
  }
  }
  
  logout() {
    this.authService.logout()

  }



}


   
