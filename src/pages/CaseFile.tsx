import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SuspectCard } from '@/components/SuspectCard';
import { InterrogationPanel } from '@/components/InterrogationPanel';
import { AccusationModal } from '@/components/AccusationModal';
import { mysteryCase } from '@/data/caseData';
import { Suspect, Message } from '@/types/game';
import { Scale } from 'lucide-react';

const CaseFile = () => {
  const navigate = useNavigate();
  const [detectiveName, setDetectiveName] = useState('');
  const [suspects, setSuspects] = useState<Suspect[]>(mysteryCase.suspects);
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [showAccusationModal, setShowAccusationModal] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('detectiveName');
    if (!name) {
      navigate('/');
    } else {
      setDetectiveName(name);
    }
  }, [navigate]);

  const handleInterrogate = (suspect: Suspect) => {
    setSelectedSuspect(suspect);
  };

  const handleQuestionAsked = (suspectId: string, question: string, answer: string) => {
    // Update conversations
    setConversations(prev => ({
      ...prev,
      [suspectId]: [
        ...(prev[suspectId] || []),
        { role: 'user', content: question },
        { role: 'assistant', content: answer }
      ]
    }));

    // Decrease questions remaining
    setSuspects(prev => prev.map(s => 
      s.id === suspectId 
        ? { ...s, questionsRemaining: s.questionsRemaining - 1 }
        : s
    ));
  };

  const handleAccuse = (suspectId: string) => {
    const isCorrect = suspectId === mysteryCase.correctSuspect;
    navigate('/outcome', { 
      state: { 
        won: isCorrect, 
        accusedSuspect: suspects.find(s => s.id === suspectId),
        correctSuspect: suspects.find(s => s.id === mysteryCase.correctSuspect)
      } 
    });
  };

  const totalQuestionsRemaining = suspects.reduce((sum, s) => sum + s.questionsRemaining, 0);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="case-file p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="w-10 h-10 text-primary" />
            <h1 className="font-display text-5xl text-primary">{mysteryCase.title}</h1>
          </div>
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-4">
            Detective: {detectiveName}
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-foreground leading-relaxed text-lg">
              {mysteryCase.description}
            </p>
          </div>
        </div>

        {/* Suspects Grid */}
        <div>
          <h2 className="font-display text-3xl text-center text-primary mb-6">
            Suspects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suspects.map(suspect => (
              <SuspectCard
                key={suspect.id}
                suspect={suspect}
                onInterrogate={() => handleInterrogate(suspect)}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Total questions remaining: <span className="text-primary font-bold">{totalQuestionsRemaining}</span>
          </p>
          <Button
            size="lg"
            variant="destructive"
            onClick={() => setShowAccusationModal(true)}
            className="noir-glow font-display text-xl px-8"
          >
            Make Your Accusation
          </Button>
        </div>
      </div>

      {/* Interrogation Panel */}
      {selectedSuspect && (
        <InterrogationPanel
          suspect={selectedSuspect}
          messages={conversations[selectedSuspect.id] || []}
          onClose={() => setSelectedSuspect(null)}
          onQuestionAsked={handleQuestionAsked}
        />
      )}

      {/* Accusation Modal */}
      {showAccusationModal && (
        <AccusationModal
          suspects={suspects}
          onAccuse={handleAccuse}
          onClose={() => setShowAccusationModal(false)}
        />
      )}
    </div>
  );
};

export default CaseFile;