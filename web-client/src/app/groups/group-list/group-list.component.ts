import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Group} from '../../data/groups/group';
import {GroupsService} from '../../services/groups.service';

import {Router} from '@angular/router';
import {Renderer2} from '@angular/core';
import {ViewChild} from '@angular/core'

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

 groupList : Group[];

  filteredGroups : Group[];

  @ViewChild('sorting') sorting;

	name: string = '';

	groupToDelete: Group = new Group();

	@ViewChild('modal') modal;

  constructor(	private groupsService: GroupsService, 
  				private router: Router,
  				private renderer: Renderer2) { }

  ngOnInit() {
  	this.groupsService
  		.getGroupList()
  		.subscribe(group => this.groupList = group);

    this.assignCopy();

  }

  assignCopy(){
    this.filteredGroups = Object.assign([], this.groupList);
  }

  toGroupAdd(){
    this.router.navigate(['/groups/add']);
  }

  toGroupDetails(id) {
    this.router.navigate(['/groups/' + id]);
  }

  toGroupEdit(id) {
    this.router.navigate(['/groups/' + id + '/edit']);
  }

  deleteGroup(id){
  	this.groupsService.deleteGroup(id);
  	this.ngOnInit();
  	this.closeModal();
  }

  openModal(group: Group){
  	this.groupToDelete = group;
  	this.renderer.addClass(this.modal.nativeElement, 'show');
  	this.renderer.setStyle(this.modal.nativeElement, 'display', 'block');
  }

  closeModal(){
  	this.renderer.removeClass(this.modal.nativeElement, 'show');
  	this.renderer.setStyle(this.modal.nativeElement, 'display', 'none');
  }

  filter(name){

    if(!name){
         this.assignCopy();
     } // when nothing has typed

    this.filteredGroups = Object.assign([], this.groupList).filter(
        item => item.name.toLowerCase().indexOf(name.toLowerCase()) > -1);

        this.sort(this.sorting.nativeElement.value);

  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

  sort(property){

  switch(property){

    case '1': 
    this.filteredGroups.sort(this.dynamicSort("name"));
      break;

    case '2': 
    this.filteredGroups.sort(this.dynamicSort("-name"));
      break;  
  }

  }

}

//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [GroupListComponent],
	imports: [CommonModule]
})
class GroupListModule{}