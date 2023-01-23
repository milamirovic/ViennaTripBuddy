import { publish, MessageContext } from "lightning/messageService";
import PLACE_LIST_UPDATE_MESSAGE from "@salesforce/messageChannel/PlaceListUpdate__c";
import { NavigationMixin } from "lightning/navigation";
import { LightningElement, wire } from "lwc";
/** PlaceController.searchPlaces(searchTerm) Apex method */
import searchPlaces from "@salesforce/apex/PlaceController.searchPlaces";
export default class List extends NavigationMixin(LightningElement) {
  searchTerm = "";

  places;
  @wire(MessageContext) messageContext;
  @wire(searchPlaces, { searchTerm: "$searchTerm" })
  loadPlaces(result) {
    this.places = result;
    if (result.data) {
      const message = {
        places: result.data,
      };
      publish(this.messageContext, PLACE_LIST_UPDATE_MESSAGE, message);
    }
  }

  handleSearchTermChange(event) {
    // Debouncing this method: do not update the reactive property as
    // long as this function is being called within a delay of 300 ms.
    // This is to avoid a very large number of Apex method calls.
    window.clearTimeout(this.delayTimeout);
    const searchTerm = event.target.value;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.delayTimeout = setTimeout(() => {
      this.searchTerm = searchTerm;
    }, 300);
  }
  get hasResults() {
    return this.places.data.length > 0;
  }
  handlePlaceView(event) {
    // Get place record id from placeview event
    const placeId = event.detail;
    // Navigate to place record page
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: placeId,
        objectApiName: "Place__c",
        actionName: "view",
      },
    });
  }
}
