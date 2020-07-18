import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import { of } from 'rxjs';
import { Subject } from 'rxjs';

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

  handleReceiverChange(i, list, subject){
    if(i < list.length){
    console.log("before",list[i]);
      if(list[i].receiver[0] == "u"){
          this.contactsService.getContact(parseInt(list[i].receiver.slice(1)))
            .subscribe(contact => {
                console.log("afterContact", contact);
                if(contact)
                  list[i].receiver = contact.name + " " + contact.surname + ", " + contact.phone_number;
                else
                  list[i].receiver = "kontakt usunięty"
                console.log("after", list[i]);
                this.handleReceiverChange(i+1, list, subject);
              });
      }
      if(list[i].receiver[0] == "g"){
          this.groupsService.getGroup(parseInt(list[i].receiver.slice(1)))
            .subscribe(group => {
                if(group)
                  list[i].receiver = group.name;
                else
                  list[i].receiver = "grupa usunięta"
                console.log("after", list[i]);
                this.handleReceiverChange(i+1, list, subject);
              });
      }
      if(list[i].receiver[0] == "+"){
          this.handleReceiverChange(i+1, list, subject);
      }
    }else{
      subject.next(list);
    }
  }

  getMessagesList(shorten:boolean, whatList:string):Observable<MessageToShow[]>{
  	

    let list:MessageToShow[] = [];

    var subject = new Subject<MessageToShow[]>();

  	this.getRawMessagesList(whatList)
  		.subscribe(messages => {

      list = messages.map(message => ({
  										id: message.id,
  										receiver: (message.user_id != 0) ? ("u" + message.user_id) : 
                        (message.group_id != 0 ? ("g" + message.group_id ): 
                            (message.phone_number)),
  										content: (shorten ? (message.text.slice(0,200) + '...') : message.text),
  										date: message.timestamp.slice(0,10),
  		}));

      console.log(list, messages, "a dziendobry");

      /*list.forEach(message => {

      if(message.receiver[0] == "u"){
        this.contactsService.getContact(parseInt(message.receiver.slice(1)))
          .subscribe(contact => 
            message.receiver = contact.name + " " + contact.surname + ", " + contact.phone_number)
      }
      if(message.receiver[0] == "g"){
        this.groupsService.getGroup(parseInt(message.receiver.slice(1)))
          .subscribe(group =>
            message.receiver = group.name)

      }
                            
      })*/

      this.handleReceiverChange(0, list, subject);

      //console.log(list, "+1");

      //subject.next(list);

      //console.log("elo320");

      });


  	return subject.asObservable();

  }

  getRawMessage(whatList, id):Observable<Message>{
    //bez API
  	/*let list:Message[] = [];
    var subject = new Subject<Date>();

  	this.getRawMessagesList(whatList).subscribe(messages => {
      list = messages;

    });

  	return of(list[id-1]);*/

    //z API
    return this.http.get<Message>
        ('http://' 
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/history_element?id='
          + id);
  }

  getFirstDate(whatList:string):Observable<Date>{

  	let dates = [];
    var subject = new Subject<Date>();

  	this.getRawMessagesList(whatList)
  		.subscribe(messages => {
        dates = messages.map(message => message.timestamp);
        //console.log("daty", dates, typeof dates[0]);
        //console.log(new Date(Math.min.apply(null, dates.map(e => new Date(e)))));
        let firstDate = new Date(Math.min.apply(null, dates.map(e => new Date(e))));
        subject.next(firstDate);
      });

  	return subject.asObservable();
  }

  getLastDate(whatList:string):Observable<Date>{
  	let dates = [];

    var subject = new Subject<Date>();

  	this.getRawMessagesList(whatList)
  		.subscribe(messages => {
        dates = messages.map(message => message.timestamp);
        let lastDate = new Date(Math.max.apply(null, dates.map(e => new Date(e))));
        subject.next(lastDate);
      });

  	

  	return subject.asObservable();
  }

  sendMessage(contactList, groupList, numberList, content, date) : Observable<boolean>{

  	/*if(contactList.length){
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
      
  	}*/

    console.log(contactList, groupList, numberList);

    var subject = new Subject<boolean>();

    this.handleContactsMessageSending(0, contactList, groupList, numberList, content, subject);

  	//console.log(content);
  	//console.log(date);

    return subject.asObservable();
  }

  handleContactsMessageSending(i, contactList, groupList, numberList, content, subject){

    if(i < contactList.length){

      var message : Object = {
          user_id: contactList[i],
          text: content
        }

        console.log("toContact: ", message);

        this.http.post<Object>
          ('http://'
            + config.backendIP
            + ':'
            + config.backendPort
            + '/api/send_user', message)
        .subscribe(data =>{
          console.log(data);
          this.handleContactsMessageSending(i+1, contactList, groupList, numberList, content, subject)
        });

    }else{
      this.handleGroupsMessageSending(0, groupList, numberList, content, subject);
    }

  }

  handleGroupsMessageSending(i, groupList, numberList, content, subject){

    if(i < groupList.length){

      var message : Object = {
          group_id: groupList[i],
          text: content
        }

        console.log("toGroup: ", message);

        this.http.post<Object>
          ('http://'
            + config.backendIP
            + ':'
            + config.backendPort
            + '/api/send_group', message)
        .subscribe(data =>{
          console.log(data);
          this.handleGroupsMessageSending(i+1, groupList, numberList, content, subject)
        });

    }else{
      this.handleNumberMessageSending(0, numberList, content, subject);
    }

  }

  handleNumberMessageSending(i, numberList, content, subject){

    if(i < numberList.length){

      var message : Object = {
          phone_number: numberList[i],
          text: content
        }

        console.log("toNumber: ", message);

        this.http.post<Object>
          ('http://'
            + config.backendIP
            + ':'
            + config.backendPort
            + '/api/send_number', message)
        .subscribe(data =>{
          console.log(data);
          this.handleNumberMessageSending(i+1, numberList, content, subject)
        });

    } else {
      subject.next(true);
    }

  }

}
