'use strict';
/* global $ */

let state = {
  view: 'initial',
  errors: [],
  minRating: 0,
  bookmarks: [
    {
      id: 'xxxxxxx',
      title: 'AN Example',
      url: '',
      description: 'It is an example',
      rating: 3,
      expanded: false,
      selected: false,
    },
  ],

};

const populateState = function () {

  api.getAllBookmarks()
    .then((results) => {

      const newState = [];

      results.forEach(bookmark => {

        newState.push({
          id          : bookmark.id,
          title       : bookmark.title,
          url         : bookmark.url,
          description : bookmark.desc,
          rating      : bookmark,
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

  const filteredArray = state.bookmarks.filter(bookmark => parseInt(bookmark.rating, 10) >= state.minRating);


  switch (state.view) {

  case 'add':
    renderAdd(filteredArray);
    break;

  case 'delete':
    renderDelete(filteredArray);
    break;

  default:
    renderInitial(filteredArray);
    break;
  }

};

function generateListHtml(bookmarks){
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
  });
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

const renderInitial = function (filteredState) {
  $('.bookmarks-list').html(generateListHtml(state.bookmarks));
  console.log('Initial View', filteredState);
};

const renderAdd = function (filteredState) {

  console.log('Add View', filteredState);
};

const renderDelete = function (filteredState) {

  console.log('Delete View', filteredState);
};


function handleNewItem(){
  $('.new-bookmark-button').on('submit', function(event){
    event.preventDefault();
    console.log('New bookmark clicked');
    // update view in store to add view, render

  });
}

function handleRatingFilter(){
  $('.bookmark-rating-form').on('submit', function(event){
    event.preventDefault();
    const filterRating = $('#bookmark-rating').val();
    console.log(`Filtering for ${filterRating} stars`);
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
    console.log('Canceling Add');
  });
}


// function handleClickBookmark(){
//   $('.bookmarks-list').on('click', '.expand', function(event){
//     event.preventDefault();
//   });
// }


function handleCheckbox(){
  $('.bookmarks-list').on('click', '.checkbox', function(){
    // grab the id of the item checked, then change the checked value in the store for that item
    console.log('bookmark checked');
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
    const bookmark = state.bookmark.find(bookmark => bookmark.id === cuid);
    bookmark.expanded = true;
    console.log('showing details');
    render();
  });
}

function handleHideDetails(){
  $('.bookmarks-list').on('click', '.hide-details', function(event){
    event.preventDefault();
    const cuid = $(event.target).closest('li').find('input').data('cuid');
    const bookmark = state.bookmark.find(bookmark => bookmark.id === cuid);
    bookmark.expanded = false;
    console.log('hiding details');
    render();
  });
}

function main(){
  render();
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
