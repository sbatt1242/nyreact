// Include React
var React = require("react");

// Here we include all of the sub-components
var Form = require("./children/Form");
var Results = require("./children/Results");
var Saved = require("./children/Saved");

// Helper for making AJAX requests to our API
var helpers = require("./utils/helpers");

// Creating the Main component
var Main = React.createClass({

  // Here we set a generic state associated with the number of clicks
  // Note how we added in this history state variable
  getInitialState: function () {
    return { searchTerm: "", id: "", saved: [], nyt: [] };
  },

  // The moment the page renders get the History
  componentDidMount: function () {
    // Get the latest history.
    console.log("componentDidMount");
    // helpers.getHistory().then(function (response) {
    //   console.log(response);
    //   if (response !== this.state.history) {
    //     console.log("History", response.data);
    //     this.setState({ history: response.data });
    //   }
    // }.bind(this));
  },

  // If the component changes (i.e. if a search is entered)...
  componentDidUpdate: function () {
    console.log("componentDidUpdate");


  },
  // This function allows childrens to update the parent.
  setTerm: function (term) {
    console.log("MAIN:" + term);
    this.setState({ searchTerm: term });
    // Run the query for the address
    helpers.runQuery(term).then(function (data) {
      if (data !== this.state.results) {
        console.log("Address", data);
        this.setState({ nyt: data });
      }
    }.bind(this));
  },
  // set id then post
  setId: function (data) {
    console.log("main: " + data);
    this.setState({ id: data });
    // filter the article based on the id selected
    var result = this.state.nyt.filter(function (obj) {
      return obj._id === data;
    });
    var selected = result[0];
    var nytObj = {
      title: selected.headline.main,
      date: Date.now(),
      url: selected.web_url
    }
    helpers.postArticle(nytObj).then(function () {
      console.log("Updated!");

      // After we've done the post... then get the updated history
      helpers.getArticle().then(function (response) {
        console.log("Saved: ", response.data);
        this.setState({ saved: response.data });
      }.bind(this));
    }.bind(this));
  },

  // delete saved article
  deleteArticle: function (data) {
    helpers.deleteSaved(data).then(function (response) {
      console.log(response);
      console.log("Deleted!");
      // After we've done the post... then get the updated history
      helpers.getArticle().then(function (response) {
        console.log("After delete: ", response.data);
        this.setState({ saved: response.data });
      }.bind(this));
    }.bind(this));

  },
  // Here we render the function
  render: function () {
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron">
            <h2 className="text-center">New York Times Article React</h2>
            <p className="text-center">
              <em>Search for and annotate articles of interest!</em>
            </p>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Form setTerm={this.setTerm} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Results nyt={this.state.nyt} setId={this.setId} />
            </div>
          </div>
        </div>
        <div className="row">
          <Saved saved={this.state.saved} delete={this.deleteArticle} />
        </div>
      </div>
    );
  }
});

// Export the component back for use in other files
module.exports = Main;
