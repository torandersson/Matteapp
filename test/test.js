//Note exercise is the json i will change this to be loaded from disk


describe('Mathengine.js', function(){
    
    describe('Mathengine', function(){
        it('GetMainQuestion', function(){
            
           	var engine = new Mathengine(debug_exercise);

            var mainQuestion = 	engine.getMainQuestion();
            expect(mainQuestion).to.equal("Marcus lastar gamla cyklar på sitt lastbilsflak.\nHur många cyklar kan han lasta på flaket?");
    
    
        }); 

    })

})
