import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Contact} from '../../data/contacts/contact';
import {Group} from '../../data/groups/group';
import {ContactsService} from '../../services/contacts.service';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

  contact : Contact;
  groupsOfContact: Group[];

  constructor(private contactsService: ContactsService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  	let id = this.route.snapshot.paramMap.get('id');
    //this.contactsService.getContact(id)
    //    .subscribe(contact => this.contact = contact);
    this.contact = this.contactsService.getContact(id);
    this.groupsOfContact = this.contactsService.getContactGroups(id);
  }

  toGroupDetails(id){
  	this.router.navigate(['/groups/' + id]);
  }

  toContactEdit() {
    this.router.navigate(['/contacts/' + this.contact.id + '/edit']);
  }

}

//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [ContactDetailsComponent],
	imports: [CommonModule]
})
class ContactListModule{}