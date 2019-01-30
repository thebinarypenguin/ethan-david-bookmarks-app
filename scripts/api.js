'use strict';

const api = (function() {

  const USER_NAME = 'ethan';
  const BASE_URI  = `https://thinkful-list-api.herokuapp.com/${USER_NAME}/bookmarks`;

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
      body: JSON.stringify(data)
    });
  };

  const updateBookmark = function (id, data) {

    // TODO sanity check id and data

    return request(`${BASE_URI}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
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
