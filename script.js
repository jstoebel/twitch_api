var getStream = function(userName) {
    //pre: userName(string)
    //post: a Promise object that makes an AJAX call to Twitch API

    var rootUrl = "https://api.twitch.tv/kraken/streams/";
    var cb = "?callback=?";
    return new Promise(function(resolve, reject) {
        //getJSON with userName
        $.getJSON(rootUrl+userName+cb, function(response) {
            if (response.stream) {
                //online!
                resolve(response)
            } else {
                //offline!
                //return user's channel
                reject(response)  //._links.channel)
            }
        })
    })  
}

var getChannel = function(channel) {
    //pre: channel to request (string)
    //post: a Promise object that makes an AJAX call to Twitch API

    return new Promise(function(resolve, reject) {
        $.getJSON(channel, function(resp) {
            if (resp) {
                //if we got a response
                resolve(resp)
            } else {
                //no response
                reject("no response!")
            }
        })
    })

}

var pushTab = function(data, OnOff) {
    //pre:
        //data: object containing all of our needed data:
            //img_loc
            //name
            //game
        //data can also be null
        //OnOff: if the user is online, "online" otherwise "offline")
    //post: data is pused to tab

    //profiles as columns
    var template = `
        <div class="col-xs-12 col-sm-6 col-md-3 tile">
            <a href="http://www.twitch.tv/${data.name}" target="_blank">
                <img src="${data.imgLoc}" class="logo">
            </a>
            <div class="info">            
                <div class="stream-info">${data.name}</div>
                <div class="stream-info">${data.game}</div>
            </div>
        </div>
    `
    // console.log("should push " + template);
    $("#"+OnOff+"-row").prepend(template);
    $("#all-row-"+OnOff).prepend(template);

};



$(document).ready(function(){
    var users = ["storbeck", "terakilobyte", "habathcx",
    "RobotCaleb","thomasballinger","noobs2ninjas","beohoff", "brunofin", "comster404", "freecodecamp"];

    var logoStanIn = "http://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F";

    for (u in users) {
        getStream(users[u]).then(function(streamResults){
            var data = {
                imgLoc: streamResults.stream.channel.logo || logoStanIn,
                name: streamResults.channel.display_name,
                game: streamResults.stream.channel.game || ""
            };

            pushTab(data, "online")

        }).catch(function(streamResults){

            //are they offline or did I get an error?

            if (streamResults.error) {
                console.log("error!")
                //its an error!
                var data = {
                    imgLoc: logoStanIn,
                    name: users[u],
                    game: "Channel Removed"
                }
                pushTab(data, "offline")

            } else {
                console.log("offline!")
                //get channel
                getChannel(streamResults._links.channel).then(function(channelResults){
                    //got the channel back
                    var data = {
                        imgLoc: channelResults.logo || logoStanIn,
                        name: channelResults.display_name,
                        game: channelResults.game || ""
                    };

                    pushTab(data, "offline")

                })  // explicetly not catching errors on this
            }

        })

    }



})