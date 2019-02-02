'use strict';

/* global $ api */

const state = (function () {

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
        // console.log(err);
      });
  };

  const render = function () {

    const getFilteredState = function (state) {

      const filtered = {
        view      : state.view,
        errors    : state.errors,
        minRating : state.minRating,
      };

      filtered.bookmarks = state.bookmarks.filter((bookmark) => {

        if (state.minRating === 0) {
          return true;
        }

        if (parseInt(bookmark.rating, 10) >= state.minRating) {
          return true;
        }

        return false;
      });

      return filtered;
    };

    const filteredState = getFilteredState(state);

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

    // console.log('Initial View', filteredState);
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

    // console.log('Add View', filteredState);
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


    // console.log('Delete View', filteredState);
  };

  const generateErrorHtml = function (errors){

    let view = '<section class="error-container">';

    view += errors.map(err => {
      return `<p class = "error message" aria-role="error-message">${err}</p>`;
    }).join('');

    view += '</section>';
    return view;
  };

  const generateListHtml = function (bookmarks){

    let html = '';

    html += '<section class="list">';

    html += '<ul class="bookmarks-list">';

    html += bookmarks.map(bookmark => {

      let item = '<li>';

      if (bookmark.selected === true){
        item += `
        <div>
          <input type="checkbox" id="bookmark-${bookmark.id}" class='checkbox' data-cuid="${bookmark.id}" checked>
          <label for="bookmark-${bookmark.id}"><strong>${bookmark.title}</strong></label>
        </div>
        <div class="bookmark-rating">
          ${fullStar.repeat(bookmark.rating) + emptyStar.repeat(5 - bookmark.rating)}
        </div>`;
      } else {
        item += `
        <div>
          <input type="checkbox" id="bookmark-${bookmark.id}" class='checkbox' data-cuid="${bookmark.id}">
          <label for="bookmark-${bookmark.id}"><strong>${bookmark.title}</strong></label>
        </div>
        <div class="bookmark-rating">
          ${fullStar.repeat(bookmark.rating) + emptyStar.repeat(5 - bookmark.rating)}
        </div>`;
      }

      if (bookmark.expanded === true) {
        item += `
          <input type="button" class="hide-details" value="Hide details">
          <div class="description-container">
            ${ bookmark.description || '' }
            <a class="fake-button make-button" href="${bookmark.url}" target="_blank">Visit Site</a>
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
  };

  const generateAddViewHtml = function (){
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
            <option value="0"></option>
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
  };

  return {
    view      : 'initial',
    errors    : [],
    minRating : 0,
    bookmarks : [],
    populate  : populateState,
    render    : render,
  };
}());
