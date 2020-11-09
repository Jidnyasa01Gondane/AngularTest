import { EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dialogues',
  templateUrl: './dialogues.component.html',
  styleUrls: ['./dialogues.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialoguesComponent implements OnInit, OnChanges {

  @Input() createProduct: boolean = false;
  @Output() cancelAddEmit = new EventEmitter<boolean>();
  @Output() deleteEmit = new EventEmitter<boolean>();
  @Output() saveAddEmit = new EventEmitter<boolean>();
  @Input() productId: any;
  @Input() isNew: boolean;
  @Input() createFilter: boolean = false;
  @Output() cancelFilterEmit = new EventEmitter<boolean>();
  addProductForm: FormGroup;
  imgPath: any;
  isFileType: boolean;
  fileSize: boolean;
  selectedFile: any;
  filterForm: FormGroup;
  totalRow: number;
  fieldName: any = [];
  operator: any = [];
  
  constructor(private messageService: MessageService,) { }

  ngOnInit(): void {

    this.addProductForm = new FormGroup({
      productName: new FormControl(null, [Validators.required]),
      cost: new FormControl('', [Validators.required]),
      salesPrice: new FormControl('', [Validators.required]),
      retailPrice: new FormControl('', Validators.required),
      inventory: new FormControl('', Validators.required),
      manufacturing: new FormControl(''),
      backorder: new FormControl(''),
      category: new FormControl(''),
    });

    this.filterForm = new FormGroup({
      filterRow: new FormArray([this.initRow()]),
      save: new FormControl(null),
      filterName: new FormControl('', [Validators.required])
    });

    this.fieldName = [
      { label: 'Product_Name', value: 'Product Name' },
      { label: 'Product_Cost', value: 'Cost' },
      { label: 'Product_Sale_Price', value: 'Sale Price'},
      { label: 'Product_Retail_Price', value: 'Retail Price'},
      { label: 'Product_Current_Inventory', value: 'Inventory' },
      { label: 'Product_Manufacturing', value: 'Manufacturing' },
      { label: 'Product_Backorder', value: 'Backorder' }, 
    ]
    this.operator = [
      { label: 'not equal', value: '!==' },
      { label: 'equal', value: '==' },
    ]
  }

  ngOnChanges(changes : SimpleChanges){
    if(!this.isNew && this.productId){
      this.patchFormValues(this.productId)
    }
  }
  get f() {
    return this.addProductForm.controls;
  }

  save(data) {
    console.log(data);
    let newData : any = {
      Product_Backorder: data.backorder,
      Product_Category: data.category,
      Product_Cost: data.cost,
      Product_Current_Inventory: data.inventory,
      Product_ID: this.productId?.Product_ID,
      Product_Manufacturing: data.manufacturing,
      Product_Name: data.productName,
      Product_Retail_Price: data.retailPrice,
      Product_Sale_Price: data.salesPrice
    }
    this.saveAddEmit.emit(newData);
    this.cancelAddEmit.emit(false);
  }

  delete(data) {
    this.deleteEmit.emit(data);
    this.cancelAddEmit.emit(false);
  }

  onFileSelected(event) {
    if (event.target.files.length === 0) {
      return;
    }
    let validFileType = ["jpeg", "png", "gif", "svg"];
    var filetype = event.target.files[0].type;
    var Type = filetype.split("/")[1].toLowerCase();
    if (!validFileType.includes(Type)) {
      this.isFileType = false;
      this.messageService.add({ severity: 'warn', summary: 'File Type is not valid.' });
      return;
    }
    else if ((event.target.files[0].size / 1024) >= 1024) {
      this.fileSize = false;
      this.messageService.add({ severity: 'warn', summary: 'File Size is greater than 1 MB.' });
      return;
    }
    else {
      this.isFileType = true;
      this.fileSize = true;
      this.selectedFile = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (_event) => {
        this.imgPath = reader.result;
      }
      let formData = new FormData;
      formData.append('file', this.selectedFile);

      
    }
  }

  onHide(event){
    this.addProductForm.reset();
    this.imgPath = undefined;
    this.productId = undefined;
    this.cancelAddEmit.emit(false);
  }

  onFilterHide(event){
    this.filterForm.reset();
    this.cancelFilterEmit.emit(false);
  }

  patchFormValues(values){
    this.addProductForm.patchValue({
      productName: values.Product_Name,
      cost: values.Product_Cost,
      salesPrice: values.Product_Sale_Price,
      retailPrice: values.Product_Retail_Price,
      inventory: values.Product_Current_Inventory,
      manufacturing: values.Product_Manufacturing,
      backorder: values.Product_Backorder,
      category: values.Product_Category
    });
    this.imgPath = "data:image/png;base64," +values.product.Product_Primary_Image;
  }

  initRow() {
    const group = new FormGroup({
      'fieldName': new FormControl(null, [Validators.required]),
      'operator': new FormControl(null, [Validators.required]),
      'value': new FormControl(null, [Validators.required])
    });
    return group;
  }
  get filterRows() {
    return this.filterForm ? this.filterForm.get('filterRow') as FormArray : this.initRow()
  }

  onAddRow() {
    const group = new FormGroup({
      'fieldName': new FormControl(null, [Validators.required]),
      'operator': new FormControl(null, [Validators.required]),
      'value': new FormControl(null, [Validators.required])
    });
    (<FormArray>this.filterForm.get('filterRow')).push(group);
    this.totalRow = (<FormArray>this.filterForm.get('filterRow')).length;
    console.log(this.totalRow);
  }
  onDeleteRow(index) {
    const control = (<FormArray>this.filterForm.get('filterRow'));
    if (control != null) {
      this.totalRow = control.length;
    }
    if (this.totalRow > 1) {
      control.removeAt(index);
      this.totalRow = this.totalRow - 1;
    }
    console.log(this.totalRow);
  }
}
