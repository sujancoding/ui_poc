import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import SwiperCore , {Navigation , Pagination , Scrollbar , A11y, Swiper, SwiperOptions} from 'swiper' ;
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Navigation , Pagination , Scrollbar , A11y]) ;

@Component({
  selector: 'app-organization-marketing',
  templateUrl: './organization-marketing.component.html',
  styleUrls: ['./organization-marketing.component.scss']
})
export class OrganizationMarketingComponent implements OnInit , AfterViewInit {
  opened = false;
  logo = 'assets/images/logo1.jpg';
  homeWallpaper = 'assets/images/background/bg-image.jpg'; 
  googlePayImage = 'assets/images/google-play.png';
  singaporeMoneyImage = 'assets/images/service-2.png';
  handFullMoney = 'assets/images/background/megamenubg.jpg';
  orgMapLocation = 'assets/images/apt map.png';
  baseCountryLocation : string = 'Singapore' ;
  menuWallpaper : string = 'assets/images/background/profile-bg.jpg';
  public duration = 5;
  private swiper!: Swiper;
  @ViewChild('swiperSlideShow') swiperSlideShow!: SwiperComponent;
  config: SwiperOptions = {};
  customCollapsedHeight: string = '100px';
  customExpandedHeight: string = '90px';
  selectionChanges !: string ;
  counter = 0;
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

  showShortCutMenu = false;
  ShortCutLinksArray = [
    { displayLink : "Home" , toolTipMessage: "Go to Home"},
    { displayLink : "About us" , toolTipMessage: "Go to About us"},
    { displayLink : "Our Mission" , toolTipMessage: "Go to Our Mission"},
    {  displayLink : "What We Offer" , toolTipMessage: "Go to What We Offer"},
    { displayLink : "Our Team" , toolTipMessage: "Go to Our Team"},
    { displayLink : "Our Services" , toolTipMessage: "Go to Our Services"},
    { displayLink : "Why Choose Us" , toolTipMessage: "Go to Why Choose Us"},
    { displayLink : "Compliance" , toolTipMessage: "Go to Compliance"},
    { displayLink : "FAQ" , toolTipMessage: "Go to FAQ"},
    { displayLink : "Contact Us" , toolTipMessage: "Go to Contact Us"},
  ]
  constructor(private router : Router) { }

  ngOnInit(): void {
   //getScreenWidth will get the windows inner width.
 this.getScreenWidth = window.innerWidth;
 this.getScreenHeight = window.innerHeight;
 console.log(this.getScreenWidth);
if(this.getScreenWidth<=1965){ //desktop
  this.showShortCutMenu=true;
}
if(this.getScreenWidth<=920){ //mobile
  this.showShortCutMenu=false;
}


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




  navigateLoginScreen(customerType : string){
    if(customerType == "I"){
      this.router.navigate(['authentication/login']);
    }
    else if (customerType == "B"){
      this.router.navigate(['authentication/login-branchuser']);
    }
    else if (customerType == "A"){
      this.router.navigate(['authentication/login-agent']);
    }
    else if(customerType == "C"){
      this.router.navigate(['authentication/login-business']) ;
    }
  }


  scrollToAboutUs() {
   this.selectionChanges = "aboutUs" ;
   this.counter ++ ;
} 

scrollToHome() {
  this.selectionChanges = "home";
  this.counter ++ ;
} 

scrollToOffers() {
  this.selectionChanges = "offers";
  this.counter ++ ;
}

scrollToFaq() {
  this.selectionChanges = "faq";
  this.counter ++ ;
}

scrollToSupport() {
  this.selectionChanges = "contactUs";
  this.counter ++ ;
}

scrollToOurMission(){
  this.selectionChanges = "ourMission";
  this.counter ++ ;
}
scrollToOurTeam(){
  this.selectionChanges = "ourTeam";
  this.counter ++ ;
}

scrollToOurServices(){
  this.selectionChanges = "ourServices";
  this.counter ++ ;
}

scrollTowhyChooseUs(){
  this.selectionChanges = "whyChooseUs";
  this.counter ++ ;
}

scrollTocompliance(){
  this.selectionChanges = "compliance";
  this.counter ++ ;
}

@HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenWidth();
  }

checkScreenWidth() {
  const screenWidth = window.innerWidth;
  this.showShortCutMenu = screenWidth <= 1965;
  if(screenWidth<=920){
    this.showShortCutMenu=false;
  }
}

openShortCutLink(displayLink:string){
  if(displayLink == "About us"){
    this.scrollToAboutUs() ;
  }
  else if(displayLink == "Home"){
    this.scrollToHome();

  }
  else if(displayLink == "Our Mission"){
    this.scrollToOurMission();

  }
  else if(displayLink == "What We Offer"){
    this.scrollToOffers();

  }
  else if(displayLink == "Our Team"){
    this.scrollToOurTeam();
  }
  else if(displayLink == "Our Services"){
    this.scrollToOurServices();
  }
  else if(displayLink == "Why Choose Us"){
    this.scrollTowhyChooseUs();
  }
  else if(displayLink == "Compliance"){
    this.scrollTocompliance();
  }
  else if(displayLink == "FAQ"){
    this.scrollToFaq();
  }
  else if(displayLink == "Contact Us"){
    this.scrollToSupport();
  }
}
}
