/* global System */

if(typeof System !== "undefined" && !System.require) {
	System.require = function(deps, onReady) {
		return Promise.all(deps.map(function(mod) {
			var p = System.import(mod);
			return p;
		}))
		.then(function(results) {
			onReady.apply(null, results.map(function(mod) {
				if(mod.default)
					return mod.default;
					
				return mod;	
			}));
		});
	};
}