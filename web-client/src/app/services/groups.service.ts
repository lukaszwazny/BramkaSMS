import { Injectable } from '@angular/core';

import {Observable} from 'rxjs';
import { of } from 'rxjs';

import {Group} from '../data/groups/group';
import groupList from '../../assets/MOCK_DATA_GROUPS.json'

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  constructor() { }

   getGroupList(name) : Observable<Group[]> {
  		//do podmiany, gdy będzie API
  		let list : Group[] = groupList;
  		let obsList = of(list);
  		return obsList;
  }
}
