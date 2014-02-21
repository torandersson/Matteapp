function Mathengine (fname) {

	 // Default settings
    this.MAX_LIVES = 3;
    
    // Assignment properties
    this.m_Question = {};     
    this.m_Filename = "";
    this.m_MainQuestion = ""; 
    this.m_FollowUp = "";
    this.values_Variables = {};  
    this.values_Lists = {};
    this.values_Questions = [];
    this.values_WrongAnswers = [];
    this.values_FoundAnswers = [];
    this.values_Clues = {};
    this.m_Title = "";
    this.m_Lives = 0;
    
    // Question-Answer system
    this.run_QuestionOptions = [];
    this.run_QuestionOptionsIndex = [];
    this.m_AnswerValue = 0;
    this.run_AnswerValue = 0;
    this.m_AnswerTolerance = 0;    
    this.m_AnswerUnit = "";
    this.run_AnswerUnit = "";
    this.m_AnswerUnitCategory = [];
    this.run_QuestionAnswer = "";
    this.run_WrongAnswerMessage = "";
    this.run_WrongAnswerClue = "";
    
    // Other variables
    this.m_HasFinished = false;
    this.m_OfferClues = false;
    this.m_Units = [];

    this.toSi = {};
	this.toSi["kg"] = function(value){return value;}
	this.toSi["hg"] = function(value){value/10;}
	this.toSi["g"] = function(value){return value/1000.0;}
	this.toSi["ton"] = function(value){return value*1000.0;}
	this.toSi["l"] = function(value){return value;}
	this.toSi["dl"] = function(value){return value/10.0;}
	this.toSi["cl"] = function(value){return value/100.0;}
	this.toSi["ml"] = function(value){return value/1000.0;}
	this.toSi["m"] = function(value){return value;}
	this.toSi["dm"] = function(value){return value/10.0;}
	this.toSi["cm"] = function(value){return value/100.0;}
	this.toSi["mm"] = function(value){return value/1000.0;}
	this.toSi["km"] = function(value){return value*1000.0;}
	this.toSi["st"] = function(value){return value;}

     this.m_Units = [
        ["kg", "hg", "g", "ton"],
        ["l", "dl", "cl", "ml"],
        ["m", "dm", "cm", "mm", "km"],
        ["st"]
    ];

    if(fname != undefined){
    	this.init(fname);
    }



    //this.clear();
}

Mathengine.prototype.clear = function() {
	this.values_Variables = {};
    this.values_Lists = {};
    this.values_Questions = [];
    this.values_FoundAnswers = [];
    this.values_WrongAnswers = [];
    this.values_Clues = {};
        
    
        
    this.m_OfferClues = true;
};

Mathengine.prototype.init = function(fname) {
	this.m_Filename = fname;
	
    this.m_Lives = this.MAX_LIVES;

	this.readFile();

	this.setVariables();

	this.getLists();

	this.readAssignmentData();

	this.processQuestions();
        
    this.processWrongAnswers();
            
    this.processClues();

    return true;

};

Mathengine.prototype.readFile = function() {
	this.m_Question = this.m_Filename;
};

Mathengine.prototype.setVariables = function() {
	var variables = this.m_Question["variables"];

	for(var prop in variables){
		var data = variables[prop].split(",");
		this.values_Variables[prop] = this.randomize(data[0],data[1])
	}

};

Mathengine.prototype.randomize = function(from,to) {
	//100 -  = seed
	//10-1 == 1 to 10 
    var fromSplit = from.toString().split("."),
        toSplit = to.toString().split("."),
        decimals = 0,
        seed = to - from,
        randomNumber = 0,
        seed = 0,
        pow = 0,
        result = 0

    if (fromSplit.length > 1) decimals = fromSplit[1].length;

    if (toSplit.length > 1) {
        var tmp = toSplit[1].length;
        if (tmp > decimals) decimals = tmp;
    }

    seed = to - from;
    randomNumber = ((Math.random() * seed) + from);
    pow = Math.pow(10, decimals);
    result = Math.round(randomNumber * pow) / pow;
    return result;
};
   
Mathengine.prototype.getLists = function() {
	var lists = this.m_Question["lists"];

	if(lists == undefined) return true;

	for(var propName in lists)
	{
		this.values_Lists[propName] = this.shuffle(lists[propName])[0];
	};
};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
Mathengine.prototype.shuffle = function (o) { //v1.0
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
};

Mathengine.prototype.readAssignmentData = function() {
	
    this.m_MainQuestion = this.evaluateText(this.m_Question["question"]);  
    this.m_AnswerValue = this.evaluateText(this.m_Question["answervalue"]).trim();
   
    this.m_AnswerUnit = this.m_Question["answerunit"];
    this.m_AnswerUnitCategory = this.getUnitCategory(this.m_AnswerUnit);
    this.m_AnswerTolerance = this.m_Question["tolerance"];
    this.m_FollowUp = this.m_Question["followup"];
    this.m_Title = this.m_Question["title"];
        
    return true;
};

/**
 * Evaluate a string and replace the variable references with actual values.
 * 
 * @param text The text string to evaluate.
 * @return The same, but processed, string.
 */
Mathengine.prototype.evaluateText = function(text) {
	var textEval = new Matte({openToken:"$",closeToken:"$"});

    for(var prop in this.values_Lists)
    {
        this.values_Variables[prop] = this.values_Lists[prop];
    }
   // console.log("this.values_Variables",this.values_Variables)

   // var evalExpression = textEval.Parse(text,this.values_Lists);
   var evalExpression = textEval.Parse(text,this.values_Variables);
	//console.log("evalExpression",evalExpression);
    return evalExpression;
}
 
/**
 * Returns an array of all units in the same category
 * 
 * @param unit The unit to check
 * @return A string array. Is null if unit not recognized.
 */
Mathengine.prototype.getUnitCategory = function(unit) {
    
    for (var i=0; i<this.m_Units.length; i++)
    {
        var category = this.m_Units[i];
        
        if(category.indexOf(unit) > -1){
        	return category;
        }
    }
    
    return null;
}

/**
 * Find all questions in the file and store them locally.
 * @return True if there were no problems.
 */
Mathengine.prototype.processQuestions = function()
{
    
    try
    {
        var questions = this.m_Question["questions"];
        

        if (questions == null){
            return true;
        }
        
        
        for(var property in questions)
        {
        
       
            var q = questions[property];

            var keywords = this.evaluateText(q["keywords"]);
            var keywordsarray = keywords.split(",");
            var formulation = this.evaluateText(q["formulation"]);
            var answer = this.evaluateText(q["answer"]);
            var temp = q["clue"];
            
            var clues = [];
           if(Object.prototype.toString.call( temp ) === '[object Array]') 
            {
                clues = temp.slice(0)
            }
            else
            {
                clues.push(temp);
            }                
            
            var saveString = q["save"];
            
            var save = true;
            if (saveString != null){
                if (saveString == "false"){
                    save = false;
                }
                
            }

            var questionData = new QuestionData(
                    keywordsarray, formulation, answer, clues, save);
            this.values_Questions.push(questionData);
        }

        return true;
    }
    catch(e)
    {
       console.log("e",e)
    }

    return false;
}


/**
* @return True if there were no problems.
*/
Mathengine.prototype.processWrongAnswers = function()
{
    try
    {
       var wronganswers = this.m_Question["wronganswers"];

        if (wronganswers == null){
            return true;
        }
       
        for(var prop in wronganswers)
        {
            var q = wronganswers[prop];

            var value =	this.evaluateText(q["value"]).trim();
            var unit = q["unit"];
            var message = q["message"];
            var temp = q["clue"];
            
            var clues = [];
            
            if (Object.prototype.toString.call( temp ) === '[object Array]') 
             {
                clues = temp.slice(0);
            }
            else
            {
                var temp2 = temp;
                clues.push(temp2);
            }                   

            this.values_WrongAnswers.push(new WrongAnswerData(
                    value, unit, message, clues));
        }
        
        return true;
    }
    catch (e)
    {
        console.log("e",e);
    }
    
    return false;
}

/**
 * Finds all clues contained in the file and stores them locally.
 * @return True if there were no problems.
 */
Mathengine.prototype.processClues = function()
{
    try
    {
        var clues = this.m_Question["clues"];
        
        if (clues == null)
            return true;
        
        for(var prop in clues)
        {
            var clue = clues[prop];
            
            var messages = clue["message"];
            
            var msg = [];
            
             if (Object.prototype.toString.call( messages ) === '[object Array]') 
             {
                for (var i = 0; i < messages.length; i++) {
                   msg.push(this.evaluateText(messages[i]));
                };
            }
            else
            {
                msg.push(this.evaluateText(messages));
            }   
            
            var prio = clue["prio"];
            var value = clue["value"];                
            
            this.values_Clues[prop] = new ClueData(prio, value, msg);
        }
        
        return true;
    }
    catch (e)
    {
       console.log("e",e);
    }
    
    return false;
}

/**
 * Evaluates the given expression.
 * 
 * @param terms The expression to evaluate.
 * @return The calculated expression. Returns 0 if the expression is invalid
 */
Mathengine.prototype.calculate = function(terms)
{
    try
    {
        return this.evaluateText("$"+terms.trim()+"$");
    }
    catch (e)
    {
       console.log(e)
        return 0;
    }        
}

Mathengine.prototype.getMainQuestion = function() {
	return this.m_MainQuestion;
};


/**
 * @return The main title of this assignment.
 */
Mathengine.prototype.getTitle = function()
{
    return this.m_Title;
}

/**
 * Note that any application must call getPoints() to see if player is
 * still "alive".
 * 
 * @return True if this assignment is completed (successfully).
 */
Mathengine.prototype.isFinished = function()
{
    return this.m_HasFinished;
}

/**
 * Set the value of a new answer
 * @param value Answer value
 */
Mathengine.prototype.setAnswerValue = function(value)
{
    this.run_AnswerValue = this.evaluateText("$"+value+"$");
}

/**
 * Set the unit of a new answer
 * @param unit Answer unit
 */
Mathengine.prototype.setAnswerUnit = function(unit)
{
    this.run_AnswerUnit = unit;
}

/**
 * Converts a value to SI units.
 * 
 * @param value The value in a prefixed unit.
 * @param unit The prefix.
 * @return A double for value in the SI unit. Is 0 if not recognized.
 */
Mathengine.prototype.convertToSI = function(value, unit)
{
	return this.toSi[unit](value);
}

/**
 * Test the provided answer.
 * @return True if the answer is correct.
 */
Mathengine.prototype.testAnswer = function()
{
    if (this.m_AnswerUnit == null){
        return false;
    }
    
    var result = false;

    if (this.m_AnswerUnit == this.run_AnswerUnit)       
    {
        result = (this.m_AnswerValue == this.run_AnswerValue);
    }
    else
    {
        var correctCategory = false;
        
		for (var i = 0; i < this.m_AnswerUnitCategory.length; i++) {
			if(this.m_AnswerUnitCategory[i] == this.run_AnswerUnit){
				correctCategory = true;
				break;
			}
		};
        
        if (correctCategory)
        {
            var m1 = convertToSI(this.m_AnswerValue, this.m_AnswerUnit);
            var m2 = convertToSI(this.run_AnswerValue, this.run_AnswerUnit);
            
            result = (Math.abs(m1-m2) < this.m_AnswerTolerance);
        }
    }
    
    if (result)
    {
        if (this.m_FollowUp.indexOf(".json") == -1)
        {
            this.m_HasFinished = result;
        }
        else
        {
            this.init(this.m_FollowUp);
        }
    }
    else
    {
        this.m_Lives--;
        
        this.run_WrongAnswerMessage = this.findWrongAnswerMatch();
        
        this.findClue();
    }

    return result;
}

/**
 * Note: Reduces the appropriate clue regardless of this being used or not.
 * @return The message of a certain wrong answer if it matches current set.
 */
Mathengine.prototype.findWrongAnswerMatch = function()
{
    for(var prop in this.values_WrongAnswers){

		var m = this.values_WrongAnswers[prop];
        
        var result = (m.val == this.run_AnswerValue) 
            && (m.unit == this.run_AnswerUnit);
         
        if (result)
        {

        	for(var clue in m.clues)
        	{
              	this.values_Clues[m.clues[clue]].value--;	
        	}
            
            return m.message;
        }
    }
    
    return "";
}

/**
 * @return Return message for this wrong answer (if exists)
 */
Mathengine.prototype.getWrongAnswerMessage = function()
{
    return this.run_WrongAnswerMessage;
}

/**
 * Return an array of questions that match keywords in the string.
 * If there is just one match, you can call getAnswer() directly.
 * 
 * @param keywords The search string.
 * @return Array of matching questions.
 */
Mathengine.prototype.searchQuestion = function(keywords)
{
    this.run_QuestionOptions = [];
    this.run_QuestionOptionsIndex = [];

	keywords = keywords.toUpperCase();

    for (var i=0; i<this.values_Questions.length; i++)
    {
        var fit = this.values_Questions[i].Fits(keywords);
       
        if (fit)
        {
            this.run_QuestionOptions.push(this.values_Questions[i].formulation);
            this.run_QuestionOptionsIndex.push(i);
        }
    }

    if (this.run_QuestionOptions.length == 1)
        this.askQuestion(0);

    return this.run_QuestionOptions;
}

/**
 * Ask a certain question that has been given.
 * Note: you must have called searchQuestion previously.
 * 
 * @param index Index of this question in the array.
 * @return True if a question exists at this index.
 */
Mathengine.prototype.askQuestion = function(index)
{
    if (this.values_Questions.length == 0){
        return false;
    }
        
    if (index < 0 || index >= this.values_Questions.length){
        return false;
    }
    
    var question = 
            this.values_Questions[this.run_QuestionOptionsIndex[index]];
    
    this.run_QuestionAnswer = question.answer;
    
    for (var i=0; i<question.clues.length; i++)
    {
        if (!question.clues[i] == ".")
        {
            this.values_Clues[question.clues[i]].value--;
            question.clues[i] = ".";
        }       
    }
    
    if (question.save)
        this.values_FoundAnswers.push(this.run_QuestionAnswer);
    
    return true;
}

/**
 * Note: you must have called askQuestion() first.
 * @return The answer to the given question.
 */
Mathengine.prototype.getAnswer = function()
{
    return this.run_QuestionAnswer;
}

/**
 * @return An array of all answers that have been found.
 */
Mathengine.prototype.getFoundAnswers = function()
{
    return this.values_FoundAnswers;
}

/**
 * Remove an entry in the array of found answers.
 * @param index Index of the entry to remove.
 */
Mathengine.prototype.removeFoundAnswer = function(index)
{
    if (index >= 0 && index < this.values_FoundAnswers.length()){
        values_FoundAnswers.splice(index,1);
    }
}

/**
 * Move an entry in the array of found answers.
 * @param oldindex The index of the entry to move.
 * @param newindex The new index of the moved entry.
 */
Mathengine.prototype.moveFoundAnswer = function(oldindex,newindex)
{
    if (oldindex >= 0 && oldindex < this.values_FoundAnswers.length() &&
        newindex >= 0 && newindex < this.values_FoundAnswers.length() &&
        oldindex != newindex)
    {
        var temp = this.values_FoundAnswers[oldindex];
        this.values_FoundAnswers.arr.splice(newindex, 0, temp);
        this.values_FoundAnswerss.splice(oldindex,1);
    }
}

/**
 * Set whether or not to give clues when a wrong answer is provided.
 * 
 * @param condition Condition, true or false.
 */
Mathengine.prototype.setGiveClues = function(condition)
{
    this.m_OfferClues = condition;
}

/**
 * Check whether clues are retrieved upon wrong answers.
 * 
 * @return Boolean value. 
 */
Mathengine.prototype.givesClues = function()
{
    return this.m_OfferClues;
}

/**
 * Get appropriate clue.
 * 
 * @return Clue (a string).
 */
Mathengine.prototype.getAnswerClue = function()
{
    return this.run_WrongAnswerClue;
}

/**
 * Find an appropriate clue for the provided answer.
 * 
 * Use getAnswerClue() to get it (only if getWrongAnswerMessage() is blank)
 */
Mathengine.prototype.findClue = function()
{
    var maxPrio = 999;
    var found = false;
    
    if (this.m_OfferClues)
    {
        for (var p=1; p<maxPrio && !found; p++)
        {
            for (var prop in this.values_Clues) 
            {
            	var clue = this.values_Clues[prop]
                if (!found)
                {
                    if (this.values_Clues[prop].prio == p &&
                        this.values_Clues[prop].value > 0)
                    {
                        this.run_WrongAnswerClue = this.values_Clues[prop].getClue();

                        found = true;
                    }
                }
            }
        }
    }
}

/**
 * Get the current lives
 * @return Number of lives
 */
Mathengine.prototype.getLives = function()
{
    return this.m_Lives;
}

/**
 * Set the current lives
 * @param value Number of lives, a non-negative integer.
 */
Mathengine.prototype.setLives = function(value)
{
    if (value >= 0)
        this.m_Lives = value;
}

/**
 * Find an initial clue if the user does not get going.
 * 
 * @return The current clue with a value greater than 0.
 */
Mathengine.prototype.getInitialClue = function()
{
    this.findClue();
    return this.getAnswerClue();
}

function QuestionData(k,f,a,s,c)
{
	this.keywords = k;
    this.formulation = f;
    this.answer = a;
    this.save = s;
    this.clues = c;
}

QuestionData.prototype.Fits = function(s) {
	var f = [], 
		fit = true;

	s = s.trim().replace(/\?/g,' ').toUpperCase();
	f = s.split(" ");
    
	for (var i = 0; i < this.keywords.length; i++) {
		var keyword = this.keywords[i];
		var temp = false;
		var options = keyword.trim().split("&");
		for (var k = 0; k < options.length && !temp; k++) {
    			for (var j = 0; j < f.length && !temp; j++) {
                if (f[j].trim().indexOf(options[k].trim()) != -1)
                {
                	temp = true;
                }
			};
		};
	};
	if(!temp) fit = false;

	return fit;
};

function WrongAnswerData(v,u,m,c){
	this.val = v;
	this.unit = u;
	this.message = m;
	this.clues = c;
}

function ClueData(p,v,m){
	this.prio = p;
    this.val = v;
    this.messages = m;
}

ClueData.prototype.getClue = function() {
	return this.messages[Math.floor(Math.random() * this.messages.length)];
};

