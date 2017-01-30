'use strict';
const stream = require('stream');
const parser = require('tap-parser');

/**
 * Parses TAP aysncronously resolving a Promise with an `Object` 
 * representing the structured TAP.
 * 
 * @param {string} tap
 * @returns Promise resolves with an Object
 */
function parseTAP(tap) {
  return new Promise((resolve, reject) => {
    const strReader = new stream.Readable();
    strReader.push(tap);
    strReader.push(null);

    const writable = parser(resolve);
    strReader.pipe(writable);
  });
}

module.exports.parseTAP = parseTAP;
