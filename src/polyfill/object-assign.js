
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