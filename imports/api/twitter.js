import { Meteor } from "meteor/meteor";
//import { HTTP } from 'meteor/http';

//HTTP.call(method, url, [options], [asyncCallback])

let Twitter = require("twitter");

Meteor.methods({
  "twitter.invite"(info) {
    if (info == null) {
      return;
    }
    let client = new Twitter({
      consumer_key: "YffJaGtYhAtJpA6LhurUL7IGP",
      consumer_secret: "r9U5zh1yX70ynN470aVLxfDipFHsLaTzOC3hs0XdPUQNDTbSga",
      access_token_key: Meteor.user().services.twitter.accessToken,
      access_token_secret: Meteor.user().services.twitter.accessTokenSecret
    });

    let data = "";
    if (info.friends !== null) {
      let friends = info.friends.split(",");
      for (var i = 0; i < friends.length; i++) {
        data = data.concat("@",friends[i]," ");
      }
      data = data.concat("Join my Dixit game! link: https://dixitgame2019.herokuapp.com/, accessCode: ", info.accessCode.toString());
    }

    client.post("statuses/update", { status: data }, function(
      error,
      tweet,
      response
    ) {
      console.log("error: ", error);
      if (error) throw error;
      console.log(tweet); // Tweet body.
      console.log(response); // Raw response object.
    });
  }
});