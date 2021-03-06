import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { UsersGames } from "../api/usersGames.js";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

class MyCollection extends Component {
  constructor(props) {
    super(props);
  }
  getDate(createdAt) {
    let data =  new Date(createdAt);
    return data.toDateString();
  }

  render() {
    // console.log(this.props.myData);
    // console.log(this.props.myData[0]);

    return (
      <div className="container collection">
        <h2 className="row collection"> My Collection 
          {this.props.myData != []?
            <span>
              <span id="badge" className="badge badge-pill badge-warning m-2">
                {this.props.myData.map(m => (<h5 key={m}>    {m.collection.length} cards</h5>))}
              </span>
            </span> : null}
        </h2>
        { this.props.myData != []?
          <div className="row collectionCards" id="addcard">
            {this.props.myData.map(m => m.collection.map(card => (
              
              <div

                key={card._id}
                className="card col-xs-4 col-s-3 container image"
                style={{
                  backgroundImage: `url(${card.url})`,
                  backgroundSize: "cover"
                }}
              >
                <div className="overlay">
                  <div className="text">{this.getDate(card.createdAt)}<br/>@ {card.gameName}</div>
                </div>
              </div>
            )))}
          </div> : null
        }
      </div>
    );
  }
}

MyCollection.propTypes = {
  myData: PropTypes.arrayOf(PropTypes.object).isRequired,
  ready: PropTypes.bool.isRequired
};

export default withTracker(() => {
  const handle = Meteor.subscribe("myData");
  return {
    user: Meteor.user(),
    myData: UsersGames.find().fetch(),
    ready: handle.ready(),
  };
})(MyCollection);
