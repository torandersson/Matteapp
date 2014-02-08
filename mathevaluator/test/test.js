describe('Evaluator', function() {
  describe('evaluator.js', function() {
    
    it('single digits', function() {
      
      var expr = new Expression();
      //var decco = new Decco();
      
    //  var functionExectued = 0;
     // decco.Before(expr,function(val,funcName){console.log("funcName",funcName,"arguments",val),functionExectued++;});
//console.log("functionExectued",functionExectued)

      expect(expr.Calc("2+4")).to.equal(6);
      expect(expr.Calc("(2^2)")).to.equal(4);
      expect(expr.Calc("2^(2*1)")).to.equal(4);
      expect(expr.Calc("2^(2*3)")).to.equal(64);
      expect(expr.Calc("2^(2*3)+3*1")).to.equal(67);
      expect(expr.Calc("2^(2*3)+3*1-1")).to.equal(66);
      expect(expr.Calc("2+2+2+2")).to.equal(8);
      expect(expr.Calc("2*2")).to.equal(4)
        

      expect(expr.Calc("2--1")).to.equal(3);
      expect(expr.Calc("2---2")).to.equal(0);
      expect(expr.Calc("2*3+4^3--2+100/7/7")).to.equal(74.04081632653062);
      expect(expr.Calc("2/-2")).to.equal(-1);
      
   
    });

    it('decimal digits', function(){
      
      var expr = new Expression();

      expect(expr.Calc("0.1+0.2")).to.be.closeTo(0.3,0.00000000000000004);
      expect(expr.Calc("0.1+0.2-0.3")).to.be.closeTo(0,5.551115123125783e-17);
      expect(expr.Calc("1*0.1")).to.equal(0.1);
     
    });

    it('many digits', function(){
      
      var expr = new Expression();
      
      expect(expr.Calc("10+40")).to.equal(50);
      expect(expr.Calc("10-40")).to.equal(-30);
       
    });

    it('modolu', function(){
      
      var expr = new Expression();
      
      expect(expr.Calc("40%10")).to.equal(0);
      expect(expr.Calc("11%10")).to.equal(1);
      expect(expr.Calc("5+6%5+5")).to.equal(11);
        
    });

  })

});

describe('Replacer', function(){
  describe('replacer.js', function(){
    
    it('replace tokens', function(){
      
      var replacer = new Replacer();
  
      expect(replacer.Parse({a:1,b:2,c:3},"a*b*c")).to.equal("1*2*3");

      expect(replacer.Parse({a:1,b:2,c:3},"a*a*a")).to.equal("1*1*1");
      
      expect(replacer.Parse({a:1,aa:2,aaa:3},"aaa*a*aa")).to.equal("3*1*2");
      
    });

  })

})

describe('ExpressionFinder', function(){
  describe('expressionFinder.js', function(){
    
    it('find expressions', function(){
      
      var expressionFinder = new ExpressionFinder();
  
      var expression = "a {{a+b}} bv {{test}}  asd{{finna}}adf";
      
      var result = expressionFinder.Parse(expression);
      
      expect(result).to.include("a+b");
      expect(result).to.include("test");
      expect(result).to.include("finna");

    });

    it('find expressions with diffrent tokens', function(){
      
      var expressionFinder = new ExpressionFinder("[","]");
  
      var expression = "a [a+b] bv [test]  asd[finna]adf";
      
      var result = expressionFinder.Parse(expression);
      
      expect(result).to.include("a+b");
      expect(result).to.include("test");
      expect(result).to.include("finna");

    });

     it('find expressions with diffrent tokens dubble', function(){
      
      var expressionFinder = new ExpressionFinder("[[","]]");
  
      var expression = "a [[a+b]] bv [[test]]  asd[[finna]]adf";
      
      var result = expressionFinder.Parse(expression);
      
      expect(result).to.include("a+b");
      expect(result).to.include("test");
      expect(result).to.include("finna");

    });

  })

})

describe('Linking it all together', function(){
  describe('matte.js', function(){
    
    it('Parse algebraic expression', function(){
      
      var replacer = new Replacer(),
          expr = new Expression(),
          expression = "a^b+c"; //2^3+1

      var evalExpression = replacer.Parse({a:2,b:3,c:1},expression);

      expect(expr.Calc(evalExpression)).to.equal(9);
           
    });

    it('Parse algebraic and text expression', function(){
      var matte = new Matte(),
          expression = "Peter är {{a^b+c}} år gammal Tor är {{a*16}} år gammal och 11%2={{11%2}}", //2^3+1
          evalExpression = matte.Parse(expression,{a:2,b:3,c:1});
      
      expect(evalExpression).to.equal("Peter är 9 år gammal Tor är 32 år gammal och 11%2=1");
    });
   
    it('Matte skarpt no variables', function(){
      var matte = new Matte(),
          expression = "Peter är {{2^3+1}} år gammal Tor är {{2*16}} år gammal",
          evalExpression = matte.Parse(expression);
      
      expect(evalExpression).to.equal("Peter är 9 år gammal Tor är 32 år gammal");
    });

    it('Matte skarpt no variables', function(){
      var matte = new Matte({openToken:"%",closeToken:"%"}),
          expression = "Peter är %2^3+1% år %gammal% Tor är %2*16% år gammal",
          evalExpression = matte.Parse(expression,{gammal:"ung"});
      
      expect(evalExpression).to.equal("Peter är 9 år ung Tor är 32 år gammal");
    });

  });
})

describe('Parse to func', function(){
  describe('tofunc.js', function(){
    
    it('Matte skarpt', function(){
      
      var toFunc = new ToFunc(),
      expression = "Peter är {{1^3+2}} == {{1+2}}",
      funcStr = toFunc.Parse(expression);

      expect(funcStr).to.equal("return 'Peter är '+(safepow(1,3)+2)+' == '+(1+2)+''");

/*      var expression2 = "{{r}}/{{r+1}}";
      var func2Str = toFunc.Parse(expression2);
      console.log("func2Str",func2Str);
      expect(func2Str).to.equal("return ''+(r)+'/'+(r+1)''");*/

      var expression3 = "Reela tal";
      var func3Str = toFunc.Parse(expression3);
     
      expect(func3Str).to.equal("return 'Reela tal'");



    });
  });
})



