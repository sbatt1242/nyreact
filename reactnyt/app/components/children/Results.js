// Include React
var React = require("react");

// Creating the Results component
var Results = React.createClass({
  // Here we set a generic state associated with the text being searched for
  getInitialState: function() {
    return { dataId: "" };
  },
  // When a user submits...
  handleClick: function (event) {
    // prevent the HTML from trying to submit a form if the user hits "Enter" instead of
    // clicking the button
    event.preventDefault();
    var eventId = event.target.id;
    this.setState({ dataId: eventId });
    this.props.setId(eventId);
  },
  // Here we render the function
  render: function () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title text-center">Search Results</h3>
        </div>
        <ul className="list-group">
          {/* Here we use a map function to loop through an array in JSX */}
          {this.props.nyt.map(function (search, i) {
            return (
              <li className="list-group-item" key={i}>
                <div className="row">
                  <div className="col-md-10 list-group-item-text">
                    <h4 className="list-group-item-heading"><a href={search.web_url} className="list-group-item-text" target="_blank">{search.headline.main}</a></h4>
                    <p>Published on: {search.pub_date}</p>
                  </div>
                  <div className="col-md-2 list-group-item-text text-right">
                    <button id={search._id} className="btn btn-primary" type="submit" onClick={this.handleClick}>Save</button>
                  </div>
                </div>
              </li>
            );
          }, this)}
        </ul>
      </div>
    );
  }
});

// Export the component back for use in other files
module.exports = Results;
