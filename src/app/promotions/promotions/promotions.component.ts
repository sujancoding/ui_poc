import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';



import { AddPromotionComponent } from '../add-promotion/add-promotion.component';
import { PromotionMaintenance } from '../models/PromotionsModel';
import { AddPromotionService } from '../services/add-promotion.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';


@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  p: number = 1;

  form: FormGroup = Object.create(null);
  id!:number;
  searchDescription!: string;
  Description!: string; 
  

  promotionMaintenance : PromotionMaintenance[]=[

  ]

  myDate:any= new Date();
 



  openPromotion(){
    this.dialogRef.open(AddPromotionComponent, {
      panelClass: 'custom-modalbox',
      height:'450px',
      width:'500px'
     }).afterClosed().subscribe( val=>{
         this.getAllPromotion();
      
     })
  }

  getAllPromotion(){
   this.PromotionService.getPromotions().subscribe(data=>{
    this.promotionMaintenance = data;
   })
   }

   deleteProduct(id:number){
    this.PromotionService.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        alert("Promotion Deleted Successfully");
        this.getAllPromotion();
      },
      error:()=>{
        alert("Error")
      }
    })
   }

  constructor(public dialogRef: MatDialog,private PromotionService: AddPromotionService,private datePipe: DatePipe,private headerService : TitleHeaderService) {
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd,h:mm:ss a ');
  }

  ngOnInit(): void {
    this.headerService.setTitle('Promotion');
    this.getAllPromotion();
  }

}
