//Note exercise is the json i will change this to be loaded from disk


describe('Mathengine.js', function(){
    
    describe('Mathengine', function(){
        
        it('GetMainQuestion', function(){    
           	var engine = new Mathengine(debug_exercise);
            var mainQuestion = 	engine.getMainQuestion();
            expect(mainQuestion).to.equal("Marcus lastar gamla cyklar på sitt lastbilsflak.\nHur många cyklar kan han lasta på flaket?");
        }); 

        it('GetScore', function(){    
           	var engine = new Mathengine(debug_exercise);
            var score = engine.getLives();
            expect(score).to.equal(3);
        }); 


        it('calculate(expr)-plus', function(){    
           	var engine = new Mathengine(debug_exercise);
            var result = engine.calculate("1+2+3+0.1");
            expect(result).to.equal('6.1');
        }); 


        it('calculate(expr)-pow', function(){    
           	var engine = new Mathengine(debug_exercise);
            var result = engine.calculate("2^2^2");
            expect(result).to.equal('16');
        }); 

        it('calculate(expr)-minus', function(){    
           	var engine = new Mathengine(debug_exercise);
            var result = engine.calculate("2-2-2");
            expect(result).to.equal('-2');
        }); 

        it('calculate(expr)-times', function(){    
           	var engine = new Mathengine(debug_exercise);
            var result = engine.calculate("2*2*2");
            expect(result).to.equal('8');
        }); 

         it('calculate(expr)-divided', function(){    
           	var engine = new Mathengine(debug_exercise);
            var result = engine.calculate("42/2");
            expect(result).to.equal('21');
        }); 


    })

})
