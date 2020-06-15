import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import {FormsModule} from '@angular/forms';



@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.css'],
})
export class ContactAddComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor() { }

  ngOnInit() {
  this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

}


@NgModule({
	declarations: [ContactAddComponent],
	imports: [NgMultiSelectDropDownModule, FormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class ContactListModule{}

