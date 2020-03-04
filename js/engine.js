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
    Storage.saveItems(this.items);
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
    let result = 0;
    if (this.hasItems()) {
      result = this.items.reduce((totalQuantity, item) => {
        return totalQuantity + item.quantity
      }, 0);
    }
    return result
  }
  getItems() {
    return this.items
  }
  clearBag() {
    this.items = [];
    Storage.clearStorage();
  }
  getTotalDiscount() {
    if (this.hasBestOfferItems()) return BestOffer.getDiscount();
    else return 0
  }
  getItemQuantity(itemID) {
    let result = 0;
    if (this.includesItem(itemID)) {
      result = this.getItemByID(itemID).quantity;
    }
    return result
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
  addItemToBag() {
    let id = document.querySelector(".section-item").id;
    let color = this.getItemColor();
    let size = this.getItemSize();
    let item = BagItem.createItem(id, color, size);
    this.bag.addItem(item);
    this.layoutBuilder.updateDOMBag();
  }
  getItemSize() {
    let result = null;
    let DOMSizes = document.querySelectorAll(".parameter__sizes input");
    for (let DOMSize of DOMSizes) {
      if (DOMSize.checked) result = DOMSize.id
    }
    return result
  }
  getItemColor() {
    let result = null;
    let DOMColors = document.querySelectorAll(".parameter__colors input");
    for (let DOMColor of DOMColors) {
      if (DOMColor.checked) result = DOMColor.id
    }
    return result
  }
  addBagListeners() {
    this.addEmptyBagListener();
    this.addChangeQuantityListeners();
    this.addRemoveItemListeners();
    this.addCheckoutListener();
  }
  addChangeQuantityListeners() {
    let DOMItems = document.querySelectorAll(".bag-main__item");
    for (let i = 0; i < DOMItems.length; i++) {
      DOMItems[i].addEventListener("click", event => {
        if (event.target.className === "item__quantity--decrement") {
          this.bag.decreaseItemQuantity(DOMItems[i].id);
          this.layoutBuilder.updateDOMItemQuantity(DOMItems[i]);
        }
        if (event.target.className === "item__quantity--increment") {
          this.bag.increaseItemQuantity(DOMItems[i].id);
          this.layoutBuilder.updateDOMItemQuantity(DOMItems[i]);
        }
      });
    }
  }
  addRemoveItemListeners() {
    let DOMItems = document.querySelectorAll(".bag-main__item");
    for (let i = 0; i < DOMItems.length; i++) {
      DOMItems[i].addEventListener("click", event => {
        if (event.target.className === "item__remove-btn") {
          this.bag.removeItem(DOMItems[i].id);
          this.layoutBuilder.removeDOMItem(DOMItems[i]);
        }
      });
    }
  }
  addEmptyBagListener() {
    let emptyBagBtn = document.querySelector(".checkout__empty-bag");
    emptyBagBtn.addEventListener("click", () => {
      this.bag.clearBag();
      this.layoutBuilder.updateDOMBagPageOnEmpty();
    });
  }
  addCheckoutListener() {
    let checkoutBtn = document.querySelector(".checkout__btn");
    checkoutBtn.addEventListener("click", () => {
      if (this.bag.hasItems()) {
        this.bag.clearBag();
        this.layoutBuilder.updateDOMBagPageOnCheckout();
      }
    });
  }
}

class LayoutBuilder {
  constructor(bag) {
    this.bag = bag;
    this.DOMbag = document.getElementsByClassName("header__bag")[0];

  }
  updateDOMBag() {
    let quantity = this.bag.getItemsQuantity();
    this.DOMbag.querySelector(".bag__quantity").innerText = quantity;

    let totalPrice = "£" + this.getFormattedTotalPrice();
    if (quantity === 0) {
      this.DOMbag.querySelector(".bag__price").innerText = "";
    } else {
      this.DOMbag.querySelector(".bag__price").innerText = totalPrice;
    }
  }
  buildDOMCatalog(catalogItems) {
    let PromoLastWeekendItems = document.querySelector(".promo-last-weekend__items");
    let DOMData = "";
    for (let i = 0; i < 4; i++) {
      DOMData += DOMTemplates.generateCatalogPromoItemTemplate(catalogItems[i]);
    }
    PromoLastWeekendItems.innerHTML = DOMData;

    DOMData = "";
    let DOMCatalogMainItems = document.querySelector(".catalog-main__items");
    for (let i = 3; i < catalogItems.length; i++) {
      DOMData += DOMTemplates.generateCatalogMainItemTemplate(catalogItems[i]);
    }
    DOMCatalogMainItems.innerHTML = DOMData;
  }
  buildDOMBagPage() {
    this.buildDOMBagItemsSection();
    this.updateDOMBagCheckoutSection();
  }
  buildDOMBagItemsSection() {
    let DOMBagMainItems = document.querySelector(".bag-main__items");
    let DOMData = "";
    if (this.bag.hasItems()) {
      let items = this.bag.getItems();
      items.forEach(item => {
        DOMData += DOMTemplates.generateBagItemTemplate(item);
      });
    }
    else {
      DOMData = DOMTemplates.generateEmptyBagTemplate();
    }
    DOMBagMainItems.innerHTML = DOMData;
  }
  updateDOMBagCheckoutSection() {
    let DOMBagCheckout = document.querySelector(".section__checkout");
    DOMBagCheckout.innerHTML = DOMTemplates.generateBagCheckout(this.getFormattedTotalPrice(), this.bag.getTotalDiscount());
  }
  updateDOMBagPageOnEmpty() {
    let DOMBagMainItems = document.querySelector(".bag-main__items");
    DOMBagMainItems.innerHTML = DOMTemplates.generateEmptyBagTemplate();
    this.updateDOMBag();
    this.updateDOMBagCheckoutSection();
  }
  getFormattedTotalPrice() {
    let totalPrice = this.bag.getTotalPrice();
    if (totalPrice > 0) return totalPrice.toFixed(2);
    else return totalPrice
  }
  updateDOMItemQuantity(DOMItem) {
    let itemQuantity = this.bag.getItemQuantity(DOMItem.id);
    if (itemQuantity === 0) this.removeDOMItem(DOMItem);
    else {
      let DOMItemQuantity = DOMItem.querySelector(".item__data--quantity");
      DOMItemQuantity.innerText = itemQuantity;
    }
    this.updateDOMBag();
    this.updateDOMBagCheckoutSection()
  }
  removeDOMItem(DOMItem) {
    DOMItem.remove();
    this.updateDOMBag();
    this.updateDOMBagCheckoutSection()
  }
  updateDOMBagPageOnCheckout() {
    let DOMBagMainItems = document.querySelector(".bag-main__items");
    console.log(DOMTemplates.generateCheckoutTemplate());
    DOMBagMainItems.innerHTML = DOMTemplates.generateCheckoutTemplate();
    this.updateDOMBag();
    this.updateDOMBagCheckoutSection();
  }
}

let filteredCatalogItems = window.catalog.filter(catalogItem => {
  return catalogItem.category === "women" && catalogItem.fashion === "Casual style"
});
filteredCatalogItems.sort((item1, item2) => {
  return Date.parse(item1.dateAdded) - Date.parse(item2.dateAdded)
});


const currentPage = document.getElementsByTagName("title")[0].innerText;
const bag = Bag.create();
const layoutBuilder = new LayoutBuilder(bag);
const dispatcher = new EventDispatcher(bag, layoutBuilder);

layoutBuilder.updateDOMBag();

if (currentPage.includes("Start")) {

}
if (currentPage.includes("Catalog")) {
  layoutBuilder.buildDOMCatalog(filteredCatalogItems);
}
if (currentPage.includes("Item")) {
  let buyBtn = document.querySelector(".item-buy__btn");
  buyBtn.addEventListener("click", event => {
    dispatcher.addItemToBag();
  });
}
if (currentPage.includes("Shopping")) {
  layoutBuilder.buildDOMBagPage();
  dispatcher.addBagListeners();
}

