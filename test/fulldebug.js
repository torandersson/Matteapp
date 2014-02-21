var fulldebug_exercise = {
	"title":"Rubrik",
	"question":"Det här är en uppgift för $name$.",
	"answervalue":"$a$",
        "answerunit":"kg",
        "tolerance":"0.1",
        "followup":"",

	"wronganswers" : { 
"a" : {"value":"$1$", "unit":"st", "message":"Felmeddelande 1 x = $x$", "clue":"b"},
"b" : {"value":"$y$", "unit":"kg", "message":"Felmeddelande 2 y = $y$", "clue":"c"} 
         },

        "clues" : {
"a" : {"message":"Ledtråd a", "value":2, "order":1},
"b" : {"message":"Ledtråd b", "value":2, "order":2},
"c" : {"message":"Ledtråd c", "value":2, "order":3}
         },

        "lists" : {
"name" : ["Marcus"]
         },

	"variables" : { 
"x":"1,1",
"y":"5,5",
"a":"10,10"
         },

	"questions": { 
"a" : { "keywords":"ABC,BCD&CDE", "formulation":"Fråga 1", "answer":"Svar 1", "clue":["a","b"] }, 
"b" : { "keywords":"ABC,CDE&DEF", "formulation":"Fråga 2", "answer":"Svar 2", "clue":"a" }, 
"c" : { "keywords":"CDE,DEF,EFG", "formulation":"Fråga 3", "answer":"Svar 3", "clue":"b" }, 
	 }
}
