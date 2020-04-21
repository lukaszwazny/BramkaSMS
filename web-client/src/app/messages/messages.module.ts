import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageHistoryComponent } from './message-history/message-history.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageDetailsComponent } from './message-details/message-details.component';
import { MessageAddComponent } from './message-add/message-add.component';



@NgModule({
  declarations: [MessageHistoryComponent, MessageListComponent, MessageDetailsComponent, MessageAddComponent],
  imports: [
    CommonModule
  ]
})
export class MessagesModule { }
