import { Component, HostListener, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/core/services/transaction.service';

import { PipeTransform, Pipe } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InMemoryCache } from 'src/app/shared/services/cache.service';
import { TitleHeaderService } from 'src/app/core/services/headertitle.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorDialogAdminComponent } from '../../shared/modals/errordialogadmin/error-dialog-admin.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { ViewManagementReportConfirmationDialogComponent } from '../../shared/modals/view-management-report-confirmation-dialog/view-management-report-confirmation-dialog.component';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value: any, args: string[]): any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}

@Component({
  selector: 'app-transaction-summary-report',
  templateUrl: './transaction-summary-report.component.html',
  styleUrls: ['./transaction-summary-report.component.scss', '../../../../assets/styles/tables/table-style.scss',
    '../../../../assets/styles/buttons/button.scss'
  ],
})
export class TransactionSummaryReportComponent implements OnInit {

  searchReport !: string;
  showCounts !: Boolean;
  selectedReport !: string;
  loader: Boolean = false;
  isActive = false;
  p: number = 1;
  itemsPerPage: number = 20;
  reportDatas: any[] = [];
  headerData: any[] = [];
  form: FormGroup = Object.create(null);
  xpandStatus = false;
  selectedType !: string;
  selectable: boolean = true;
  selected!: Date | null;
  selectedEnddate !: Date | null;
  selectedStatus !: string;
  isDisabled: Boolean = true;
  selectedDayRange !: string;
  searchResultsLabel: Boolean = false;
  enteredStartDate: any;
  enteredEndDate: any;
  currentDate = new Date();
  priorDateFor30Days = new Date(new Date().setDate(this.currentDate.getDate() - 30)); //from currenct date - 30 days
  priorDateFor15Days = new Date(new Date().setDate(this.currentDate.getDate() - 15)); //from currenct date - 15 days
  priorDateFor10Days = new Date(new Date().setDate(this.currentDate.getDate() - 10));  //from currenct date - 10 days
  reportName !: string;
  noReportsData: Boolean = false;
  selectedCustomerType: string = '';
  count: any;
  validateEndDate: any;
  validateStartDate: any;
  public getScreenWidth: any;
  public getScreenHeight: any;
  getReports: any[] = [];
  retrievedReportsData: Boolean = true;
  filterValues: any[] = [];
  onLoadReportName: string = "";
  minStartDate : Date = new Date(2025, 0, 1); 
  maxStartDate!: Date;
  minEndDate!: any;
  maxEndDate!: any;
  disableDateField: Boolean = true;
  showProfitLoss: boolean = true;
  customerTypeArray: any[] = [
    { "value": "", "description": "--Select--", "disabled": true },
    { "value": "I", "description": "Consumer", "disabled": false },
    { "value": "C", "description": "Corporate", "disabled": false },
    { "value": "A", "description": "Agent", "disabled": false },
  ];



  constructor(private titleHeader: TitleHeaderService, private transactionService: TransactionService,
    private fb: FormBuilder, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.titleHeader.setTitle('Transaction Summary');
    this.form = this.fb.group({
      dayRange: [null],
      customerType: [null],
      reportName: [null, [Validators.compose([Validators.required])]],
      startDate: [null, [Validators.compose([Validators.required])]],
      endDate: [null, [Validators.compose([Validators.required])]],
    });



    //get dropdown reports values from a service call
    
    this.transactionService.getManagementReportsDrpdownValues().subscribe((datas: any) => {
      let reports : any [] = datas['data'];
      // filter profit loss based on showProfitLoss
        this.getReports = reports.filter(report => report.TYPE == "MONTHLYTXNSUMMARY");
    },
      //error handling completed in 01-06-2023
      (error: any) => {
        if (error.status != 401) {
          this.dialog.open(ErrorDialogAdminComponent, {
            data: { errorMessage: error.error.errorMessage }
          });
        }
      }

    );


    //getScreenWidth and getScreenHeight will get the windows inner height and width.
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;

  }
  //The HostListener is a Decorator used for listening to the DOM,
  // and It provides a handler method to run when that event occurs.
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

  tableHeight() {
    return { 'height': (this.getScreenHeight - 286) + 'px', 'overflow-y': 'auto' };
  }


  resetFilter() {
    this.xpandStatus = false;
    this.filterValues = [];
    this.form.patchValue({
      "dayRange": "",
      "customerType" : "",
      "reportName" : "11"
    });

    // Patch empty in all fields
    this.form.controls.startDate.setValue("");
    this.form.controls.endDate.setValue("");
    //service call - onLoad call org pl records
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
      this.reportDatas = [];
      this.count = this.reportDatas.length;
      if (this.reportDatas.length == 0) {
        this.noReportsData = true;
      }
      else {
        this.noReportsData = false;
      }
    }, 200);
  }


  //fetch functio 
  searchFilter(dayRange: any, reportName: string) { //report name will be like '1' | '2' ..


    this.dialog.open(ViewManagementReportConfirmationDialogComponent, {
      width: "500px"
    }).afterClosed().subscribe((response: any) => {
      console.log(response)
      if (response && response.action == "VIEW") {
        console.log("Its View")
        this.loader = true;
        this.showCounts = true;

        this.selectedCustomerType = '';
        this.xpandStatus = false //close expansion panel .
        this.filterValues = []; //clearing filter values array 

        //pushing report name 
        var reportNameArr = this.getReports.filter(v => v.ID == reportName);
        let name = reportNameArr[0].TEXT ? reportNameArr[0].TEXT : "";
        var reportNameObj = { "fieldName": "Report Name", "value": name };
        this.filterValues.push(reportNameObj);

        this.reportName = reportName; // eg : this.reportName = '1' ;
        this.searchReport = reportName;  // eg : this.searchReport = '1' ;
        //}
        let todaysDay = this.currentDate.getDate();
        let todaysMonth = this.currentDate.getMonth() + 1;
        let todaysYear = this.currentDate.getFullYear();
        let startDate;
        let endDate;

        if (dayRange == "10days") {
          endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
          startDate = this.priorDateFor10Days.getFullYear() + "-" + (this.priorDateFor10Days.getMonth() + 1) + "-" + this.priorDateFor10Days.getDate();
          var start_date: any = moment(this.form.controls.startDate.value);
          var end_date: any = moment(this.form.controls.endDate.value);
          // Use toLocaleDateString to format the date as "dd/mm/yyyy"
          let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
          let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
          let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
          var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
          var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
          var dayRangeObj = { "fieldName": "Day Range", "value": "Last 10 Days" };
          this.filterValues.push(dayRangeObj);
          this.filterValues.push(obj2);
          this.filterValues.push(obj3);
        }
        else if (dayRange == "15days") {
          endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
          startDate = this.priorDateFor15Days.getFullYear() + "-" + (this.priorDateFor15Days.getMonth() + 1) + "-" + this.priorDateFor15Days.getDate();
          var start_date: any = moment(this.form.controls.startDate.value);
          var end_date: any = moment(this.form.controls.endDate.value);
          // Use toLocaleDateString to format the date as "dd/mm/yyyy"
          let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
          let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
          let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
          var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
          var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
          var dayRangeObj = { "fieldName": "Day Range", "value": "Last 15 Days" };
          this.filterValues.push(dayRangeObj);
          this.filterValues.push(obj2);
          this.filterValues.push(obj3);
        }
        else if (dayRange == "30days") {
          endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
          startDate = this.priorDateFor30Days.getFullYear() + "-" + (this.priorDateFor30Days.getMonth() + 1) + "-" + this.priorDateFor30Days.getDate();
          var start_date: any = moment(this.form.controls.startDate.value);
          var end_date: any = moment(this.form.controls.endDate.value);
          // Use toLocaleDateString to format the date as "dd/mm/yyyy"
          let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
          let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
          let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
          var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
          var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
          var dayRangeObj = { "fieldName": "Day Range", "value": "Last 30 Days" };
          this.filterValues.push(dayRangeObj);
          this.filterValues.push(obj2);
          this.filterValues.push(obj3);
        }
        else if (dayRange == "Current Date") {
          startDate = this.currentDate.getFullYear() + "-" + (this.currentDate.getMonth() + 1) + "-" + this.currentDate.getDate();
          endDate = this.currentDate.getFullYear() + "-" + (this.currentDate.getMonth() + 1) + "-" + this.currentDate.getDate();
          var start_date: any = moment(this.form.controls.startDate.value);
          var end_date: any = moment(this.form.controls.endDate.value);
          // Use toLocaleDateString to format the date as "dd/mm/yyyy"
          let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
          let patchStartDate = start_date._d.toLocaleDateString('en-GB', options);
          let patchEndDate = end_date._d.toLocaleDateString('en-GB', options);
          var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
          var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
          var dayRangeObj = { "fieldName": "Day Range", "value": "Current Date" };
          this.filterValues.push(dayRangeObj);
          this.filterValues.push(obj2);
          this.filterValues.push(obj3);
        }



        else if (dayRange == "custom date") {

          const givenStartDate = this.form.controls.startDate.value._d;
          const givenEndDate = this.form.controls.endDate.value._d;
          startDate = givenStartDate.getFullYear() + "-" + (givenStartDate.getMonth() + 1) + "-" + givenStartDate.getDate();
          endDate = givenEndDate.getFullYear() + "-" + (givenEndDate.getMonth() + 1) + "-" + givenEndDate.getDate();
          // Use toLocaleDateString to format the date as "dd/mm/yyyy"
          let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
          let patchStartDate = this.form.controls.startDate.value._d.toLocaleDateString('en-GB', options);
          let patchEndDate = this.form.controls.endDate.value._d.toLocaleDateString('en-GB', options);
          var obj2 = { "fieldName": "Start Date (DD/MM/YYYY)", "value": patchStartDate };
          var obj3 = { "fieldName": "End Date (DD/MM/YYYY)", "value": patchEndDate };
          this.filterValues.push(obj2);
          this.filterValues.push(obj3);  //



        }

        this.searchResultsLabel = true;

        this.selectedCustomerType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "" ;
        if (this.selectedCustomerType != ""){
          let array = this.customerTypeArray.filter(v => v.value == this.selectedCustomerType) ;
          let val = array ? array[0].description : "";
          var reportNameObj = { "fieldName": "Customer Type", "value": val };
          this.filterValues.push(reportNameObj);
        }

        //service call
        if (startDate != undefined && endDate != undefined) {
          this.transactionService.getOnlineReports(this.reportName, startDate, endDate, this.selectedCustomerType, name,"").subscribe((datas: any) => {
            console.log(datas['data']);
            this.loader = false;
            this.isDisabled = true;
            this.reportDatas = datas['data'];
            this.count = this.reportDatas.length;
            if (this.reportDatas.length == 0) {
              this.noReportsData = true;
              this.retrievedReportsData = false;
            }
            else {
              this.noReportsData = false;
              this.retrievedReportsData = true;
            }
          },//error handling
            (error: any) => {
              if (error.status != 401) {
                this.loader = false;
                const dialogRef = this.dialog.open(ErrorDialogAdminComponent, {
                  data: { isReview: true }
                })
                dialogRef.afterClosed().subscribe(res => {
                  this.loader = false;
                  this.noReportsData = true;
                  this.retrievedReportsData = false;
                })
                this.count = '0'
              }

            }
          );
        }
        else {
          this.loader = false;
          this.snackBar.open("Please Enter Day Range", "Ok");
        }


      }
      else if (response && response.action == "SAVE") {
        console.log("Its Save");
        this.loader = true;
        this.reportName = reportName; // eg : this.reportName = '1' ;
        this.searchReport = reportName;  // eg : this.searchReport = '1' ;
        this.selectedCustomerType = "" ;
        //}
        let todaysDay = this.currentDate.getDate();
        let todaysMonth = this.currentDate.getMonth() + 1;
        let todaysYear = this.currentDate.getFullYear();
        let startDate;
        let endDate;

        var reportNameArr = this.getReports.filter(v => v.ID == reportName);
        let name = reportNameArr[0].TEXT ? reportNameArr[0].TEXT : "";

        if (dayRange == "10days") {
          endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
          startDate = this.priorDateFor10Days.getFullYear() + "-" + (this.priorDateFor10Days.getMonth() + 1) + "-" + this.priorDateFor10Days.getDate();
        }
        else if (dayRange == "15days") {
          endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
          startDate = this.priorDateFor15Days.getFullYear() + "-" + (this.priorDateFor15Days.getMonth() + 1) + "-" + this.priorDateFor15Days.getDate();
        }
        else if (dayRange == "30days") {
          endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
          startDate = this.priorDateFor30Days.getFullYear() + "-" + (this.priorDateFor30Days.getMonth() + 1) + "-" + this.priorDateFor30Days.getDate();
        }
        else if (dayRange == "Current Date") {
          startDate = this.currentDate.getFullYear() + "-" + (this.currentDate.getMonth() + 1) + "-" + this.currentDate.getDate();
          endDate = this.currentDate.getFullYear() + "-" + (this.currentDate.getMonth() + 1) + "-" + this.currentDate.getDate();
        }


        else if (dayRange == "custom date") {

          const givenStartDate = this.form.controls.startDate.value._d;
          const givenEndDate = this.form.controls.endDate.value._d;
          startDate = givenStartDate.getFullYear() + "-" + (givenStartDate.getMonth() + 1) + "-" + givenStartDate.getDate();
          endDate = givenEndDate.getFullYear() + "-" + (givenEndDate.getMonth() + 1) + "-" + givenEndDate.getDate();
        }

        this.selectedCustomerType = this.form.controls['customerType'].value ? this.form.controls['customerType'].value : "" ;

        //service call
        if (startDate != undefined && endDate != undefined) {
          this.transactionService.getManagementReportAsPdf(this.reportName, startDate, endDate, this.selectedCustomerType, name, true,false,'').subscribe((datas: ArrayBuffer) => {
            this.loader = false;

            // Handle the ArrayBuffer data here
            const blob = new Blob([datas], { type: 'application/pdf' });

            // Create a File with a specified filename
            const filename = `${name}.pdf`;

            const file = new File([blob], filename, { type: 'application/pdf' });

            // Create a data URL from the File
            const url = URL.createObjectURL(file);

            const a = document.createElement("a");
            a.href = url;
            a.download = file.name; // Ensures correct file name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // Cleanup the blob URL to free memory
            URL.revokeObjectURL(url);

            // Open the PDF in a new tab or download as needed
            // window.open(url);
          },//error handling
            (error: any) => {
              if (error.status != 401) {
                if (error.status == 500) {
                  // Decode the ArrayBuffer to JSON if it's an error response
                  const textDecoder = new TextDecoder("utf-8");
                  const errorText = textDecoder.decode(error.error);
                  let errorMessage = "";
                  try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.errorMessage || "An error occurred";
                  } catch (e) {
                    errorMessage = "An error occurred"; // Fallback in case JSON parsing fails
                  }
                  this.dialog.open(ErrorDialogAdminComponent, {
                    data: { errorMessage: errorMessage ? errorMessage : "" }
                  })
                }
                else {
                  this.dialog.open(ErrorDialogAdminComponent)
                }
              }

            }
          );
        }
        else {
          this.snackBar.open("Please Enter Day Range", "Ok");
        }

      }
        else if(response && response.action == "XLSX"){ //excel
          console.log("Its EXCEL") ;
          this.loader = true;
          this.reportName = reportName; // eg : this.reportName = '1' ;
          this.searchReport = reportName;  // eg : this.searchReport = '1' ;
          //}
         let todaysDay = this.currentDate.getDate();
         let todaysMonth = this.currentDate.getMonth() + 1;
         let todaysYear = this.currentDate.getFullYear();
         let startDate;
         let endDate;
      
         var reportNameArr =  this.getReports.filter(v => v.VALUE == reportName);
         let name = reportNameArr[0].TEXT ? reportNameArr[0].TEXT : "" ;
      
          if(dayRange == "10days"){
             endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
             startDate = this.priorDateFor10Days.getFullYear() + "-" + (this.priorDateFor10Days.getMonth() + 1) + "-" + this.priorDateFor10Days.getDate();
          }
          else if(dayRange == "15days"){
            endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
            startDate = this.priorDateFor15Days.getFullYear() + "-" + (this.priorDateFor15Days.getMonth() + 1) + "-" + this.priorDateFor15Days.getDate();
         }
         else if(dayRange == "30days"){
          endDate = todaysYear + "-" + todaysMonth + "-" + todaysDay;
          startDate = this.priorDateFor30Days.getFullYear() + "-" + (this.priorDateFor30Days.getMonth() + 1 )+ "-" + this.priorDateFor30Days.getDate();
         }
         else if(dayRange == "Current Date"){
        startDate = this.currentDate.getFullYear() +"-" + (this.currentDate.getMonth()+1) +"-" + this.currentDate.getDate();
        endDate = this.currentDate.getFullYear() +"-" + (this.currentDate.getMonth()+1) +"-" + this.currentDate.getDate();
         }
         
          // this.filteredArrayList = []; --> old code , This can be used when removeMatChips function was enabled .
      
           else if(dayRange == "custom date"){
           
            const givenStartDate = this.form.controls.startDate.value._d ;
            const givenEndDate = this.form.controls.endDate.value._d  ;
            startDate = givenStartDate.getFullYear() + "-" + (givenStartDate.getMonth() + 1) + "-" + givenStartDate.getDate();
            endDate = givenEndDate.getFullYear() + "-" + (givenEndDate.getMonth() + 1) + "-" + givenEndDate.getDate();
           }
          
            //service call
            if(startDate != undefined && endDate != undefined){
          this.transactionService.getManagementReportAsPdf(this.reportName,startDate,endDate,this.selectedCustomerType,name,false, true,'').subscribe((datas:ArrayBuffer) =>{
            this.loader = false;
            
            // Handle the ArrayBuffer data here
            const blob = new Blob([datas], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
            // Create a filename for the XLSX file
            const filename = `${name}.xlsx`;
      
           // Create a File object
            const file = new File([blob], filename, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
            // Create a data URL from the File
             const url = URL.createObjectURL(file);

             const a = document.createElement("a");
             a.href = url;
             a.download = file.name; // Ensures correct file name
             document.body.appendChild(a);
             a.click();
             document.body.removeChild(a);
      
            // Open the PDF in a new tab or download as needed
            // window.open(url);
          },//error handling
          (error:any) => { 
            if(error.status != 401){
              this.loader = false;
              this.dialog.open(ErrorDialogAdminComponent,{
                data : {errorMessage : error.error.errorMessage}
              }) 
            }
           
        }  
      );
        }
      }
      else {
        console.log("Dialog is closed without any action provided...")
      }

    })


  }

  //selectionChange event fired when they selecting values in "Day Range" Dropdown
  dayRangeSelection(dayRange: string) {
    //To patch Current date in endDate field.
    const currentDate = new Date();
    this.form.controls['endDate'].setValue(currentDate);
    this.minEndDate = null; // to set null in min and max property.
    this.maxEndDate = null;

    //last 10 days
    if (dayRange == "10days") {
      this.disableDateField = true;
      const futureDate = new Date(currentDate.getTime() - (10 * 24 * 60 * 60 * 1000)); // startDate = current date - 10days
      this.form.controls['startDate'].setValue(futureDate);
    }

    //last 15 days
    else if (dayRange == "15days") {
      this.disableDateField = true;
      const futureDate = new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000)); // startDate = current date - 15days
      this.form.controls['startDate'].setValue(futureDate);

    }

    //last 30 days
    else if (dayRange == "30days") {
      this.disableDateField = true;
      const futureDate = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000)); // startDate = current date - 30days
      this.form.controls['startDate'].setValue(futureDate);
    }


    //current day
    else if (dayRange == "Current Date") {
      this.disableDateField = true;
      const currentDate = new Date();     //startDate = current date
      this.form.controls['startDate'].setValue(currentDate);
    }

    //custom days
    else if (dayRange == "custom date") {
      this.disableDateField = false;
      this.form.controls['startDate'].setValue(null);
      this.form.controls['endDate'].setValue(null);
    }
  }

  //dateChange event fired - after start date and end date value is entered
  public onEndDateChange(event: MatDatepickerInputEvent<any>): void {
    this.validateEndDate = event.value._d;

  }
  public onStartDateChange(event: MatDatepickerInputEvent<any>): void {// changed to one year
    if (event.value != null) {
      this.validateStartDate = event.value._d;
      this.minEndDate = this.validateStartDate  //max end date is 8 days and exclude sat and sun
      this.maxEndDate = new Date(this.minEndDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      // this.form.controls['endDate'].setValue(this.maxEndDate);
    }
    else {
      this.form.controls['startDate'].clearValidators();

      // Apply new validators (or none, if you want to remove validation)
      this.form.controls['startDate'].setValidators([Validators.required, /* other validators */]);

      // Update the control's status and validity
      this.form.controls['startDate'].updateValueAndValidity();
    }
  }

  handlePageChange(event: any): void {
    this.p = event.pageIndex + 1;
  }

  //On report name dropdown changes..perform certain CV .
  onChangeReportName(reportValue: string) {

    // First, reset all disabled states
    this.customerTypeArray.forEach(v => {
      v.disabled = false;
    });

    //if report is "summary" --> Customer type only select is supported
    if (reportValue == "11") {
      this.form.controls['customerType'].setValue("") //patch ALL.
      this.customerTypeArray.forEach(v => {
        if (v.value != "") {
          v.disabled = true;
        }
      })
    }
    //if report is "funds accepted IN SG --> disable options "Agent"  in customer type array
    if (reportValue == "12") {
      this.form.controls['customerType'].setValue("I") //patch Consumer initially.
      this.customerTypeArray.forEach(v => {
        if (v.value == "A" ) {
          v.disabled = true;
        }
      })
    }
    //if report is "funds accepted OUT SG --> enable options customer type array
    if (reportValue == "13") {
      this.form.controls['customerType'].setValue("I") //patch Consumer initially.
      this.customerTypeArray.forEach(v => {
          v.disabled = false;
      })
    }
    //if report is "funds remitted - agent --> disable options "consumer" , "corporate" , "All" in customer type array
    if (reportValue == "14") {
      this.form.controls['customerType'].setValue("A") //patch Agent initially.
      this.customerTypeArray.forEach(v => {
        if (v.value != "A") {
          v.disabled = true;
        }
      })
    }

    //if report is "funds remitted - bank --> disable options "consumer" , "corporate" , "All" and "Agent" in customer type array
    if (reportValue == "15") {
      this.form.controls['customerType'].setValue("") //patch --Select-- initially.
      this.customerTypeArray.forEach(v => {

        v.disabled = true;

      })
    }
  }


}
