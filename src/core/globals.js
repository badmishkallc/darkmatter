
var globals = null;

// Browser or WebWorker
if(typeof self !== "undefined")
    globals = self;
// Node
else if(typeof global !== "undefined")
    globals = global;
// Browser
else if(typeof window !== "undefined")
    globals = window;
//  Last Ditch Effort
else {
    globals = new Function("return this;")();
}

var noop = function(){};

export default globals;
export { noop };


if (typeof globals.Symbol !== "undefined") {
} else {

    var idx = 0,
        global = [],
        cache = {},
        map = {};

    var Symbol = function (description) {
        if (!(this instanceof Symbol)) {
            return new Symbol(description, arguments[1] || null);
        }

        this.description = description;

        var id = description;
        if (!id || id[0] !== "@")
            id = (idx++).toString() + (id || "");

        if (arguments[1] && arguments[1] === true) {
            global.push(description || id);
            map[description || id] = id;
        }

        this.id = id;
        cache[id] = this;

        Object.defineProperty(Object.prototype, id, {
            set: function (value) {
                Object.defineProperty(this, id, {
                    value: value,
                    enumerable: false,
                    writable: true,
                    configurable: true
                });
            },
            configurable: true
        });
    };

    Symbol.prototype = {
        toString: function () {
            return this.id;
        }
    };

    Symbol.for = function (key) {
        var symbol;

        if (global.indexOf(key) > -1)
            symbol = cache[map[key]];


        if (!symbol)
            symbol = Symbol(key, true);

        return symbol;
    };

    Symbol.keyFor = function (symbol) {
        return symbol.description;
    };

    Symbol.iterator = Symbol("@@iterator", true);

    Symbol.species = Symbol("@@species", true);

    Symbol.observable = Symbol("@@observable", true);


    Object.getOwnPropertySymbols = function (object) {
        var symbols = [];

        for (var prop in cache) {
            if (cache.hasOwnProperty(prop) && object[cache[prop]] !== undefined)
                symbols[symbols.length] = cache[prop];
        }

        return symbols;
    };
}

export { Symbol };


if (!Array.from) {
    Array.from = (function () {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) { return 0; }
            if (number === 0 || !isFinite(number)) { return number; }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike/*, mapFn, thisArg */) {
            // 1. Let C be the this value.
            var C = this;

            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);

            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError("Array.from requires an array-like object - not null or undefined");
            }

            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }

                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);

            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);

            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
        };
    }());
}

if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}

if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

if(!Object.assign) {

    /**
     * Assigns the values of the source(s) to the target object.
     *
     * @example
     * 		var target = {property: "value"},
     *     		targetRef = Object.assign(target, {newProperty: "value2"});
     *
     *     	console.log(targetRef); // {property: "value", {newProperty: "value2"}};
     *
     *      // multiple sources
     *      //
     *	    // [{}, {}].reduce(Object.assign, target);
     *      // Object.assign(target, {}, {}, {});
     *
     * @param {Object} target The object that will values replaced.
     * @param {Object} source* The source of values that will replace the values in the the target.
     * @return {Object} The target object after value assignment has occurred.
     */
    Object.assign = function( target, source ) {
        /// <summary> Assigns the values of the source(s) to the target object. </summary>
        /// <param name="target" type="object">The object that will have values replaced. </param>
        /// <source name="source" type="object">The source of values that will replace the values in the target. </param>
        /// <return type="object">Returns the target object.</return>

        var to, sourceList = [], i = 1, l = 0;

        to = Object( target );

        if( arguments.length > 1 ) {
            l = arguments.length;
            sourceList = new Array( l - 1 );

            for(; i < l; i++)
                sourceList[i - 1] = arguments[i];
        }

        l = sourceList.length;

        var mapObject = function(i) {
            var from = Object(sourceList[i]),
                keysArray = Object.getOwnPropertyNames(from),
                len = keysArray.length,
                nextIndex = 0;

            while(nextIndex < len) {
                var nextKey = keysArray[nextIndex.toString()];
                var desc = from[nextKey];

                if(desc !== undefined && desc) {
                    to[nextKey] = desc;
                }

                nextIndex++;
            }
        };

        for(i = 0; i < l; i++) {
            /* jshint loopfunc: true */
            mapObject(i);
        }

        return to;
    };
}