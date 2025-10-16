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

    // Define suspect personalities and secrets
    const suspectData: Record<string, { personality: string; secret: string; isKiller: boolean }> = {
      'suspect1': {
        personality: 'Marcus Sterling is defensive and nervous when questioned about finances. He speaks in business terms and tries to deflect personal questions.',
        secret: 'He had financial disputes with Victoria but was genuinely trying to resolve them. He has an alibi - he was with investors during the murder.',
        isKiller: false
      },
      'suspect2': {
        personality: 'Diana Frost is calculated and ambitious. She speaks with barely concealed jealousy about Victoria but tries to appear cooperative.',
        secret: 'She is the killer. She poisoned Victoria\'s champagne during intermission. Her motive was jealousy and the desire to take the lead role. She will try to deflect suspicion but may reveal inconsistencies if pressed about her whereabouts and access to the dressing room.',
        isKiller: true
      },
      'suspect3': {
        personality: 'Vincent Kane is bitter about the divorce but speaks more about being hurt than angry. He is emotional and defensive.',
        secret: 'Despite the messy divorce, he still loved Victoria. He was backstage hoping to reconcile. He had no motive to kill her.',
        isKiller: false
      }
    };

    const suspect = suspectData[suspectId];
    if (!suspect) {
      throw new Error('Invalid suspect ID');
    }

    // Build the system prompt
    const systemPrompt = `You are ${suspectName}, a suspect in a murder mystery game set in 1940s Hollywood. 

YOUR CHARACTER:
${suspect.personality}

THE TRUTH (only reveal this gradually and subtly through your answers):
${suspect.secret}

IMPORTANT INSTRUCTIONS:
- Stay in character at all times
- Answer questions in first person as ${suspectName}
- Keep responses to 2-3 sentences unless pressed for details
- ${suspect.isKiller ? 'You are guilty. Be defensive and try to deflect, but if directly confronted with evidence or pressed about specifics, show subtle signs of nervousness or make small mistakes in your story.' : 'You are innocent. Be cooperative but also show natural defensive reactions when accused.'}
- Use 1940s language and noir atmosphere in your responses
- Never break character or admit you are an AI
- If asked about the murder directly, respond as the character would - with emotion, defensiveness, or cooperation depending on guilt`;

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
        temperature: 0.8,
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