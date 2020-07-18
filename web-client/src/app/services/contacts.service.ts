import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { of } from 'rxjs';
import {Contact} from '../data/contacts/contact';
import {Group} from '../data/groups/group';
import contactList from '../../assets/MOCK_DATA_CONTACS.json'
import groupList from '../../assets/MOCK_DATA_GROUPS.json'
import config from '../../assets/config.json'

import {timeout} from 'rxjs/operators'

import { HttpHeaders } from '@angular/common/http';

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

      //timeout test
      /*var list;
      this.http.get<Object[]>('http://slowwly.robertomurray.co.uk/delay/30000/url/https://jsonplaceholder.typicode.com/posts')
      .pipe(timeout(35000))
      .subscribe(r => {list = r; console.log(r)});*/

      //z API
      return this.http.get<Contact[]>
        ('http://' 
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/users');
  }

  addContact(name, surname, phoneNumber){
  	console.log(name, surname, phoneNumber, groupList);
    var contact = {
      "name": name,
      "surname": surname,
      "phone_number": phoneNumber,
      "group_id": -1
    };

    /*let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*' });
    let options = { headers: headers };*/
    
    return this.http.post<any>
      ('http://'
        + config.backendIP
        + ':'
        + config.backendPort
        + '/api/users', contact);
    console.log(contact);
  }

  addContactToGroup(user_id, group_id): Observable<Contact[]>{

    return this.http.post<any>
                        ('http://'
                        + config.backendIP
                        + ':'
                        + config.backendPort
                        + '/api/groups/user', {
                          "user_id": user_id,
                          "group_id": group_id
                        });

  }

  deleteContactFromGroup(user_id, group_id): Observable<Contact[]>{
    console.log("deleting: " + user_id + " from " + group_id);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        user_id: user_id,
        group_id: group_id,
      },
    };
    return this.http.delete<any>
                        ('http://'
                        + config.backendIP
                        + ':'
                        + config.backendPort
                        + '/api/groups/user', options);

  }

  deleteContact(id){
  	console.log('deleting '+ id);
    return this.http.delete<Contact>
      ('http://'
        + config.backendIP
        + ':'
        + config.backendPort
        + '/api/users?id='
        + id)
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

  getContactGroups(id) : Observable<Group[]> {
    //bez API
  	//returns random groups
  	/*let randNrOfGroups  = Math.floor(Math.random() * 5);
  	let list = [];
  	for(let i = 0; i < randNrOfGroups; i++){
  		let randGroup = groupList[Math.floor(Math.random() * groupList.length)];
  		console.log(randGroup);
  		list.push(randGroup);
  	}
  	return list;*/

    //z API
    return this.http.get<Group[]>
      ('http://' 
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/user/groups?id='
          + id);
  }

}