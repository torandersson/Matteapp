function Decco() {
}

Decco.prototype = {
	After: function(module,callback) {
		this.TypeIterrator(module,function(func,funcName) { 
	            	return function() {
	                	var args = Array.prototype.slice.call(arguments),
	                    	val = func.apply(this,args);
	                    	console.log("val",val,"funcName",funcName)
	                  	callback(val,funcName);
	          			
	                  	return val;
	          
	              	}
	            });
	},

	Before: function(module,callback) {
		this.TypeIterrator(module,function(func,funcName) { 
	            	return function() {
	                	var args = Array.prototype.slice.call(arguments),
	                    	val = func.apply(this,args);

	                  	callback(args,funcName);
	          
	                  	return val;
	          
	              	}
	    		});

	},

	TypeIterrator: function(module,func) {
		for(var i in module) {
	    	if(typeof module[i] == "function") {
	        	var funcStr = module[i].toString();
	            module[i] = func(module[i],i);
	        }
	    }
	}
}
