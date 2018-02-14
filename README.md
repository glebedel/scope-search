# scope-search
ScopeSearch class can search recursively for strings or other values inside an object. It can be use to see what variables are available from the global scope (window).

## Examples

### Search in global window scope
```javascript
var s = new ScopeSearch(window, (data)=>data === 'whatIwant').search();
console.log(s.results);
```

### Search in all document's nodes

```javascript
var s = new ScopeSearch();
var all = document.querySelectorAll('*');
s.search(all, (data)=>data === 'whatIwant');
```

### Search in all angular scopes

```javascript
var s = new ScopeSearch();
var all = document.querySelectorAll('*');
var allScopes = [];
for (var i = 0; i < all.length; i++) {
  try {
    allScopes.push(angular.element(all[i]).scope());
  } catch (e) {
    //in case there is no scope
  }
}
s.search(allScopes, (data)=>data === 'whatIwant');
```

## API doc

### ScopeSearch
**Kind**: global class  

* [ScopeSearch](#ScopeSearch)
    * [new ScopeSearch([origin], [validator], [options])](#new_ScopeSearch_new)
    * [.logError(toLog)](#ScopeSearch+logError)
    * [.testValue(data, [validator])](#ScopeSearch+testValue) ⇒ <code>Boolean</code>
    * [.search([origin], [validator], [otions])](#ScopeSearch+search) ⇒ <code>Array.Objects</code>
    * [.count([origin])](#ScopeSearch+count) ⇒ <code>Number</code>

<a name="new_ScopeSearch_new"></a>

### new ScopeSearch([origin], [validator], [options])
constructor of the ScopeSearch class.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [origin] | <code>Object</code> | <code>{}</code> | object to search through |
| [validator] | <code>function</code> | <code>function(){return false}</code> | condition that will validate whether or not the data looked at is a valid result |
| [options] | <code>Object</code> | <code>{maxDepth:50, key:true, value: true, logErrors: false,</code><br/><code> logProgress:true, progressThreshold:0.25}</code> | object specifying different options to our search |
| [options.maxDepth] | <code>Number</code> | <code>50</code> | maximum depth the recursive search will go through. |
| [options.key] | <code>Boolean</code> | <code>true</code> | check the keys of properties for matches against our validator |
| [options.value] | <code>Boolean</code> | <code>true</code> | check the values of properties for matches against our validator |
| [options.logErrors] | <code>Boolean</code> | <code>false</code> | log (console.error) error thrown by our validator function |
| [options.logProgress] | <code>Boolean</code> | <code>true</code> | log progress percentage of our search (compared to total amount of properties to look at) |
| [options.progressThreshold] | <code>Number</code> | <code>0.25</code> | threshold % to show for the progress logs (default logs for every 25% searched) |

<a name="ScopeSearch+logError"></a>

### scopeSearch.logError(toLog)
use console.log to log the passed parameter

**Kind**: instance method of <code>[ScopeSearch](#ScopeSearch)</code>  

| Param | Type | Description |
| --- | --- | --- |
| toLog | <code>String</code> | message to print w/ console.error |

<a name="ScopeSearch+testValue"></a>

### scopeSearch.testValue(data, [validator]) ⇒ <code>Boolean</code>
check the specific data against the validator function

**Kind**: instance method of <code>[ScopeSearch](#ScopeSearch)</code>  
**Returns**: <code>Boolean</code> - whether or not the tested data matched the requireements of the validator  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>String</code> &#124; <code>Number</code> &#124; <code>function</code> |  | value to call validator with |
| [validator] | <code>function</code> | <code>this.validator</code> | validator to test the passed data with |

<a name="ScopeSearch+search"></a>

### scopeSearch.search([origin], [validator], [otions]) ⇒ <code>Array.Objects</code>
search through given object for data that matches the validator

**Kind**: instance method of <code>[ScopeSearch](#ScopeSearch)</code>  
**Returns**: <code>Array.Objects</code> - Array containing all matching results  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [origin] | <code>Object</code> | <code>this.origin</code> | object to search through |
| [validator] | <code>function</code> | <code>this.validator</code> | condition that will validate whether or not the data looked at is a valid result (see [ScopeSearch#constructor](ScopeSearch#constructor)) |
| [otions] | <code>Object</code> | <code>this.options</code> | object specifying different options to our search (see [ScopeSearch#constructor](ScopeSearch#constructor)) |

<a name="ScopeSearch+count"></a>

### scopeSearch.count([origin]) ⇒ <code>Number</code>
Counts the number of non-object properties inside of a javascript object

**Kind**: instance method of <code>[ScopeSearch](#ScopeSearch)</code>  
**Returns**: <code>Number</code> - Number of (non-object) properties which inside the origin and all its inner objects  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [origin] | <code>Object</code> | <code>this.origin</code> | object which will be searched through and the number of properties returned |

