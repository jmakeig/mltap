'use strict';
const mltap = require('/mltap');

/**
 * @param {number} code
 * @param {string} [message]
 */
function HTTPClientError(code, message) {
   // <http://www.2ality.com/2011/12/subtyping-builtins.html>
   function copyOwnFrom(source, target) {Object.getOwnPropertyNames(source).forEach(function(propName) {Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));});return target;}
   const superInstance = Error.call(null, message);
   copyOwnFrom(superInstance, this);
   Error.captureStackTrace(this);
   this.name = 'HTTPClientError';
   this.code = code;
}
HTTPClientError.prototype = Object.create(Error.prototype);
HTTPClientError.constructor = HTTPClientError;

//console.log(xdmp.getRequestHeader('Content-Type'));

try {
  const method = xdmp.getRequestMethod();
  switch (method) {
    case 'POST':
      const testModules = [].concat.apply([], [xdmp.getRequestField('tests')]);
      xdmp.setResponseContentType('text/plain+tap;encoding=utf-8');
      mltap(testModules);
      break;
    default:
      throw new HTTPClientError(405, `${method} is not a supported method`);
  }
} catch(err) {
  const codes = {
    '405': 'Method not allowed',
    '500': 'Internal Server Error',
  }
  if(err instanceof HTTPClientError) {
    xdmp.setResponseCode(err.code, codes[String(err.code)]);
    if(err.message) { 
      err.message;
    }
  } else {
    xdmp.setResponseCode(500, codes['500']);
    //Error.captureStackTrace(err);
    err.stack;
  }
}