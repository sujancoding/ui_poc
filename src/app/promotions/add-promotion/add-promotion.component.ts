import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddPromotionService } from '../services/add-promotion.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/shared/services/alert.service';
import { PromotionMaintenance } from '../models/PromotionsModel';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.scss']
})
export class AddPromotionComponent implements OnInit {
  minDate = new Date();
  date:any = new Date();

  form: FormGroup = Object.create(null);

  user: any = {};
  id!: string;
  submitted = false;
  loading = false;

  onSave() {
    this.PromotionService.addPromotion(this.addPromotion()).subscribe(
      data => {
        console.log(data);
        this.alertService.clear()
        this.alertService.success("Registration Successful!!");  //success message
        this.form.reset();
        this.dialogRef.close('save');
        
      },
      error => {
        console.log(error.message);
        this.alertService.clear()
        this.alertService.error("Login Failed. Try Again");
        this.loading = false;
        this.submitted = false;   //failure message
      }
    )
  }

  addPromotion():PromotionMaintenance{
   return new PromotionMaintenance({
    "promoId": "216",
    "Description": this.form.controls['description'].value,
    "StartDate": this.form.controls['startDate'].value,
    "EndDate": this.form.controls['endDate'].value,
    "createdBy": "Buhari",
    "createdOn": this.datePipe.transform(this.date, 'MMM d, y, h:mm:ss a'), 
   })
  }


  constructor(public fb: FormBuilder,private PromotionService: AddPromotionService,private alertService: AlertService,public dialogRef: MatDialogRef<AddPromotionComponent>,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
  
    this.form = this.fb.group({   
      startDate: [null, [Validators.compose([Validators.required])]],
      endDate: [null, [Validators.compose([Validators.required])]],
      description: [null, [Validators.compose([Validators.required])]],
    });
  }

}
