'use strict';
/* global $ */

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


function handleClickBookmark(){
  $('.bookmarks-list').on('click', '.expand', function(event){
    event.preventDefault();
    expandBookmark();
  });
}


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

function expandBookmark(){

}

function generateAddFormHtml(){
  
}




function main(){
  handleNewItem();
  handleRatingFilter();
  handleCheckbox();
  handleClickBookmark();
  handleDelete();
  handleSaveBookmark();
  handleCancelBookmark();
}

$(main);