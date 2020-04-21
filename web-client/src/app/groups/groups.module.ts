import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupAddComponent } from './group-add/group-add.component';



@NgModule({
  declarations: [GroupListComponent, GroupDetailsComponent, GroupAddComponent],
  imports: [
    CommonModule
  ]
})
export class GroupsModule { }
