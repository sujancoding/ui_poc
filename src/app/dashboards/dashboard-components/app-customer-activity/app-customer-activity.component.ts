import { Component, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-activity',
  templateUrl: './app-customer-activity.component.html',
  styleUrls: ['./app-customer-activity.component.scss']
})
export class AppCustomerActivityComponent implements AfterViewInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  displayedColumns: string[] = ['name', 'amount'];

  dataSource = new MatTableDataSource(transactions);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // tslint:disable-next-line - Disables all
  openDialog(action: string, obj: any): void {
  }

  // tslint:disable-next-line - Disables all
  addRowData(row_obj: Transaction): void {
    this.dataSource.data.splice(0, 0, {
      id: transactions.length + 1,
      Name: row_obj.Name,
      DateOfTxn: row_obj.DateOfTxn,
      Amount: row_obj.Amount,
    });
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Transaction): boolean | void {
    this.dataSource.data = this.dataSource.data.filter((value) => {
      if (value.id === row_obj.id) {
        value.Name = row_obj.Name;
        value.DateOfTxn = row_obj.DateOfTxn;
        value.Amount = row_obj.Amount;
      }
      return true;
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Transaction): boolean | void {
    this.dataSource.data = this.dataSource.data.filter((value) => {
      return value.id !== row_obj.id;
    });
  }

}


export interface Transaction {
  id: number;
  Name: string;
  DateOfTxn: string;
  Amount: number;
}

const transactions = [
  {
    id: 1,
    Name: 'Mark Deo',
    DateOfTxn: '01-2-2020',
    Amount: 12000,
  }
  , {
    id: 2,
    Name: 'Hans walker',
    DateOfTxn: '05-2-2021',
    Amount: 12000,
  },
  {
    id: 3,
    Name: 'Mark Deo',
    DateOfTxn: '11-3-2021',
    Amount: 12000,
  },
  {
    id: 4,
    Name: 'Trimmer Deo',
    DateOfTxn: '21-4-2021',
    Amount: 12000,
  }

];