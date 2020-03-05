"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uniqueStorageID = "asdffdavjssd8";

var BagItem =
  /*#__PURE__*/
  function () {
    function BagItem(id, name, price, color, size) {
      var quantity = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
      var catalogID = arguments.length > 6 ? arguments[6] : undefined;

      _classCallCheck(this, BagItem);

      this.id = id;
      this.name = name;
      this.price = price;
      this.color = color;
      this.size = size;
      this.quantity = quantity;
      this.catalogID = catalogID;
    }

    _createClass(BagItem, null, [{
      key: "createItem",
      value: function createItem(catalogID) {
        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Default";
        var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Default";
        var quantity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var catalogItem = window.catalog.filter(function (catalogItem) {
          return catalogItem.id === catalogID;
        })[0];
        var id = catalogID + "--" + color + "--" + size;
        var price = catalogItem.discountedPrice ? catalogItem.discountedPrice : catalogItem.price;
        return new BagItem(id, catalogItem.title, price, color, size, quantity, catalogID);
      }
    }, {
      key: "getCatalogParameters",
      value: function getCatalogParameters(item) {
        return window.catalog.filter(function (catalogItem) {
          return catalogItem.id === item.catalogID;
        })[0];
      }
    }, {
      key: "createDefaultFromCatalogID",
      value: function createDefaultFromCatalogID(catalogItemID) {
        var catalogItem = window.catalog.filter(function (catalogItem) {
          return catalogItem.id === catalogItemID;
        })[0];
        var color = catalogItem.colors[0] ? catalogItem.colors[0] : "Default";
        var size = catalogItem.sizes[0] ? catalogItem.sizes[0] : "Default";
        return BagItem.createItem(catalogItemID, color, size);
      }
    }, {
      key: "createItemsFromID",
      value: function createItemsFromID(idArray) {
        var result = [];
        result = idArray.map(function (id) {
          return BagItem.createDefaultFromCatalogID(id);
        });
        return result;
      }
    }, {
      key: "getItemImg",
      value: function getItemImg(item) {
        return BagItem.getCatalogParameters(item).thumbnail;
      }
    }, {
      key: "getNewState",
      value: function getNewState(item) {
        var result = "";

        if (BagItem.getCatalogParameters(item).hasNew) {
          result = "item-new";
        }

        return result;
      }
    }]);

    return BagItem;
  }();

var BagItems =
  /*#__PURE__*/
  function () {
    function BagItems() {
      _classCallCheck(this, BagItems);
    }

    _createClass(BagItems, null, [{
      key: "isItemsSame",
      value: function isItemsSame(item1, item2) {
        var result = true;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = item1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var param = _step.value;
            if (item1[param] !== item2[param]) result = false;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return result;
      }
    }]);

    return BagItems;
  }();

var BestOffer =
  /*#__PURE__*/
  function () {
    function BestOffer() {
      _classCallCheck(this, BestOffer);
    }

    _createClass(BestOffer, null, [{
      key: "includesDiscountedItems",
      value: function includesDiscountedItems(items) {
        return BestOffer.includesLeftItem(items) && BestOffer.includesRightItem(items);
      }
    }, {
      key: "includesLeftItem",
      value: function includesLeftItem(items) {
        var bestOfferLeftIDs = window.bestOffer.left;
        var result = items.reduce(function (result, item) {
          if (bestOfferLeftIDs.some(function (id) {
            return id === item.catalogID;
          })) result = true;
          return result;
        }, false);
        return result;
      }
    }, {
      key: "includesRightItem",
      value: function includesRightItem(items) {
        var bestOfferLeftIDs = window.bestOffer.right;
        var result = items.reduce(function (result, item) {
          if (bestOfferLeftIDs.some(function (id) {
            return id === item.catalogID;
          })) result = true;
          return result;
        }, false);
        return result;
      }
    }, {
      key: "getDiscount",
      value: function getDiscount() {
        return +window.bestOffer.discount;
      }
    }]);

    return BestOffer;
  }();

var Storage =
  /*#__PURE__*/
  function () {
    function Storage() {
      _classCallCheck(this, Storage);
    }

    _createClass(Storage, null, [{
      key: "hasItems",
      value: function hasItems() {
        return window.localStorage.getItem(uniqueStorageID);
      }
    }, {
      key: "loadItems",
      value: function loadItems() {
        var items = window.localStorage.getItem(uniqueStorageID);
        items = JSON.parse(items);
        return items;
      }
    }, {
      key: "saveItems",
      value: function saveItems(items) {
        var serializedItems = JSON.stringify(items);
        window.localStorage.setItem(uniqueStorageID, serializedItems);
      }
    }, {
      key: "clearStorage",
      value: function clearStorage() {
        window.localStorage.removeItem(uniqueStorageID);
      }
    }]);

    return Storage;
  }();

var DOMTemplates =
  /*#__PURE__*/
  function () {
    function DOMTemplates() {
      _classCallCheck(this, DOMTemplates);
    }

    _createClass(DOMTemplates, null, [{
      key: "generateCatalogPromoItemTemplate",
      value: function generateCatalogPromoItemTemplate(catalogItem) {
        var price = catalogItem.price.toFixed(2);
        var oldPrice = "";

        if (catalogItem.discountedPrice && catalogItem.discountedPrice !== catalogItem.price) {
          oldPrice = "<span class=\"old-price\">\xA3".concat(price, "</span>");
          price = catalogItem.discountedPrice.toFixed(2);
        }

        return "                <a class=\"promo-last-weekend__item\" href=\"item.html\"><div class=\"item".concat(catalogItem.hasNew ? " item-new" : "", "\">\n          <div class=\"item__img\">\n                      <div class=\"item__view-item--hover\">\n              <div class=\"item__view-item--text\">View Item</div>\n            </div>\n            <img src=\"img/").concat(catalogItem.thumbnail, "\" alt=\"").concat(catalogItem.title, "\">\n          </div>\n          <div class=\"item__name\">").concat(catalogItem.title, "</div>\n          <div class=\"item__price\">").concat(oldPrice, "\xA3").concat(price, "</div>\n        </div></a>\n    ");
      }
    }, {
      key: "generateCatalogMainItemTemplate",
      value: function generateCatalogMainItemTemplate(catalogItem) {
        var price = catalogItem.price.toFixed(2);
        var oldPrice = "";

        if (catalogItem.discountedPrice && catalogItem.discountedPrice !== catalogItem.price) {
          oldPrice = "<span class=\"old-price\">\xA3".concat(price, "</span>");
          price = catalogItem.discountedPrice.toFixed(2);
        }

        return "        <a href=\"item-2.html\"><div class=\"catalog-main__item item".concat(catalogItem.hasNew ? " item-new" : "", "\">\n          <div class=\"item__img\">\n                      <div class=\"item__view-item--hover\">\n              <div class=\"item__view-item--text\">View Item</div>\n            </div>\n            <img src=\"img/").concat(catalogItem.thumbnail, "\" alt=\"").concat(catalogItem.title, "\">\n          </div>\n          <div class=\"item__name\">").concat(catalogItem.title, "</div>\n          <div class=\"item__price\">").concat(oldPrice, "\xA3").concat(price, "</div>\n        </div></a>\n    ");
      }
    }, {
      key: "generateBagItemTemplate",
      value: function generateBagItemTemplate(item) {
        return "\n        <div class=\"bag-main__item\" id=\"".concat(item.id, "\">\n          <div class=\"item__img ").concat(BagItem.getNewState(item), "\">\n            <div class=\"item__view-item--hover\">\n              <div class=\"item__view-item--text\">View Item</div>\n            </div>\n            <img src=\"img/").concat(BagItem.getItemImg(item), "\" alt=\"").concat(item.name, "\">\n          </div>\n          <div class=\"item__data\">\n            <div class=\"item__name\">").concat(item.name, "\n            </div>\n            <div class=\"item__price\">\xA3").concat(item.price.toFixed(2), "</div>\n            <div class=\"item__color\">Color: <span class=\"item__data--color\">").concat(item.color, "</span></div>\n            <div class=\"item__size\">Size: <span class=\"item__data--size\">").concat(item.size.replace("-", " "), "</span></div>\n            <div class=\"item__quantity\">\n              Quantity: <span class=\"item__quantity--decrement\">\u2014 </span><span class=\"item__data--quantity\">").concat(item.quantity, "</span><span class=\"item__quantity--increment\"> +</span>\n            </div>\n            <div class=\"item__remove-btn\">Remove item</div>\n          </div>\n        </div>");
      }
    }, {
      key: "generateBagCheckout",
      value: function generateBagCheckout(totalPrice, discount) {
        var discountString = "&nbsp;";

        if (discount) {
          discountString = "Applied discount: <span class=\"price__discount--amount\">\xA3".concat(discount.toFixed(2), "</span>");
        }

        return "\n        <div class=\"checkout__price\">\n          <div class=\"price__discount\">".concat(discountString, "</div>\n          <div class=\"price__total\">Total price: <span class=\"price__total--amount\">\xA3").concat(totalPrice, "</span></div>\n        </div>");
      }
    }, {
      key: "generateEmptyBagTemplate",
      value: function generateEmptyBagTemplate() {
        return "<div class=\"bag__empty \">Your shopping bag is empty. Use <a href=\"catalog.html\" class=\"active-text\" >Catalog</a> to add new items.</div>";
      }
    }, {
      key: "generateCheckoutTemplate",
      value: function generateCheckoutTemplate() {
        return "<div class=\"bag__empty\">Thank you for your purchase. Maybe use <a href=\"catalog.html\" class=\"active-text\" >Catalog</a> to find more awesome items!</div>\n    ";
      }
    }]);

    return DOMTemplates;
  }();

function DOMAddClass(DOMElement, targetClassName) {
  var classNames = DOMElement.className;

  if (classNames.indexOf(targetClassName) >= 0) {
    /* do not add same class again */
  } else {
    if (classNames === "") {
      classNames = targetClassName;
    } else {
      classNames = classNames + " " + targetClassName;
    }
  }

  DOMElement.className = classNames;
}

function DOMRemoveClass(DOMElement, targetClassName) {
  var classNames = DOMElement.className;

  if (classNames.indexOf(targetClassName) >= 0) {
    if (classNames.indexOf(targetClassName) === 0) {
      classNames = classNames.replace(targetClassName, "");
    } else {
      classNames = classNames.replace(" " + targetClassName, "");
    }
  }

  DOMElement.className = classNames;
}