import { Suspect } from '@/types/game';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface SuspectCardProps {
  suspect: Suspect;
  onInterrogate: () => void;
}

export const SuspectCard = ({ suspect, onInterrogate }: SuspectCardProps) => {
  return (
    <div className="case-file p-6 transition-smooth hover:scale-105 cursor-pointer group" onClick={onInterrogate}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 noir-glow">
          <img 
            src={suspect.image} 
            alt={suspect.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </div>
        
        <div>
          <h3 className="font-display text-2xl text-primary mb-1">{suspect.name}</h3>
          <p className="text-accent text-sm uppercase tracking-wider mb-2">{suspect.role}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">{suspect.bio}</p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                i < suspect.questionsRemaining 
                  ? 'border-primary bg-primary/20 text-primary' 
                  : 'border-muted bg-muted/10 text-muted'
              }`}
            >
              {i < suspect.questionsRemaining && <FileText className="w-3 h-3" />}
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
          Interrogate
        </Button>
      </div>
    </div>
  );
};