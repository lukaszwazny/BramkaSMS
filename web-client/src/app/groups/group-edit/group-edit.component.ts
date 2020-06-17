import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  group : Group;

  name = '';
  
  contactsOfGroup: Contact[];

  contactList: Contact[];

  dropdownSettings = {};

  constructor(private groupsService: GroupsService, private contactsService: ContactsService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit(): void {
  	let id = this.route.snapshot.paramMap.get('id');
    //this.contactsService.getContact(id)
    //    .subscribe(contact => this.contact = contact);
    this.group = this.groupsService.getGroup(id);

    this.groupsService
  		.getGroupContacts(id)
  		.subscribe(contact => this.contactsOfGroup = contact);

    this.contactsService
  		.getContactList()
  		.subscribe(contact => this.contactList = contact);

  	this.name = this.group.name;

  	this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'fullData',
      selectAllText: 'Zaznacz wszystko',
      unSelectAllText: 'Odzaznacz wszystko',
      searchPlaceholderText: 'Szukaj',
      itemsShowLimit: 20,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Brak kontaktów',
    };
  }

  toGroupDetails() {
    this.router.navigate(['/groups/' + this.group.id]);
  }

  updateGroup(){
  	this.groupsService.updateGroup(this.group, this.contactsOfGroup);
  	this.toGroupDetails();
  }

}

//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [GroupEditComponent],
	imports: [CommonModule, NgMultiSelectDropDownModule, FormsModule, NgxMaskModule.forRoot()],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class GroupEditModule{}
