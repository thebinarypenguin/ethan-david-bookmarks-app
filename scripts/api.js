'use strict';

const api = (function() {

  const USER_NAME = 'ethan';
  const BASE_URI  = `https://thinkful-list-api.herokuapp.com/${USER_NAME}/bookmarks`;

  const validateBody = function (input) {

    const validInput = {};

    const keys = Object.keys(input);

    for (let k = 0; k < keys.length; k++) {

      switch (keys[k]) {

      case 'id':
        if (input.id) {
          validInput.id = input.id;
        }
        break;

      case 'title':
        if (input.title) {
          validInput.title = input.title;
        }
        break;

      case 'url':
        if (input.url) {
          validInput.url = input.url;
        }
        break;

      case 'desc':
        if (input.desc) {
          validInput.desc = input.desc;
        }
        break;

      case 'description':
        if (input.description) {
          validInput.desc = input.description;
        }
        break;

      case 'rating':

        const num = Number.parseInt(input.rating, 10);

        if (num >= 1 && num <= 5) {
          validInput.rating = num;
        }
        break;

      default:
        // do nothing
        break;
      }
    }

    console.log(input, validInput);
    return validInput;
  };

  const request = function (uri, options) {

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const mergedOptions = Object.assign({}, defaultOptions, options);

    let response = null;

    return fetch(uri, mergedOptions)
      .then((res) => {
        // Save response object for later use
        response = res;
        return res;
      })
      .then((res) => {
        // parse json
        return res.json();
      })
      .then((data) => {
        if (!response.ok) {
          throw new Error(data.message);
        }

        return data;
      });
  };


  const getAllBookmarks = function () {

    return request(BASE_URI, {});
  };

  const getBookmark = function (id) {

    // TODO sanity check id

    return request(`${BASE_URI}/${id}`, {});
  };

  const createBookmark = function (data) {

    // TODO sanity check data

    return request(BASE_URI, {
      method: 'POST',
      body: JSON.stringify(validateBody(data))
    });
  };

  const updateBookmark = function (id, data) {

    // TODO sanity check id and data

    return request(`${BASE_URI}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(validateBody(data)),
    });
  };

  const destroyBookmark = function (id) {

    // TODO sanity check id

    return request(`${BASE_URI}/${id}`, {
      method: 'DELETE',
    });
  };


  return {
    getAllBookmarks,
    getBookmark,
    createBookmark,
    updateBookmark,
    destroyBookmark,
  };

}());
