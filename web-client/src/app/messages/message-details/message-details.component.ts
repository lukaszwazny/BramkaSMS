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

  	this.messagesService.getRawMessage(whatList, id).subscribe(message => this.message = message);

  	if(this.message.userId){
  		this.receiver = {
  			id: this.message.userId,
  			name: this.contactsService.getContact(this.message.userId).fullData
  		}
  	}

  	if(this.message.groupId){
  		this.receiver = {
  			id: this.message.groupId,
  			name: this.groupsService.getGroup(this.message.groupId).name
  		}
  	}

  	if(this.message.sentToNumber){
  		this.receiver = {
  			id: null,
  			name: this.message.sentToNumber
  		}
  	}

  	console.log(this.receiver.id);
  		
  }

  toMessageHistory(){
  	this.router.navigate(['/messages/history']);
  }

  toRecieverDetails(){
  	if(this.message.userId)
  		this.router.navigate(['/contacts/' + this.receiver.id]);
  	if(this.message.groupId)
  		this.router.navigate(['/groups/' + this.receiver.id]);
  }

}

//XD, bez tego nie działa *ngIf
@NgModule({
	declarations: [MessageDetailsComponent],
	imports: [CommonModule]
})
class MessageDetailsModule{}