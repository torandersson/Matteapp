package matteappengine;

import bsh.EvalError;
import bsh.Interpreter;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/**
 * Main class for the Math engine.
 * Uses JSON-simple and the BeanShell Javascript interpreter.
 * 
 * @author Marcus Näslund
 * @version 0.95, 21 February 2014
 */
public class Mathengine
{
    /**
     * Helper class to store question data.
     */
    protected class MathengineQuestionData
    {
        public String[] keywords;
        public String formulation;
        public String answer;
        public boolean save;
        public String[] clues;
        
        public MathengineQuestionData(String[] k, String f, String a, String[] c, boolean s)
        {
            keywords = k;
            formulation = f;
            answer = a;
            save = s;
            clues = c;
        }

        public boolean fits(String s)
        {
            s = s.trim().replace('?', ' ').toUpperCase();
            String[] f = s.split(" ");
            
            boolean fit = true;
            for (String keyword : keywords)
            {
                boolean temp = false;
                String[] options = keyword.trim().split("&");
                for (int k=0; k<options.length && !temp; k++)
                {
                    for (int j=0; j<f.length && !temp; j++)
                    {
                        if (f[j].trim().contains(options[k].trim()))
                        {
                            temp = true;
                        }
                    }
                }
                if (!temp)
                    fit = false;
            }
            
            return fit;
        }
    }
    
    /**
     * Helper class for wrong answers
     */
    protected class MathengineWrongAnswerData
    {
        public double value;
        public String unit;
        public double tolerance;
        public String message;
        public String[] clues;
        
        public MathengineWrongAnswerData(double v, String u, String m, String[] c, double t)
        {
            value = v;
            unit = u;
            message = m;
            clues = c;
            tolerance = t;
        }
    }
    
    /**
     * Helper class for clues
     */
    protected class MathengineClueData
    {
        public long order;
        public long value;
        public String[] messages;
        
        public MathengineClueData(long p, long v, String[] m)
        {
            order = p;
            value = v;
            messages = m;
        }
        
        public String getClue()
        {
            int i = (int)Math.floor(Math.random()*messages.length);
            return messages[i];
        }
    }
    
    // Default settings
    public static final int MAX_LIVES = 3;
    
    // Assignment properties
    private JSONObject m_Question;    
    private String m_Filename, m_MainQuestion, m_FollowUp;
    private HashMap<String, Double> values_Variables;  
    private HashMap<String, String> values_Lists;
    private ArrayList<MathengineQuestionData> values_Questions;
    private ArrayList<MathengineWrongAnswerData> values_WrongAnswers;
    private ArrayList<String> values_FoundAnswers;
    private HashMap<String, MathengineClueData> values_Clues;
    private String m_Title;
    private int m_Lives;
    
    // Question-Answer system
    private ArrayList<String> run_QuestionOptions;
    private ArrayList<Integer> run_QuestionOptionsIndex;
    private double m_AnswerValue, run_AnswerValue, m_AnswerTolerance;    
    private String m_AnswerUnit, run_AnswerUnit;
    private String[] m_AnswerUnitCategory;
    private String run_QuestionAnswer;
    private String run_WrongAnswerMessage;
    private String run_WrongAnswerClue;
    
    // Other variables
    private boolean m_HasFinished;
    private boolean m_OfferClues;
    ArrayList<String[]> m_Units;
        
    /**
     * Main constructor
     * Requires later call to init().
     */
    Mathengine()
    {
        m_HasFinished = false;
        clear();
    }
    
    /**
     * Main constructor
     * @param fname Filename (.json)
     */
    Mathengine(String fname)
    {
        m_HasFinished = false;
        clear();
        init(fname);
    }
    
    /**
     * Clear all data in the engine.
     */
    public final void clear()
    {
        values_Variables = new HashMap<String, Double>();
        values_Lists = new HashMap<String, String>();
        values_Questions = new ArrayList<MathengineQuestionData>();
        values_FoundAnswers = new ArrayList<String>();
        values_WrongAnswers = new ArrayList<MathengineWrongAnswerData>();
        values_Clues = new HashMap<String, MathengineClueData>();
        
        m_Units = new ArrayList<String[]>();
        m_Units.add(new String[] {"kg", "hg", "g", "ton"});
        m_Units.add(new String[] {"l", "dl", "cl", "ml"});
        m_Units.add(new String[] {"m", "dm", "cm", "mm", "km"});
        m_Units.add(new String[] {"st"});
        
        m_OfferClues = true;
    }
        
    /**
     * Opens the given file and processes its contents.
     * 
     * @param fname Filename (.json)
     * @return True if there were no errors.
     */
    public final boolean init(String fname)
    {
        m_Filename = fname;
        m_Lives = Mathengine.MAX_LIVES;

        if (!readFile())
            return false;
        
        if (!setVariables())
            return false;
        
        if (!getLists())
            return false;
        
        if (!readAssignmentData())
            return false;
        
        if (!processQuestions())
            return false;
        
        if (!processWrongAnswers())
            return false;
        
        if (!processClues())
            return false;
        
        return true;
    }
    
    /**
     * Finds all clues contained in the file and stores them locally.
     * @return True if there were no problems.
     */
    private boolean processClues()
    {
        try
        {
            JSONObject clues = (JSONObject)m_Question.get("clues");
            
            if (clues == null)
                return true;
            
            Set<String> vars = clues.keySet();

            for (String s : vars)
            {
                JSONObject clue = (JSONObject)clues.get(s);
                
                Object messages = clue.get("message");
                
                String[] msg;
                
                if (messages instanceof JSONArray)
                {
                    JSONArray temp = (JSONArray)messages;
                    msg = new String[temp.size()];
                    for (int i=0; i<temp.size(); i++)
                        msg[i] = evaluateText((String)temp.get(i));
                }
                else
                {
                    String temp = evaluateText((String)messages);
                    msg = new String[] {temp};
                }
                
                long order = (Long)clue.get("order");
                long value = (Long)clue.get("value");                
                
                values_Clues.put(s, new MathengineClueData(order, value, msg));
            }
            
            return true;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        
        return false;
    }
    
    /**
     * Evaluates the given expression.
     * 
     * @param terms The expression to evaluate.
     * @return The calculated expression. Returns 0 if the expression is invalid
     */
    public double calculate(String terms)
    {
        try
        {
            String eval = evaluateText("$"+terms.trim()+"$");
            return Double.valueOf(eval);
        }
        catch (Exception e)
        {
            return 0;
        }        
    }
        
    /**
     * Evaluate a string and replace the variable references with actual values.
     * 
     * @param text The text string to evaluate.
     * @return The same, but processed, string.
     */
    private String evaluateText(String text)
    {        
        Interpreter interpreter = new Interpreter();

        for (int i=0; i<text.length(); i++)
        {
        	//TODO Not compliant with exercise standard, should be $...$ also for lists
            if (text.charAt(i) == '%')
            {
                for (int j=i+1; j<text.length(); j++)
                {
                    if (text.charAt(j) == '%')
                    {
                        String orig = text.substring(i, j+1);
                        String expr = text.substring(i+1, j);
                        
                        if (!values_Lists.isEmpty())
                        {
                            for (Map.Entry pair : values_Lists.entrySet()) 
                            {
                                expr = expr.replace(
                                        (String)pair.getKey(), 
                                        (String)(pair.getValue()));
                            }
                        }
                        
                        text = text.replace(orig, expr);
                    }
                }
            }
            
            if (text.charAt(i) == '$')
            {
                for (int j=i+1; j<text.length(); j++)
                {
                    if (text.charAt(j) == '$')
                    {
                        String orig = text.substring(i, j+1);
                        String expr = text.substring(i+1, j);

                        if (!values_Variables.isEmpty())
                        {
                            for (Map.Entry pair : values_Variables.entrySet()) 
                            {
                                expr = expr.replace(
                                        (String)pair.getKey(), 
                                        String.valueOf(pair.getValue()));
                            }
                        }

                        try
                        {
                            interpreter.eval("result = "+expr);                                
                            text = text.replace(orig, 
                                    String.valueOf(interpreter.get("result")));
                        }
                        catch (EvalError e)
                        {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }

        return text;
    }

    /**
     * Opens the specified file.
     * @return True if there were no errors.
     */
    private boolean readFile()
    {
        try
        {
            //For Android:
            //InputStream is = m_Context.getAssets().open(m_Filename);

            //For Windows:
            InputStream is = new FileInputStream(m_Filename);
            
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
        	
            String bufferString = new String(buffer);        	
            JSONParser parser = new JSONParser();
            m_Question = (JSONObject)parser.parse(bufferString);

            return true;
        } 
        catch (IOException e)
        {
            e.printStackTrace();
        }
        catch (ParseException e)
        {
            e.printStackTrace();
        }

        return false;
    }
    
    /**
     * Reads properties of the current assignment.
     * @return True if there were no problems.
     */
    private boolean readAssignmentData()
    {
    	String temp;
    	
        m_MainQuestion = evaluateText((String)(m_Question.get("question")));            
        m_AnswerValue = Double.valueOf(
                evaluateText((String)m_Question.get("answervalue")).trim());
        m_AnswerUnit = (String)m_Question.get("answerunit");
        m_AnswerUnitCategory = getUnitCategory(m_AnswerUnit);
        
        temp = (String)m_Question.get("tolerance");
        
        if (temp == null)
        	m_AnswerTolerance = 0.0;
        else
            m_AnswerTolerance = Double.valueOf(temp);
            
        m_FollowUp = (String)m_Question.get("followup");
                
        if (!m_FollowUp.contains(".json") && m_FollowUp.length() > 0)
        	m_FollowUp = m_FollowUp + ".json";
        
        m_Title = (String)m_Question.get("title");
        
        return true;
    }
    
    private boolean getLists()
    {
        try
        {
            JSONObject lists = (JSONObject)m_Question.get("lists");

            if (lists == null)
                return true;
            
            Set<String> names = lists.keySet();

            for (String name : names)
            {
                JSONArray temp = (JSONArray)lists.get(name); 
                
                int index = (int)Math.floor(Math.random()*temp.size()-0.1);
                
                String value = (String)temp.get(index);
                
                values_Lists.put(name, value);
            }
            
            return true;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }

    /**
     * Find all variables in the document and set variables.
     * @return True if there were no problems.
     */
    private boolean setVariables()
    {
        try
        {
            JSONObject variables = (JSONObject)m_Question.get("variables");

            if (variables == null)
                return true;
            
            Set<String> vars = variables.keySet();

            for (String s : vars)
            {
                String value = (String)variables.get(s);                
                String[] data = value.split(",");
                
                String lowtext = data[0];
                String hightext = data[1];
                
                double varvalue = Math.random()*
                            (Double.valueOf(hightext)-Double.valueOf(lowtext)) 
                            + Double.valueOf(lowtext);
                
                if (!lowtext.contains(".") && !hightext.contains("."))
                {
                    varvalue = Math.round(varvalue);
                }

                values_Variables.put(s, varvalue);
            }
            
            return true;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }
    
    /**
     * Get all accepted units divided by category.
     * @return An arraylist of string arrays of unit categories.
     */
    public ArrayList<String[]> getUnits()
    {
        return m_Units;
    }

    /**
     * Find all questions in the file and store them locally.
     * @return True if there were no problems.
     */
    private boolean processQuestions()
    {
        try
        {
            JSONObject questions = (JSONObject)m_Question.get("questions");

            if (questions == null)
                return true;
            
            Set<String> questionnames = questions.keySet();

            for (String s : questionnames)
            {
                JSONObject q = (JSONObject)questions.get(s);

                String keywords = evaluateText((String)q.get("keywords"));
                String[] keywordsarray = keywords.split(",");
                String formulation = evaluateText((String)q.get("formulation"));
                String answer = evaluateText((String)q.get("answer"));
                Object temp = q.get("clue");
                
                String[] clues;

                if (temp instanceof JSONArray)
                {
                    JSONArray temp2 = (JSONArray)temp;
                    clues = new String[temp2.size()];
                    for (int i=0; i<temp2.size(); i++)
                        clues[i] = (String)temp2.get(i);
                }
                else
                {
                    String temp2 = (String)temp;
                    clues = new String[] {temp2};
                }                
                
                String saveString = (String)q.get("save");
                boolean save = true;
                if (saveString != null)
                    if (saveString.equals("false"))
                        save = false;

                values_Questions.add(new MathengineQuestionData(
                        keywordsarray, formulation, answer, clues, save));
            }
            
            return true;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return false;
    }
    
    /**
     * @return True if there were no problems.
     */
    private boolean processWrongAnswers()
    {
        try
        {
            JSONObject wronganswers = 
                    (JSONObject)m_Question.get("wronganswers");

            if (wronganswers == null)
                return true;
            
            Set<String> questionnames = wronganswers.keySet();

            for (String s : questionnames)
            {
                JSONObject q = (JSONObject)wronganswers.get(s);

                double value = Double.valueOf(
                        evaluateText((String)q.get("value")).trim());
                String unit = (String)q.get("unit");
                String message = (String)q.get("message");
                double tolerance;
                
                String stolerance = (String)q.get("tolerance");
                if (stolerance == null)
                	tolerance = 0.0;
                else
                	tolerance = Double.valueOf(stolerance);
                
                Object temp = q.get("clue");
                
                String[] clues;
                
                if (temp instanceof JSONArray)
                {
                    JSONArray temp2 = (JSONArray)temp;
                    clues = new String[temp2.size()];
                    for (int i=0; i<temp2.size(); i++)
                        clues[i] = (String)temp2.get(i);
                }
                else
                {
                    String temp2 = (String)temp;
                    clues = new String[] {temp2};
                }                

                values_WrongAnswers.add(new MathengineWrongAnswerData(
                        value, unit, message, clues, tolerance));
            }
            
            return true;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        
        return false;
    }

    /**
     * @return The question of this assignment.
     */
    public String getMainQuestion()
    {
        return m_MainQuestion;
    }
    
    /**
     * @return The main title of this assignment.
     */
    public String getTitle()
    {
        return m_Title;
    }

    /**
     * Note that any application must call getPoints() to see if player is
     * still "alive".
     * 
     * @return True if this assignment is completed (successfully).
     */
    public boolean isFinished()
    {
        return m_HasFinished;
    }
    
    /**
     * Set the value of a new answer
     * @param value Answer value
     */
    public void setAnswerValue(String value)
    {
        run_AnswerValue = Double.parseDouble(evaluateText("$"+value+"$"));
    }

    /**
     * Set the unit of a new answer
     * @param unit Answer unit
     */
    public void setAnswerUnit(String unit)
    {
        run_AnswerUnit = unit;
    }
    
    /**
     * Converts a value to SI units.
     * 
     * @param value The value in a prefixed unit.
     * @param unit The prefix.
     * @return A double for value in the SI unit. Is 0 if not recognized.
     */
    public double convertToSI(double value, String unit)
    {
        if (unit.equals("kg"))
            return value;
        else if (unit.equals("hg"))
            return value/10.0;
        else if (unit.equals("g"))
            return value/1000.0;
        else if (unit.equals("ton"))
            return value*1000.0;
        else if (unit.equals("l"))
            return value;
        else if (unit.equals("dl"))
            return value/10.0;
        else if (unit.equals("cl"))
            return value/100.0;
        else if (unit.equals("ml"))
            return value/1000.0;
        else if (unit.equals("m"))
            return value;
        else if (unit.equals("dm"))
            return value/10.0;
        else if (unit.equals("cm"))
            return value/100.0;
        else if (unit.equals("mm"))
            return value/1000.0;
        else if (unit.equals("km"))
            return value*1000.0;
        else if (unit.equals("st"))
            return value;
        
        return 0;
    }
    
    /**
     * Returns an array of all units in the same category
     * 
     * @param unit The unit to check
     * @return A string array. Is null if unit not recognized.
     */
    public String[] getUnitCategory(String unit)
    {
        for (int i=0; i<m_Units.size(); i++)
        {
            String category[] = m_Units.get(i);
            
            for (String part : category)
            {
                if (part.equals(unit))
                {
                    return category;
                }
            }
        }
        
        return null;
    }

    /**
     * Test the provided answer.
     * @return True if the answer is correct.
     */
    public boolean testAnswer()
    {
        if (m_AnswerUnit == null)
            return false;
        
        boolean result = false;
        
        if (m_AnswerUnit.equals(run_AnswerUnit))       
        {
            result = (m_AnswerValue == run_AnswerValue);
        }
        else
        {
            boolean correctCategory = false;
            
            for (String category : m_AnswerUnitCategory)
            {
                if (category.equals(run_AnswerUnit))
                {
                    correctCategory = true;
                    break;
                }
            }
            
            if (correctCategory)
            {
                double m1 = convertToSI(m_AnswerValue, m_AnswerUnit);
                double m2 = convertToSI(run_AnswerValue, run_AnswerUnit);
                
                result = (Math.abs(m1-m2) < m_AnswerTolerance);
            }
        }
        
        if (result)
        {
            if (!m_FollowUp.contains(".json"))
            {
                m_HasFinished = result;
            }
            else
            {
                init(m_FollowUp);
            }
        }
        else
        {
            m_Lives--;
            
            run_WrongAnswerMessage = findWrongAnswerMatch();
            
            findClue();
        }

        return result;
    }
    
    /**
     * Note: Reduces the appropriate clue regardless of this being used or not.
     * @return The message of a certain wrong answer if it matches current set.
     */
    private String findWrongAnswerMatch()
    {
        for (MathengineWrongAnswerData m : values_WrongAnswers)
        {
            boolean result = 
                (m.value == run_AnswerValue) 
                && (m.unit.equals(run_AnswerUnit));
            
            if (result)
            {
                for (String clue : m.clues)
                {
                    values_Clues.get(clue).value--;
                }
                
                return m.message;
            }
        }
        
        return "";
    }
    
    /**
     * @return Return message for this wrong answer (if exists)
     */
    public String getWrongAnswerMessage()
    {
        return run_WrongAnswerMessage;
    }
    
    /**
     * Return an array of questions that match keywords in the string.
     * If there is just one match, you can call getAnswer() directly.
     * 
     * @param keywords The search string.
     * @return Array of matching questions.
     */
    public ArrayList<String> searchQuestion(String keywords)
    {
        run_QuestionOptions = new ArrayList<String>();
        run_QuestionOptionsIndex = new ArrayList<Integer>();

        for (int i=0; i<values_Questions.size(); i++)
        {
            boolean fit = values_Questions.get(i).fits(keywords);

            if (fit)
            {
                run_QuestionOptions.add(values_Questions.get(i).formulation);
                run_QuestionOptionsIndex.add(i);
            }
        }

        if (run_QuestionOptions.size() == 1)
            askQuestion(0);

        return run_QuestionOptions;
    }

    /**
     * Ask a certain question that has been given.
     * Note: you must have called searchQuestion previously.
     * 
     * @param index Index of this question in the array.
     * @return True if a question exists at this index.
     */
    public boolean askQuestion(int index)
    {
        if (values_Questions.isEmpty())
            return false;
            
        if (index < 0 || index >= values_Questions.size())
            return false;
        
        MathengineQuestionData question = 
                values_Questions.get(run_QuestionOptionsIndex.get(index));
        
        run_QuestionAnswer = question.answer;
        
        for (int i=0; i<question.clues.length; i++)
        {
            if (!question.clues[i].equals("."))
            {
                values_Clues.get(question.clues[i]).value--;
                question.clues[i] = ".";
            }       
        }
        
        if (question.save)
            values_FoundAnswers.add(run_QuestionAnswer);
        
        return true;
    }

    /**
     * Note: you must have called askQuestion() first.
     * @return The answer to the given question.
     */
    public String getAnswer()
    {
        return run_QuestionAnswer;
    }
    
    /**
     * @return An array of all answers that have been found.
     */
    public ArrayList<String> getFoundAnswers()
    {
        return values_FoundAnswers;
    }
    
    /**
     * Remove an entry in the array of found answers.
     * @param index Index of the entry to remove.
     */
    public void removeFoundAnswer(int index)
    {
        if (index >= 0 && index < values_FoundAnswers.size())
            values_FoundAnswers.remove(index);
    }
    
    /**
     * Move an entry in the array of found answers.
     * @param oldindex The index of the entry to move.
     * @param newindex The new index of the moved entry.
     */
    public void moveFoundAnswer(int oldindex, int newindex)
    {
        if (oldindex >= 0 && oldindex < values_FoundAnswers.size() &&
            newindex >= 0 && newindex < values_FoundAnswers.size() &&
            oldindex != newindex)
        {
            String temp = values_FoundAnswers.get(oldindex);
            values_FoundAnswers.add(newindex, temp);
            values_FoundAnswers.remove(oldindex);
        }
    }
    
    /**
     * Set whether or not to give clues when a wrong answer is provided.
     * 
     * @param condition Condition, true or false.
     */
    public void setGiveClues(boolean condition)
    {
        m_OfferClues = condition;
    }
    
    /**
     * Check whether clues are retrieved upon wrong answers.
     * 
     * @return Boolean value. 
     */
    public boolean givesClues()
    {
        return m_OfferClues;
    }
    
    /**
     * Get appropriate clue.
     * 
     * @return Clue (a string).
     */
    public String getAnswerClue()
    {
        return run_WrongAnswerClue;
    }
    
    /**
     * Find an appropriate clue for the provided answer.
     * 
     * Use getAnswerClue() to get it (only if getWrongAnswerMessage() is blank)
     */
    private void findClue()
    {
        final int maxorder = 999;
        boolean found = false;
        
        if (m_OfferClues)
        {
            for (int p=1; p<maxorder && !found; p++)
            {
                for (Map.Entry clue : values_Clues.entrySet()) 
                {
                    if (!found)
                    {
                        if (values_Clues.get((String)clue.getKey()).order == p &&
                            values_Clues.get((String)clue.getKey()).value > 0)
                        {
                            run_WrongAnswerClue = values_Clues.get((String)clue.getKey()).getClue();

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
    public int getLives()
    {
        return m_Lives;
    }
    
    /**
     * Set the current lives
     * @param value Number of lives, a non-negative integer.
     */
    public void setLives(int value)
    {
        if (value >= 0)
            m_Lives = value;
    }
    
    /**
     * Find an initial clue if the user does not get going.
     * 
     * @return The current clue with a value greater than 0.
     */
    public String getInitialClue()
    {
        findClue();
        return getAnswerClue();
    }
}
