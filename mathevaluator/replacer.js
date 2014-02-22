function Replacer()
{
	
}

Replacer.prototype.Parse = function(valueContainer,expression) {

	var orderOfLength = {},
    	max = 0;
    //sort of length dont want to replace AA with A
	for(var propertyName in valueContainer)
	{
		if(!orderOfLength[propertyName.length])
		{
			if(max < propertyName.length)
				max = propertyName.length;

			orderOfLength[propertyName.length] = [];	
		}
		orderOfLength[propertyName.length].push({token:propertyName,value:valueContainer[propertyName]})
	}
   
    var result = expression;

	for (var i = max - 1; i >= 0; i--) {
		var tokens = orderOfLength[i+1];
		
		if(!tokens)	continue;
		for (var j = tokens.length - 1; j >= 0; j--) {
			var obj = tokens[j];
			var regExp = new RegExp("(?!{{)("+obj.token+")(?!}})","g");
            var s = obj.value.toString();
            var fixedStr = "";
            for (var t = 0; t < s.length; t++) {
            	fixedStr += "{{"+s[t]+"}}";	
            }
			result =  result.replace(regExp,fixedStr);
		};

	};
	return result.replace(/{{/g,"").replace(/}}/g,"");
};


