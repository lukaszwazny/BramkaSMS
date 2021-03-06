import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Contact} from '../../data/contacts/contact';
import {Group} from '../../data/groups/group';
import {GroupsService} from '../../services/groups.service';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import {Renderer2} from '@angular/core';
import {ViewChild} from '@angular/core'

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  group;
  contactsOfGroup: Contact[];

  @ViewChild('modal') modal;

  constructor(private groupsService: GroupsService,
    private route: ActivatedRoute, private router: Router, private renderer: Renderer2) { }

  ngOnInit() {
  	let id = this.route.snapshot.paramMap.get('id');
    this.groupsService.getGroup(id)
        .subscribe(group => {
          this.group = group; 
          console.log(this.group);

          this.groupsService.getGroupContacts(id)
            .subscribe(contacts => this.contactsOfGroup = contacts);
        });
    //this.group = this.groupsService.getGroup(id);

  }

  toContactDetails(id){
  	this.router.navigate(['/contacts/' + id]);
  }

  toGroupEdit() {
    this.router.navigate(['/groups/' + this.group.group_id + '/edit']);
  }

  toGroups() {
    this.router.navigate(['/groups']);
  }

  deleteGroup(){
  	this.groupsService.deleteGroup(this.group.group_id)
      .subscribe(data => {
        console.log(data);
        this.router.navigate(['/groups']);
      });
  	
  	//this.closeModal();
  }

  openModal(){
  	this.renderer.addClass(this.modal.nativeElement, 'show');
  	this.renderer.setStyle(this.modal.nativeElement, 'display', 'block');
  }

  closeModal(){
  	this.renderer.removeClass(this.modal.nativeElement, 'show');
  	this.renderer.setStyle(this.modal.nativeElement, 'display', 'none');
  }

}

//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [GroupDetailsComponent],
	imports: [CommonModule]
})
class GroupDetailsModule{}