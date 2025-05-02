import { Component, OnInit } from '@angular/core';
import { organisation } from 'src/assets/dropdownvalues';

@Component({
  selector: 'app-privacy-policy-content',
  templateUrl: './privacy-policy-content.component.html',
  styleUrls: ['./privacy-policy-content.component.scss']
})
export class PrivacyPolicyContentComponent implements OnInit {

  orgName : string = organisation ;
  policyContent : any[] = [
    {
      "heading" : "1. Privacy Policy Coverage" , 
      "value" : "We respect and maintain your right to privacy, with the highest regards. The intent of this privacy policy is to detail the information Arcade Plaza Traders Pte Ltd may gather about the users of this web site, how that information is used, and the company’s disclosure practices."
    },
    {
      "heading" : "2. Links",
      "value" : "This web site may contain links to third party sites. Please be aware that we are not responsible for the privacy practices of other such sites. We do not endorse or make and representations about third-party websites. The personal data you choose to give to third-party sites is not covered by Arcade Plaza Traders Pte Ltd privacy policy. We encourage our users to be aware when they leave our site and to read the privacy policies of each and every web site that collects personal and identifiable information. This privacy statement applies solely to information collected on this web site."
    },
    {
      "heading" : "3. Logs and Cookies",
      "value" : "Our web server log files record non-specific user information of a generic nature in an aggregated-only form. Such information is for internal review and is then discarded, used to improve the content of our web site, or used to customize the content and/or layout of our site for a category of user. We do not share such information with other third parties. A cookie is a piece of data stored on the user’s computer tied to information about the user visit and may be used if a visitor’s browser is set to enable cookie usage. Usage of a cookie is in no way linked to any personally identifiable information while on our site. We may use both session ID cookies and persistent cookies to enable a more complete browsing experience for our users."
    },
    {
      "heading" : "4. Email",
      "value" : "We collect the email addresses of those who communicate with us via e-mail, or who submit information by filling web-based forms. Such information is used to provide service to those people and may be used by us to contact consumers for marketing or customer relationship purposes. If you do not wish to receive email from us in the future, please let us know by sending an email to us or calling us at the contact numbers listed in the Contact Us section of this web site, and telling us that you do not wish to receive email from our company."
    },
    {
      "heading" : "5. Business Transitions",
      "value" : "In the event that our company goes through a business transition, such as a merger, being acquired by another company or selling a portion of its assets, users’ personal information, if any, will, in most instances, be part of the assets transferred."
    },
    {
      "heading" : "6. Personal Information",
      "value" : "Any information that is associated with your name or personal identity, Arcade Plaza Traders Pte Ltd will not sell, rent or lease your personal information to others. WE use personal information to understand your needs better and to provide you with better service. You can be assured that your personal information will be used only to support your customer relationship with Arcade Plaza Traders Pte Ltd."
    },
    {
      "heading" : "7. Accuracy",
      "value" : "Arcade Plaza Traders Pte Ltd strives to keep your personal information accurate. We have implemented technology, management processes and policies to maintain customer data accuracy. To protect your privacy and identity, we will also take reasonable steps to verify your identity, such as a username and password, before granting access to your data."
    },
    {
      "heading" : "8. Notification of Changes",
      "value" : "If we decide to change our privacy policy, we will post those changes to this privacy statement on this page, and other places we deem appropriate, so that our users are always aware of what information we collect, how we use it and under what circumstances, if any, we disclose it."
    },
    {
      "heading" : "9. Contact Us",
      "value" : "We value your opinions and feedback. If you have comments or questions regarding our Privacy Policy, please send an email to enquiries@aptonline.com.sg We will respond to you shortly."
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

  scrollToTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
