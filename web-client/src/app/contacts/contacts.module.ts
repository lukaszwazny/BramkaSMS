import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactAddComponent } from './contact-add/contact-add.component';



@NgModule({
  declarations: [ContactListComponent, ContactDetailsComponent, ContactAddComponent],
  imports: [
    CommonModule
  ]
})
export class ContactsModule { }
