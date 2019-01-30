'use strict';
/* global $ */

let state = {};

const populateState = function () {

  return api.getAllBookmarks()
    .then((results) => {

      const newState = [];

      results.forEach(bookmark => {

        newState.push({
          id          : bookmark.id,
          title       : bookmark.title,
          url         : bookmark.url,
          description : bookmark.desc,
          rating      : bookmark.rating,
          expanded    : false,
          selected    : false,
        });
      });

      state.bookmarks = newState;
    })
    .catch((err) => {
      console.log(err);
    });
};

const render = function () {

  const filteredState = {
    view      : state.view,
    errors    : state.errors,
    minRating : state.minRating,
    bookmarks : state.bookmarks.filter(bookmark => parseInt(bookmark.rating, 10) >= state.minRating),
  };


  switch (state.view) {

  case 'add':
    renderAdd(filteredState);
    break;

  case 'delete':
    renderDelete(filteredState);
    break;

  default:
    renderInitial(filteredState);
    break;
  }

};

function generateErrorHtml(errors){
  return errors.map(err => {
    return `<p>${err}</p>`;
  }).join('');
}



function generateListHtml(state){
  return state.bookmarks.map(bookmark => {
    return `
    <li class="bookmark">
          <div>
            <input type="checkbox" class='checkbox' data-cuid="${bookmark.id}"><strong>${bookmark.title}</strong>
          <div>
          <div class="bookmark-rating">
              Rating: ${bookmark.rating}
          </div>
          <input type="button" class="view-details" value="View details">
          <div class="description-container">
          </div>
        </li>
    `;
  }).join('');
}

function generateExpandedHtml(bookmark){
  return `
  <li class="bookmark">
    <div>
      <input type="checkbox" class='checkbox' data-cuid="${bookmark.id}"><strong>${bookmark.title}</strong>
    <div>
    <div class="bookmark-rating">
        Rating: ${bookmark.rating}
    </div>
      <input type="button" class="hide-details" value="Hide details">
      <p class="bookmark-description">${bookmark.description}</p>
    <div class="site-link-container flex">
      <a href="${bookmark.url}" class="fake-button">Visit Site</a>
    </div>
  </li>`;
}

function generateAddViewHtml(){
  return `<form action="" class="new-bookmark-form">
  <div class="flex form-container">
    <div class="left-form">
      <label for="bookmark-title">Title</label>
      <input type="text" name="title" id="new-bookmark-title">
      <label for="bookmark-name">URL</label>
      <input type="url" name="url" id="new-bookmark-url">
   </div>
   <div class="right-form">
      <label for="bookmark-title">Description</label>
      <textarea type="text" name="description" id="new-bookmark-description"></textarea>
      <label for="bookmark-rating">Rating</label>
      <select name="" id="new-bookmark-rating">
          <option value=""></option>
          <option value="1">★☆☆☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="3">★★★☆☆</option>
          <option value="4">★★★★☆</option>
          <option value="5">★★★★★</option>
      </select>
    </div>
  </div>
  <div class="flex button-container">
        <input type="button" id="cancel-item" value="Cancel"></input>
        <button type="submit" id="save-item">Save</button>
  </div>
</form>`;
}

function generateDeleteViewHtml(){
  return `<strong>1 item selected</strong>
  <form action="" class="delete-bookmarks">
    <button type="submit">Delete</button>
  </form>`;
}

const renderInitial = function (filteredState) {
  $('.bookmarks-list').html(generateListHtml(state.bookmarks));
  console.log('Initial View', filteredState);
};

const renderAdd = function (filteredState) {

  console.log('Add View', filteredState);
};

const renderDelete = function (filteredState) {

  let count = 0;
  filteredState.bookmarks.forEach((b) => {

    if (b.selected === true) {
      count++;
    }
  });

  console.log('Delete View', `${count} selected`, filteredState);
};


function handleNewItem(){
  $('.new-bookmark-button').on('submit', function(event){
    event.preventDefault();
    state.view = 'add';
    render();
    console.log('New bookmark clicked');
    // update view in store to add view, render

  });
}

function handleRatingFilter(){
  $('.bookmark-rating-form').on('submit', function(event){
    event.preventDefault();
    state.minRating = parseInt($('#bookmark-rating').val(), 10);
    render();
  });
  // update filter in store, render
}

function handleSaveBookmark(){
  $('.container').on('submit', '.new-bookmark-form', function(event){
    event.preventDefault();
    const title = $('#new-bookmark-title').val();
    const url = $('#new-bookmark-url').val();
    const description = $('#new-bookmark-descrption').val();
    const rating = $('#new-bookmark-rating').val();

    console.log('saving new bookmark');
    // send POST request to API, then send GET request
  });
}

function handleCancelBookmark(){
  $('.container').on('click', '#cancel-item', function(event){
    event.preventDefault();
    state.view = 'initial';
    console.log('Canceling Add');
  });
}

function handleCheckbox(){
  $('.bookmarks-list').on('click', '.checkbox', function(){
    const isChecked = $(event.target).prop('checked');
    const cuid = $(event.target).closest('li').find('input').data('cuid');
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === cuid);

    state.bookmarks[index].selected = isChecked;

    if ($( '.checkbox:checked').length > 0) {
      state.view = 'delete';
    } else {
      state.view = 'initial';
    }

    render();
  });
}

function handleDelete(){
  $('.delete-bookmarks').on('submit', function(event){
    event.preventDefault();
    console.log('deleting a bunch');
  });
}

function handleViewDetails(){
  $('.bookmarks-list').on('click', '.view-details', function(event){
    event.preventDefault();
    const cuid = $(event.target).closest('li').find('input').data('cuid');
    const bookmark = state.bookmarks.find(bookmark => bookmark.id === cuid);
    bookmark.expanded = true;
    console.log('showing details');
    render();
  });
}

function handleHideDetails(){
  $('.bookmarks-list').on('click', '.hide-details', function(event){
    event.preventDefault();
    const cuid = $(event.target).closest('li').find('input').data('cuid');
    const bookmark = state.bookmarks.find(bookmark => bookmark.id === cuid);
    bookmark.expanded = false;
    console.log('hiding details');
    render();
  });
}

function main(){
  populateState()
    .then(render);
  handleNewItem();
  handleRatingFilter();
  handleCheckbox();
  // handleClickBookmark();
  handleDelete();
  handleSaveBookmark();
  handleCancelBookmark();
  handleViewDetails();
  handleHideDetails();
}

$(main);
