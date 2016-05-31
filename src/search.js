function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]"
}

GlobalSearch.prototype.logError = function(toLog) {
  if (this.options.verbose) {
    console.error(toLog);
  }
};

GlobalSearch.prototype.testValue = function(data, context = '', container = this.origin, type="value", validator = this.validator) {
  try {
    if (validator(data)) {
      this.results.push({ data, context, container, [type]: true });
    }
  } catch (e) {
    this.logError(`${context}=>${e}`);
  };
};

GlobalSearch.prototype.search = function(origin = this.origin, depth = 0, context = '') {
  var options = this.options;
  var currentDepth = depth + 1;
  var self = this;
  if (currentDepth <= options.maxDepth) {
    for (var key in origin) {
      if (!origin.hasOwnProperty(key))
        continue;
      var tempContext = context;
      if (options.key) {
        self.testValue(key, tempContext, origin, "key");
      }
      tempContext = `${context}['${key}']`;
      var val = origin[key];
      if (isObject(val)) {
        self.search(val, currentDepth, tempContext)
      } else if (options.value) {
        self.testValue(val, tempContext, origin, "value");
      }
    }
  }
  return self.results;
};

GlobalSearch.prototype.startSearch = function(origin = this.origin, depth = 0, context = '') {
  this.results = [];
  this.search(origin, depth, context);
  return this.results;
};

function GlobalSearch(origin = {}, validator = function() {
  return false;
}, options = {}) {
  this.options = Object.assign({ maxDepth: 20, async: true, key: true, value: true, verbose: false, timeout: 50 }, options);
  this.validator = validator;
  this.origin = origin;
  this.results = [];
  this.timeouts = [];
  return this;
}

try {
  module.exports = GlobalSearch;
} catch (e) {
  console.log('cannot export module');
}
