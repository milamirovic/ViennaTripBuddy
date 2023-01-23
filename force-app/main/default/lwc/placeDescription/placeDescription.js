import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

// Set Place object fields
const NAME_FIELD = "Place__c.Name";
const DESCRIPTION_FIELD = "Place__c.Description__c";
const WEBSITE_FIELD = "Place__c.Website__c";

const placeFields = [
  NAME_FIELD,
  DESCRIPTION_FIELD,
  WEBSITE_FIELD
];

export default class PlaceDescription extends LightningElement {
  @api recordId;
  name;
  description;
  website;

  @wire(getRecord, { recordId: "$recordId", fields: placeFields })
  loadPlace({ error, data }) {
    if (error) {
      // TODO: handle error
    } else if (data) {
      // Get Place data
      this.name = getFieldValue(data, NAME_FIELD);
      this.description = getFieldValue(data, DESCRIPTION_FIELD);
      this.website = getFieldValue(data, WEBSITE_FIELD);
    }
  }

  visitWebsiteClicked(event) {
    window.open(this.website);
  }
}
