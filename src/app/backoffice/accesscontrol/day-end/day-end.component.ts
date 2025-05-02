import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { DayEndConfirmationDialogComponent } from '../modals/day-end-confirmation-dialog/day-end-confirmation-dialog.component';

@Component({
  selector: 'app-day-end',
  templateUrl: './day-end.component.html',
  styleUrls: ['./day-end.component.scss']
})
export class DayEndComponent implements OnInit {

  constructor(private titleHeaderService: TitleHeaderService, private dialog:MatDialog) { }

  ngOnInit(): void {
    this.titleHeaderService.setTitle('Branch Close') ;
  }

  //open confirmation dialog for day closing..
  openDayCloseConfirmationDialog(){
    this.dialog.open(DayEndConfirmationDialogComponent,{
      width : '480px',
      //height: '500px',
      panelClass: 'custom-modalbox',
    })
  }
}
