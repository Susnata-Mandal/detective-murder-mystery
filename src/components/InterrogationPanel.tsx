import { useState, useRef, useEffect } from 'react';
import { Suspect, Message } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InterrogationPanelProps {
  suspect: Suspect;
  messages: Message[];
  onClose: () => void;
  onQuestionAsked: (suspectId: string, question: string, answer: string) => void;
  caseTitle: string;
}

export const InterrogationPanel = ({ 
  suspect, 
  messages, 
  onClose,
  onQuestionAsked,
  caseTitle
}: InterrogationPanelProps) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleAskQuestion = async () => {
    if (!question.trim() || suspect.questionsRemaining <= 0 || isLoading) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interrogate', {
        body: {
          suspectId: suspect.id,
          suspectName: suspect.name,
          question: question.trim(),
          chatHistory: messages,
          caseTitle: caseTitle
        }
      });

      if (error) throw error;

      onQuestionAsked(suspect.id, question.trim(), data.answer);
      setQuestion('');
    } catch (error) {
      console.error('Interrogation error:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="case-file w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <div className="flex items-center gap-4">
            <img 
              src={suspect.image} 
              alt={suspect.name}
              className="w-16 h-16 rounded-full border-2 border-primary/30 object-cover grayscale"
            />
            <div>
              <h2 className="font-display text-2xl text-primary">{suspect.name}</h2>
              <p className="text-accent text-sm uppercase tracking-wider">{suspect.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    i < suspect.questionsRemaining 
                      ? 'border-primary bg-primary/20 text-primary' 
                      : 'border-muted bg-muted/10 text-muted line-through'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </div>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 paper-texture">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <p className="font-display text-xl mb-2">Begin your interrogation</p>
              <p className="text-sm">You have {suspect.questionsRemaining} questions remaining</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div 
                className={`max-w-[80%] p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary/20 border border-primary/30 ml-auto' 
                    : 'bg-card border border-border'
                }`}
              >
                <p className="text-sm font-semibold mb-1 text-accent">
                  {msg.role === 'user' ? 'You' : suspect.name}
                </p>
                <p className="text-foreground leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-primary/20">
          {suspect.questionsRemaining > 0 ? (
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder="Type your question..."
                disabled={isLoading}
                className="flex-1 bg-input border-border"
              />
              <Button 
                onClick={handleAskQuestion} 
                disabled={!question.trim() || isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="stamp inline-block animate-stamp">
                No Questions Remaining
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};