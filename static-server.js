module.exports.init = function(port) {
    var http = require("http"),
        url = require("url"),
        fs = require("fs"),
        path = require("path"),
        port = port || 8000;

    http.createServer(function(request, response) {
        var uri = url.parse(request.url).pathname
        , filename = path.join(process.cwd(), uri);

        fs.exists(filename, function(exists) {
            if(!exists) {
                filename = "index.html";
               /*
               console.log("No such file: "+filename);
               response.writeHead(404, {"Content-Type": "text/plain"});
               response.write(uri+ " Not found\n");
               response.end();
               return;
               */
            }

            console.log("Serving "+uri+" as: "+filename);

            if (fs.statSync(filename).isDirectory()) filename += '/index.html';

            fs.readFile(filename, "binary", function(err, file) {
                if(err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                response.writeHead(200);
                response.write(file, "binary");
                response.end();
            });
        });
    }).listen(parseInt(port, 10));
}
