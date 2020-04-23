import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { of } from 'rxjs';
import {Contact} from '../data/contacts/contact';
import contactList from '../../assets/MOCK_DATA_CONTACS.json'

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
}
