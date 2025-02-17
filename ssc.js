// Require the functionality we need to use:
var http = require('http'),
	url = require('url'),
	path = require('path'),
	mime = require('mime'),
	path = require('path'),
	fs = require('fs');

// Make a simple fileserver for all of our static content.
var app = http.createServer(function(req, resp){
	var filename = path.join(__dirname, "ssc", url.parse(req.url).pathname);
	(fs.exists || path.exists)(filename, function(exists)
	{
		if (exists)
		{
			fs.readFile(filename, function(err, data)
			{
				if (err)
				{
					// File exists but is not readable (permissions issue?)
					resp.writeHead(500, {
						"Content-Type": "text/plain"
					});
					resp.write("Internal server error: could not read file");
					resp.end();
					return;
				}

				// File exists and is readable
				var mimetype = mime.lookup(filename);
				resp.writeHead(200, {
					"Content-Type": mimetype
				});
				resp.write(data);
				resp.end();
				return;
			});
		}
		else
		{
			// File does not exist
			resp.writeHead(404, {
				"Content-Type": "text/plain"
			});
			resp.write("Requested file not found: "+filename);
			resp.end();
			return;
		}
	});
});
app.listen(3456);

// start up socketio connection
var io = require("socket.io");
var socket = io.listen(app);
