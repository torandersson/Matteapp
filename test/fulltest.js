//Note exercise is the json i will change this to be loaded from disk


describe('Mathengine.js', function(){
    
    describe('Engine', function(){
        
        it('GetMainQuestion', function(){    
           	var engine = new Mathengine(fulldebug_exercise);
            var mainQuestion = 	engine.getMainQuestion();
            expect(mainQuestion).to.equal("Det här är en uppgift för Marcus.");
        }); 

        it('GetScore', function(){    
           	var engine = new Mathengine(fulldebug_exercise);
            var score = engine.getLives();
            expect(score).to.equal(3);
        }); 

        it('getfoundanswers', function(){    
           	var engine = new Mathengine(fulldebug_exercise);
            var result = engine.getFoundAnswers();
            expect(result.length).to.equal(0);
        }); 

        it('searchQuestion',function(){
            var engine = new Mathengine(fulldebug_exercise);

            var data = "abc cde";
            var questions = engine.searchQuestion(data);

            expect(questions[0]).to.equal("Fråga 1");
			expect(questions[1]).to.equal("Fråga 2");
        });

        it('askQuestion and get an answer',function(){
            var engine = new Mathengine(fulldebug_exercise);

            var data = "ABC CDE";
            var questions = engine.searchQuestion(data);  
         
            var questionsb = engine.askQuestion(1);
			var answer = engine.getAnswer();

			expect(questions.length).to.equal(2);
            expect(answer).to.equal("Svar 2");
        });

		it('getfoundanswers_b', function(){    
           	var engine = new Mathengine(fulldebug_exercise);
			var data = "ABC BCD";
            var questions = engine.searchQuestion(data);           

            var result = engine.getFoundAnswers();
            expect(result.length).to.equal(1);
			var answer = engine.getAnswer();
			expect(answer).to.equal("Svar 1");
        });
        
        it('givewronganswer',function(){
            var engine = new Mathengine(fulldebug_exercise);

            var data = "1";
			var datab = "st";

			engine.setAnswerValue(data);
			engine.setAnswerUnit(datab);
            engine.testAnswer();

			var msg = engine.getWrongAnswerMessage();
            var clue = engine.getAnswerClue();

			expect(msg).to.equal("Felmeddelande 1 x = 1");
			expect(clue).to.equal("Ledtråd a"); 
        });

		it('GetScoreb', function(){    
           	var engine = new Mathengine(fulldebug_exercise);
            var score = engine.getLives();

			var data = "1";
			var datab = "st";
			var finished = engine.isFinished();

			engine.setAnswerValue(data);
			engine.setAnswerUnit(datab);
            engine.testAnswer();

            expect(score).to.equal(2);
			expect(finished).to.equal(false);
        }); 

		it('givecorrectanswer',function(){
            var engine = new Mathengine(fulldebug_exercise);

            var data = "100";
			var datab = "hg";

			engine.setAnswerValue(data);
			engine.setAnswerUnit(datab);

            var result = engine.testAnswer();
			var finished = engine.isFinished();

			expect(result).to.equal(true);
			expect(finished).to.equal(true);
        });

    });	
})