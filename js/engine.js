"use strict";

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
    return BestOffer.includesDiscountedItems(this.items)
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
      this.items.push(item);
    }
    Storage.saveItems(this.items);
  }
  addBestOfferItems(itemLeft, itemRight) {
    Storage.saveItems(this.items);
  }
  increaseItemQuantity(itemID) {
    let item = this.getItemByID(itemID);
    item.quantity += 1;
    Storage.saveItems(this.items);
  }
  decreaseItemQuantity(itemID) {
    let item = this.getItemByID(itemID);
    item.quantity -= 1;
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
      price = this.items.reduce((price, item) => price + item.price * item.quantity,
        0);
      if (this.hasBestOfferItems()) {
        price -= BestOffer.getDiscount();
      }
    }
    return price
  }
  getItemsQuantity() {
    return this.items.reduce((totalQuantity, item) => {
      return totalQuantity + item.quantity
    }, 0);
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
    bag.initialize();
    return bag;
  }
}

class EventDispatcher {
  constructor(bag, layoutBuilder) {
    this.bag = bag;
    this.layoutBuilder = layoutBuilder;
  }
  addItemToBag(event) {
    let id = document.querySelector(".section-item").id;
    let size = this.getItemSize();
    let color = this.getItemColor();
    let item = BagItem.createItem(id, size, color);
    this.bag.addItem(item);
    this.layoutBuilder.updateDOMBag();
  }
  getItemSize() {
    let result = null;
    let DOMSizes = document.querySelectorAll(".parameter__sizes radio");
    for (let DOMSize of DOMSizes) {
      if (DOMSize.checked) result = DOMSize.id
    }
    return result
  }
  getItemColor() {
    let result = null;
    let DOMColors = document.querySelectorAll(".parameter__colors radio");
    for (let DOMColor of DOMColors) {
      if (DOMColor.checked) result = DOMColor.id
    }
    return result
  }
}

class LayoutBuilder {
  constructor(bag) {
    this.bag = bag;
    this.DOMbag = document.getElementsByClassName("header__bag")[0]
  }
  updateDOMBag() {
    let quantity = this.bag.getItemsQuantity();
    this.DOMbag.querySelector(".bag__quantity").innerText = quantity;

    let totalPrice = "£" + this.bag.getTotalPrice().toFixed(2);
    if (quantity === 0) {
      this.DOMbag.querySelector(".bag__price").innerText = "";
    } else {
      this.DOMbag.querySelector(".bag__price").innerText = totalPrice;
    }
  }
  buildDOMBagItems() {

  }
}

const currentPage = document.getElementsByTagName("title")[0].innerText;
const bag = Bag.create();
const layoutBuilder = new LayoutBuilder(bag);
const dispatcher = new EventDispatcher(bag, layoutBuilder);

layoutBuilder.updateDOMBag();

if (currentPage.includes("Start")) {

}
if (currentPage.includes("Catalog")) {
  layoutBuilder.buildDOMCatalog();
}
if (currentPage.includes("Item")) {
  let buyBtn = document.querySelector(".item-buy__btn");
  buyBtn.addEventListener("click", event => {
    dispatcher.addItemToBag(event);
  });
}
if (currentPage.includes("Shopping")) {
  layoutBuilder.buildDOMBagItems();
}

