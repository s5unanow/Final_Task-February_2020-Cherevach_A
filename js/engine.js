"use strict";
const uniqueStorageID = "asdffdavjssd8";

class bagItem {
  constructor(id, name, price, color, size) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.color = color;
    this.size = size;
  }
}

class BagItems {
  static isItemsSame(item1, item2) {
    let result = true;
    for (let param of item1) {
      if (item1[param] !== item2[param]) result = false
    }
    return result
  }
}

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
  getItemsQuantity() {
    return this.items.length;
  }
  getItems() {
    return this.items
  }
  clearBag() {
    this.items = [];
    Storage.clearStorage();
  }
  static create() {
    let bag = new Bag();
    bag.initialize()
    return bag;
  }
}

class EventDispatcher {

}

class LayoutBuilder {
  constructor(bag) {
    this.bag = bag;
    this.DOMbag = document.getElementsByClassName("header__bag")[0]
  }
  updateDOMBag() {
    let quantity = this.bag.getItemsQuantity();
    this.DOMbag.querySelector(".bag__quantity").innerText = quantity;

    let totalPrice = "£" + this.bag.getTotalPrice();
    if (quantity === 0) {
      this.DOMbag.querySelector(".bag__price").innerText = "";
    } else {
      this.DOMbag.querySelector(".bag__price").innerText = totalPrice;
    }

  }
}

const currentPage = document.getElementsByTagName("title")[0].innerText;
const bag = Bag.create();
const layoutBuilder = new LayoutBuilder(bag);
const dispatcher = new EventDispatcher();

layoutBuilder.updateDOMBag();

if (currentPage.includes("Start")) {

}
if (currentPage.includes("Catalog")) {
  layoutBuilder.buildDOMCatalog();
}
if (currentPage.includes("Item")) {

}
if (currentPage.includes("Shopping")) {
  layoutBuilder.guildDOMBagItems();
}

