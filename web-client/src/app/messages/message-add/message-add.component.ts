import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import { NgxMaskModule, IConfig } from 'ngx-mask'
import { TextMaskModule } from 'angular2-text-mask';

import {Group} from '../../data/groups/group';
import {Contact} from '../../data/contacts/contact';
import {ContactsService} from '../../services/contacts.service';
import {GroupsService} from '../../services/groups.service';
import {MessagesService} from '../../services/messages.service';

import {Renderer2} from '@angular/core';
import {ViewChild} from '@angular/core';


@Component({
  selector: 'app-message-add',
  templateUrl: './message-add.component.html',
  styleUrls: ['./message-add.component.css'],
})
export class MessageAddComponent implements OnInit {

  groupList = [];
  selectedGroups = [];
  dropdownSettingsGroups = {};

  contactList = [];
  selectedContacts = [];
  dropdownSettingsContacts = {};

  numbers:string = '';
  content:string = 'Wpisz treść sms-a...';
  immediately:boolean = true;
  date:Date;

  numberList = [];

  mask;

  @ViewChild('dateInput') dateInput;

  constructor(private renderer: Renderer2, private messagesService: MessagesService, private contactsService: ContactsService, private router: Router, private groupsService: GroupsService) { }

  ngOnInit() {

  	this.groupsService
  		.getGroupList()
  		.subscribe(group => this.groupList = group);

  	this.dropdownSettingsGroups = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Zaznacz wszystko',
      unSelectAllText: 'Odzaznacz wszystko',
      searchPlaceholderText: 'Szukaj',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Brak grup'
    };

  	this.contactsService
  		.getContactList()
  		.subscribe(contact => this.contactList = contact);

  	this.dropdownSettingsContacts = {
      singleSelection: false,
      idField: 'id',
      textField: 'fullData',
      selectAllText: 'Zaznacz wszystko',
      unSelectAllText: 'Odzaznacz wszystko',
      searchPlaceholderText: 'Szukaj',
      itemsShowLimit: 30,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'Brak kontaktów'
    };

    this.mask = this.getMask;

  }

  toMessageList() {
    this.router.navigate(['/messages']);
  }

  onItemSelect(item: any) {
    console.log(this.selectedGroups);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  sendMessage(){

  	this.numberList = this.numbers.split(',');
  	this.numberList = this.numberList.filter(num => num != ' ' && num != '');
  	this.numberList = this.numberList.map(num => num.replace(/ /g, ''));

  	this.messagesService.sendMessage(this.selectedContacts.map( cont => cont.id ), 
  									this.selectedGroups.map(group => group.id), 
  									this.numberList, 
  									this.content, 
  									this.immediately ? new Date() : new Date(this.date));

  	this.router.navigate(['/messages']);

  }

  dateVisible(){
  	if(!this.immediately){
  		this.renderer.setStyle(this.dateInput.nativeElement, 'display', 'none');
  	}
  	else{
  		this.renderer.setStyle(this.dateInput.nativeElement, 'display', 'flex');
  	}
  }

  // prettier-ignore
phoneMask10Digit = ['+', '4', '8',' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];
// prettier-ignore
phoneMask11Digit = ['+', '4', '8',' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];
comma = [',', ' '];

getMask = rawValue => {
  const lastKeyDown = rawValue[rawValue.length - 1];
  const lastKeyWasNumber = Number.isInteger(parseInt(lastKeyDown, 10));
  const lastKeyWasComma = lastKeyDown === ",";
  const lastKeyWasSpace = lastKeyDown === " ";
  /**
   * Splits user input into an array of phone numbers
   * @returns {array} [ string ]
   */
  const phoneNumbers = rawValue.split(",").reduce((numbers, string) => {
    // Strip out all chars leaving only numbers
    const digits = string.replace(/[^0-9]/g, "");
    // Single phone number
    if (digits.length < 12) {
      return numbers.concat(digits);
    }

    const firstNumber = digits.slice(0, 11);
    const secondNumber = digits.slice(11);

    // This case is for when a user types in the first number and starts on a 2nd
    return numbers.concat([firstNumber, secondNumber]);
  }, []);

  /**
   * Create a regex for every char of user input
   * @returns {array} [ regex, regex, ...]
   */
  const phoneNumbersMask = phoneNumbers.reduce((mask, phoneNumber, index) => {
    const isFirstPhoneNumber = !index;

    if (phoneNumber.length === 11) {
      if (lastKeyWasNumber || lastKeyWasComma) {
        if (!isFirstPhoneNumber) {
          return mask.concat(...this.comma, ...this.phoneMask11Digit);
        }
        return mask.concat(...this.phoneMask11Digit);
      }
      return mask.concat(...this.phoneMask11Digit, ...this.comma);
    }

    /*if (phoneNumber.length === 10) {
      if (lastKeyWasNumber || lastKeyWasComma) {
        if (!isFirstPhoneNumber) {
          return mask.concat(...this.comma, ...this.phoneMask10Digit);
        }
        return mask.concat(...this.phoneMask10Digit);
      }
      return mask.concat(...this.phoneMask10Digit, ...this.comma);
    }*/

    // If first phone number
    if (isFirstPhoneNumber || lastKeyWasSpace) {
      return mask.concat(...this.phoneMask10Digit);
    }

    // After first number or start of a new number
    if (phoneNumber.length === 0 || lastKeyWasNumber || lastKeyWasComma) {
      return mask.concat(...this.comma, ...this.phoneMask10Digit);
    }

    // Backspaced on '(', ')', ' '
    return mask.concat(...this.phoneMask10Digit);
  }, []);

  return phoneNumbersMask;
};


}


@NgModule({
	declarations: [MessageAddComponent],
	imports: [NgMultiSelectDropDownModule, FormsModule, NgxMaskModule.forRoot(), TextMaskModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
class MessageAddModule{}

