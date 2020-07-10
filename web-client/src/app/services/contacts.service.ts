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
      return this.http.get<Contact[]>
        ('http://' 
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/users');
  }

  addContact(name, surname, phoneNumber, groupList){
  	console.log(name, surname, phoneNumber, groupList);
    var contact = {
      "name": name,
      "surname": surname,
      "phone_number": phoneNumber,
      "group_id": 0
    };
    
    this.http.post<any>
      ('http://'
        + config.backendIP
        + ':'
        + config.backendPort
        + '/api/users', contact)
        .subscribe(data => console.log(data));
    console.log(contact);
  }

  deleteContact(id){
  	console.log('deleting '+ id);
    this.http.delete<Contact>
      ('http://'
        + config.backendIP
        + ':'
        + config.backendPort
        + '/api/users?id='
        + id)
      .subscribe(data => console.log(data));
  }

  updateContact(contact : Contact, groups: Group[]){
  	//console.log('updating ' + contact.id + ' ' + contact.name + ' ' + //contact.surname + ' ' + contact.phoneNumber + ' ' + groups)
    this.http.put<Contact>
      ('http://'
        + config.backendIP
        + ':'
        + config.backendPort
        + '/api/users', contact)
        .subscribe(data => console.log(data));

  }

  getContact(id) : Observable<Contact>{
  	//bez API
  	/*let contact:Contact = contactList[id-1];
  	console.log(id);
  	contact.fullData = contact.name + ' ' + contact.surname + ', ' + contact.phoneNumber;
  	return contact;*/

    //z API
    return this.http.get<Contact>
        ('http://' 
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/user?id='
          + id);
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