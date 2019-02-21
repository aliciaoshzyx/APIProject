const IOUs = {};

// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  // object for our headers
  // Content-Type for json
  const headers = {
    'Content-Type': 'application/json',
  };

  // send response with json object
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
// takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  // object for our headers
  // Content-Type for json
  const headers = {
    'Content-Type': 'application/json',
  };

  // send response without json object, just headers
  response.writeHead(status, headers);
  response.end();
};

// get user object
// should calculate a 200
const getIOUs = (request, response) => {
  // json object to send
  const responseJSON = {
    message: 'Success',
    IOUs,
  };

  // return 200 with message
  return respondJSON(request, response, 200, responseJSON);
};
const getIOUsMeta = (request, response) => respondJSONMeta(request, response, 200);


const addIOU = (request, response, body) => {
  // default json message if left blank
  const responseJSON = {
    message: 'Your name, their name, and ammount owed are all required',
  };

  // check if any parameters are missing
  if (!body.name || !body.oname || !body.ammount || !body.why) {
    responseJSON.id = 'Bad Request';
    // return 400 error
    return respondJSON(request, response, 400, responseJSON);
  }

  // default created
  let responseCode = 201;

  // check if just update
  if (IOUs[body.why]) {
    responseJSON.id = 'Updated';
    responseJSON.message = 'Updated: (no content)';
    responseCode = 204;
  } else {
    IOUs[body.why] = {};
  }
  
  IOUs[body.why].why = body.why;
  IOUs[body.why].name = body.name;
  IOUs[body.why].otherName = body.oname;
  IOUs[body.why].ammount = body.ammount;
  if(body.when !== "")
    IOUs[body.why].when = body.when;
  else
    IOUs[body.why].when = "Anytime"; //default for if date is not given
  
  if (responseCode === 201) {
    responseJSON.id = 'Success';
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSON(request, response, responseCode, responseJSON);
};

// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'Resource Not Found',
  };

  // return a 404 with an error message
  respondJSON(request, response, 404, responseJSON);
};

// function for 404 not found without message
const notFoundMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONMeta(request, response, 404);
};

// set public modules
module.exports = {
  getIOUs,
  getIOUsMeta,
  addIOU,
  notFound,
  notFoundMeta,
};
