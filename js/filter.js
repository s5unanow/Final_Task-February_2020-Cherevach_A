"use strict";

/* desktop filter */
const DOMDesktopFilterCategories = document.querySelectorAll(".filter__category");

for (let i = 0; i < DOMDesktopFilterCategories.length; i++) {
  let DOMCategory = DOMDesktopFilterCategories[i];
  DOMCategory.addEventListener("click", event => {
    if (event.target.className === "filter__value") {
      if (event.target.innerText === "Not selected") {
        unsetFilter(DOMCategory);
      } else {
        let filterValue = event.target.innerText;
        setFilter(DOMCategory, filterValue);
      }
    }
  });
}

function unsetFilter(DOMCategory) {
  DOMCategory.querySelector(".filter__category--set").className = "filter__category--set filter__category--hidden";
}
function setFilter(DOMCategory, filterValue) {
  let DOMSetFilter = DOMCategory.querySelector(".filter__category--set");
  let DOMValue = DOMSetFilter.querySelector(".filter__category--value");
  DOMValue.innerText = filterValue;
  DOMSetFilter.className = "filter__category--set";
}


/* mobile-tablet filter */

const DOMMobileFilterCategories = document.querySelectorAll(".filter-mobile__category");

for (let i = 0; i < DOMMobileFilterCategories.length; i++) {
  let DOMCategory = DOMMobileFilterCategories[i];
  DOMCategory.addEventListener("click", event => {
    console.log(event.target.className.indexOf("filter-mobile__value"));
    if (event.target.className.indexOf("filter-mobile__value") >= 0) {
      if (event.target.innerText === "Not selected") {
        unsetFilterParams(DOMCategory);
        event.target.className = "filter-mobile__value active-text--black";
        unsetFilterCategoryString(DOMCategory);
      } else {
        unsetFilterParams(DOMCategory);
        event.target.className = "filter-mobile__value active-text";
        setFilterCategoryString(DOMCategory, event.target.innerText);
      }
    }
  });
}

function unsetFilterParams(DOMCategory) {
  let DOMFilterParams = DOMCategory.querySelectorAll(".filter-mobile__value");
  for (let i = 0; i < DOMFilterParams.length; i++) {
    DOMFilterParams[i].className = "filter-mobile__value";
  }
}

function unsetFilterCategoryString(DOMCategory) {
  let category = DOMCategory.querySelector(".filter-mobile__category--type").innerText;
  let DOMStringCategory = getDOMStringCategory(category);
  DOMstringCategory.innerText = category;
  DOMToggleClass(DOMstringCategory, "filter__param--set");
}

function setFilterCategoryString(DOMCategory, filterValue) {

}

function getDOMStringCategory() {

}

function DOMToggleClass(DOMElement, targetClassName) {
  let classNames = DOMElement.className;
  if (classNames.indexOf(targetClassName) >= 0) {
    if (classNames.indexOf(targetClassName) === 0) {
      classNames = classNames.replace(targetClassName, "");
    } else {
      classNames = classNames.replace(" " + targetClassName, "");
    }
  } else {
    if (classNames === "") {
      classNames = targetClassName;
    } else {
      classNames = classNames + " " + targetClassName;
    }
  }
  DOMElement.className = classNames;
}