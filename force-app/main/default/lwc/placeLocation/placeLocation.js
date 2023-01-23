import { LightningElement, api, wire } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

// Set Place object fields
const NAME_FIELD = "Place__c.Name";
const LOCATION_LATITUDE_FIELD = "Place__c.Location__Latitude__s";
const LOCATION_LONGITUDE_FIELD = "Place__c.Location__Longitude__s";
const IMAGES_FIELD = "Place__c.Images__c";
const WEBSITE_FIELD = "Place__c.Website__c";
const TICKET_PRICE_FIELD = "Place__c.TicketPrice__c";
const TYPE_FIELD = "Place__c.Type__c";
const RICHTEXT_FIELD = "Place__c.Guide__c";

const placeFields = [
  NAME_FIELD,
  LOCATION_LATITUDE_FIELD,
  LOCATION_LONGITUDE_FIELD,
  IMAGES_FIELD,
  WEBSITE_FIELD,
  TICKET_PRICE_FIELD,
  TYPE_FIELD,
  RICHTEXT_FIELD
];

export default class PlaceLocation extends LightningElement {
  @api recordId;
  name;
  type;
  images = [];
  website;
  additionalInformation;
  ticketPrice;
  richtext;
  mapMarkers = [];

  @wire(getRecord, { recordId: "$recordId", fields: placeFields })
  loadPlace({ error, data }) {
    if (error) {
      // TODO: handle error
    } else if (data) {
      // Get Place data
      this.name = getFieldValue(data, NAME_FIELD);
      this.type = getFieldValue(data, TYPE_FIELD);
      this.website = getFieldValue(data, WEBSITE_FIELD);
      this.richtext = getFieldValue(data, RICHTEXT_FIELD);
      let Images = getFieldValue(data, IMAGES_FIELD);
      console.log(this.richtext);
      Images.split(';').forEach(img => {
        this.images.push(img);
      });
      this.ticketPrice = getFieldValue(data, TICKET_PRICE_FIELD);
      const Latitude = getFieldValue(data, LOCATION_LATITUDE_FIELD);
      const Longitude = getFieldValue(data, LOCATION_LONGITUDE_FIELD);
      // Transform Place data into map markers
      this.mapMarkers = [
        {
          location: { Latitude, Longitude },
          title: this.name,
          description: `Coords: ${Latitude}, ${Longitude}`,
        },
      ];
    }
  }
  get cardTitle() {
    return this.name ? `${this.name}'s location` : "Place location";
  }
}
