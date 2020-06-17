import { Injectable } from '@angular/core';

import {Observable} from 'rxjs';
import { of } from 'rxjs';

import {Group} from '../data/groups/group';
import {Contact} from '../data/contacts/contact';
import {Message} from '../data/messages/message';
import {MessageToShow} from '../data/messages/message-to-show';
import groupList from '../../assets/MOCK_DATA_GROUPS.json'
import contactList from '../../assets/MOCK_DATA_CONTACS.json'
import messageListWithName from '../../assets/MOCK_DATA_MESSAGES_NAME.json'
import messageListWithGroup from '../../assets/MOCK_DATA_MESSAGES_GROUP.json'
import messageListWithNumber from '../../assets/MOCK_DATA_MESSAGES_NUMBER.json'

import {ContactsService} from './contacts.service'
import {GroupsService} from './groups.service'

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private contactsService: ContactsService, private groupsService: GroupsService) { }

  getRawMessagesList(): Observable<Message[]>{

  	let list1 : Message[] = messageListWithName.map(
  										message => ({
  											id: message.id,
  											userId: message.userId,
  											content: message.content,
  											date: new Date(message.date)
  										}));
  	/*list1.forEach( elem => {
  		elem.receiver = this.contactsService.getContact(Number(elem.receiver)).fullData;
  	});*/

  	let list2 : Message[] = messageListWithGroup
  									.map(
  										message => ({
  											id: message.id,
  											groupId: message.groupId,
  											content: message.content,
  											date: new Date(message.date)
  										}));

  	/*list2.forEach( elem => {
  		elem.receiver = this.groupsService.getGroup(Number(elem.receiver)).name;
  	});*/

  	let list3 : Message[] = messageListWithNumber
  									.map(
  										message => ({
  											id: message.id,
  											sentToNumber: message.sentToNumber,
  											content: message.content,
  											date: new Date(message.date)
  										}));;

  	let list = list1.concat(list2).concat(list3);

  	let obsList = of(list);
  	return obsList;
  }

  getMessagesList(shorten:boolean):Observable<MessageToShow[]>{
  	let list:MessageToShow[] = [];

  	this.getRawMessagesList()
  		.subscribe(messages => list = messages.map(message => ({
  										id: message.id,
  										receiver: (message.userId != null ? (this.contactsService.getContact(message.userId).fullData) : 
  													(message.groupId != null ? this.groupsService.getGroup(message.groupId).name : 
  													(message.sentToNumber) )),
  										content: (shorten ? (message.content.slice(0,200) + '...') : message.content),
  										date: message.date.toISOString().slice(0,10),
  									})));

  	return of(list);
 	
  }

  getFirstDate():Observable<Date>{
  	let dates = [];

  	this.getRawMessagesList()
  		.subscribe(messages => dates = messages.map(message => message.date));

  	let firstDate = new Date(Math.min.apply(null, dates));

  	return of(firstDate);
  }

  getLastDate():Observable<Date>{
  	let dates = [];

  	this.getRawMessagesList()
  		.subscribe(messages => dates = messages.map(message => message.date));

  	let lastDate = new Date(Math.max.apply(null, dates));

  	return of(lastDate);
  }

}
