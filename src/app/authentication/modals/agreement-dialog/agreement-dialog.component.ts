import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-agreement-dialog',
  templateUrl: './agreement-dialog.component.html',
  styleUrls: ['./agreement-dialog.component.scss']
})
export class AgreementDialogComponent implements OnInit {

  @ViewChild('linksToOtherRes') linksToOtherRes!: ElementRef;
  @ViewChild('accountsAndMembership') accountsAndMembership !: ElementRef;
  @ViewChild('changesAndAmendments') changesAndAmendments !: ElementRef;
  @ViewChild('acceptanceOfTheseTerms') acceptanceOfTheseTerms !: ElementRef;
  @ViewChild('contactingUs') contactingUs !: ElementRef;
  
  constructor() { }

  ngOnInit(): void {
  }

  
  scrollToContent(section:string) {
    if(section == "1"){   //Link scroll to "Accounts and membership" section .
    this.accountsAndMembership.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    });
  }
  else if(section == "2"){ //Link scroll to "Link to Other Resource" section .
    this.linksToOtherRes.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    });
  }
  else if(section == "3"){ //Link scroll to "Changes and Amendments" section .
    this.changesAndAmendments.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    });
  }
  else if(section == "4"){ //Link scroll to "Acceptance of these terms" section .
    this.acceptanceOfTheseTerms.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    });
  }
  else if(section == "5"){ //Link scroll to "Contacting us" section .
    this.contactingUs.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    });
  }
} 


}
