import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const UsersGames = new Mongo.Collection("usersGames");

if (Meteor.isServer) {
  Meteor.publish("usersGames", function gamesPublication() {
    return UsersGames.find({
    },{
      limit: 50,
      sort: {
        createdAt: -1
      }
    });
  });

  Meteor.publish("myData", function f() {
    if (!Meteor.userId()) {
      return this.ready();
    }
    return UsersGames.find({_id: Meteor.userId()});
  });

  Meteor.publish("gameData", function f(){
    if (!Meteor.userId()) {
      return this.ready();
    }
    let res = UsersGames.find({_id: Meteor.userId()}).fetch();
    return UsersGames.find({gameName: res[0].gameName});
  });
}

Meteor.methods({

  "usersGames.join"(name) {
    check(name, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let res = UsersGames.findOne({
      _id: this.userId
    });
    if (res){
      if (res.ingame === true) {
        throw new Meteor.Error("Already in a game");
      } else {
        UsersGames.update({
          _id: this.userId
        }, {
          $set:{
            ingame: true,
            gameName: name
          }
        });
      }
    } else {
      UsersGames.insert({
        _id: this.userId,
        username: Meteor.user().username,
        ingame: true,
        gameName: name,
        totalPoints: 0,
        totalRounds: 0
      });
    }
  },
  
  "usersGames.updateScore"(points) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    UsersGames.update ({
      _id: Meteor.userId()
    }, {
      $inc: {
        totalPoints: points,
      }
    }); 
  },



  "usersGames.exit"() {//upate points, round++, exit game
    console.log(this.userId);
    console.log(Meteor.userId());
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    UsersGames.update ({
      _id: this.userId,
    }, { 
      $set:{
        ingame: false,
        gameName: "",
      },
      $inc: {
        totalRounds: 1
      }
    }); 
  }
});



