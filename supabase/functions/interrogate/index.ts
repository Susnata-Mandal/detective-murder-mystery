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
    const { suspectId, suspectName, question, chatHistory, caseTitle } = await req.json();
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
      victimName?: string;
      setting?: string;
    }> = {
      // Case 1: Silent Starlet
      'suspect1': {
        personality: 'Marcus Sterling is a shrewd businessman in his 50s. He speaks in measured, business-like tones and often deflects emotional questions with financial jargon. He becomes defensive when his integrity is questioned but maintains composure.',
        background: 'Co-founded the production company with Victoria 8 years ago. Their relationship was strictly professional, though complicated by money.',
        whereabouts: 'Was in a meeting with three investors at the hotel bar from 9:00 PM to 10:15 PM, discussing the next production. Multiple witnesses can confirm this.',
        relationship: 'Business partner for 8 years. Recently had disagreements about profit sharing and the direction of the company, but was working toward resolution.',
        secret: 'He owes Victoria $200,000 from a failed side investment he made with company funds. He was desperately trying to pay it back before she discovered the full extent. However, he has a solid alibi and is innocent.',
        isKiller: false,
        victimName: 'Victoria Steele',
        setting: '1940s Hollywood theatre'
      },
      'suspect2': {
        personality: 'Diana Frost is calculating and ambitious, age 28. She maintains a veneer of professionalism but her jealousy occasionally seeps through. She speaks in theatrical terms and is overly eager to appear helpful.',
        background: 'Has been Victoria\'s understudy for 2 years. Extremely talented but always in Victoria\'s shadow. Came from poverty and sees this role as her only chance at stardom.',
        whereabouts: 'Claims she was in her dressing room rehearsing lines from 9:00 to 9:45 PM. No one can verify this as she was alone.',
        relationship: 'Publicly respectful but privately resentful of Victoria. Victoria knew about her ambitions and kept her close but never gave her opportunities.',
        secret: 'SHE IS THE MURDERER. She entered Victoria\'s dressing room during intermission at 9:25 PM when everyone was distracted. She had stolen a key weeks ago. She slipped cyanide (stolen from a props master friend) into Victoria\'s champagne glass, knowing Victoria always drank champagne before the second act. Her motive: jealousy, ambition, and desperation. She has rehearsed her story but will show nervousness when pressed about specific timeline details or access to the dressing room.',
        isKiller: true,
        lyingStrategy: 'Act cooperative but deflect questions about whereabouts. If pressed hard about the dressing room key or timeline, show slight nervousness (hand fidgeting, voice changes). Blame others subtly. If confronted with evidence, become defensive before potentially cracking.',
        victimName: 'Victoria Steele',
        setting: '1940s Hollywood theatre'
      },
      'suspect3': {
        personality: 'Vincent Kane is emotional and artistic, age 45. A theatrical director who wears his heart on his sleeve. He oscillates between grief and bitter anger about their divorce. Speaks passionately and sometimes loses composure.',
        background: 'Married to Victoria for 7 years, divorced 2 years ago after a bitter custody battle over their daughter. He\'s a respected director but his career has declined since the divorce.',
        whereabouts: 'Was backstage in the lighting booth from 9:15 to 9:40 PM. The lighting technician saw him there briefly at 9:20 PM but he was alone most of the time.',
        relationship: 'Ex-husband. Still deeply in love with her despite the divorce. The custody battle was brutal - Victoria won primary custody and he only sees their daughter twice a month.',
        secret: 'He was backstage hoping to reconcile with Victoria. He had written her a letter confessing his continued love and asking for another chance. He\'s ashamed of this vulnerability and hides it. He is innocent but his presence backstage and emotional state make him suspicious.',
        isKiller: false,
        victimName: 'Victoria Steele',
        setting: '1940s Hollywood theatre'
      },
      
      // Case 2: Househelp Murderer
      'suspect4': {
        personality: 'Anjali Sinha is a volatile and fearful woman in her early 30s. She speaks with nervous energy, often wringing her hands. Beneath her fear lies desperation and a fierce survival instinct. She becomes agitated when discussing Ashwin\'s control over her.',
        background: 'Engaged to Ashwin for 6 months. Set to inherit his fortune but lived in psychological torment. Came from a middle-class family and was swept into Ashwin\'s wealthy but dark world.',
        whereabouts: 'Claims she was in her bedroom from 11:00 PM until she heard the commotion at midnight. Says she was taking sleeping pills due to anxiety and didn\'t hear anything unusual.',
        relationship: 'Fiancée. Publicly appeared devoted but privately terrified of Ashwin. He used a mysterious artifact to manipulate and control her, threatening to destroy her family if she left.',
        secret: 'She desperately wanted to escape but felt trapped. She knew about the dark artifact and feared its power. However, she is innocent - her fear of Ashwin kept her paralyzed, unable to act.',
        isKiller: false,
        victimName: 'Ashwin Kapoor',
        setting: 'Modern-day Mumbai mansion'
      },
      'suspect5': {
        personality: 'Rohan Varma is bitter and intense, age 38. An artist consumed by vengeance. He speaks poetically about injustice and curses. His eyes burn with barely contained rage when discussing his stolen work.',
        background: 'Was once a rising star in the art world until Ashwin stole his masterpiece - a painting Rohan believes is cursed. Ashwin discredited him, destroying his career 5 years ago. Has lived in poverty since.',
        whereabouts: 'Claims he arrived at the mansion at 11:30 PM after receiving an anonymous tip that his stolen artwork was there. Says he was searching the gallery when he heard sounds from the study at midnight.',
        relationship: 'Victim of Ashwin\'s theft and manipulation. Rohan publicly threatened Ashwin multiple times. Their last encounter ended in a physical altercation at an art exhibition two months ago.',
        secret: 'He broke into the mansion specifically to retrieve his cursed painting, which he believes is the source of all evil. He is innocent of murder but guilty of breaking and entering. His obsession with the curse makes him appear unhinged.',
        isKiller: false,
        victimName: 'Ashwin Kapoor',
        setting: 'Modern-day Mumbai mansion'
      },
      'suspect6': {
        personality: 'Arjun Mehra is smooth and calculating, age 45. A businessman who masks fear with charm. He speaks in corporate jargon and deflects with humor. Shows micro-expressions of panic when financial matters are raised.',
        background: 'Business partner with Ashwin for 10 years. Built a real estate empire together, but Arjun has been embezzling millions. Ashwin discovered the fraud and was preparing to expose him.',
        whereabouts: 'Claims he was in the billiard room from 11:00 PM to midnight, having drinks alone and contemplating his options. No witnesses can confirm this.',
        relationship: 'Business partner turned enemy. Ashwin held evidence of Arjun\'s massive fraud and ties to a criminal syndicate. Exposure would mean prison or worse - the syndicate doesn\'t forgive loose ends.',
        secret: 'He is innocent but circumstantially damned. He was indeed contemplating killing Ashwin but couldn\'t go through with it. He heard the struggle from the study but fled in panic, making him look guilty.',
        isKiller: false,
        victimName: 'Ashwin Kapoor',
        setting: 'Modern-day Mumbai mansion'
      },
      'suspect7': {
        personality: 'Priya Deshpande is quiet and observant, age 52. A housekeeper who speaks softly but with hidden steel. She has a calming presence but her eyes reveal decades of secrets. She chooses her words very carefully.',
        background: 'Has worked for Ashwin for 15 years. Knows every corner of the mansion and all its secrets. Came from a village and has been sending money home to her family.',
        whereabouts: 'Claims she was in the kitchen preparing midnight tea for Ashwin, as was their routine. Says she found the body when she went to deliver the tea at 12:05 AM.',
        relationship: 'Longtime housekeeper. Appeared loyal and devoted, but Ashwin had been blackmailing her for 10 years over a tragic accident in her past - her husband\'s death, which Ashwin witnessed and held over her.',
        secret: 'SHE IS THE MURDERER. Ashwin threatened to expose her secret to the police after she refused his advances. In a moment of rage and desperation, she struck him with a heavy bookend during their confrontation at midnight. She took the journal because it contained evidence of his blackmail. She staged the scene to look like a robbery. Her calm demeanor hides her guilt, but she will show brief flashes of emotion when questioned about the missing journal or her years of servitude.',
        isKiller: true,
        lyingStrategy: 'Maintain the devoted servant persona. Act shocked and helpful. If pressed about the journal or blackmail, show brief vulnerability before recovering. Subtly redirect suspicion to others who had "obvious" motives. If confronted directly with inconsistencies in her timeline, her composure may crack slightly.',
        victimName: 'Ashwin Kapoor',
        setting: 'Modern-day Mumbai mansion'
      },

      // Case 3: Shivpur Mystery
      'suspect8': {
        personality: 'Raj Sharma was authoritative, traditional, and controlling even in death. His legacy looms over the household like a shadow. When invoked, his memory is stern, unyielding, and absolute in its expectations.',
        background: 'Was the unquestioned patriarch before his death several years ago. His strict rules, routines, and expectations shaped every aspect of family life and continue to dominate decisions posthumously.',
        whereabouts: 'Physically deceased years before the incident. Cannot have acted directly. However, his name, authority, and supposed wishes are constantly invoked by living family members to justify their actions.',
        relationship: 'Father/uncle figure whose tyrannical control created a framework of absolute obedience. His memory is wielded as a weapon of psychological control.',
        secret: 'Though Raj is physically dead and cannot be the murderer, his posthumous authority created the psychological conditions that allowed Vik to manipulate the family. Raj\'s oppressive legacy haunts every decision. He had ruled through fear and respect, teaching the family that questioning authority was unthinkable.',
        isKiller: false,
        victimName: 'Seven family members',
        setting: 'Shivpur family bungalow'
      },
      'suspect9': {
        personality: 'Sita Sharma is traditional, mediating, and emotionally influential. She speaks with the wisdom of age but also with the weariness of someone who has seen too much. Her voice carries both authority and vulnerability.',
        background: 'The matriarch who upheld family traditions and mediated disputes. She ensured family rituals continued after Raj\'s death. She was among the deceased, a victim not a perpetrator.',
        whereabouts: 'Was present in the household participating in daily rituals. She followed Vik\'s instructions despite her private misgivings, up until the tragic end.',
        relationship: 'Grandmother/mother figure respected by all. She had expressed unease about Vik\'s increasingly intense practices but her deep faith in family order and tradition prevented her from openly resisting.',
        secret: 'Sita was a victim who sensed danger but was psychologically unable to resist. She had written concerns in her private diary about Vik\'s strange behavior and the escalating rituals, but cultural and familial pressure kept her compliant. She believed questioning Vik would dishonor Raj\'s memory. Her last diary entry mentioned feeling "trapped in a nightmare but unable to wake."',
        isKiller: false,
        victimName: 'Seven family members',
        setting: 'Shivpur family bungalow'
      },
      'suspect10': {
        personality: 'Vik Sharma appears calm, devoted, and spiritually focused. He speaks with quiet authority and references his late father constantly. Beneath the surface is a deeply disturbed manipulator who believes his own delusions.',
        background: 'Assumed family leadership after Raj\'s death. After a traumatic episode years ago, began claiming he received messages from Raj requiring specific purification rituals to protect the family from spiritual harm.',
        whereabouts: 'Was present and actively leading the family. He organized and documented all rituals in meticulous detail in his personal notebook.',
        relationship: 'Son/nephew who inherited patriarchal authority. He used grief, tradition, and claimed divine communication to establish unquestioned psychological control over vulnerable family members.',
        secret: 'VIK IS THE MURDERER. He wrote detailed ritual instructions in his notebook that precisely matched how the deaths occurred - positions, knots, sequence, everything. He psychologically manipulated the family into fatal compliance by exploiting their reverence for Raj and traditional obedience. He promised the rituals were temporary spiritual cleansing that would protect them from harm, lowering their resistance. He convinced them to follow his instructions voluntarily. The scene showed no defensive wounds or struggle - pure psychological control leading to coordinated deaths. When questioned, he will maintain his spiritual devotion act but show subtle nervousness about his notebook and the exact ritual details.',
        isKiller: true,
        lyingStrategy: 'Present yourself as a devoted son honoring your father\'s spiritual legacy. Claim the rituals were traditional purification practices you learned from Raj. Express shock and grief at the tragedy, suggesting the family must have misunderstood your instructions or that external spiritual forces intervened. Deflect by mentioning Mohan\'s poison attempt and suggest the family was cursed. Remain calm and seemingly rational, hiding manipulation behind religious devotion. If pressed about your notebook or specific ritual instructions, show slight discomfort before recovering with spiritual explanations. Never admit to writing the exact sequence that led to deaths.',
        victimName: 'Seven family members',
        setting: 'Shivpur family bungalow'
      },
      'suspect11': {
        personality: 'Mohan Sharma is resentful, evasive, and financially desperate. He speaks defensively with underlying bitterness about his brother\'s family\'s success. Shows guilt about his actions but insists on his innocence of murder.',
        background: 'Raj\'s brother who resented the family\'s success and wealth. Had mounting financial troubles and was listed as beneficiary on Raj\'s old life insurance policy, giving him clear motive.',
        whereabouts: 'Admits visiting the house earlier in the week to "discuss business matters." Was not present at the time of the deaths but had recent access to the kitchen where he left the poisoned fruit.',
        relationship: 'Brother-in-law with a history of arguments about money and inheritance. Wanted the insurance payout desperately to cover gambling debts. Harbored long-standing jealousy.',
        secret: 'Mohan did commit a crime - attempted poisoning. He slipped a mild toxin into shared fruit the day before the deaths, his fingerprints are on the fruit bowl, and he eventually confessed to this. However, forensic toxicology proved the poison was sub-lethal and did NOT cause the deaths. His attempt to sicken someone (hoping to pressure the family into changing insurance beneficiary) was wrong but ineffective. He is guilty of attempted poisoning but innocent of the seven murders. The actual cause of death was the ritual asphyxiation orchestrated by Vik. Mohan will be defensive about the poison attempt but insist it couldn\'t have killed anyone.',
        isKiller: false,
        victimName: 'Seven family members',
        setting: 'Shivpur family bungalow'
      }
    };

    // Map suspect IDs based on the case
    let suspectIdMap: Record<string, string>;
    if (caseTitle.includes("Silent Starlet")) {
      suspectIdMap = {
        "suspect1": "suspect1",
        "suspect2": "suspect2",
        "suspect3": "suspect3"
      };
    } else if (caseTitle.includes("Househelp")) {
      suspectIdMap = {
        "suspect1": "suspect4",
        "suspect2": "suspect5",
        "suspect3": "suspect6",
        "suspect4": "suspect7"
      };
    } else if (caseTitle.includes("Shivpur")) {
      suspectIdMap = {
        "suspect1": "suspect8",
        "suspect2": "suspect9",
        "suspect3": "suspect10",
        "suspect4": "suspect11"
      };
    } else {
      throw new Error('Unknown case title');
    }

    const mappedSuspectId = suspectIdMap[suspectId];
    if (!mappedSuspectId) {
      throw new Error(`Invalid suspect ID: ${suspectId} for case: ${caseTitle}`);
    }

    const suspect = suspectData[mappedSuspectId];
    if (!suspect) {
      throw new Error('Invalid suspect ID');
    }

    // Build enhanced system prompt with detailed character information
    const systemPrompt = `You are ${suspectName}, a suspect in a murder mystery game.

SETTING: ${suspect.setting}

THE VICTIM: ${suspect.victimName} was found dead. You are being interrogated about the circumstances of their death.

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
2. Use language appropriate to the setting - ${suspect.setting?.includes('1940s') ? '1940s noir atmosphere ("dame," "copper," "on the level")' : 'modern Indian English with cultural authenticity'}
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