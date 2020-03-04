"use strict";

const uniqueStorageID = "asdffdavjssd8";

class BagItem {
  constructor(id, name, price, color, size, quantity = 1, catalogID) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.color = color;
    this.size = size;
    this.quantity = quantity;
    this.catalogID = catalogID;
  }
  static createItem(catalogID, color, size, quantity = 1) {
    let catalogItem = window.catalog.filter(catalogItem => catalogItem.id === catalogID)[0];
    let id = catalogID + "--" + color + "--" + size;
    let price = catalogItem.discountedPrice ? catalogItem.discountedPrice :  catalogItem.price;
    return new BagItem(id, catalogItem.title, price, color, size, quantity, catalogID)
  }
  static getCatalogParameters(item) {
    return window.catalog.filter(catalogItem => catalogItem.id === item.catalogID)[0];
  }
  static createDefaultFromCatalogID(catalogItemID) {
    let catalogItem = window.catalog.filter(catalogItem => catalogItem.id === catalogItemID)[0];
    return BagItem.createItem(catalogItemID, catalogItem.color[0], catalogItem.size[0])
  }
  static createItemsFromID(idArray) {
    let result = [];
    result = idArray.map(id => BagItem.createDefaultFromCatalogID(id));
    return result
  }
  static getItemImg(item) {
    return BagItem.getCatalogParameters(item).thumbnail;
  }
  static getNewState(item) {
    let result = "";
    if (BagItem.getCatalogParameters(item).hasNew) {
      result = "item-new"
    }
    return result
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

class BestOffer {
  static includesDiscountedItems(items) {
    return BestOffer.includesLeftItem(items) && BestOffer.includesRightItem(items)
  }
  static includesLeftItem(items) {
    let bestOfferLeftIDs = window.bestOffer.left;
    let result = items.reduce((result, item) => {
      if (bestOfferLeftIDs.some(id => id === item.catalogID)) result = true;
      return result
    }, false);
    return result
  }
  static includesRightItem(items) {
    let bestOfferLeftIDs = window.bestOffer.right;
    let result = items.reduce((result, item) => {
      if (bestOfferLeftIDs.some(id => id === item.catalogID)) result = true;
      return result
    }, false);
    return result
  }
  static getDiscount() {
    return +window.bestOffer.discount
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

class DOMTemplates {
  static generateCatalogPromoItemTemplate(catalogItem) {
    let price = catalogItem.price.toFixed(2);
    let oldPrice = "";
    if (catalogItem.discountedPrice && catalogItem.discountedPrice !== catalogItem.price) {
      oldPrice = `<span class="old-price">£${price}</span>`;
      price = catalogItem.discountedPrice.toFixed(2);
    }
    return `        <div class="promo-last-weekend__item item${catalogItem.hasNew? " item-new" : ""}">
          <div class="item__img">
            <img src="img/${catalogItem.thumbnail}" alt="${catalogItem.title}">
          </div>
          <div class="item__name">${catalogItem.title}</div>
          <div class="item__price">${oldPrice}£${price}</div>
        </div>
    `
  }
  static generateCatalogMainItemTemplate(catalogItem) {
    let price = catalogItem.price.toFixed(2);
    let oldPrice = "";
    if (catalogItem.discountedPrice && catalogItem.discountedPrice !== catalogItem.price) {
      oldPrice = `<span class="old-price">£${price}</span>`;
      price = catalogItem.discountedPrice.toFixed(2);
    }
    return `        <div class="catalog-main__item item${catalogItem.hasNew? " item-new" : ""}">
          <div class="item__img">
            <img src="img/${catalogItem.thumbnail}" alt="${catalogItem.title}">
          </div>
          <div class="item__name">${catalogItem.title}</div>
          <div class="item__price">${oldPrice}£${price}</div>
        </div>
    `
  }
  static generateBagItemTemplate(item) {
    return `
        <div class="bag-main__item" id="${item.id}">
          <div class="item__img ${BagItem.getNewState(item)}">
            <div class="item__view-item--hover">
              <div class="item__view-item--text">View Item</div>
            </div>
            <img src="img/${BagItem.getItemImg(item)}" alt="${item.name}">
          </div>
          <div class="item__data">
            <div class="item__name">${item.name}
            </div>
            <div class="item__price">£${item.price}</div>
            <div class="item__color">Color: <span class="item__data--color">${item.color}</span></div>
            <div class="item__size">Size: <span class="item__data--size">${item.size.replace("-", " ")}</span></div>
            <div class="item__quantity">
              Quantity: <span class="item__quantity--decrement">— </span><span class="item__data--quantity">${item.quantity}</span><span class="item__quantity--increment"> +</span>
            </div>
            <div class="item__remove-btn">Remove item</div>
          </div>
        </div>`
  }
  static generateBagCheckout(totalPrice, discount) {
    let discountString = `&nbsp;`;
    if (discount) {
      discountString = `Applied discount: <span class="price__discount--amount">${discount}</span>`
    }
    return `
          <div class="checkout__delivery">
        You've qualified for Free UK Next Day Delivery on your order. Don't forget to enter the code
        <span class="active-text">nexday</span> at checkout
      </div>
      <div class="checkout__info">
        <div class="checkout__price">
          <div class="price__discount">${discountString}</div>
          <div class="price__total">Total price: <span class="price__total--amount">£${totalPrice}</span></div>
        </div>
        <div class="checkout__cta">
          <a href="#" class="checkout__btn cta-btn">Checkout</a>
        </div>
        <div class="checkout__empty-bag active-hover">
          Empty bag
        </div>`
  }
  static generateEmptyBagTemplate() {
    return `<div class="bag__empty ">Your shopping bag is empty. Use Catalog to add new items.</div>
    `
  }
  static generateCheckoutTemplate() {
    return `<div class="bag__empty">Thank you for your purchase.</div>
    `
  }
}