import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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

	name: string = '';
	surname: string = '';
	phone: string = '';

	contactToDelete: Contact = new Contact();

	@ViewChild('modal') modal;

  constructor(	private contactsService: ContactsService, 
  				private router: Router,
  				private renderer: Renderer2) { }

  ngOnInit() {
  	this.contactsService
  		.getContactList(this.name, this.surname, this.phone)
  		.subscribe(contact => this.contactList = contact);
  }

  toContactDetails(id) {
    this.router.navigate(['/contacts/' + id]);
  }

  toContactEdit(id) {
    this.router.navigate(['/contacts/' + id + '/edit']);
  }

  deleteContact(id){
  	//delete function
  	this.ngOnInit();
  	this.closeModal();
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

}


//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [ContactListComponent],
	imports: [CommonModule]
})
class ContactListModule{}

