const http = require('http'); // pull in http module
// parsing url string
const url = require('url');
const query = require('querystring');
// files I have made
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// hold the different url possiblitities
/* const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/getUsers': jsonHandler.getUsers,
  '/notReal': jsonHandler.notReal,
  '/addUser': jsonHandler.addUser,
  index: jsonHandler.notReal,
};
*/
// when server gets a requesr
const onRequest = (request, response) => {
  // parse url into individual parts and return those
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  switch (request.method) {
    case 'GET':
      if (parsedUrl.pathname === '/') {
        // if homepage, send index
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') {
        // if stylesheet, send stylesheet
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/getIOUs') {
        // if get users, send user object back
        jsonHandler.getIOUs(request, response, params);
      } else {
        // if not found, send 404 message
        jsonHandler.notFound(request, response);
      }
      break;
    case 'HEAD':
      if (parsedUrl.pathname === '/getIOUs') {
        // if get users, send meta data back
        jsonHandler.getIOUsMeta(request, response);
      } else {
        // if not found send 404 without body
        jsonHandler.notFoundMeta(request, response);
      }
      break;
    case 'POST':
      if (parsedUrl.pathname === '/addIOU') {
        const res = response;
        const body = [];
        // if the upload stream errors out, just throw a
        // a bad request and send it back
        request.on('error', (err) => {
          console.dir(err);
          res.statusCode = 400;
          res.end();
        });

        // on 'data' is for each byte of data that comes in
        // from the upload. We will add it to our byte array.
        request.on('data', (chunk) => {
          body.push(chunk);
        });

        // on end of upload stream.
        request.on('end', () => {
          // combine our byte array (using Buffer.concat)
          // and convert it to a string value (in this instance)
          const bodyString = Buffer.concat(body).toString();
          // since we are getting x-www-form-urlencoded data
          // the format will be the same as querystrings
          // Parse the string into an object by field name
          const bodyParams = query.parse(bodyString);

          // pass to our addUser function
          jsonHandler.addIOU(request, res, bodyParams);
        });
      } else {
        jsonHandler.notFound(request, response);
      }
      break;
    default:
      jsonHandler.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
