var debug_exercise = {
	"title":"Cyklar på flaket",
	"question":"$name$ lastar gamla cyklar på sitt lastbilsflak.\nHur många cyklar kan han lasta på flaket?",
	"answervalue":" $a$ ",
        "answerunit":"st",
        "tolerance":"0.1",
        "followup":"debug2.json",

	"wronganswers" : { 
"a" : {"value":"$y*10$", "unit":"st", "message":"Inte korrekt. Så många får inte plats.", "clue":"b"} 
         },

        "clues" : {
"a" : {"message":["Fundera över vikter, både hos cyklarna och hur mycket som flaket klarar av.", "Det här är en annan ledtråd."], "value":2, "order":1},
"b" : {"message":"Dividera lastbilsflakets viktkapacitet med en cykels vikt.", "value":1, "order":2},
"c" : {"message":"Hur många cyklar som får plats handlar om areor (ytor).", "value":2, "order":3}
         },

        "lists" : {
"name" : ["Marcus"]
         },

	"variables" : { 
"x":"1,1", 
"y":"20,25", 
"a":"10,20", 
"b":"1,2" 
         },

	"questions": { 
"a" : { "keywords":"VIKT&VÄGER,CYKEL&CYKLAR", "formulation":"Hur mycket väger en cykel?", "answer":"En genomsnittlig cykel väger $x$ kg", "clue":["a","b"] }, 
"b" : { "keywords":"VIKT&VÄGER, LASTBIL&FLAK", "formulation":"Hur stor vikt klarar lastbilen?", "answer":"Lastbilen klarar $x*y*10$ kg.", "clue":"a" },
"c" : { "keywords":"AREA&YTA&PLATS, LASTBIL&FLAK", "formulation":"Hur stor area har lastbilens flak?", "answer":"Lastbilen är $a*b$ m2 stor.", "clue":"b" },
"d" : { "keywords":"AREA&YTA&PLATS, CYKEL&CYKLAR", "formulation":"Hur stor yta tar en cykel upp?", "answer":"Varje cykel behöver $b$ m2.", "clue":"c" },
"e" : { "keywords":"MÅNGA&ANTAL, CYKEL&CYKLAR, LASTBIL&FLAK", "formulation":"Hur många cyklar får plats på lastbilsflaket?", "answer":"Jag vet inte, det måste du räkna ut.", "save":"false" } 
	 }
}
