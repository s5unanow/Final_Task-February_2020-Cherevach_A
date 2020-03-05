"use strict";

class CycledArray {
  constructor(array, startIndex = 0) {
    this.array = array;
    this.currentIndex = startIndex;
  }
  getCurrent () {
    return this.array[this.currentIndex];
  }
  moveUp() {
    if (this.array.length < this.currentIndex + 1) {
      this.currentIndex = 0
    } else {
      this.currentIndex++;
    }
    return this.array[this.currentIndex];
  }
  moveDown() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.array.length - 1;
    } else {
      this.currentIndex--;
    }
    return this.array[this.currentIndex];
  }
}

class Slider {
  constructor() {
    this.itemsLeft = new CycledArray(BagItem.createItemsFromID(window.bestOffer.left));
    this.itemsRight = new CycledArray(BagItem.createItemsFromID(window.bestOffer.right));
  }
  switchItem(switcherClass) {
    if (switcherClass.indexOf("best-offer__slide-up--left") >= 0) {
      this.switchLeftItem(switcherClass);
    } else {
      this.switchRightItem(switcherClass);
    }
    this.updatePrice();
  }
  switchLeftItem(switcherClass) {
    let DOMItem = document.querySelector(".slider-left");
    if (switcherClass.indexOf("best-offer__slide-up") >= 0) {
      this.switchLeftItemUp(DOMItem);
    } else {
      this.switchLeftItemDown(DOMItem);
    }
  }
  switchLeftItemUp(DOMItem) {

  }
  switchLeftItemDown(DOMItem) {

  }
  switchRightItem(switcherClass) {
    let DOMItem = document.querySelector(".slider-right");
    if (switcherClass.indexOf("best-offer__slide-up") >= 0) {
      this.switchRightItemUp(DOMItem);
    } else {
      this.switchRightItemDown(DOMItem);
    }
  }
  switchRightItemUp(DOMItem) {

  }
  switchRightItemDown(DOMItem) {

  }
  updatePrice() {
    let price = this.itemsLeft.getCurrent().price + this.itemsRight.getCurrent().price;
    let DOMPrice = document.querySelector(".best-offer__old-price");
  }
  getCurrentItems() {
    let result = [];
    let leftItem = Object.assign({}, this.itemsLeft.getCurrent());
    let rightItem = Object.assign({}, this.itemsRight.getCurrent());
    result.push(leftItem);
    result.push(rightItem);
    return result
  }
}

let slider = new Slider();

let DOMBestOfferBlock = document.querySelector(".best-offer__offer-block");

DOMBestOfferBlock.addEventListener("click", event => {
  let DOMSwitcherClassName = event.target.getAttribute("class");
  if (DOMSwitcherClassName.indexOf("best-offer__slide") >= 0) {
    slider.switchItem(DOMSwitcherClassName);
  }
});