import { LightningElement, api } from "lwc";
import ursusResources from "@salesforce/resourceUrl/ursus_park";
export default class Tile extends LightningElement {
  @api place;
  appResources = {
    placeSilhouette: `${ursusResources}/standing-bear-silhouette.png`,
    cafe: `${ursusResources}/cafe.png`,
    church: `${ursusResources}/church.png`,
    cityCenter: `${ursusResources}/city-center.png`,
    fortress: `${ursusResources}/fortress.png`,
    lunaPark: `${ursusResources}/luna-park.png`,
    museum: `${ursusResources}/museum.png`,
    zoo: `${ursusResources}/zoo.png`,
    park: `${ursusResources}/park.png`,
    restaurant: `${ursusResources}/restaurant.png`,
    shoppingMall: `${ursusResources}/shopping-mall.png`,
    statue: `${ursusResources}/statue.png`,
    street: `${ursusResources}/street.png`,
    viewpoint: `${ursusResources}/viewpoint.png`
  };

  get isCafe() {
    return this.place.Type__c == "Cafe";
  }

  get isRestaurant() {
    return this.place.Type__c == "Restaurant";
  }

  get isChurch() {
    return this.place.Type__c == "Church";
  }

  get isCityCenter() {
    return this.place.Type__c == "City center";
  }

  get isFortress() {
    return this.place.Type__c == "Fortress";
  }

  get isLunaPark() {
    return this.place.Type__c == "Luna park";
  }

  get isMuseum() {
    return this.place.Type__c == "Museum";
  }

  get isPark() {
    return this.place.Type__c == "Park";
  }

  get isShoppingCenter() {
    return this.place.Type__c == "Shopping center";
  }

  get isStatue() {
    return this.place.Type__c == "Statue";
  }

  get isStreet() {
    return this.place.Type__c == "Street";
  }
  
  get isZoo() {
    return this.place.Type__c == "Zoo";
  }

  get isViewpoint() {
    return this.place.Type__c == "Viewpoint";
  }

  handleOpenRecordClick() {
    const selectEvent = new CustomEvent("placeview", {
      detail: this.place.Id,
    });
    this.dispatchEvent(selectEvent);
  }
}
