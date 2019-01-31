'use strict';
/* global $ api state */

function handleNewItem(){
  $('main').on('submit', '.new-bookmark-button', function(event){
    event.preventDefault();
    state.view = 'add';
    state.render();
  });
}

function handleRatingFilter(){
  $('main').on('submit', '.bookmark-rating-form', function(event){
    event.preventDefault();
    state.minRating = parseInt($('#bookmark-rating').val(), 10);
    state.render();
  });
}

function handleSaveBookmark(){
  $('main').on('submit', '.new-bookmark-form', function(event){
    event.preventDefault();
    const title = $('#new-bookmark-title').val();
    const url = $('#new-bookmark-url').val();
    const description = $('#new-bookmark-description').val();
    const rating = $('#new-bookmark-rating').val();

    api.createBookmark({
      title:  title,
      url    : url,
      desc   : description,
      rating : rating,
    })
      .then((bookmark) => {
        state.bookmarks.push({
          id          : bookmark.id,
          title       : bookmark.title,
          url         : bookmark.url,
          description : bookmark.desc,
          rating      : bookmark.rating,
        });

        state.view = 'initial';

        state.errors = [];
      })
      .catch((err) => {
        state.errors = [];
        state.errors.push(err.message);
      })
      .finally(() => {
        state.render();
      });

  });
}

function handleCancelBookmark(){
  $('main').on('click', '#cancel-item', function(event){
    event.preventDefault();
    state.errors = [];
    state.view = 'initial';
    state.render();
  });
}

function handleCheckbox(){
  $('main').on('click', '.checkbox', function(){
    const isChecked = $(event.target).prop('checked');
    const cuid = $(event.target).closest('li').find('input').data('cuid');
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === cuid);

    state.bookmarks[index].selected = isChecked;

    if ($( '.checkbox:checked').length > 0) {
      state.view = 'delete';
    } else {
      state.view = 'initial';
    }

    state.render();
  });
}

function handleDelete(){
  $('main').on('submit', '.delete-bookmarks', function(event){
    event.preventDefault();

    const selectedBookmarks = state.bookmarks.filter((b) => {
      return b.selected === true;
    });

    const loop = selectedBookmarks.reduce((prevPromise, bookmark) => {

      return prevPromise.finally(() => {

        return api.destroyBookmark(bookmark.id)
          .then(() => {
            const deletedIndex = state.bookmarks.findIndex((mark) => { return mark.id === bookmark.id; });
            state.bookmarks.splice(deletedIndex, 1);
          })
          .catch((err) => {
            state.errors.push(err.message);
          });

      });

    }, Promise.resolve());


    loop.finally(() => {
      state.view = 'initial';
      state.render();
    });

  });
}

function handleViewDetails(){
  $('main').on('click', '.view-details', function(event){
    event.preventDefault();
    const cuid = $(event.target).closest('li').find('input').data('cuid');
    const bookmark = state.bookmarks.find(bookmark => bookmark.id === cuid);
    bookmark.expanded = true;
    state.render();
  });
}

function handleHideDetails(){
  $('main').on('click', '.hide-details', function(event){
    event.preventDefault();
    const cuid = $(event.target).closest('li').find('input').data('cuid');
    const bookmark = state.bookmarks.find(bookmark => bookmark.id === cuid);
    bookmark.expanded = false;
    state.render();
  });
}

function main(){
  state.populate().then(state.render);

  handleNewItem();
  handleRatingFilter();
  handleCheckbox();
  handleDelete();
  handleSaveBookmark();
  handleCancelBookmark();
  handleViewDetails();
  handleHideDetails();
}

$(main);
