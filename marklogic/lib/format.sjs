'use strict';

require('./polyfill');
var format = require('/mltap/_modules/pretty-format/index');

/**
 * Left pads a multi-line string, for example to embed it
 * in something that’s already indented.
 * 
 * @param {string} str               Multi-line string to pad
 * @param {number} [num=0]           Number of instances to pad
 * @param {string} [fill]=' ']       Actual characters used to pad
 * @param {boolean} [hanging=false]  Suppresses the padding on the first line
 * @returns string
 * @throws TypeError
 */
function indent(str, num, fill, hanging) {
  if ('string' !== typeof str) {
    throw new TypeError(format(str) + ' is not a string');
  }
  if (!num) return str;
  var pad = new Array(num).fill(fill || ' ').join('');
  return str
    .split('\n')
    .map(function(line, index) {
      return (0 === index && hanging ? '' : pad) + line;
    })
    .join('\n');
}

/**
 * 
 * @example
 * { pad: 2 }
 * 
 * @example
 * { pad: '.' }
 * 
 * @example
 * {
 *   num: 2,
 *   fill: ' ',
 *   hanging: true,
 * }
 * 
 * @param {any}    val
 * @param {object} [opts]
 * @returns string
 */
function prettyFormat(val, opts) {
  // Argh. pretty-format rejects unknown options
  // <https://github.com/thejameskyle/pretty-format/issues/37>
  var pruned = Object.assign({}, opts);
  delete pruned.pad;

  var formatted = format(val, pruned);
  if (opts && opts.pad) {
    var num = opts.pad.num, fill = opts.pad.fill, hanging = opts.pad.hanging;
    if ('number' === typeof opts.pad) {
      num = opts.pad;
      fill = undefined;
    }
    if ('string' === typeof opts.pad) {
      num = 1;
      fill = opts.pad;
    }
    return indent(formatted, num, fill, hanging);
  }
  return formatted;
}

module.exports = prettyFormat;
