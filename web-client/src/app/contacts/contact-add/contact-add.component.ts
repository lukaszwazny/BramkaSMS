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
  i = 0;
  dropdownSettings = {};

  name = '';
  surname = '';
  phoneNumber = '';

  constructor(private contactsService: ContactsService, private router: Router, private groupsService: GroupsService) { }

  ngOnInit() {

  	this.groupsService
  		.getGroupList()
  		.subscribe(group => {this.groupList = group; console.log(group)});

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
  	this.contactsService.addContact(this.name, this.surname, '+48' + this.phoneNumber)
      .subscribe(data=>{
        console.log(data);
        this.contactsService.getContactList()
          .subscribe(conList => {
            console.log(conList.find(con => {return con.name == this.name}).id, this.selectedGroups[0].id);
            var requestsDone = [];
            this.selectedGroups.forEach((group, i) => {
              requestsDone[i] = false;
            });
            requestsDone[0] = true;
            requestsDone[this.selectedGroups.length] = false
            //console.log("siemanko w mojej kuchni");
            /*this.selectedGroups.forEach((group, i) => {
              //console.log("siemanko w mojej kuchni");
              while(!requestsDone[i+1]){
                //console.log("siemanko w mojej kuchni");
                if(requestsDone[i]){
                  requestsDone[i] = false;
                  console.log("siemanko w mojej kuchni");
                  this.contactsService.addContactToGroup(
                    conList.find(con => {return con.name == this.name}).id,
                    group.id)
                  .subscribe(elo => {
                    subject.next()
                    console.log(elo);
                    requestsDone[i+1] = true;
                    console.log("witam");
                  });

                }
              }  
            });*/
            this.handleAddingContactToGroups(conList.find(con => {return con.name == this.name}).id);
      
            });            
          });     
  }



  handleAddingContactToGroups(contactId){


  if(this.i < this.selectedGroups.length){
    console.log("elo");
    this.contactsService.addContactToGroup(
                    contactId,
                    this.selectedGroups[this.i].id)
                  .subscribe(elo => {
                    console.log(elo);
                    this.i++;
                    this.handleAddingContactToGroups(contactId);
                  });
  }else{
    this.router.navigate(['/contacts/list']);
  }

  }

}


@NgModule({
	declarations: [ContactAddComponent],
	imports: [NgMultiSelectDropDownModule, FormsModule, NgxMaskModule.forRoot()],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class ContactListModule{}

