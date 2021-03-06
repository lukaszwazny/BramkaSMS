import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable} from 'rxjs';

import {Contact} from '../../data/contacts/contact';
import {ContactsService} from '../../services/contacts.service';

import {Router} from '@angular/router';
import {Renderer2} from '@angular/core';
import {ViewChild} from '@angular/core'

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

	contactList : Contact[];

  filteredContacts : Contact[];

	name: string = '';
	surname: string = '';
	phone: string = '';

	contactToDelete: Contact = new Contact();

	@ViewChild('modal') modal;

  @ViewChild('sorting') sorting;

  constructor(	private contactsService: ContactsService, 
  				private router: Router,
  				private renderer: Renderer2) { }

  ngOnInit() {
  	this.contactsService
  		.getContactList()
  		.subscribe(contact => {this.contactList = contact; console.log(this.contactList); this.assignCopy();});



    

  }

  assignCopy(){
    this.filteredContacts = Object.assign([], this.contactList);
  }

  toContactAdd(){
    this.router.navigate(['/contacts/add']);
  }

  toContactDetails(id) {
    this.router.navigate(['/contacts/' + id]);
  }

  toContactEdit(id) {
    this.router.navigate(['/contacts/' + id + '/edit']);
  }

  deleteContact(id){
  	this.contactsService.deleteContact(id)
      .subscribe(data => {
        console.log(data);
        this.closeModal();
        this.ngOnInit(); 
      })
  }

  openModal(contact: Contact){
  	this.contactToDelete = contact;
  	this.renderer.addClass(this.modal.nativeElement, 'show');
  	this.renderer.setStyle(this.modal.nativeElement, 'display', 'block');
  }

  closeModal(){
  	this.renderer.removeClass(this.modal.nativeElement, 'show');
  	this.renderer.setStyle(this.modal.nativeElement, 'display', 'none');
  }

  filter(name, surname){

    if((!name) && (!surname)){
         this.assignCopy();
     } // when nothing has typed

     if((name) && (!surname)){
      this.filteredContacts = Object.assign([], this.contactList).filter(
        item => item.name.toLowerCase().indexOf(name.toLowerCase()) > -1
     )
     }
     
     if((!name) && (surname)){
      this.filteredContacts = Object.assign([], this.contactList).filter(
        item => item.surname.toLowerCase().indexOf(surname.toLowerCase()) > -1
     )
     }

     if((name) && (surname)){
     this.filteredContacts = Object.assign([], this.contactList).filter(
        item => item.name.toLowerCase().indexOf(name.toLowerCase()) > -1
     )
      this.filteredContacts = Object.assign([], this.filteredContacts).filter(
        item => item.surname.toLowerCase().indexOf(surname.toLowerCase()) > -1
     )
     }

     this.sort(this.sorting.nativeElement.value);
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

  sort(property){
  console.log(property);

  switch(property){

    case '1': 
    this.filteredContacts.sort(this.dynamicSort("name"));
      break;

    case '2': 
    this.filteredContacts.sort(this.dynamicSort("-name"));
      break;

    case '3': 
    this.filteredContacts.sort(this.dynamicSort("surname"));
      break;

    case '4': 
    this.filteredContacts.sort(this.dynamicSort("-surname"));
      break;

    case '5':
    this.filteredContacts.sort(this.dynamicSort("phone_number")); 
      break;

    case '6': 
    this.filteredContacts.sort(this.dynamicSort("-phone_number"));
      break;   
  }

  }

     

}


//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [ContactListComponent],
	imports: [CommonModule]
})
class ContactListModule{}

