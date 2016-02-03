if( typeof Symbol === "undefined") {

	var idx = 0,
		global  = [],
		cache = {},
		map = {};
	
	var Symbol = function(description) {
		if(! (this instanceof Symbol)) {
			return new Symbol(description, arguments[1] || null);
		}
		
		this.description = description;
		
		var id = description;	
		if(!id || id[0] !== "@")
			id = (idx++).toString()  + (id || "");
		
		if(arguments[1] && arguments[1] === true) {
			global.push(description || id);
			map[description || id] = id;
		}
		
		this.id = id;
	    cache[id] = this;
	   
		Object.defineProperty(Object.prototype, id, {
			set: function(value) {
				Object.defineProperty(this, id, {
					value: value,
					enumerable: false,
					writable: true,
					configurable: true 
				});
			}
		});	
	};
	
	Symbol.prototype = {
		toString: function() {
			return this.id;
		}
	};
	
	Symbol.for = function(key) {
		var symbol;
		
		if(global.indexOf(key) > -1)
			symbol = cache[ map[key] ];
	
		
		if(!symbol)
			symbol = Symbol(key, true);
			
		return symbol;
	};
	
	Symbol.keyFor = function(symbol) {
		return symbol.description;
	};
	
	Symbol.iterator = Symbol("@@iterator");
	
	Object.getOwnPropertySymbols = function(object) {
		var symbols = [];
			
		for(var prop in cache) {
			if(object[cache[prop]] !== undefined)
				symbols[symbols.length] = cache[prop];
		}
		
		return symbols;
	};
}

export default Symbol;