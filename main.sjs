'use strict';



/**
 * CAUTION: This is a total hack.
 * 
 * For objects that cross an `xdmp.invoke()` boundary
 * only the enumerable properties of the instance are 
 * copied, not all of the inherited ones from the 
 * prototype chain. 
 * 
 * This function creates a new instance of a type and then
 * copies all of the enumerable properties from the 
 * immediate prototype onto the newly created instance. 
 * 
 * @param {class|function} Type
 * @returns A new instance that behaves like a `Type`
 */
function newInstance(Type, ...args) {
  // <http://stackoverflow.com/a/3871769/563324>
  let instance = Object.create(Type.prototype);
  instance.constructor = Type;
  // `Type` cannot be declared as a class becuase 
  // class constructor functions can only be
  // called with the `new` operator.
  const constructed = Type.apply(instance, args);
  if('object' === typeof constructed) {
     instance = constructed;
  }
  Object
    .getOwnPropertyNames(Type.prototype)
    .forEach(prop => instance[prop] = Type.prototype[prop]);
  return instance;
} 



/**
 * ES5-style class
 */
function Speaker() {
  this.name = 'Bob';
}
Speaker.prototype = {
  declare(message) {
    return `${this.name} says: ${message}`;
  }
}


/**
 * Singleton that has an instance of the
 * `Speaker` class.
 */
const obj = {
  msg: 'Hi!',
  speaker: newInstance(Speaker),
  say() {
    return this.speaker.declare(this.msg);
  }
};
obj;