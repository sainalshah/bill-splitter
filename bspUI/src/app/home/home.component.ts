
import { MatTableDataSource } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BillService } from '../services/bill.service';
import { Bill } from '../models/bill';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private billService: BillService) { }
  // data = [{ createdBy: '2018-07-11', description: 'test bill', amount: 270 }];
  // dataSource = new MatTableDataSource(this.data);
  dataSource = new UserDataSource(this.billService);
  displayedColumns = ['createdTstamp', 'description', 'amount'];

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  ngOnInit() {
  }

}


export class UserDataSource extends DataSource<any> {
  constructor(private rentService: BillService) {
    super();
  }
  connect(): Observable<Bill[]> {
    return this.rentService.getAll();
  }
  disconnect() { }
}
