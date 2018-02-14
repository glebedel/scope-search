"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function hasKeys(obj) {
  return Object.keys(obj).length;
}
/**
 * @class ScopeSearch
 * class to search in javascript objects
 */

var ScopeSearch = function () {
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

  function ScopeSearch() {
    var origin = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var validator = arguments.length <= 1 || arguments[1] === undefined ? function () {
      return false;
    } : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, ScopeSearch);

    this.options = _extends({ maxDepth: 50, key: true, value: true, logErrors: false, logProgress: true, progressThreshold: 0.25 }, options);
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


  _createClass(ScopeSearch, [{
    key: "logError",
    value: function logError(toLog) {
      if (this.options.logErrors) {
        console.error(toLog);
      }
    }
  }, {
    key: "__loopThrough",
    value: function __loopThrough(originObj, callback) {
      var depth = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
      var context = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

      var currentDepth = depth + 1;
      this._visited.add(originObj);
      for (var key in originObj) {
        try {
          if (!callback(originObj, key, originObj[key], currentDepth, context) || originObj.hasOwnProperty && !originObj.hasOwnProperty(key)) {
            continue;
          }
          if (hasKeys(originObj[key]) && !this._visited.has(originObj[key])) {
            this.__loopThrough(originObj[key], callback, currentDepth, context + "['" + key + "']");
          }
        } catch (e) {
          this.logError(e);
        }
      }
    }
  }, {
    key: "_recursiveBrowsing",
    value: function _recursiveBrowsing(originObj, callback) {
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

  }, {
    key: "testValue",
    value: function testValue(data) {
      var validator = arguments.length <= 1 || arguments[1] === undefined ? this.validator : arguments[1];

      var res = false;
      try {
        res = validator(data);
      } catch (e) {
        this.logError(context + "=>" + e);
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

  }, {
    key: "search",
    value: function search() {
      var origin = arguments.length <= 0 || arguments[0] === undefined ? this.origin : arguments[0];

      var _this = this;

      var validator = arguments.length <= 1 || arguments[1] === undefined ? this.validator : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      _extends(this.options, options);
      this.results = [];
      var counter = 0;
      var nbObjs = this.options.logProgress && this.count(origin);
      if (nbObjs) {
        var nextThreshold = 0.25;
        console.info("Searching through " + nbObjs + " " + (this.options.key ? "keys and " : "") + (this.options.value ? "values" : ""));
      }
      this._recursiveBrowsing(origin, function (container, key, value, depth, context) {
        counter++;
        if (_this.options.logProgress && counter / nbObjs >= nextThreshold) {
          console.log((counter / nbObjs * 100 | 0) + "% searched...");
          nextThreshold += _this.options.progressThreshold;
        }
        if (_this.options.key && _this.testValue(key, validator)) {
          _this.results.push({ data: key, context: context, container: container, key: true });
        }
        if (_this.options.value && _this.testValue(value, validator)) {
          _this.results.push({ data: value, context: context + "['" + key + "']", container: container, value: true });
        }
        return depth < _this.options.maxDepth;
      });
      return this.results;
    }
    /**
     * Counts the number of non-object properties inside of a javascript object
     * @param  {Object} [origin=this.origin]    object which will be searched through and the number of properties returned
     * @return {Number}        Number of (non-object) properties which inside the origin and all its inner objects
     */

  }, {
    key: "count",
    value: function count() {
      var _this2 = this;

      var origin = arguments.length <= 0 || arguments[0] === undefined ? this.origin : arguments[0];

      var res = 0;
      this._recursiveBrowsing(origin, function (container, key, value, depth, context) {
        res++;
        return depth < _this2.options.maxDepth;
      });
      return res;
    }
  }]);

  return ScopeSearch;
}();

try {
  module.exports = ScopeSearch;
} catch (e) {
  console.log('cannot export module');
}
//# sourceMappingURL=ScopeSearch.js.map
