import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

import pendingMessageListWithName from '../../assets/MOCK_DATA_PENDING_MESSAGES_NAME.json'
import pendingMessageListWithGroup from '../../assets/MOCK_DATA_PENDING_MESSAGES_GROUP.json'
import pendingMessageListWithNumber from '../../assets/MOCK_DATA_PENDING_MESSAGES_NUMBER.json'

import {ContactsService} from './contacts.service'
import {GroupsService} from './groups.service'

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http:HttpClient, private contactsService: ContactsService, private groupsService: GroupsService) { }

  getRawMessagesList(whatList: string): Observable<Message[]>{

  	let list1, list2, list3, list : Message[];

  	if(whatList == 'sent'){
  		list1 = messageListWithName.map(
  										message => ({
  											id: message.id,
  											userId: message.userId,
  											content: message.content,
  											date: new Date(message.date)
  										}));

  		list2 = messageListWithGroup
  									.map(
  										message => ({
  											id: message.id,
  											groupId: message.groupId,
  											content: message.content,
  											date: new Date(message.date)
  										}));

  		list3 = messageListWithNumber
  									.map(
  										message => ({
  											id: message.id,
  											sentToNumber: message.sentToNumber,
  											content: message.content,
  											date: new Date(message.date)
  										}));
  	}

  	if(whatList == 'pending'){
  		list1 = pendingMessageListWithName.map(
  										message => ({
  											id: message.id,
  											userId: message.userId,
  											content: message.content,
  											date: new Date(message.date)
  										}));

  		list2 = pendingMessageListWithGroup
  									.map(
  										message => ({
  											id: message.id,
  											groupId: message.groupId,
  											content: message.content,
  											date: new Date(message.date)
  										}));

  		list3 = pendingMessageListWithNumber
  									.map(
  										message => ({
  											id: message.id,
  											sentToNumber: message.sentToNumber,
  											content: message.content,
  											date: new Date(message.date)
  										}));
  	}

  	

  	list = list1.concat(list2).concat(list3);

  	let obsList = of(list);
  	return obsList;
  }

  getMessagesList(shorten:boolean, whatList:string):Observable<MessageToShow[]>{
  	let list:MessageToShow[] = [];

  	this.getRawMessagesList(whatList)
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

  getRawMessage(whatList, id):Observable<Message>{
  	let list:Message[] = [];

  	this.getRawMessagesList(whatList).subscribe(messages => list = messages);

  	return of(list[id-1]);
  }

  getFirstDate(whatList:string):Observable<Date>{
  	let dates = [];

  	this.getRawMessagesList(whatList)
  		.subscribe(messages => dates = messages.map(message => message.date));

  	let firstDate = new Date(Math.min.apply(null, dates));

  	return of(firstDate);
  }

  getLastDate(whatList:string):Observable<Date>{
  	let dates = [];

  	this.getRawMessagesList(whatList)
  		.subscribe(messages => dates = messages.map(message => message.date));

  	let lastDate = new Date(Math.max.apply(null, dates));

  	return of(lastDate);
  }

  sendMessage(contactList, groupList, numberList, content, date){

  	if(contactList.length){
  		console.log(contactList);
  	}
  	if(groupList.length){
  		console.log(groupList);
  	}
  	if(numberList.length){
  		console.log(numberList);
  	}

  	console.log(content);
  	console.log(date);
  }

}
