import { Component, OnInit } from '@angular/core';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  constructor(private tileHeaderService: TitleHeaderService) { }

  ngOnInit(): void {
    this.tileHeaderService.setTitle('Delete Account') ;
  }

}
