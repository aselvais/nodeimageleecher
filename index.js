var http = require('http');
var $ = require('jquery');
var jsdom = require("jsdom");
var request = require('request');
var http = require('http'),
    Stream = require('stream').Transform,
    fs = require('fs');
var sanitize = require("sanitize-filename");

var url = process.argv[2];

var download = function(uri, filename, callback){
  console.log('Downloading '+uri);
  request.head(uri, function(err, res, body){
    try {
      request(uri).on('error', function(err) {
    console.log(err);
  }).pipe(fs.createWriteStream(filename)).on('close', callback);
    } catch (errr) {
      console.log(errr);
      callback.apply();
    }
  });
};

jsdom.env(
  url,
  ["http://code.jquery.com/jquery.js"],
  function (err, window) {
    var $ = require("jquery")(window);
    var files = [];
    $('a').each(function(e){
      var ll = $(this).attr('href')
      if (ll.match(/\.jpg$/)) {
        files.push(ll);
      }
    });
for (var i = files.length-1; i > 0; i--)
{
     download(url + files[i], sanitize(files[i]), function(){
       console.log(files[i] + ' done');
     });
}


  }
);
