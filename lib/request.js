var Hook = require('hook.io').Hook,
    request = require('request'),
    util = require('util');

var RequestHook = exports.RequestHook = function(options){
  Hook.call(this, options);
  var self = this;
  self.on('*::http::request', self._request);
};

// RequestHook inherits from Hook
util.inherits(RequestHook, Hook);

RequestHook.prototype._request = function(options, callback){
  var self = this,
      now  = new Date().getTime();
  //
  // Remark: The try / catch here is to catch any uncaught DNS / ECONN errors in request
  //
  try {
    request(options, function (err, response, body) {
       var requestTime = new Date().getTime() - now;
       response = response || {};
       var data = {
          err:         err,
          statusCode:  response.statusCode,
          headers:     response.headers,
          body:        body,
          requestTime: requestTime,
          hook:        options // gives back whatever option has been passed, ideal for passing a context
        };
       return callback(err, data);
     });
    
  } catch(err){
    return callback(err, options);
  }
};