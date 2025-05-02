import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NoteUpdateRq } from 'src/app/core/model/mcdailysetup/dailysetup.model';
import { MoneyChangerDailySetupService } from 'src/app/core/services/mcdailysetup.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.scss']
})
export class NoteDialogComponent implements OnInit {

  noteArray : any[] = [] ;
  form : FormGroup = Object.create(null) ;

  constructor(private exchangeRateService: MoneyChangerDailySetupService, private alertService : AlertService,
    private fb : FormBuilder, public dialogRef: MatDialogRef<NoteDialogComponent>
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      "note" : [null] 
    });

    this.exchangeRateService.getNotes().subscribe((datas:any) =>{
      this.noteArray = datas['data'] ;
      let noteValue = this.noteArray[0].TODAYSNOTE ? this.noteArray[0].TODAYSNOTE : "" ;
      this.form.patchValue({
        "note" : noteValue 
      })
      this.alertService.clear() ;
      this.alertService.success("Latest Note Retrieved !") ;
    },
   //error handling 
   (error:any) =>{
    if(error.status != 401){
      this.alertService.clear() ;
      this.alertService.error("Failed to load notes, Try again !") ;
    }
  }
  )
  }

  //Add note service call .
  onSave(){
   this.exchangeRateService.updateNotes(this.buildNotesPayload()).subscribe((datas:any)=>{
    console.log(datas) ;
    this.alertService.clear() ;
      this.alertService.success("Note Updated !") ;
      this.dialogRef.close() ;
   },
   //error handling 
   (error:any) =>{
    if(error.status != 401){
      this.alertService.clear() ;
      this.alertService.error("Failed to update, Try again !") ;
    }
  }
  )
  }

  buildNotesPayload(): NoteUpdateRq{
    return new NoteUpdateRq({
      "note" : this.form.controls['note'].value ? this.form.controls['note'].value : ""
    })
  }

}
