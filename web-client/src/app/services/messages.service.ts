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

import config from '../../assets/config.json'

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

    //bez API
  	/*let list1, list2, list3, list : Message[];

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
  	return obsList;*/

    //z API
    return this.http.get<Message[]>
        ('http://' 
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/history?id=1');
  }

  getMessagesList(shorten:boolean, whatList:string):MessageToShow[]{
  	

    //bez API
    let list:MessageToShow[] = [];

  	this.getRawMessagesList(whatList)
  		.subscribe(messages => {list = messages.map(message => ({
  										id: message.id,
  										receiver: (message.user_id != null) ? ("u" + message.user_id) : 
                        (message.group_id != null ? ("g" + message.group_id ): 
                            (message.phone_number)),
  										content: (shorten ? (message.text.slice(0,200) + '...') : message.text),
  										date: message.timestamp.slice(0,10),
  		}));
      console.log(list, messages, "a dziendobry");

      list.forEach(message => {

      if(message.receiver[0] == "u"){
        this.contactsService.getContact(parseInt(message.receiver.slice(1)))
          .subscribe(contact => 
            message.receiver = contact.name + " " + contact.surname + ", " + contact.phone_number)
      }
      if(message.receiver[0] == "g"){
        this.groupsService.getGroup(parseInt(message.receiver.slice(1)))
          .subscribe(group =>
            message.receiver = group.group_name)

      }
                            
      })

      console.log(list, "+1");

      return list;

      console.log("elo320");

      });


  	return null;

  }

  getRawMessage(whatList, id):Observable<Message>{
  	let list:Message[] = [];

  	this.getRawMessagesList(whatList).subscribe(messages => list = messages);

  	return of(list[id-1]);
  }

  getFirstDate(whatList:string):Observable<Date>{
  	let dates = [];

  	this.getRawMessagesList(whatList)
  		.subscribe(messages => dates = messages.map(message => message.timestamp));

  	let firstDate = new Date(Math.min.apply(null, dates));

  	return of(firstDate);
  }

  getLastDate(whatList:string):Observable<Date>{
  	let dates = [];

  	this.getRawMessagesList(whatList)
  		.subscribe(messages => dates = messages.map(message => message.timestamp));

  	let lastDate = new Date(Math.max.apply(null, dates));

  	return of(lastDate);
  }

  sendMessage(contactList, groupList, numberList, content, date){

  	if(contactList.length){
  		console.log(contactList);

      contactList.foreach(contact => {

        var message : Object = {
          user_id: contact.id,
          text: content
        }

        this.http.post<Object>
          ('http://'
            + config.backendIP
            + ':'
            + config.backendPort
            + '/api/send_user', message);

      });

  	}
  	if(groupList.length){
  		console.log(groupList);

      groupList.foreach(group => {

        var message : Object = {
          group_id: group.id,
          text: content
        }

        this.http.post<Object>
          ('http://'
            + config.backendIP
            + ':'
            + config.backendPort
            + '/api/send_group', message);

      });
  	}

  	if(numberList.length){
  		console.log(numberList);
      numberList.forEach(number => {

        var message : Object = {
          phone_number: number,
          text: content
        }

        this.http.post<Object>
          ('http://'
            + config.backendIP
            + ':'
            + config.backendPort
            + '/api/send_number', message)
            .subscribe(data => console.log(data));

      });
      
  	}

  	console.log(content);
  	console.log(date);
  }

}
