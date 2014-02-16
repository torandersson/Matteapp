//Note exercise is the json i will change this to be loaded from disk


describe('Mathengine.js', function(){
    
    describe('Enginge', function(){
        
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

        it('getfoundanswers', function(){    
           	var engine = new Mathengine(debug_exercise);
            var result = engine.getFoundAnswers();
            expect(result.length).to.equal(0);
        }); 

        it('searchQuestion',function(){
            var engine = new Mathengine(debug_exercise);

            var data = "Hur mycket väger en cykel?";
            var questions = engine.searchQuestion(data);

            expect(questions[0]).to.equal("Hur mycket väger en cykel?");
            expect(questions[1]).to.equal("Hur stor yta tar en cykel upp?")

        });

        it('askQuestion and get an answer',function(){
            var engine = new Mathengine(debug_exercise);

            var data = "Hur mycket väger en cykel?";
            var questions = engine.searchQuestion(data);

           
            var questions = engine.askQuestion(0);;

            expect(engine.getAnswer()).to.equal("En genomsnittlig cykel väger 1 kg");
        });
        
        it('giveanswer',function(){
            var engine = new Mathengine(debug_exercise);

            var data = "50";
			var datab = "st";

			engine.setAnswerValue(data);
			engine.setAnswerUnit(datab);

            var result = engine.testAnswer();

			var msg = engine.getWrongAnswerMessage();
            var clue = engine.getAnswerClue();

			console.log("Inkorrekt. " + msg + ", " + clue);   
        });

        it('IsFinished false',function(){
            var engine = new Mathengine(debug_exercise);
            expect(engine.isFinished()).to.equal(false);
        });


    });
	
	 describe('Calculate expressions', function(){
	 	
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
	 });
	
})
