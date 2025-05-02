import { Component, OnInit } from '@angular/core';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';

@Component({
  selector: 'app-parent-calculator',
  templateUrl: './parent-calculator.component.html',
  styleUrls: ['./parent-calculator.component.scss']
})
export class ParentCalculatorComponent implements OnInit {

  constructor(private headerService : TitleHeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Calculator');
  }

}
