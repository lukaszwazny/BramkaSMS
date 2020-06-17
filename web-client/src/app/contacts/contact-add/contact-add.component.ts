import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import { NgxMaskModule, IConfig } from 'ngx-mask'

import {Group} from '../../data/groups/group';
import {ContactsService} from '../../services/contacts.service';
import {GroupsService} from '../../services/groups.service';



@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.css'],
})
export class ContactAddComponent implements OnInit {

  groupList = [];
  selectedGroups = [];
  dropdownSettings = {};

  name = '';
  surname = '';
  phoneNumber = '';

  constructor(private contactsService: ContactsService, private router: Router, private groupsService: GroupsService) { }

  ngOnInit() {

  	this.groupsService
  		.getGroupList()
  		.subscribe(group => this.groupList = group);

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Zaznacz wszystko',
      unSelectAllText: 'Odzaznacz wszystko',
      searchPlaceholderText: 'Szukaj',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Brak grup'
    };

  }

  toContacts() {
    this.router.navigate(['/contacts']);
  }

  onItemSelect(item: any) {
    console.log(this.selectedGroups);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  addContact(){
  	this.contactsService.addContact(this.name, this.surname, '+48' + this.phoneNumber, this.selectedGroups);
  	this.router.navigate(['/contacts/list']);
  }

}


@NgModule({
	declarations: [ContactAddComponent],
	imports: [NgMultiSelectDropDownModule, FormsModule, NgxMaskModule.forRoot()],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class ContactListModule{}

