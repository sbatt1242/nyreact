// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");

// NYT API key
var nytAPI = "a0001411237041cdac81e7c11f508333";

// Helper functions for making API Calls
var helper = {

  // This function serves our purpose of running the query to geolocate.
  runQuery: function (location) {
    console.log(location);
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + nytAPI + "&q=" + location + "&sort=newest";
    return axios.get(queryURL).then(function (result) {
      // If get get a result, return the response.docs array
      if (result.data) {
        return result.data.response.docs;
      }
      return "";
    });
  },

  // This function hits our own server to retrieve the record of query results
  getArticle: function () {
    return axios.get("/api");
  },

  // This function posts new searches to our database.
  postArticle: function (nytObj) {
    return axios.post("/api", nytObj);
  },

  // This function deletes saved article by id
  deleteSaved: function (id){
    return axios.delete("/api/" + id);
  }
};

// We export the API helper
module.exports = helper;
