import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomepageComponent} from './commons/homepage/homepage.component';

import {GroupListComponent} from './groups/group-list/group-list.component';
import {GroupAddComponent} from './groups/group-add/group-add.component';
import {GroupDetailsComponent} from './groups/group-details/group-details.component';
import {GroupEditComponent} from './groups/group-edit/group-edit.component';

import {MessageListComponent} from './messages/message-list/message-list.component';
import {MessageAddComponent} from './messages/message-add/message-add.component';
import {MessageHistoryComponent} from './messages/message-history/message-history.component';

import {ContactListComponent} from './contacts/contact-list/contact-list.component';
import {ContactAddComponent} from './contacts/contact-add/contact-add.component';
import {ContactDetailsComponent} from './contacts/contact-details/contact-details.component';
import {ContactEditComponent} from './contacts/contact-edit/contact-edit.component';


const routes: Routes = [
	{path: '', redirectTo: '/homepage', pathMatch: 'full'},
	{path: 'homepage', component: HomepageComponent},

	{path: 'groups', redirectTo: 'groups/list'},
	{path: 'groups/list', component: GroupListComponent},
	{path: 'groups/add', component: GroupAddComponent},
	{path: 'groups/:id', component: GroupDetailsComponent},
	{path: 'groups/:id/edit', component: GroupEditComponent},

	{path: 'messages', redirectTo: 'messages/list'},
	{path: 'messages/list', component: MessageListComponent},
	{path: 'messages/add', component: MessageAddComponent},
	{path: 'messages/history', component: MessageHistoryComponent},

	{path: 'contacts', redirectTo: 'contacts/list'},
	{path: 'contacts/list', component: ContactListComponent},
	{path: 'contacts/add', component: ContactAddComponent},
	{path: 'contacts/:id', component: ContactDetailsComponent},
	{path: 'contacts/:id/edit', component: ContactEditComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
