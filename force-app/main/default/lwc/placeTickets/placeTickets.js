import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import sendEmail from "@salesforce/apex/PlaceController.sendEmail";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

// Set Place object fields
const NAME_FIELD = "Place__c.Name";
const DESCRIPTION_FIELD = "Place__c.Description__c";
const CHILD_TICKET_PRICE_FIELD = "Place__c.ChildTicketPrice__c";
const STUDENT_TICKET_PRICE_FIELD = "Place__c.StudentTicketPrice__c";
const TICKET_PRICE_FIELD = "Place__c.TicketPrice__c";
const ELDERLY_TICKET_PRICE_FIRELD = "Place__c.ElderlyTicketPrice__c";
const VIDEO_FIELD = "Place__c.Video__c";

const placeFields = [
    NAME_FIELD,
    DESCRIPTION_FIELD,
    CHILD_TICKET_PRICE_FIELD,
    STUDENT_TICKET_PRICE_FIELD,
    TICKET_PRICE_FIELD,
    ELDERLY_TICKET_PRICE_FIRELD,
    VIDEO_FIELD
];

export default class PlaceTickets extends LightningElement {
  @api recordId;
  name;
  description;
  childPrice;
  studentPrice;
  elderlyPrice;
  ticketPrice;
  video;

  adultsNum = 0;
  childrenNum = 0;
  studentsNum = 0;
  elderlyNum = 0;
  sum = 0;
  totalPrice = 0;

  totalVisible = false;

  today = '';
  visitDate = '';

  connectedCallback() {
    let date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    this.today = `${year}-${month}-${day}`;
    this.visitDate = this.today;
  }
  
  get today() {
    return this.today;
  }

  get visitDate() {
    return this.visitDate;
  }

  @wire(getRecord, { recordId: "$recordId", fields: placeFields })
  loadPlace({ error, data }) {
    if (error) {
      // TODO: handle error
    } else if (data) {
      // Get Place data
      this.name = getFieldValue(data, NAME_FIELD);
      this.video = getFieldValue(data, VIDEO_FIELD);
      this.description = getFieldValue(data, DESCRIPTION_FIELD);
      this.ticketPrice = getFieldValue(data, TICKET_PRICE_FIELD);
      this.childPrice = getFieldValue(data, CHILD_TICKET_PRICE_FIELD);
      this.studentPrice = getFieldValue(data, STUDENT_TICKET_PRICE_FIELD);
      this.elderlyPrice = getFieldValue(data, ELDERLY_TICKET_PRICE_FIRELD);
    }
  }

  get sum() {
    return this.sum;
  }

  set sum(newSum) {
    this.sum = newSum;
  }

  get totalPrice() {
    return this.totalPrice;
  }

  set totalPrice(newTotalPrice) {
    this.totalPrice = newTotalPrice;
  }

  get totalVisible() {
    return this.totalVisible;
  }

  updateSum() {
    this.sum = Number(this.adultsNum) + Number(this.childrenNum) + Number(this.studentsNum) + Number(this.elderlyNum);
    if(this.sum > 0)
        this.totalVisible = true;
    else 
        this.totalVisible = false;
}

  updateTotalPrice() {
    this.totalPrice = Number(this.adultsNum) * this.ticketPrice 
        + Number(this.childrenNum) * this.childPrice 
        + Number(this.studentsNum) * this.studentPrice 
        + Number(this.elderlyNum) * this.elderlyPrice;
  }

  adultsChanged(event) {
    if(event.target.value < 0)
        this.adultsChanged = 0;
    else 
        this.adultsNum = event.target.value;
    this.updateSum();
    this.updateTotalPrice();

    console.log(this.template.querySelector('lightning-input').value);
  }

  childrenChanged(event) {
    if(event.target.value < 0)
        this.childrenNum = 0;
    else 
        this.childrenNum = event.target.value;
    this.updateSum();
    this.updateTotalPrice();
  }

  studentsChanged(event) {
    if(event.target.value < 0)
        this.studentsNum = 0;
    else 
        this.studentsNum = event.target.value;
    this.updateSum();
    this.updateTotalPrice();
  }

  elderlyChanged(event) {
    if(event.target.value < 0)
        this.elderlyNum = 0;
    else this.elderlyNum = event.target.value;
    this.updateSum();
    this.updateTotalPrice();
  }

  dateChanged(event) {
    this.visitDate = event.target.value;
  }

  showNotification(_title, _message, _variant, _mode) {
    const evt = new ShowToastEvent({
      title: _title,
      message: _message,
      variant: _variant,
      mode: _mode
    });
    this.dispatchEvent(evt);
  }

  handleReservationClick(event) {
    // poslati mejl koji u sebi sadrzi neki templejt koji predstavlja rezervaciju
    // primalac je trenutni user
    if(this.sum === 0 && this.totalPrice === 0) {
        this.showNotification(
            "You must select at least 1 ticket to make a reservation!",
            ``,
            "error",
            "dismissable"
          ); 
    }
    else {
        sendEmail({ totalPrice: this.totalPrice, numberOfTickets: this.sum, visitDate: this.visitDate, placeName: this.name }).then(res => {
            this.showNotification(
                "Successfull Reservation! An Email is sent to your account.",
                ``,
                "success",
                "dismissable"
            );
            this.adultsNum = 0;
            this.childrenNum = 0;
            this.studentsNum = 0;
            this.elderlyNum = 0;
            this.sum = 0;
            this.totalPrice = 0;

            console.log(this.template.querySelector('lightning-input').value);
        })
        .catch(err => console.error('Error in sendEmail method: ', err));
    }
  }
}
