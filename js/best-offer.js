"use strict";

class Slider {
  constructor() {
    this.itemsLeftID = BagItem.createItemsFromID(window.bestOffer.left);
    this.itemsRightID = BagItem.createItemsFromID(window.bestOffer.right);
  }
}