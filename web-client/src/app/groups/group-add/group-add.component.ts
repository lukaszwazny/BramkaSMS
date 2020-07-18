import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import { NgxMaskModule, IConfig } from 'ngx-mask'

import {Contact} from '../../data/contacts/contact';
import {ContactsService} from '../../services/contacts.service';
import {GroupsService} from '../../services/groups.service';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css']
})
export class GroupAddComponent implements OnInit {

 contactList = [];
  selectedContacts = [];
  dropdownSettings = {};

  name = '';
  i = 0;

  constructor(private contactsService: ContactsService, private router: Router, private groupsService: GroupsService) { }

  ngOnInit() {

  	this.contactsService
  		.getContactList()
  		.subscribe(contact => {
        this.contactList = contact;
        this.contactList.forEach(con =>{con.fullData = con.name + ' ' + con.surname});
      });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'fullData' ,
      selectAllText: 'Zaznacz wszystko',
      unSelectAllText: 'Odzaznacz wszystko',
      searchPlaceholderText: 'Szukaj',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Brak grup'
    };

  }

  toGroups() {
    this.router.navigate(['/groups']);
  }

  onItemSelect(item: any) {
    console.log(this.selectedContacts);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  addGroup(){
  	this.groupsService.addGroup(this.name)
      .subscribe(data => {
        console.log(data);
        this.groupsService.getGroupList()
          .subscribe(groupList => {
            this.handleAddingContactToGroups(groupList.find(grou => {return grou.name == this.name}).id);
          });
      });
  }

  handleAddingContactToGroups(groupId){


  if(this.i < this.selectedContacts.length){
    console.log("elo");
    this.contactsService.addContactToGroup(
                    this.selectedContacts[this.i].id,
                    groupId)
                  .subscribe(elo => {
                    console.log(elo);
                    this.i++;
                    this.handleAddingContactToGroups(groupId);
                  });
  }else{
    this.router.navigate(['/groups/list']);
  }

  }

}

@NgModule({
	declarations: [GroupAddComponent],
	imports: [NgMultiSelectDropDownModule, FormsModule, NgxMaskModule.forRoot()],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class GroupListModule{}