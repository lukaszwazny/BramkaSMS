import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Observable} from 'rxjs';

import {Contact} from '../../data/contacts/contact';
import {Group} from '../../data/groups/group';
import {ContactsService} from '../../services/contacts.service';
import {GroupsService} from '../../services/groups.service';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {

  contact : Contact;

  name = '';
  surname = '';
  
  groupsOfContact: Group[];

  groupList: Group[];

  dropdownSettings = {};

  constructor(private groupsService: GroupsService, private contactsService: ContactsService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit(): void {
  	let id = this.route.snapshot.paramMap.get('id');
    this.contactsService.getContact(id)
        .subscribe(contact => this.contact = contact);
    //this.contact = this.contactsService.getContact(id);
    this.groupsOfContact = this.contactsService.getContactGroups(id);
    this.groupsService
  		.getGroupList()
  		.subscribe(group => this.groupList = group);

  	this.name = this.contact.name;
  	this.surname = this.contact.surname;

  	this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Zaznacz wszystko',
      unSelectAllText: 'Odzaznacz wszystko',
      searchPlaceholderText: 'Szukaj',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Brak grup',
    };
  }

  toContactDetails() {
    this.router.navigate(['/contacts/' + this.contact.id]);
  }

  updateContact(){
  	//this.contact.phoneNumber = '+48' + this.contact.phoneNumber;

  	this.contactsService.updateContact(this.contact, this.groupsOfContact);
  	this.toContactDetails();
  }

}


//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [ContactEditComponent],
	imports: [CommonModule, NgMultiSelectDropDownModule, FormsModule, NgxMaskModule.forRoot()],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class ContactEditModule{}