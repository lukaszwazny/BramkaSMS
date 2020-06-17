import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupEditComponent } from './group-edit/group-edit.component';



@NgModule({
  declarations: [GroupListComponent, GroupDetailsComponent, GroupAddComponent, GroupEditComponent],
  imports: [
    CommonModule
  ]
})
export class GroupsModule { }
