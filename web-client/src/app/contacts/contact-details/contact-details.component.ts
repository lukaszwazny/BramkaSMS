import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Contact} from '../../data/contacts/contact';
import {Group} from '../../data/groups/group';
import {ContactsService} from '../../services/contacts.service';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import {Renderer2} from '@angular/core';
import {ViewChild} from '@angular/core'

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

  contact : Contact;
  groupsOfContact: Group[];

  @ViewChild('modal') modal;

  constructor(private contactsService: ContactsService,
    private route: ActivatedRoute, private router: Router, private renderer: Renderer2) { }

  ngOnInit() {
  	let id = this.route.snapshot.paramMap.get('id');
    this.contactsService.getContact(id)
        .subscribe(contact => {
          this.contact = contact;
          this.contactsService.getContactGroups(id)
            .subscribe(groups => this.groupsOfContact = groups);
        });
    //this.contact = this.contactsService.getContact(id);
    
  }

  toGroupDetails(id){
  	this.router.navigate(['/groups/' + id]);
  }

  toContactEdit() {
    this.router.navigate(['/contacts/' + this.contact.id + '/edit']);
  }

  toContacts() {
    this.router.navigate(['/contacts']);
  }

  deleteContact(){
  	this.contactsService.deleteContact(this.contact.id);
  	this.router.navigate(['/contacts']);
  	this.closeModal();
  }

  openModal(){
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
	declarations: [ContactDetailsComponent],
	imports: [CommonModule]
})
class ContactDetailsModule{}