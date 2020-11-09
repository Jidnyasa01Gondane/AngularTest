import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import *  as  products from '../assets/json/products.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'AngularTest';
  products = products['default'];
  cols = [];
  selectedProdut: any;
  rating: number = 0;
  imagesCatlog: any = [];
  chartData: any;
  _selectedColumns: any[];
  displayAddSlider: boolean;
  product: any;
  newProduct: boolean = false;
  displayFilterSlider: boolean = false;

  ngOnInit(): void {
    console.log(this.products);
    this.cols = [
      { field: 'Product_Name', header: 'Product Name', class: "name" },
      { field: 'Product_Cost', header: 'Cost', class: "cost" },
      { field: 'Product_Sale_Price', header: 'Sale Price', class: "saleprice" },
      { field: 'Product_Retail_Price', header: 'Retail Price', class: "retailprice" },
      { field: 'Product_Current_Inventory', header: 'Inventory', class: "inventory" },
      { field: 'Product_Manufacturing', header: 'Manufacturing', class: "manufacturing" },
      { field: 'Product_Backorder', header: 'Backorder', class: "backorder" }, //
    ]
    this._selectedColumns = this.cols;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  onRowSelect(event) {
    this.rating = event.data.product.Product_Consumer_Rating;
    this.processChartData(event.data.salesAndOpportunities);
    this.processCatlogImages(event.data.catalog);
    this.newProduct = false;
    this.product = this.cloneCar(event.data);
  }

  processCatlogImages(data) {
    let imageCatlog = Object.keys(data);
    this.imagesCatlog = []
    for (let i = 0; i < imageCatlog.length; i++) {
      this.imagesCatlog.push(data[imageCatlog[i]])
    }
  }

  processChartData(data) {
    let label = [];
    let salesData = [];
    let oppurtinityData = [];
    let datasets = [];
    data.forEach(element => {
      label.push(element.Year.toString());
      salesData.push(Number(element.Sale));
      oppurtinityData.push(Number(element.Opportunity));
    });
    let i = 0;
    while (i < 2) {
      let json = {
        'label': i == 0 ? 'Sales' : 'Opportunity',
        'backgroundColor': i == 0 ? '#cc285c' : '#005b9fe3',
        'borderColor': '#1E88E5',
        'data': i == 0 ? salesData : oppurtinityData
      }
      datasets.push(json);
      i++;
    }
    this.chartData = {
      'labels': label,
      'datasets': datasets
    }
  }

  exportExcel() {
    // this.ngxLoader.start()
    let tableData = [];
    // console.log(this.workOrderList);
    this.products.forEach(data => {
      let json: any = [];
      this.cols.forEach(element => {
        if (element.field != "") {
          json[element.header] = data[element.field]
        }
      });
      tableData.push(json)
    });
    console.log(tableData);
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(tableData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "ProductData");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
      // this.ngxLoader.stop()
    });
  }

  getCancelAddMessage(value) {
    this.displayAddSlider = value;
    this.selectedProdut = undefined;
    this.newProduct = false;
  }

  getCancelFilterMessage(value){
    this.displayFilterSlider = value;
  }
  showDialogToAdd() {
    this.newProduct = true;
    this.product = {};
    this.displayAddSlider = true;
  }


  cloneCar(p) {
    let product = {};
    for (let prop in p) {
      product[prop] = p[prop];
    }
    return product;
  }

  save(data) {
    let products = [...this.products];
    if (this.newProduct)
      products.push(data);
    else
      products[this.products.indexOf(this.selectedProdut)] = data;

    this.products = products;
    console.log(this.products);
    this.product = null;
    this.selectedProdut = undefined;
  }

  delete(data) {
    let index = this.products.indexOf(this.selectedProdut);
    this.products = this.products.filter((val, i) => i != index);
    this.product = null;
  }
}
