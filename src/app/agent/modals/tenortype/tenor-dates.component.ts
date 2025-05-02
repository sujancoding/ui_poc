import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface EndTenor{
  viewValue: string;
 }
interface StartTenor {
  viewValue: string;
}

@Component({
  selector: 'app-tenor-dates',
  templateUrl: './tenor-dates.component.html',
  styleUrls: ['./tenor-dates.component.scss']
})
export class TenorDatesComponent implements OnInit {
 // mindate!: Date;
  minStartDate!: Date;
  maxStartDate!: Date;
  minEndDate!: Date;
  maxEndDate!: Date;
  validateEndDate: any;
  validateStartDate: any;
  selectedValue!: string;
  selected1!:string;
  selected2!:string
  value!:Date;
  startDate : any = new FormControl();
  endDate : any = new FormControl();
  isDisabledButton !: Boolean;
  public tenorForm: FormGroup = Object.create(null);
  isFieldDisable : Boolean = true ; //always start tenor and end tenor dropdown field should be disabled .
  tenorRange : any[] = [
    {value: "TODAY" , viewValue : "Today"},
    {value: "TOM" , viewValue : "Tomorrow"},
    {value: "1W" , viewValue : "1 Week"},
    {value: "custom dates" , viewValue : "Custom Dates"},
  ];
  weekIndicator !: string ;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private datePipe: DatePipe,
  public dialogRef: MatDialogRef<TenorDatesComponent>){

  }

  days: StartTenor[] = [
    {viewValue: '+1 day(stock)'},
    {viewValue: '+2 days(stock)'},
    { viewValue: '+3 days(stock)'},
    { viewValue: '+4 days(stock)'},
    {viewValue: '+5 days(stock)'},
    {viewValue: '+6 days(stock)'},
    { viewValue: '+7 days(stock)'},
    {viewValue: '+8 days(stock)'},
    {viewValue: '+9 days(stock)'},
    { viewValue: '+10 days(stock)'},
    {viewValue: 'Today'},
    {viewValue: 'Tomorrow'},
   // {viewValue: '1 Week'},
  ];
  
  status: EndTenor[] = [
    {viewValue: 'Broken'},
  
  ];
  
  ngOnInit() {
    
    //this.mindate=new Date();
   
 
    this.tenorForm = this.fb.group({
      startTenorDate: [null , Validators.compose ([Validators.required])],
      startTenor    : [null , Validators.compose ([Validators.required])],
      endTenorDate  : [null , Validators.compose ([Validators.required])],
      endTenor      : [null , Validators.compose ([Validators.required])],
      timePeriod     : ['TODAY' , Validators.compose ([Validators.required])],
      })
      this.minStartDate = new Date(); //min and max start date will be only as current date
      //this.maxStartDate = new Date();
      
     // this.minEndDate =  this.tenorForm.controls['startTenorDate'].value;  //max end date is 8 days and exclude sat and sun
      //this.maxEndDate = new Date(this.minEndDate.getTime() + 8 * 24 * 60 * 60 * 1000);

      this.validateStartDate = new Date();
      this.validateEndDate = new Date();
      this.tenorForm.patchValue({
        "startTenorDate" : new DatePipe('en-US').transform(new Date(), 'dd/MM/yyyy'),
        "endTenorDate" : new DatePipe('en-US').transform(new Date(), 'dd/MM/yyyy'),
        //"startTenor" : "Today",
        "endTenor" : "Broken"
      })
      this.selectedValue = "Today";
      this.tenorForm.controls['startTenorDate'].disable();
      this.tenorForm.controls['startTenor'].disable();
      this.tenorForm.controls['endTenorDate'].disable();
      this.tenorForm.controls['endTenor'].disable();
      this.startDate.patchValue(new Date);
      this.endDate.patchValue(new Date);
      this.startDate.disable() ;
      this.endDate.disable() ;

     
  
  }
//restricting sat and sun
  weekendsFilter(date: Date | null): boolean {
    if (!date) {
      return false;
    }
    const d = new Date(date);
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }

  //Apply 
  onSubmit(){
    this.dialogRef.close({startDate:this.validateStartDate , endDate: this.validateEndDate,oneWeekIndicator : this.weekIndicator});
    console.log("start date = " + this.validateStartDate , "end date = " + this.validateEndDate);
  }


  close(){
    this.dialogRef.close();
  }


  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;
   // this.validateEndDate  = new DatePipe('en-US').transform(this.validateEndDate, 'dd/MM/yyyy');
    if(new Date(this.validateStartDate).getTime() <= new Date(this.validateEndDate).getTime()){
      this.isDisabledButton = false; 
    }else{
      this.isDisabledButton = true;
    }
    this.tenorForm.patchValue({
      "endTenorDate" : new DatePipe('en-US').transform(this.validateEndDate, 'dd/MM/yyyy'),
      "endTenor" : "Broken"
    })
    const startDate = new Date(this.validateStartDate);
    const endDate = new Date(this.validateEndDate);
    let diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    // Iterate over the dates and exclude weekends
     let excludedDays = 0;
    //  for (let i = 1; i <= diff; i++) {
    //     const currentDate = new Date(startDate.getTime() + (i - 1) * (1000 * 3600 * 24));
    //     if (currentDate.getDay() === 0 || currentDate.getDay() === 6) { // Sunday or Saturday
    //     excludedDays++;
    //   }
    // }

// Calculate the final difference by subtracting the excluded days
const finalDiff = diff - excludedDays;
    const daysGap = finalDiff ;
    if(this.validateEndDate){
      if(daysGap == 0){
        this.tenorForm.patchValue({
          "startTenor" : "Today" 
        })
       }
      if(daysGap == 1){
        this.tenorForm.patchValue({
          "startTenor" : "+1 day(stock)" 
        })
       }
       if(daysGap == 2){
        this.tenorForm.patchValue({
          "startTenor" : "+2 days(stock)" 
        })
       }
       if(daysGap == 3){
        this.tenorForm.patchValue({
          "startTenor" : "+3 days(stock)" 
        })
       }
       if(daysGap == 4){
        this.tenorForm.patchValue({
          "startTenor" : "+4 days(stock)" 
        })
       }
       if(daysGap == 5){
        this.tenorForm.patchValue({
          "startTenor" : "+5 days(stock)" 
        })
       }
       if(daysGap == 6){
        this.tenorForm.patchValue({
          "startTenor" : "+6 days(stock)" 
        })
       }
       if(daysGap == 7){
        this.tenorForm.patchValue({
          "startTenor" : "+7 days(stock)" 
        })
       }
       if(daysGap == 8){
        this.tenorForm.patchValue({
          "startTenor" : "+8 days(stock)" 
        })
       }
       if(daysGap == 9){
        this.tenorForm.patchValue({
          "startTenor" : "+9 days(stock)" 
        })
       }
       if(daysGap == 10){
        this.tenorForm.patchValue({
          "startTenor" : "+10 days(stock)" 
        })
       }
    }
  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>):void{

    this.validateStartDate = event.value._d;
 //   this.validateStartDate  = new DatePipe('en-US').transform(this.validateStartDate, 'dd/MM/yyyy');

    if ( new Date(this.validateStartDate).getTime() > new Date(this.validateEndDate).getTime()) 
      {
      this.isDisabledButton = true; 
    }else{
      this.isDisabledButton = false;
    }
    
    this.tenorForm.patchValue({
      "startTenorDate" : new DatePipe('en-US').transform(this.validateStartDate, 'dd/MM/yyyy')
    })
    this.minStartDate = new Date(); //min and max start date will be only as current date
    //this.maxStartDate = new Date();
    
    this.minEndDate =  this.validateStartDate  //max end date is 8 days and exclude sat and sun
    this.maxEndDate = new Date(this.minEndDate.getTime() + 8 * 24 * 60 * 60 * 1000);
  }

  timePeriodChange(e:any,timePeriod:string){
    if(timePeriod == 'TODAY'){
      this.weekIndicator = "" ;  
      this.validateStartDate = new Date();
      this.validateEndDate = new Date();
      this.tenorForm.patchValue({
        "startTenorDate" : new DatePipe('en-US').transform(new Date(), 'dd/MM/yyyy'),
        "endTenorDate" : new DatePipe('en-US').transform(new Date(), 'dd/MM/yyyy'),
        "startTenor" : "Today" ,
        "endTenor" : "Broken"
      })
      this.tenorForm.controls['startTenorDate'].disable();
      this.tenorForm.controls['startTenor'].disable();
      this.tenorForm.controls['endTenorDate'].disable();
      this.tenorForm.controls['endTenor'].disable();
      this.startDate.patchValue(new Date);
      this.endDate.patchValue(new Date);
      this.startDate.disable() ;
      this.endDate.disable() ;
    }


    if(timePeriod == 'custom dates'){
      this.weekIndicator = "";
      this.startDate.patchValue('');
      this.endDate.patchValue('');
      this.startDate.enable() ;
      this.endDate.enable() ;
      this.tenorForm.enable() ;
      this.tenorForm.patchValue({
        "startTenorDate" : "",
        "endTenorDate" : "",
        "startTenor" : "" ,
        "endTenor" : ""
      })
    }


    if(timePeriod == 'TOM'){
      this.weekIndicator = "" ;  
      const date = new Date();
      date.setDate(date.getDate() + 1);
      this.validateStartDate = date //from
      this.validateEndDate = date;    //till
      this.tenorForm.patchValue({
        "startTenorDate" : new DatePipe('en-US').transform(date, 'dd/MM/yyyy'),
        "endTenorDate" : new DatePipe('en-US').transform(date, 'dd/MM/yyyy'),
        "startTenor" : "Tomorrow" ,
        "endTenor" : "Broken"
      })
      this.tenorForm.controls['startTenorDate'].disable();
      this.tenorForm.controls['startTenor'].disable();
      this.tenorForm.controls['endTenorDate'].disable();
      this.tenorForm.controls['endTenor'].disable();
      this.startDate.patchValue(date);
      this.endDate.patchValue(date);
      this.startDate.disable() ;
      this.endDate.disable() ;
    }


    if(timePeriod == "1W"){
      this.weekIndicator = "1W" ;
      const date = new Date();
      date.setDate(date.getDate() + 7); 
      this.validateStartDate = new Date();
      this.validateEndDate = date; 
      this.tenorForm.patchValue({
        "startTenorDate" : new DatePipe('en-US').transform(new Date(), 'dd/MM/yyyy'),
        "endTenorDate" : new DatePipe('en-US').transform(date, 'dd/MM/yyyy'),
        "startTenor" : "Today" ,
        "endTenor" : "Broken"
      })
      this.tenorForm.controls['startTenorDate'].disable();
      this.tenorForm.controls['startTenor'].disable();
      this.tenorForm.controls['endTenorDate'].disable();
      this.tenorForm.controls['endTenor'].disable();
      this.startDate.patchValue(new Date);
      this.endDate.patchValue(date);
      this.startDate.disable() ;
      this.endDate.disable() ;
    }
  }
  
}

  
