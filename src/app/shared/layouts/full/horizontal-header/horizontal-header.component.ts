import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-horizontal-header',
  templateUrl: './horizontal-header.component.html',
  styleUrls: [],
})
export class HorizontalAppHeaderComponent {
  public config: PerfectScrollbarConfigInterface = {};

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

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }
}
