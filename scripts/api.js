'use strict';

const api = (function() {

  const USER_NAME = 'ethan';
  const BASE_URI  = `https://thinkful-list-api.herokuapp.com/${USER_NAME}/bookmarks`;

  const HEADERS = {
    'Content-Type': 'application/json',
  };


  const getAllBookmarks = function () {

    return fetch(BASE_URI, {
      headers: HEADERS,
    })
      .then((res) => { return res.json(); });
  };

  const getBookmark = function (id) {

    // TODO sanity check id

    return fetch(`${BASE_URI}/${id}`, {
      headers: HEADERS,
    })
      .then((res) => { return res.json(); });
  };

  const createBookmark = function (data) {

    // TODO sanity check data

    return fetch(BASE_URI, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(data)
    })
      .then((res) => { return res.json(); });
  };

  const updateBookmark = function (id, data) {

    // TODO sanity check id and data

    return fetch(`${BASE_URI}/${id}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(data),
    })
      .then((res) => { return res.json(); });
  };

  const destroyBookmark = function (id) {

    // TODO sanity check id

    return fetch(`${BASE_URI}/${id}`, {
      method: 'DELETE',
      headers: HEADERS,
    })
      .then((res) => { return res.json(); });
  };


  return {
    getAllBookmarks,
    getBookmark,
    createBookmark,
    updateBookmark,
    destroyBookmark,
  };

}());
