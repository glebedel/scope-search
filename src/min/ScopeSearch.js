"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function hasKeys(obj){return Object.keys(obj).length}var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),ScopeSearch=function(){function ScopeSearch(){var origin=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],validator=arguments.length<=1||void 0===arguments[1]?function(){return!1}:arguments[1],options=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];return _classCallCheck(this,ScopeSearch),this.options=_extends({maxDepth:50,key:!0,value:!0,logErrors:!1,logProgress:!0,progressThreshold:.25},options),this.validator=validator,this.origin=origin,this.results=[],this.timeouts=[],this}return _createClass(ScopeSearch,[{key:"logError",value:function(toLog){this.options.logErrors&&console.error(toLog)}},{key:"__loopThrough",value:function(originObj,callback){var depth=arguments.length<=2||void 0===arguments[2]?0:arguments[2],context=arguments.length<=3||void 0===arguments[3]?"":arguments[3],currentDepth=depth+1;this._visited.add(originObj);for(var key in originObj)try{if(!callback(originObj,key,originObj[key],currentDepth,context)||originObj.hasOwnProperty&&!originObj.hasOwnProperty(key))continue;hasKeys(originObj[key])&&!this._visited.has(originObj[key])&&this.__loopThrough(originObj[key],callback,currentDepth,context+"['"+key+"']")}catch(e){this.logError(e)}}},{key:"_recursiveBrowsing",value:function(originObj,callback){this._visited=new WeakSet,this.__loopThrough(originObj,callback),this._visited=null}},{key:"testValue",value:function(data){var validator=arguments.length<=1||void 0===arguments[1]?this.validator:arguments[1],res=!1;try{res=validator(data)}catch(e){this.logError(context+"=>"+e)}finally{return res}}},{key:"search",value:function(){var origin=arguments.length<=0||void 0===arguments[0]?this.origin:arguments[0],_this=this,validator=arguments.length<=1||void 0===arguments[1]?this.validator:arguments[1],options=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];_extends(this.options,options),this.results=[];var counter=0,nbObjs=this.options.logProgress&&this.count(origin);if(nbObjs){var nextThreshold=.25;console.info("Searching through "+nbObjs+" "+(this.options.key?"keys and ":"")+(this.options.value?"values":""))}return this._recursiveBrowsing(origin,function(container,key,value,depth,context){return counter++,_this.options.logProgress&&counter/nbObjs>=nextThreshold&&(console.log((counter/nbObjs*100|0)+"% searched..."),nextThreshold+=_this.options.progressThreshold),_this.options.key&&_this.testValue(key,validator)&&_this.results.push({data:key,context:context,container:container,key:!0}),_this.options.value&&_this.testValue(value,validator)&&_this.results.push({data:value,context:context+"['"+key+"']",container:container,value:!0}),depth<_this.options.maxDepth}),this.results}},{key:"count",value:function(){var _this2=this,origin=arguments.length<=0||void 0===arguments[0]?this.origin:arguments[0],res=0;return this._recursiveBrowsing(origin,function(container,key,value,depth,context){return res++,depth<_this2.options.maxDepth}),res}}]),ScopeSearch}();try{module.exports=ScopeSearch}catch(e){console.log("cannot export module")}