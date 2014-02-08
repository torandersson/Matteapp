package matteappengine;

import java.util.ArrayList;
import java.util.Scanner;

public class Exempel
{
    private static Mathengine engine;
    
    public static void main(String[] args) 
    {
        Scanner s = new Scanner(System.in);
        
        // Starta motorn och skriv ut frågan
        engine = new Mathengine("debug.json");        
	System.out.println(engine.getMainQuestion());        
        
        // Huvudloop
        while (!engine.isFinished())
        {
            String input = s.nextLine();
            
            /*
            Möjliga kommandon:
            EXIT - stänger av
            SCORE - skriver ut nuvarande poäng
            CALC - ger dig möjlighet att beräkna ett uttryck (evalueras med Javascript)
            INFO - skriver ut all känd data
            ? - Ställ ny fråga
            ! - Skriv svar (först värde, sedan enter, sedan enhet)
            */
            
            if (input.equals("EXIT"))
            {
                break;
            }
            else if (input.equals("SCORE"))
            {
                int score = engine.getLives();
                System.out.println(score);
            }
            else if (input.equals("CALC"))
            {
                System.out.print("=");
                String expr = s.nextLine();
                double answer = engine.calculate(expr);
                System.out.println(answer);
            }
            else if (input.equals("INFO"))
            {
                ArrayList<String> stuff = engine.getFoundAnswers();
                
                System.out.println("---");
                for (String answer : stuff)
                {
                    System.out.println(answer);
                }
                System.out.println("---");
            }
            else if (input.equals("!"))
            {
                System.out.print("=");                
                String data = s.nextLine();
                engine.setAnswerValue(data);
                
                System.out.print("=");    
                data = s.nextLine();
                engine.setAnswerUnit(data);
                
                if (engine.testAnswer())
                {
                    if (!engine.isFinished())
                        System.out.println(engine.getMainQuestion());
                }   
                else
                {
                    String msg = engine.getWrongAnswerMessage();
                    String clue = engine.getAnswerClue();
                    
                    if (msg.isEmpty())
                        System.out.println("Inkorrekt. " + clue);
                    else
                        System.out.println(msg);
                }
            }
            else if (input.equals("?"))
            {
                System.out.print("=");
                
                String data = s.nextLine();
                ArrayList<String> questions = engine.searchQuestion(data);
                
                if (questions.isEmpty())
                {
                    System.out.println("FÃ¶rstÃ¥r inte.");
                }
                else
                {
                    if (questions.size() > 1)
                    {
                        System.out.println("Menar du:");

                        for (int i=0; i<questions.size(); i++)
                        {
                            System.out.println(String.valueOf(i)+") "+
                                    questions.get(i));
                        }              

                        System.out.print("=");

                        int index = s.nextInt();
                        engine.askQuestion(index);
                    }

                    System.out.println(engine.getAnswer());  
                }
            }
        }
        
        System.out.println("Du vann!");
    }
}
