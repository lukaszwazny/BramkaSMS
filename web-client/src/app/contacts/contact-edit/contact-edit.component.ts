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
  
  groupsOfContact = [];

  begGroupsOfContact = [];

  groupList = [];

  i = 0;

  dropdownSettings = {};

  constructor(private groupsService: GroupsService, private contactsService: ContactsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  	let id = this.route.snapshot.paramMap.get('id');
    this.contactsService.getContact(id)
        .subscribe(contact => {
          this.contact = contact;
          this.contactsService.getContactGroups(id)
          .subscribe(groups => {
          this.groupsService
            .getGroupList()
            .subscribe(group => {
              this.groupList = group; 
              console.log('lista grup', group);
              this.begGroupsOfContact = groups;
              this.groupsOfContact = groups;
              console.log(this.groupsOfContact);
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
            });
            
            
          });
        });
    //this.contact = this.contactsService.getContact(id);
    

  	this.name = this.contact.name;
  	this.surname = this.contact.surname;

  	
  }

  toContactDetails() {
    this.router.navigate(['/contacts/' + this.contact.id]);
  }

  updateContact(){
  	//this.contact.phoneNumber = '+48' + this.contact.phoneNumber;

  	this.contactsService.updateContact(this.contact)
      .subscribe(data => {
        console.log(data);
        this.handleAddingContactToGroups(this.contact.id);
      });
  	
  }

  handleAddingContactToGroups(contactId){


  if(this.groupsOfContact && this.i < this.groupsOfContact.length){
    console.log(this.i);
    var ifAdd = true;
    if(this.begGroupsOfContact){
      this.begGroupsOfContact.forEach(con => {
      console.log(con);
        if(con.id == this.groupsOfContact[this.i].id)
         ifAdd = false;
      });
    }
    if(ifAdd) {
      this.contactsService.addContactToGroup(
                    contactId,
                    this.groupsOfContact[this.i].id)
                  .subscribe(elo => {
                    console.log(elo);
                    this.i++;
                    this.handleAddingContactToGroups(contactId);
                  });
    }else{
      this.i++;
      this.handleAddingContactToGroups(contactId);
    }
    
  } else {
    this.i = 0;
    this.handleDeletingContactToGroups(contactId);
  }

  }

  handleDeletingContactToGroups(contactId){


  if(this.begGroupsOfContact && this.i < this.begGroupsOfContact.length){
    console.log("toDel: ", this.begGroupsOfContact[this.i]);
    var ifDel = true;
    this.groupsOfContact.forEach(con => {
      if(con.id == this.begGroupsOfContact[this.i].id)
       ifDel = false;
    });
    if(ifDel){
    console.log("deleting: ", this.begGroupsOfContact[this.i]);
    this.contactsService.deleteContactFromGroup(
                    contactId,
                    this.begGroupsOfContact[this.i].id)
                  .subscribe(elo => {
                    console.log(elo);
                    this.i++;
                    this.handleDeletingContactToGroups(contactId);
                  });
    }else{
      this.i++;
      this.handleDeletingContactToGroups(contactId);
    }
  } else {
    this.toContactDetails();
  }

  }

  onItemSelect(item: any) {
    console.log(this.groupsOfContact);
  }
  onSelectAll(items: any) {
    console.log(this.groupList);
  }

}


//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [ContactEditComponent],
	imports: [CommonModule, NgMultiSelectDropDownModule, FormsModule, NgxMaskModule.forRoot()],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class ContactEditModule{}