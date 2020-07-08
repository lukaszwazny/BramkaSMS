import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import { of } from 'rxjs';

import {Group} from '../data/groups/group';
import {Contact} from '../data/contacts/contact';
import groupList from '../../assets/MOCK_DATA_GROUPS.json'
import contactList from '../../assets/MOCK_DATA_CONTACS.json'

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor() { }

   getGroupList() : Observable<Group[]> {
  		//bez API
  		/*let list : Group[] = groupList;
  		let obsList = of(list);
  		return obsList;*/

      return this.http.get<Group[]>
        ('http://'
          + config.backendIP
          + ':'
          + config.backendPort
          + '/api/groups');
  }

    getGroup(id) : Group{
  	//return Observable.of(contactList[Math.floor(Math.random() * contactList.length)])
  	return groupList[id-1];
  }

  addGroup(name, contactList : Contact[]){
  	console.log(name);
  	console.log(contactList);

    var object = {
      name: name
    };

    this.http.post<Object>
      ('http://'
        + config.backendIP
        + ':'
        + config.backendPort
        + '/api/groups', object);
  }

  deleteGroup(id){
  	console.log('deleting '+ id);

    this.http.delete<Group>
      ('http://'
        + config.backendIP
        + ':'
        + config.backendPort
        + '/api/groups?id='
        + id);
  }

  getGroupContacts(id) : Observable<Contact[]> {
    //bez API
  	//returns random groups
  	/*let randNrOfContacts  = Math.floor(Math.random() * 20);
  	let list = [];
  	for(let i = 0; i < randNrOfContacts; i++){
  		let randContact = contactList[Math.floor(Math.random() * contactList.length)];
  		console.log(randContact);
  		list.push(randContact);
  	}
  	let obsList = of(list);
  	return obsList;*/

    //z API
    return this.http.get<Contact[]>
      ('http://'
        + config.backendIP
        + ':'
        + config.backendPort
        + '/api/group?id='
        + id);
  }


  updateGroup(group: Group, contacts: Contact[]){
  	console.log('updating ' + group.id + ' ' + group.name + ' ' + contacts)
  
    this.http.put<Group>
      ('http://'
        + config.backendIP
        + ':'
        + config.backendPort
        + '/api/groups', group);
  }
}
