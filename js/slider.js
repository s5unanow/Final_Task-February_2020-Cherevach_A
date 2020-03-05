"use strict";

class Slider {
  constructor() {
    this.itemsLeft = BagItem.createItemsFromID(window.bestOffer.left);
    this.itemsRight = BagItem.createItemsFromID(window.bestOffer.right);
    this.currentLeftItemNumber = 0;
    this.currentRightItemNumber = 0;
  }
  switchItem(switcherClass) {
    if (switcherClass.indexOf("best-offer__slide-up--left") >= 0) {
      this.switchLeftItem(switcherClass);
    } else {
      this.switchRightItem(switcherClass);
    }
  }
  switchLeftItem(switcherClass) {
    let DOMItem =
    if (switcherClass.indexOf("best-offer__slide-up") >= 0) {
      this.switchLeftItemUp(switcherClass);
    } else {
      this.switchRightItem(switcherClass);
    }
  }
  switchLeftItemUp() {

  }
  switchLeftItemDown() {

  }
  switchRightItem(switcherClass) {

  }

  getCurrentItems() {
    let result = [];
    let leftItem = Object.assign({}, this.itemsLeft[this.currentLeftItemNumber]);
    let rightItem = Object.assign({}, this.itemsRight[this.currentRightItemNumber]);
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