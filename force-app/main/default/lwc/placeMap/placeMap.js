import { LightningElement, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import PLACE_LIST_UPDATE_MESSAGE from '@salesforce/messageChannel/PlaceListUpdate__c';
export default class Map extends LightningElement {
  mapMarkers = [];
  subscription = null;
  @wire(MessageContext)
  messageContext;
  connectedCallback() {
    // Subscribe to PlaceListUpdate__c message
    this.subscription = subscribe(
        this.messageContext,
        PLACE_LIST_UPDATE_MESSAGE,
        (message) => {
            this.handlePlaceListUpdate(message);
        });
  }
  disconnectedCallback() {
    // Unsubscribe from PlaceListUpdate__c message
    unsubscribe(this.subscription);
    this.subscription = null;
  }
  handlePlaceListUpdate(message) {
    this.mapMarkers = message.places.map(place => {
      const Latitude = place.Location__Latitude__s;
      const Longitude = place.Location__Longitude__s;
      return {
        location: { Latitude, Longitude },
        title: place.Name,
        description: `Coords: ${Latitude}, ${Longitude}`,
        icon: 'utility:trailhead'
      };
    });
  }
}
