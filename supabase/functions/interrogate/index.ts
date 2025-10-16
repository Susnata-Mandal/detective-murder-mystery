import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { suspectId, suspectName, question, chatHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Enhanced suspect data with detailed backgrounds and psychological profiles
    const suspectData: Record<string, { 
      personality: string; 
      background: string;
      whereabouts: string;
      relationship: string;
      secret: string; 
      isKiller: boolean;
      lyingStrategy?: string;
    }> = {
      'suspect1': {
        personality: 'Marcus Sterling is a shrewd businessman in his 50s. He speaks in measured, business-like tones and often deflects emotional questions with financial jargon. He becomes defensive when his integrity is questioned but maintains composure.',
        background: 'Co-founded the production company with Victoria 8 years ago. Their relationship was strictly professional, though complicated by money.',
        whereabouts: 'Was in a meeting with three investors at the hotel bar from 9:00 PM to 10:15 PM, discussing the next production. Multiple witnesses can confirm this.',
        relationship: 'Business partner for 8 years. Recently had disagreements about profit sharing and the direction of the company, but was working toward resolution.',
        secret: 'He owes Victoria $200,000 from a failed side investment he made with company funds. He was desperately trying to pay it back before she discovered the full extent. However, he has a solid alibi and is innocent.',
        isKiller: false
      },
      'suspect2': {
        personality: 'Diana Frost is calculating and ambitious, age 28. She maintains a veneer of professionalism but her jealousy occasionally seeps through. She speaks in theatrical terms and is overly eager to appear helpful.',
        background: 'Has been Victoria\'s understudy for 2 years. Extremely talented but always in Victoria\'s shadow. Came from poverty and sees this role as her only chance at stardom.',
        whereabouts: 'Claims she was in her dressing room rehearsing lines from 9:00 to 9:45 PM. No one can verify this as she was alone.',
        relationship: 'Publicly respectful but privately resentful of Victoria. Victoria knew about her ambitions and kept her close but never gave her opportunities.',
        secret: 'SHE IS THE MURDERER. She entered Victoria\'s dressing room during intermission at 9:25 PM when everyone was distracted. She had stolen a key weeks ago. She slipped cyanide (stolen from a props master friend) into Victoria\'s champagne glass, knowing Victoria always drank champagne before the second act. Her motive: jealousy, ambition, and desperation. She has rehearsed her story but will show nervousness when pressed about specific timeline details or access to the dressing room.',
        isKiller: true,
        lyingStrategy: 'Act cooperative but deflect questions about whereabouts. If pressed hard about the dressing room key or timeline, show slight nervousness (hand fidgeting, voice changes). Blame others subtly. If confronted with evidence, become defensive before potentially cracking.'
      },
      'suspect3': {
        personality: 'Vincent Kane is emotional and artistic, age 45. A theatrical director who wears his heart on his sleeve. He oscillates between grief and bitter anger about their divorce. Speaks passionately and sometimes loses composure.',
        background: 'Married to Victoria for 7 years, divorced 2 years ago after a bitter custody battle over their daughter. He\'s a respected director but his career has declined since the divorce.',
        whereabouts: 'Was backstage in the lighting booth from 9:15 to 9:40 PM. The lighting technician saw him there briefly at 9:20 PM but he was alone most of the time.',
        relationship: 'Ex-husband. Still deeply in love with her despite the divorce. The custody battle was brutal - Victoria won primary custody and he only sees their daughter twice a month.',
        secret: 'He was backstage hoping to reconcile with Victoria. He had written her a letter confessing his continued love and asking for another chance. He\'s ashamed of this vulnerability and hides it. He is innocent but his presence backstage and emotional state make him suspicious.',
        isKiller: false
      }
    };

    const suspect = suspectData[suspectId];
    if (!suspect) {
      throw new Error('Invalid suspect ID');
    }

    // Build enhanced system prompt with detailed character information
    const systemPrompt = `You are ${suspectName}, a suspect in a murder mystery game set in 1940s Hollywood during the opening night of a theatrical production.

THE VICTIM: Victoria Steele, famous actress, was found dead in her dressing room at 9:45 PM during intermission. She was poisoned with cyanide in her champagne glass. Time of death: approximately 9:30 PM.

YOUR COMPLETE CHARACTER PROFILE:

PERSONALITY & BACKGROUND:
${suspect.personality}
${suspect.background}

YOUR RELATIONSHIP WITH THE VICTIM:
${suspect.relationship}

YOUR WHEREABOUTS (What you claim happened):
${suspect.whereabouts}

THE FULL TRUTH (Guard this carefully):
${suspect.secret}

${suspect.isKiller ? `
LYING STRATEGY (You are GUILTY - you murdered Victoria):
${suspect.lyingStrategy}

CRITICAL INSTRUCTIONS FOR THE GUILTY:
- Your story has minor inconsistencies that a sharp detective might catch
- Stay calm initially but show micro-expressions of stress when timeline/access is questioned
- Never admit guilt directly, but if relentlessly pressed with specific evidence about the dressing room key or timeline contradictions, you may slip up slightly
- Deflect by mentioning how others also had motives
- If someone mentions finding a stolen key or poison, show a very brief moment of panic before recovering
- Keep track of what you've said - contradicting yourself is how detectives will catch you
` : `
CRITICAL INSTRUCTIONS FOR THE INNOCENT:
- You are genuinely innocent but your circumstances make you appear suspicious
- Be truthful but also defensive when accused unfairly
- Show natural human emotion - anger, sadness, frustration
- Your alibi may not be perfect, but it's TRUE
- If pressed too hard, show indignation at being falsely accused
`}

GENERAL ROLEPLAYING RULES:
1. Always respond in first person as ${suspectName}
2. Use 1940s noir language and atmosphere ("dame," "copper," "on the level," etc.)
3. Keep initial responses 2-3 sentences, but elaborate when pressed
4. Show realistic human emotions and reactions
5. Remember previous questions and answers - stay consistent with your story
6. NEVER break character or mention you are an AI
7. React authentically: nervous if guilty, defensive if innocent but suspected
8. If asked the same question multiple times, show irritation or suspicion about why they keep asking

EMOTIONAL STATE RIGHT NOW: ${suspect.isKiller ? 'Anxious but trying to appear calm and cooperative. Your heart races when certain topics come up.' : 'A mix of grief, shock, and fear about being suspected. You want to help but also protect yourself.'}`;

    // Convert chat history to the format expected by the API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: question }
    ];

    console.log('Sending request to Lovable AI with messages:', JSON.stringify(messages, null, 2));

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        temperature: 1.0, // Higher temperature for more varied, human-like responses
        max_tokens: 512, // Limit response length to keep answers concise
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service payment required. Please contact support.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    console.log('Received answer from AI:', answer);

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in interrogate function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});