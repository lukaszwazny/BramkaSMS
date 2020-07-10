import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Message} from '../../data/messages/message';
import {MessagesService} from '../../services/messages.service';

import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';

import {Group} from '../../data/groups/group';
import {Contact} from '../../data/contacts/contact';

import {ContactsService} from '../../services/contacts.service'
import {GroupsService} from '../../services/groups.service'

@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.css']
})
export class MessageDetailsComponent implements OnInit {

	message: Message;
	receiver = {id:null, name:null};


  constructor(private groupsService:GroupsService, private contactsService: ContactsService, private messagesService: MessagesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

  	let whatList = this.route.snapshot.url[0].path;
  	let id = this.route.snapshot.url[1].path;

  	whatList = whatList == 'messageslist' ? 'pending' : 'sent';

  	this.messagesService.getRawMessage(whatList, id).subscribe(message => {
      this.message = message;

      if(this.message.user_id){

      this.contactsService.getContact(this.message.user_id)
        .subscribe(contact => {
          this.receiver = {
            id: this.message.user_id,
            name: contact.name + ' ' + contact.surname + ', ' + contact.phone_number
          }
        })

    }

    if(this.message.group_id){

      this.groupsService.getGroup(this.message.group_id)
        .subscribe(group => {
          this.receiver = {
            id: this.message.group_id,
            name: group.group_name
          }
        })
    }

    if(this.message.phone_number){
      this.receiver = {
        id: null,
        name: this.message.phone_number
      }
    }
    });

  	

  	console.log(this.receiver.id);
  		
  }

  toMessageHistory(){
  	this.router.navigate(['/messages/history']);
  }

  toRecieverDetails(){
  	if(this.message.user_id)
  		this.router.navigate(['/contacts/' + this.receiver.id]);
  	if(this.message.group_id)
  		this.router.navigate(['/groups/' + this.receiver.id]);
  }

}

//XD, bez tego nie działa *ngIf
@NgModule({
	declarations: [MessageDetailsComponent],
	imports: [CommonModule]
})
class MessageDetailsModule{}