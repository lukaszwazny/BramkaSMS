import { Component, OnInit } from '@angular/core';
import {Contact} from '../../data/contacts/contact';
import {ContactsService} from '../../services/contacts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

  contact : Contact;

  constructor(private contactsService: ContactsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
  	let id = this.route.snapshot.paramMap.get('id');
    this.contactsService.getContact(id)
        .subscribe(contact => this.contact = contact);
  }

}
