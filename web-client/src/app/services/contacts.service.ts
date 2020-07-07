import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { of } from 'rxjs';
import {Contact} from '../data/contacts/contact';
import {Group} from '../data/groups/group';
import contactList from '../../assets/MOCK_DATA_CONTACS.json'
import groupList from '../../assets/MOCK_DATA_GROUPS.json'
import config from '../../assets/config.json'

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http:HttpClient) {

  }

  getContactList() : Observable<Contact[]> {

  		//bez API (mockowy json)
  		/*let list : Contact[] = contactList;
  		list.forEach( elem => {
  			elem.fullData = elem.name + ' ' + elem.surname + ', ' + elem.phoneNumber;
  		})
  		let obsList = of(list);
  		return obsList;*/

      //z API
      console.log('http://' 
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/users');
      var contactList = this.http.get<Contact[]>
        ('http://' 
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/users');
      var elo;
      //contactList.subscribe(contact => console.log(contact));
      //console.log(contactList);
      return this.http.get<Contact[]>
        ('http://' 
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/users');
  }

  addContact(name, surname, phoneNumber, groupList){
  	console.log(name, surname, phoneNumber, groupList);
  }

  deleteContact(id){
  	console.log('deleting '+ id);
  }

  updateContact(contact : Contact, groups: Group[]){
  	//console.log('updating ' + contact.id + ' ' + contact.name + ' ' + //contact.surname + ' ' + contact.phoneNumber + ' ' + groups)
  }

  getContact(id) : any{
  	//return Observable.of(contactList[Math.floor(Math.random() * contactList.length)])
  	/*let contact:Contact = contactList[id-1];
  	console.log(id);
  	contact.fullData = contact.name + ' ' + contact.surname + ', ' + contact.phoneNumber;
  	return contact;*/
  }

  getContactGroups(id) : Group[] {
  	//returns random groups
  	let randNrOfGroups  = Math.floor(Math.random() * 5);
  	let list = [];
  	for(let i = 0; i < randNrOfGroups; i++){
  		let randGroup = groupList[Math.floor(Math.random() * groupList.length)];
  		console.log(randGroup);
  		list.push(randGroup);
  	}
  	return list;
  }

}