'use strict';
/*eslint-env jquery*/


//This is an object that contains properties that we can utilize in the functions below
const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false},],
  hideCompleted: false,
};


//this is a function that generates a new element in the HTML doc by adding an li to ul '.js-item-index-element'
function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
        <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}

//this is a function that turns the shoppingList into a string
function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  //console.log('`renderShoppingList` ran');
  let filteredItems = [ ...STORE.items ];
  if (STORE.hideCompleted) {
    filteredItems = filteredItems.filter(items => !items.checked);
  }
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function searchItemInShoppingList(itemName) {
  console.log(`Filtering only the "${itemName}" to the shopping list`);
  let searchList = [...STORE.items];
  console.log(searchList);
  if(STORE.items[name] === itemName) {
    searchList = searchList.filter(function(name) {
      name === itemName;
    });
    //console.log(searchList);
  }
  console.log(searchList);

  // let filteredItems = [ ...STORE.items ];
  // if (STORE.hideCompleted) {
  //   filteredItems = filteredItems.filter(items => !items.checked);
  // }
}

function handleSearchItemSubmit() {
  $('#js-search-for-item').submit(function(event) {
    event.preventDefault();
    console.log('a search has been submitted');
    const searchedItem = $('.js-search-for-item').val();
    $('.js-search-for-item').val('');
    searchItemInShoppingList(searchedItem);
    renderShoppingList();
  });
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

function editListItem(itemIndex) {

}

function handleEditItemClicked () {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // edit the item
    editListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

function toggleHideItems() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleToggleHideItemFilter() {
  $('#toggle-filter-completed-items').click(event => {
    console.log('toggle hide item is working');
    toggleHideItems();
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideItemFilter();
  handleSearchItemSubmit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);