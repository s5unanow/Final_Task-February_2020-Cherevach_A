"use strict";
const uniqueStorageID = "asdffdavjssd8";

class Storage {
  static hasItems() {
    return window.localStorage.getItem(uniqueStorageID);
  }
  static loadItems() {
    let items = window.localStorage.getItem(uniqueStorageID);
    items = Array.from(JSON.parse(items));
    return items
  }
  static saveItems(items) {
    let serializedItems = JSON.stringify(items);
    window.localStorage.setItem(uniqueStorageID, serializedItems);
  }
  static clearStorage() {
    window.localStorage.removeItem(uniqueStorageID);
  }
}

class Bag {
  constructor() {
    this.items = [];
  }
  initialize() {
    if (Storage.hasItems()) {
      this.items = Storage.loadItems();
    }
  }
  hasBestOfferItems() {
    return BestOffer.includesItems(this.items)
  }
  hasItems() {
    return this.items.length > 0
  }
  includesItem(itemID) {
    return this.items.some(item => item.id === itemID)
  }
  addItem(item) {
    if (this.includesItem(item.id)) {
      this.increaseItemQuantity(item.id)
    } else {

    }
    Storage.saveItems(this.items);
  }
  addBestOfferItems(itemLeft, itemRight) {
    Storage.saveItems(this.items);
  }
  increaseItemQuantity(itemID) {
    let item = this.getItemByID(itemID);
    item.quantity++;
    Storage.saveItems(this.items);
  }
  decreaseItemQuantity(itemID) {
    let item = this.getItemByID(itemID);
    item.quantity--;
    if (item.quantity === 0) {
      this.removeItem(itemID);
    }
    Storage.saveItems(this.items);
  }
  getItemByID(itemID) {
    return this.items.filter(item => item.id === itemID)[0];
  }
  removeItem(itemID) {
    this.items = this.items.filter(item => item.id !== itemID);
  }
  getTotalPrice() {
    let price = 0;
    if (this.hasItems()) {
      price = this.items.reduce((price, itemPrice) => price + itemPrice,
        0);
      if (this.hasBestOfferItems()) {
        price -= BestOffer.getDiscount();
      }
    }
    return price
  }
  getItems() {
    return this.items
  }
  clearBag() {
    this.items = [];
    Storage.clearStorage();
  }
  static create() {
    return new Bag();
  }
}

class EventDispatcher {

}

const bag = Bag.create().initialize();
const layoutBuilder = new LayoutBuilder();
const dispatcher = new EventDispatcher();

