var jsdom = require("jsdom");
var fs = require('fs');
var request = require('request');
var sanitize = require("sanitize-filename");

var url = '';

if (process && process.argv && process.argv[2])
{
	url = process.argv[2];
}
else
{
	console.log('an URL is missing ...');
	process.exit();
}

/**
 *
 * @param uri
 * @param filename
 * @param callback
 */
var download = function (uri, filename, callback)
{
	console.log('Downloading ' + uri);
	request.head(uri, function (err, res, body)
	{
		try
		{
			request(uri).on('error', function (err) { console.log(err); }).pipe(fs.createWriteStream('./downloaded/' + filename)).on('close', callback);
		} catch (errr)
		{
			console.log(errr);
			callback.apply();
		}
	});
};

/**
 *
 * @param err
 * @param window
 */
var getImageFromPage = function (err, window)
{
	var $ = require("jquery")(window);

	$('img').add('a').each(function (e)
	{
		var ll = '';
		if ($(this).attr('href'))
		{
			ll = $(this).attr('href');
		}
		if ($(this).attr('src'))
		{
			ll = $(this).attr('src');
		}
		if (ll.match(/\.jpg$|\.png|\.gif/))
		{
			var fullUrl = '';
			if (fullUrl.match(/^http/))
			{
				fullUrl = ll;
			} else
			{
				fullUrl = url + ll;
			}
			download(fullUrl + '', sanitize(ll + ''), function ()
			{
				console.log(ll + ' done');
			});
		}
	});
};


console.log('Getting images from ' + url + ' ...');
jsdom.env(url, getImageFromPage);
