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

  group;

  name = '';
  i = 0;
  
  contactsOfGroup: Contact[];
  begContactsOfGroup: Contact[];

  contactList: Contact[];

  dropdownSettings = {};

  constructor(private groupsService: GroupsService, private contactsService: ContactsService, private route: ActivatedRoute, private router: Router,) { }

  ngOnInit(): void {
  	let id = this.route.snapshot.paramMap.get('id');
    this.groupsService.getGroup(id)
        .subscribe(group => {
          this.group = group;
          this.name = this.group.group_name;
          this.groupsService.getGroupContacts(id)
            .subscribe(contacts => {
              if(contacts){
                contacts.forEach(contact => 
                contact.fullData = contact.name + " " + contact.surname + ", " + contact.phone_number);
                this.contactsOfGroup = contacts;
                this.begContactsOfGroup = contacts;
              }
              this.contactsService.getContactList()
                .subscribe(contacts2 => {
                  contacts2.forEach(contact => 
                  contact.fullData = contact.name + " " + contact.surname + ", " + contact.phone_number);
                  this.contactList = contacts2;
                });
            });
        });
    //this.group = this.groupsService.getGroup(id);

  	

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
    this.router.navigate(['/groups/' + this.group.group_id]);
  }

  updateGroup(){
  	this.groupsService.updateGroup(this.group.group_id, this.group.group_name)
      .subscribe(data => {
        console.log(data);
        this.handleAddingContactToGroups(this.group.group_id);
        
      });
  	
  }

  handleAddingContactToGroups(groupId){


  if(this.i < this.contactsOfGroup.length){
    console.log(this.i);
    var ifAdd = true;
    if(this.begContactsOfGroup){
      this.begContactsOfGroup.forEach(con => {
      console.log(con);
        if(con.id == this.contactsOfGroup[this.i].id)
         ifAdd = false;
      });
    }
    if(ifAdd) {
      this.contactsService.addContactToGroup(
                    this.contactsOfGroup[this.i].id,
                    groupId)
                  .subscribe(elo => {
                    console.log(elo);
                    this.i++;
                    this.handleAddingContactToGroups(groupId);
                  });
    }else{
      this.i++;
      this.handleAddingContactToGroups(groupId);
    }
    
  } else {
    this.i = 0;
    this.handleDeletingContactToGroups(groupId);
  }

  }

  handleDeletingContactToGroups(groupId){


  if(this.begContactsOfGroup && this.i < this.begContactsOfGroup.length){
    console.log("toDel: ", this.begContactsOfGroup[this.i]);
    var ifDel = true;
    this.contactsOfGroup.forEach(con => {
      if(con.id == this.begContactsOfGroup[this.i].id)
       ifDel = false;
    });
    if(ifDel){
    console.log("deleting: ", this.begContactsOfGroup[this.i]);
    this.contactsService.deleteContactFromGroup(
                    this.begContactsOfGroup[this.i].id,
                    groupId)
                  .subscribe(elo => {
                    console.log(elo);
                    this.i++;
                    this.handleDeletingContactToGroups(groupId);
                  });
    }else{
      this.i++;
      this.handleDeletingContactToGroups(groupId);
    }
  } else {
    this.toGroupDetails()
  }

  }

}

//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [GroupEditComponent],
	imports: [CommonModule, NgMultiSelectDropDownModule, FormsModule, NgxMaskModule.forRoot()],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class GroupEditModule{}
