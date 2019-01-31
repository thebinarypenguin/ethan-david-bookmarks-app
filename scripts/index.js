'use strict';
/* global $ */

let state = {
  view: 'initial',
  errors: [],
  minRating: 0,
  bookmarks: [],
};

const fullStar  = '&starf;';
const emptyStar = '&star;';

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

  let view = '<section class="error-container">';

  view += errors.map(err => {
    return `<p class = "error message" aria-role="error-message">${err}</p>`;
  }).join('');

  view += '</section>';
  return view;
}

function generateListHtml(bookmarks){

  let html = '';

  html += '<section class="list">';

  html += '<ul class="bookmarks-list">';

  html += bookmarks.map(bookmark => {

    let item = '<li>';

    if (bookmark.selected === true){
      item += `
      <div>
        <input type="checkbox" class='checkbox' data-cuid="${bookmark.id}" checked><strong>${bookmark.title}</strong>
      </div>
      <div class="bookmark-rating">
        ${fullStar.repeat(bookmark.rating) + emptyStar.repeat(5 - bookmark.rating)}
      </div>`;
    } else {
      item += `
      <div>
        <input type="checkbox" class='checkbox' data-cuid="${bookmark.id}"><strong>${bookmark.title}</strong>
      </div>
      <div class="bookmark-rating">
        ${fullStar.repeat(bookmark.rating) + emptyStar.repeat(5 - bookmark.rating)}
      </div>`;
    }

    if (bookmark.expanded === true) {
      item += `
        <input type="button" class="hide-details" value="Hide details">
        <div class="description-container">
          ${bookmark.description}
          <a class="fake-button" href="${bookmark.url}">Visit Site</a>
        </div>
      `;
    }  else {
      item += `
        <input type="button" class="view-details" value="View details">
      `;
    }

    item += '</li>';

    return item;
  }).join('');

  html += '</ul>';

  html += '</section>';

  return html;
}

function generateAddViewHtml(){
  return `<form action="" class="new-bookmark-form">
  <div class="flex form-container">
    <div class="left-form">
      <label for="bookmark-title">Title</label>
      <input type="text" name="title" id="new-bookmark-title">
      <label for="bookmark-name">URL</label>
      <input type="text" name="url" id="new-bookmark-url">
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

const renderInitial = function (filteredState) {

  let view = '';

  view += `
    <section class="controls flex">
      <form action="" class="new-bookmark-button">
        <button class="js-new-item">New</button>
      </form>
      <div class="rating-container">
        <form action="" class="bookmark-rating-form">
          <label for="bookmark-rating">Rating</label>
          <select name="" id="bookmark-rating">
            <option value="0"></option>
            <option value="1">★☆☆☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="3">★★★☆☆</option>
            <option value="4">★★★★☆</option>
            <option value="5">★★★★★</option>
          </select>
          <button class="submit-rating">Filter</button>
        </form>
      </div>
    </section>
  `;

  if (state.errors.length > 0) {

    view += '<div class="error-container">';

    view += state.errors.map((msg) => { return `<p>${msg}</p>`; }).join('');

    view += '</div>';
  }

  view += generateListHtml(filteredState.bookmarks);

  $('main').html(view);

  // $('.bookmarks-list').html(generateListHtml(state.bookmarks));
  console.log('Initial View', filteredState);
};

const renderAdd = function (filteredState) {

  let view = '';

  view += `
      <section class="controls flex">
        <form action="" class="new-bookmark-button">
        <button class="js-new-item">New</button>
      </form>
      <div class="rating-container">
        <form action="" class="bookmark-rating-form">
          <label for="bookmark-rating">Rating</label>
          <select name="" id="bookmark-rating">
            <option value="0"></option>
            <option value="1">★☆☆☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="3">★★★☆☆</option>
            <option value="4">★★★★☆</option>
            <option value="5">★★★★★</option>
          </select>
          <button class="submit-rating">Filter</button>
        </form>
      </div>
      </section>`;

  view += generateErrorHtml(filteredState.errors);


  view += generateAddViewHtml();


  view += generateListHtml(filteredState.bookmarks);

  $('main').html(view);

  console.log('Add View', filteredState);
};

const renderDelete = function (filteredState) {

  let count = 0;

  filteredState.bookmarks.forEach((b) => {

    if (b.selected === true) {
      count++;
    }
  });

  const countString = count === 1 ? `${count} item selected` : `${count} items selected`;

  let view = '';

  view += `
  <section class="controls flex">
    <form action="" class="new-bookmark-button">
      <button class="js-new-item">New</button>
    </form>
    <div class="rating-container">
      <form action="" class="bookmark-rating-form">
        <label for="bookmark-rating">Rating</label>
        <select name="" id="bookmark-rating">
          <option value="0"></option>
          <option value="1">★☆☆☆☆</option>
          <option value="2">★★☆☆☆</option>
          <option value="3">★★★☆☆</option>
          <option value="4">★★★★☆</option>
          <option value="5">★★★★★</option>
        </select>
        <button class="submit-rating">Filter</button>
      </form>
    </div>
  </section>
`;

  view += generateErrorHtml(filteredState.errors);

  view += '<section class="delete-controls flex">';

  view += countString;

  view += `<form action="" class="delete-bookmarks">
    <button type="submit">Delete</button>
  </form>
</section>`;

  view += generateListHtml(filteredState.bookmarks);

  $('main').html(view);


  console.log('Delete View', `${count} selected`, filteredState);
};


function handleNewItem(){
  $('main').on('submit', '.new-bookmark-button', function(event){
    event.preventDefault();
    state.view = 'add';
    render();
  });
}

function handleRatingFilter(){
  $('main').on('submit', '.bookmark-rating-form', function(event){
    event.preventDefault();
    state.minRating = parseInt($('#bookmark-rating').val(), 10);
    render();
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
        render();
      });

  });
}

function handleCancelBookmark(){
  $('main').on('click', '#cancel-item', function(event){
    event.preventDefault();
    state.errors = [];
    state.view = 'initial';
    render();
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

    render();
  });
}

function handleDelete(){
  $('main').on('submit', '.delete-bookmarks', function(event){
    event.preventDefault();

    const selectedBookmarks = state.bookmarks.filter((b) => {
      return b.selected === true;
    });

    const loop = selectedBookmarks.reduce((prevPromise, bookmark, i) => {

      return prevPromise.finally(() => {

        return api.destroyBookmark(bookmark.id)
          .then((body) => {
            console.log(`Promise #${i} resolved,`, bookmark.title, bookmark.id);
            const deletedIndex = state.bookmarks.findIndex((mark) => { return mark.id === bookmark.id; });
            console.log(`Deleteing index ${deletedIndex}`);
            const ded = state.bookmarks.splice(deletedIndex, 1);
            console.log(`Spliced out items ${ded}`);
          })
          .catch((err) => {
            console.log(`Promise #${i} rejected,`, err);
            state.errors.push(err.message);
          });

      });

    }, Promise.resolve());


    loop.finally((data) => {
      console.log('finally', data);
      state.view = 'initial';
      render();
    });

  });
}

function handleViewDetails(){
  $('main').on('click', '.view-details', function(event){
    event.preventDefault();
    const cuid = $(event.target).closest('li').find('input').data('cuid');
    const bookmark = state.bookmarks.find(bookmark => bookmark.id === cuid);
    bookmark.expanded = true;
    render();
  });
}

function handleHideDetails(){
  $('main').on('click', '.hide-details', function(event){
    event.preventDefault();
    const cuid = $(event.target).closest('li').find('input').data('cuid');
    const bookmark = state.bookmarks.find(bookmark => bookmark.id === cuid);
    bookmark.expanded = false;
    render();
  });
}

function main(){
  populateState()
    .then(render);
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
