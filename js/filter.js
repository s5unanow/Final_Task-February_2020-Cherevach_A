"use strict";

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