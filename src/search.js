function isObject(obj) {
  //return Object.prototype.toString.call(obj) === "[object Object]" || Object.prototype.toString.call(obj) === "[object Array]";
  return typeof(obj) === 'object' && obj !== null && obj !== undefined;
}

/**
 * @class ScopeSearch
 * class to search in javascript objects
 */
class ScopeSearch {
  /**
   * constructor of the ScopeSearch class.
   * @constructor
   * @param {Object} [origin={}] object to search through
   * @param  {function} [validator= function(){return false}] condition that will validate whether or not the data looked at is a valid result
   * @param  {Object} [options = {maxDepth:50, key:true, value: true, logErrors: false, logProgress:true, progressThreshold:0.25}] object specifying different options to our search
   * @param {Number} [options.maxDepth=50] maximum depth the recursive search will go through.
   * @param {Boolean} [options.key=true] check the keys of properties for matches against our validator
   * @param {Boolean} [options.value=true] check the values of properties for matches against our validator
   * @param {Boolean} [options.logErrors=false] log (console.error) error thrown by our validator function
   * @param {Boolean} [options.logProgress=true] log progress percentage of our search (compared to total amount of properties to look at)
   * @param {Number} [options.progressThreshold=0.25] threshold % to show for the progress logs (default logs for every 25% searched)
   * @return {ScopeSearch}         instance created (this)
   */
  constructor(origin = {}, validator = function() {
    return false;
  }, options = {}) {
    this.options = Object.assign({ maxDepth: 50, key: true, value: true, logErrors: false, logProgress: true, progressThreshold: 0.25 }, options);
    this.validator = validator;
    this.origin = origin;
    this.results = [];
    this.timeouts = [];
    return this;
  }
  /**
   * use console.log to log the passed parameter
   * @param  {String} toLog message to print w/ console.error
   */
  logError(toLog) {
    if (this.options.logErrors) {
      console.error(toLog);
    }
  }
  __loopThrough(originObj, callback, depth = 0, context = '') {
    const currentDepth = depth + 1;
    this._visited.add(originObj);
    for (let key in originObj) {
      try {
        if (!callback(originObj, key, originObj[key], currentDepth, context) || (originObj.hasOwnProperty && !originObj.hasOwnProperty(key))) {
          continue;
        }

        if (isObject(originObj[key]) && !this._visited.has(originObj[key])) {
          this.__loopThrough(originObj[key], callback, currentDepth, `${context}['${key}']`);
        }
      } catch (e) {
        this.logError(e);
      }
    }
  }
  _recursiveBrowsing(originObj, callback) {
    this._visited = new WeakSet();
    this.__loopThrough(originObj, callback);
    this._visited = null;
  }
  /**
   * check the specific data against the validator function
   * @param  {String|Number|Function} data      value to call validator with
   * @param  {Function} [validator=this.validator] validator to test the passed data with
   * @return {Boolean}            whether or not the tested data matched the requireements of the validator
   */
  testValue(data, validator = this.validator) {
    let res = false;
    try {
      res = validator(data);
    } catch (e) {
      this.logError(`${context}=>${e}`);
    } finally {
      return res;
    }
  }
  /**
   * search through given object for data that matches the validator
   * @param  {Object} [origin=this.origin]    object to search through
   * @param  {Function} [validator=this.validator]  condition that will validate whether or not the data looked at is a valid result (see {@link ScopeSearch#constructor})
   * @param  {Object} [otions=this.options] object specifying different options to our search (see {@link ScopeSearch#constructor})
   * @return {Array.Objects}           Array containing all matching results
   */
  search(origin = this.origin, validator = this.validator, options = {}) {
    Object.assign(this.options, options);
    this.results = [];
    let counter = 0;
    const nbObjs = this.options.logProgress && this.count(origin);
    if (nbObjs) {
      var nextThreshold = 0.25;
      console.info(`Searching through ${nbObjs} ${(this.options.key ? "keys and " : "")}${(this.options.value? "values" : "")}`);
    }
    this._recursiveBrowsing(origin, (container, key, value, depth, context) => {
      counter++;
      if (this.options.logProgress && counter / nbObjs >= nextThreshold) {
        console.log(`${((counter / nbObjs) * 100) | 0}% searched...`);
        nextThreshold += this.options.progressThreshold;
      }
      if (this.options.key && this.testValue(key, validator)) {
        this.results.push({ data: key, context, container, key: true });
      }
      if (this.options.value && this.testValue(value, validator)) {
        this.results.push({ data: value, context: `${context}['${key}']`, container, value: true });
      }
      return depth < this.options.maxDepth;
    });
    return this.results;
  }
  /**
   * Counts the number of non-object properties inside of a javascript object
   * @param  {Object} [origin=this.origin]    object which will be searched through and the number of properties returned
   * @return {Number}        Number of (non-object) properties which inside the origin and all its inner objects
   */
  count(origin=this.origin) {
    let res = 0;
    this._recursiveBrowsing(origin, (container, key, value, depth, context) => {
      res++;
      return depth < this.options.maxDepth;
    });
    return res;
  }
}


try {
  module.exports = ScopeSearch;
} catch (e) {
  console.log('cannot export module');
}
