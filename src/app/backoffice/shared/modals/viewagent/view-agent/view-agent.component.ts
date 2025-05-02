import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';

@Component({
  selector: 'app-view-agent',
  templateUrl: './view-agent.component.html',
  styleUrls: ['./view-agent.component.scss']
})
export class ViewAgentComponent implements OnInit {
  isReadOnly : Boolean = true;
  public form: FormGroup =  Object.create(null);

  constructor( private fb : FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private headerService :TitleHeaderService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      Name: [null],
      Id: [null],
      AccNo: [null],
    })

    if(this.data.reviewAgentDetails){
      this.headerService.setTitle('Approve Payee');
      this.form.patchValue({
        "Name":this.data.reviewAgentDetails[0].ENTITYNAME,
        "Id":this.data.reviewAgentDetails[0].ENTITYID,
        "AccNo":this.data.reviewAgentDetails[0].ACCOUNTNO,
      })
    }
  }
}
