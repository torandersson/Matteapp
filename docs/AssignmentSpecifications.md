#Exercise specifications

The assignments are written in JSON. All nodes are mandatory unless otherwise specified.

##title
**String:** The main exercise title.
##question
**String:** The main exercise question. May contain evaluable expressions.
##answervalue
**String:** The correct answer value. The string can be formulated as an integer (like “25”), a float (like “2.5”) or an expression to be evaluated (like “$2+0.5$”).
##answerunit
**String:** The correct answer unit. Must be one of the following: kg, hg, g, l, dl, cl, ml, m, dm, cm, mm.
##tolerance
**Optional. String:** Provide a tolerance setting for the correct answer. The string can be formulated as an integer (like “25”), a float (like “2.5”) or an expression to be evaluated (like “$2+0.5$”). May be set to “0” to only accept exact answers. If not included, tolerance is assumed to be 0.
*FIXA: Behöver inte vara angiven* 
##followup
**Optional. String:** The filename of the file that should be loaded when user has provided the correct answer.
*FIXA: Behöver inte vara angiven. Behöver heller inte ha .json på slutet.*
##wronganswers
**Set:** Lists all the specially crafted replies for wrong answers. Each entry must have a unique key (string).
###value
**String:** The answer value for triggering this reply. The string can be formulated as an integer (like “25”), a float (like “2.5”) or an expression to be evaluated (like “$2+0.5$”).
###unit
**String:** The answer unit for triggering this reply. Must be one of the following: kg, hg, g, l, dl, cl, ml, m, dm, cm, mm.
###message
**String:** The error message that is triggered by this reply. May contain evaluable expressions.
###clue
**String or Array of strings:** Every string turns off the clue with the matching specified key.
###tolerance
**String:** The tolerance level set to trigger this reply. The string can be formulated as an integer (like “25”), a float (like “2.5”) or an expression to be evaluated (like “$2+0.5$”). FIXA: Inte implementerat!
##Variables
**Optional. Set:** Lists every variable by a unique key (string). Every key corresponds to another string of the form “x,y” where x and y are integers or decimal numbers. The value is chosen randomly when the file is loaded. BEKRÄFTA: Kraschar inte ifall denna nod saknas.
###lists
**Optional. Set:** Lists every possible string list by a unique key (string). Every key corresponds to an array of strings. The chosen element is picked when the file is loaded. BEKRÄFTA: Kraschar inte ifall denna nod saknas.
###questions
**Set:** Lists all the askable question. Each entry must have a unique key (string).
###keywords
**String:** A comma-separated string of keywords that applies to this question. For each comma-separated part, the symbol & is used for 'or'. One word from each part must be matched (but not exactly). Example: “ONE&TWO,THREE&FOUR,FIVE” will be triggered by “one three five” or “two three five” but not “one two three”.
*FIXA: Keywords behöver inte vara skrivna i uppercase i json, de ska istället göras till uppercase vid runtime.*
###formulation
**String:** The full-text question that corresponds to the keywords. May contain evaluable expressions. 
###answer
**String:** The corresponding answer to the question provided in formulation. May contain evaluable expressions.
##clues
**Optional. Set:** Lists all clues. They are generated when the user enters a wrong answer that is not matched under wronganswers. Each entry must have a unique key (string).
*BEKRÄFTA: Kraschar inte om 
message*
**String or Array of strings:** The provided clue in plaintext. May be an array of strings, in which case one of the elements is chosen randomly. 
###value
**Integer:** This value is decreased every time this clue's key is contained in the clue section of a triggered questions, or set to 0 if the key is contained in the clue section of a triggered wrong answer. Only clues with a value greater than 0 can be provided to the user.
###order
**Integer:** When choosing a clue, the program selects the first clue with the lowest order. If two or more clues have the same order, one of the clues will be chosen (randomly). It is recommended that every clue has a unique order.
