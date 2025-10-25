import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SuspectCard } from '@/components/SuspectCard';
import { InterrogationPanel } from '@/components/InterrogationPanel';
import { AccusationModal } from '@/components/AccusationModal';
import { allCases } from '@/data/caseData';
import { Suspect, Message, CaseData } from '@/types/game';
import { Scale, FileText } from 'lucide-react';

const CaseFile = () => {
  const navigate = useNavigate();
  const [detectiveName, setDetectiveName] = useState('');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [casesData, setCasesData] = useState<CaseData[]>(allCases.map(c => ({
    ...c,
    suspects: c.suspects.map(s => ({ ...s }))
  })));
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [showAccusationModal, setShowAccusationModal] = useState(false);

  const currentCase = casesData[selectedCaseIndex];

  useEffect(() => {
    const name = localStorage.getItem('detectiveName');
    if (!name) {
      navigate('/');
    } else {
      setDetectiveName(name);
    }
  }, [navigate]);

  const handleCaseChange = (index: number) => {
    setSelectedCaseIndex(index);
    setSelectedSuspect(null);
  };

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

    // Decrease questions remaining for this case's suspects
    setCasesData(prev => prev.map((caseData, idx) => 
      idx === selectedCaseIndex
        ? {
            ...caseData,
            suspects: caseData.suspects.map(s => 
              s.id === suspectId 
                ? { ...s, questionsRemaining: s.questionsRemaining - 1 }
                : s
            )
          }
        : caseData
    ));
  };

  const handleAccuse = (suspectId: string) => {
    const isCorrect = suspectId === currentCase.correctSuspect;
    navigate('/outcome', { 
      state: { 
        won: isCorrect, 
        accusedSuspect: currentCase.suspects.find(s => s.id === suspectId),
        correctSuspect: currentCase.suspects.find(s => s.id === currentCase.correctSuspect),
        caseTitle: currentCase.title
      } 
    });
  };

  const totalQuestionsRemaining = currentCase.suspects.reduce((sum, s) => sum + s.questionsRemaining, 0);
  const caseColorClass = selectedCaseIndex === 0 ? 'case-hollywood' : selectedCaseIndex === 1 ? 'case-mumbai' : 'case-shivpur';

  return (
    <div className={`min-h-screen p-8 ${caseColorClass}`}>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="w-10 h-10 text-primary" />
            <h1 className="font-display text-5xl text-primary">Detective's Case Files</h1>
            <Scale className="w-10 h-10 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
            Detective: {detectiveName}
          </p>
          <p className="text-muted-foreground italic">Interrogate wisely. Justice awaits.</p>
        </div>

        {/* Case Selection */}
        <div className="flex justify-center gap-4 mb-8">
          {allCases.map((caseItem, index) => (
            <Button
              key={index}
              onClick={() => handleCaseChange(index)}
              variant={selectedCaseIndex === index ? "default" : "outline"}
              className={`transition-smooth ${
                selectedCaseIndex === index 
                  ? index === 0 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : ''
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              {caseItem.title}
            </Button>
          ))}
        </div>

        {/* Case Overview */}
        <div className="case-file p-8 text-center">
          <h2 className={`font-display text-4xl mb-4 ${
            selectedCaseIndex === 0 ? 'text-primary' : 'text-accent'
          }`}>
            {currentCase.title}
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-foreground leading-relaxed text-lg">
              {currentCase.description}
            </p>
          </div>
        </div>

        {/* Suspects Grid */}
        <div>
          <h2 className={`font-display text-3xl text-center mb-6 ${
            selectedCaseIndex === 0 ? 'text-primary' : 'text-accent'
          }`}>
            Suspects
          </h2>
          <div className={`grid grid-cols-1 gap-6 ${
            currentCase.suspects.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {currentCase.suspects.map(suspect => (
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
            Total questions remaining: <span className={`font-bold ${
              selectedCaseIndex === 0 ? 'text-primary' : 'text-accent'
            }`}>{totalQuestionsRemaining}</span>
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
          caseTitle={currentCase.title}
        />
      )}

      {/* Accusation Modal */}
      {showAccusationModal && (
        <AccusationModal
          suspects={currentCase.suspects}
          onAccuse={handleAccuse}
          onClose={() => setShowAccusationModal(false)}
        />
      )}
    </div>
  );
};

export default CaseFile;
