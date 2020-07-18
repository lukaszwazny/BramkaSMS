import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {MessageToShow} from '../../data/messages/message-to-show';
import {MessagesService} from '../../services/messages.service';

import {ViewChild} from '@angular/core'

@Component({
  selector: 'app-message-history',
  templateUrl: './message-history.component.html',
  styleUrls: ['./message-history.component.css']
})
export class MessageHistoryComponent implements OnInit {

  messagesList : MessageToShow[];

  filteredMessages : MessageToShow[];

  @ViewChild('sorting') sorting;

  @ViewChild('receiver') receiver;
  @ViewChild('content') content;

	from : any = new Date();
	to : any = new Date();

  constructor(	private messagesService: MessagesService, 
  				private router: Router) { }

  ngOnInit() {
  	this.messagesService
  		.getMessagesList(true, 'sent')
  		.subscribe(message => {
        this.messagesList = message; 
        this.assignCopy(); 
        console.log(this.messagesList, "siemanko w mojej kuchni");
        this.messagesService
          .getFirstDate('sent')
          .subscribe(date => {
            this.from = date; console.log(date)
            this.messagesService
              .getLastDate('sent')
              .subscribe(date => this.to = date);
          });
      });

    

  	

  }

  assignCopy(){
    this.filteredMessages = Object.assign([], this.messagesList);
  }

  toMessageAdd(){
    this.router.navigate(['/messages/add']);
  }

  toMessageDetails(id) {
    this.router.navigate(['/messageshistory/' + id]);
  }

  filter(receiver, content){

     this.filteredMessages = Object.assign([], this.messagesList).filter(
        item => item.receiver.toLowerCase().indexOf(receiver.toLowerCase()) > -1
     );

     this.filteredMessages = Object.assign([], this.filteredMessages).filter(
        item => item.content.toLowerCase().indexOf(content.toLowerCase()) > -1
     );

     this.setDate();

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
  console.log(property);

  switch(property){

    case '1': 
    this.filteredMessages.sort(this.dynamicSort("receiver"));
      break;

    case '2': 
    this.filteredMessages.sort(this.dynamicSort("-receiver"));
      break;

    case '3': 
    this.filteredMessages.sort(this.dynamicSort("date"));
      break;

    case '4': 
    this.filteredMessages.sort(this.dynamicSort("-date"));
      break;

  }

  }

  setDate(){

  if(Object.prototype.toString.call(this.from) === '[object Date]'){
  	this.from = this.from.toISOString().slice(0,10);
  	console.log(this.from);
  }

  if(Object.prototype.toString.call(this.to) === '[object Date]'){
  	this.to = this.to.toISOString().slice(0,10);
  	console.log(this.to);
  }

  	this.filteredMessages = this.filteredMessages.filter(message => message.date >= this.from && message.date <= this.to);

  	 this.sort(this.sorting.nativeElement.value);
  	
  }

}

//XD, bez tego nie działa *ngFor
@NgModule({
	declarations: [MessageHistoryComponent],
	imports: [CommonModule, FormsModule]
})
class MessageHistoryModule{}
