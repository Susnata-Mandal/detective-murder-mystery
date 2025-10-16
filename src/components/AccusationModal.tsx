import { Suspect } from '@/types/game';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface AccusationModalProps {
  suspects: Suspect[];
  onAccuse: (suspectId: string) => void;
  onClose: () => void;
}

export const AccusationModal = ({ suspects, onAccuse, onClose }: AccusationModalProps) => {
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelect = (suspectId: string) => {
    setSelectedSuspect(suspectId);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (selectedSuspect) {
      onAccuse(selectedSuspect);
    }
  };

  return (
    <div className="fixed inset-0 bg-noir-shadow/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="case-file w-full max-w-4xl p-8">
        {!showConfirm ? (
          <>
            <div className="text-center mb-8">
              <h2 className="font-display text-4xl text-primary mb-4">Make Your Accusation</h2>
              <p className="text-muted-foreground">
                Select the suspect you believe committed the murder. This decision is final.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {suspects.map(suspect => (
                <button
                  key={suspect.id}
                  onClick={() => handleSelect(suspect.id)}
                  className="case-file p-6 transition-smooth hover:scale-105 hover:border-destructive group cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 group-hover:border-destructive">
                      <img 
                        src={suspect.image} 
                        alt={suspect.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-primary group-hover:text-destructive">{suspect.name}</h3>
                      <p className="text-accent text-sm uppercase tracking-wider">{suspect.role}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={onClose}>
                Continue Investigation
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6 animate-slide-up">
            <AlertCircle className="w-20 h-20 text-destructive mx-auto" />
            <h2 className="font-display text-4xl text-destructive">Are You Certain?</h2>
            <p className="text-foreground text-lg">
              You are about to accuse <span className="font-display text-primary text-xl">
                {suspects.find(s => s.id === selectedSuspect)?.name}
              </span> of murder.
            </p>
            <p className="text-muted-foreground">
              This action cannot be undone. Make sure you've gathered enough evidence.
            </p>
            
            <div className="flex justify-center gap-4 pt-6">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowConfirm(false)}
              >
                Reconsider
              </Button>
              <Button 
                variant="destructive" 
                size="lg"
                onClick={handleConfirm}
                className="bg-destructive hover:bg-destructive/90 noir-glow"
              >
                Make Accusation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};