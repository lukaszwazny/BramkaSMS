import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { of } from 'rxjs';
import {Contact} from '../data/contacts/contact';
import {Group} from '../data/groups/group';
import contactList from '../../assets/MOCK_DATA_CONTACS.json'
import groupList from '../../assets/MOCK_DATA_GROUPS.json'

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor() {

  }

  getContactList(name, surname, phoneNumber) : Observable<Contact[]> {
  		//do podmiany, gdy będzie API
  		let list : Contact[] = contactList;
  		let obsList = of(list);
  		return obsList;
  }

  getGroupList(name) : Observable<Group[]> {
  		//do podmiany, gdy będzie API
  		let list : Group[] = groupList;
  		let obsList = of(list);
  		return obsList;
  }

  addContact(name, surname, phoneNumber, groupList){
  	console.log(name, surname, phoneNumber, groupList);
  }

  deleteContact(id){
  	console.log('deleting '+ id);
  }

  getContact(id) : Contact{
  	return Observable.of(contactList[Math.floor(Math.random() * contactList.length)])
  }

}
