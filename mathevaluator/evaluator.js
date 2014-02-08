/*

Grammar: For calculator 

Tokens: ^ (power of) % (modulus)

E -> T { (  "+" | "-"  ) T }
T -> F {( "*" | "/" | "%" ) F}
F -> P ["^" F]
P -> v | "(" E ")" | "-" T	         

*/

function Expression()
{
	this.numbers = {
		".":true,
		"0":true,
		"1":true,
		"2":true,
		"3":true,
		"4":true,
		"5":true,
		"6":true,
		"7":true,
		"8":true,
		"9":true
	};
}

Expression.prototype.Calc = function(expr) {
	if(typeof expr != 'string')
		throw new "expr needs to be a string"

	this.expr = expr;
	this.pos = -1;
	this.numberOfChars = expr.length;

	var t = this.E();

	return t;
}

Expression.prototype.Expect = function(tok) {
	if( this.Next() == tok) {
		this.AdvanceNext();
	}
	else {
		throw "Expected an other token!"
	}
}

Expression.prototype.Next = function() {
	var char = "";

	if(this.pos < this.expr.length){
		char = this.expr[this.pos+1];
	}

	return char;
};

Expression.prototype.AdvanceNext = function() {
	if(this.pos<this.expr.length)
		this.pos = this.pos+1;
};

Expression.prototype.IsNumber = function(char) {
	return  this.numbers[char];
};

Expression.prototype.E = function() {
	var t = this.T();
	while(this.Next() == "+" || this.Next() == "-")
	{
		var operand = this.Next();
		this.AdvanceNext();
		var t1 = this.T();
		if(operand == "+")
		{
			t = t+t1;
		}
		else if(operand == '-')
		{
			t = t-t1;
		}
	}

	return parseFloat(t);
};

Expression.prototype.T = function() {
	var t = this.F();
    while(this.Next() == '*' || this.Next() == '/' || this.Next() == '%'){
		var operand = this.Next();
		this.AdvanceNext();
		var t1 = this.F();
		if(operand == "*") {
			t = t * t1;
		} 
		else if(operand == "/") {
			t = t/t1
		}
		else if(operand == "%")
		{
			t = t%t1;
		}
	}
	return t;
};

Expression.prototype.F = function() {
	var t = this.P();
	if(this.Next() == '^')
	{
		this.AdvanceNext();
		var t1 = this.F();		
		return Math.pow(t,t1);
	}
	else if(this.Next() == "!")
	{

	}
	
	return t;
};

Expression.prototype.P = function() {
	if(this.IsNumber(this.Next())) {
		
		var t = this.Next();
		this.AdvanceNext();
		while(this.IsNumber(this.Next()))
		{
			t = t+this.Next();
			this.AdvanceNext();
		}

		t = parseFloat(t);
		
		return t;
	}
	else if(this.Next() == '(') {
		this.AdvanceNext();
		var t = this.E();
		this.Expect(')');
		return t;
	}
	else if(this.Next() == '-') {
		this.AdvanceNext();
		var t = this.F();
		return (-1)*t;
	}
	else {
		throw "Unknown token -->"+this.Next()+" at position "+ this.pos;
	}
}

