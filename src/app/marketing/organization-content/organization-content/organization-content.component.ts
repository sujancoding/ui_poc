import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { aptAppleStoreLink, aptGooglePlayStoreLink } from 'src/assets/dropdownvalues';
import Swiper, { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-organization-content',
  templateUrl: './organization-content.component.html',
  styleUrls: ['./organization-content.component.scss']
})
export class OrganizationContentComponent implements OnInit , AfterViewInit , OnChanges {
  opened = false;
  logo = 'assets/images/new apt logo(cutversion).png';
  homeWallpaper = 'assets/images/background/bg-image.jpg'; 
  googlePayImage = 'assets/images/google-play.png';
  appStoreImage = 'assets/images/appstore.png';
  singaporeMoneyImage = 'assets/images/service-2.png';
  handFullMoney = 'assets/images/background/megamenubg.jpg';
  orgMapLocation = 'assets/images/apt map.png';
  baseCountryLocation : string = 'Singapore' ;
  menuWallpaper : string = 'assets/images/background/profile-bg.jpg';
  public duration = 5;
  private swiper!: Swiper;
  @ViewChild('swiperSlideShow') swiperSlideShow!: SwiperComponent;
  config: SwiperOptions = {};
  @ViewChild('aboutUs') aboutUsSection!: ElementRef;
  @ViewChild('home') homeSection!: ElementRef;
  @ViewChild('whatweoffer') whatWeOfferSection!: ElementRef;
  @ViewChild('faq') faqSection!: ElementRef;
  @ViewChild('contactUs') contactUsSection!: ElementRef;
  @ViewChild('ourMission') ourMissionSection!: ElementRef;
  @ViewChild('ourTeam') ourTeamSection!: ElementRef;
  @ViewChild('ourServices') ourServicesSection!: ElementRef;
  @ViewChild('whyChooseUs') whyChooseUsSection!: ElementRef;
  @ViewChild('compliance') complianceSection!: ElementRef;

  customCollapsedHeight: string = '100px';
  customExpandedHeight: string = '90px';
  @Input() selectionChanges!: string;
  @Input() counter !: number ;
  faqArray : any[] = [
    {
      "question":"What is Bank Draft ?" ,
     "answer":"A bank draft is a cheaper alternative to telegraphic transfer. It is a written order issued by our bankers to pay your beneficiary a specific sum of money. The time required for the bank draft to clear varies between banks."},
     {
      "question":"What is Telegraphic Transfer ?" ,
     "answer":"Telegraphic transfer is an electronic payment sent to an overseas bank, instructing them to pay your beneficiary a specific sum of money."
     },
     {
      "question":"What is Remittance ?" ,
     "answer":"Remittance is sending money to or receiving money from an overseas bank account."},
     {
      "question":"What is Beneficiary ?" ,
     "answer":"Beneficiary is the person who receives the funds."
     },
     {
      "question":"What does APT Money Change get the Exchange Rates ?" ,
     "answer":"The exchange rates are based on Reuters and the economic forces of market demand and supply."
     },
     {
      "question":"What is the Minimum / Maximum amount I can remit ?" ,
     "answer":"There are no limitations as to the sum of money you want to remit."},
     {
      "question":"What are the charges involved ?" ,
     "answer":"Our charges depend on the type of currencies transacted. Please contact us at 65 62277660 for more details."
     }
  ]
  
  constructor(private router : Router,private changeDetectorRef: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.selectionChanges);
    this.changeDetectorRef.detectChanges(); // Trigger change detection
   if(this.selectionChanges == "aboutUs"){
     this.scrollToAboutUs();
   }
   else if(this.selectionChanges == "home"){
    this.scrollToHome() ;
   }
   else if(this.selectionChanges == "offers"){
    this.scrollToOffers() ;
   }
   else if(this.selectionChanges == "faq"){
    this.scrollToFaq() ;
   }
   else if(this.selectionChanges == "contactUs"){
    this.scrollToSupport() ;
   }
   else if(this.selectionChanges == "ourMission"){
    this.scrollToOurMission();
   }
   else if(this.selectionChanges == "ourTeam"){
    this.scrollToOurTeam();
   }
   else if(this.selectionChanges == "ourServices"){
    this.scrollToOurServices();
   }
   else if(this.selectionChanges == "whyChooseUs"){
    this.scrollTowhyChooseUs();
   }
   else if(this.selectionChanges == "compliance"){
    this.scrollTocompliance();
   }
  }

  ngOnInit(): void {
   //getScreenWidth will get the windows inner width.
 this.getScreenWidth = window.innerWidth;
 this.getScreenHeight = window.innerHeight;
 console.log(this.getScreenWidth);

 }
 public getScreenWidth: any;
 public getScreenHeight!: number;
 //The HostListener is a Decorator used for listening to the DOM,
 // and It provides a handler method to run when that event occurs.
 @HostListener('window:resize', ['$event'])
 onWindowResize() {
   this.getScreenWidth = window.innerWidth;
   this.getScreenHeight = window.innerHeight;
 }

responsiveContainer(){
  return {
    'background-color': 'white',
    'height': (this.getScreenHeight - 358 ) + 'px',
    'margin': '20px',
    'border-radius': '20px'
  }
}

ngAfterViewInit(): void {
 
}






  scrollToAboutUs() {
    this.aboutUsSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    });
} 

scrollToHome() {
  this.homeSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
  });
} 

scrollToOffers() {
  this.whatWeOfferSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
  });
}

scrollToFaq() {
  this.faqSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
  });
}

scrollToSupport() {
  this.contactUsSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
  });
}
scrollToOurMission(){
  this.ourMissionSection.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
});
}
scrollToOurTeam(){
  this.ourTeamSection.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  });
}

scrollToOurServices(){
  this.ourServicesSection.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  });
}

scrollTowhyChooseUs(){
  this.whyChooseUsSection.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  });
}

scrollTocompliance(){
  this.complianceSection.nativeElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  });
}


launchPlayStore(flag:string){
if(flag == "GP"){  //Google play store
  window.open(aptGooglePlayStoreLink)
}

else if(flag == "AP"){  //Apple play store
  window.open(aptAppleStoreLink)
}
}

}

