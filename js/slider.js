"use strict";

class Slider {
  constructor() {
    this.itemsLeft = BagItem.createItemsFromID(window.bestOffer.left);
    this.itemsRight = BagItem.createItemsFromID(window.bestOffer.right);
    this.currentLeftItemNumber = 0;
    this.currentRightItemNumber = 0;
  }
  switchItem(event) {

  }
  switchLeftItem(event) {

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
  let DOMClickedClassName = event.target.getAttribute("class");
  if (DOMClickedClassName.indexOf("best-offer__slide") >= 0) {
    slider.switchItem(DOMClickedClassName);
  }
});