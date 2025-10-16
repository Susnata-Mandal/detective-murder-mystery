import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Suspect } from '@/types/game';

interface LocationState {
  won: boolean;
  accusedSuspect?: Suspect;
  correctSuspect?: Suspect;
}

const Outcome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const handlePlayAgain = () => {
    localStorage.removeItem('detectiveName');
    navigate('/');
  };

  if (!state) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="case-file max-w-3xl w-full p-12 text-center space-y-8 animate-fade-in">
        {state.won ? (
          <>
            <CheckCircle2 className="w-32 h-32 text-primary mx-auto animate-stamp" />
            <div className="stamp text-3xl animate-stamp">
              Case Closed
            </div>
            <h1 className="font-display text-5xl text-primary">
              Outstanding Work, Detective!
            </h1>
            <div className="space-y-4 text-foreground">
              <p className="text-xl">
                You correctly identified <span className="text-primary font-display text-2xl">
                  {state.accusedSuspect?.name}
                </span> as the killer.
              </p>
              <div className="case-file p-6 bg-muted/20 text-left space-y-3">
                <h3 className="font-display text-2xl text-primary mb-2">The Truth Revealed</h3>
                <p className="leading-relaxed">
                  {state.correctSuspect?.name}, the ambitious understudy, had grown tired of living in 
                  Victoria Steele's shadow. She saw her chance during the opening night intermission. 
                  With access to Victoria's dressing room and knowledge of her routine, she slipped 
                  cyanide into the champagne glass. The motive was clear: jealousy and ambition.
                </p>
                <p className="leading-relaxed">
                  The starring role was now hers, but so was a lifetime behind bars. Justice has been served, 
                  thanks to your brilliant detective work.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-32 h-32 text-destructive mx-auto animate-stamp" />
            <div className="stamp text-3xl animate-stamp border-destructive text-destructive">
              Case Unsolved
            </div>
            <h1 className="font-display text-5xl text-destructive">
              The Killer Escapes
            </h1>
            <div className="space-y-4 text-foreground">
              <p className="text-xl">
                You accused <span className="text-destructive font-display text-2xl">
                  {state.accusedSuspect?.name}
                </span>, but that was incorrect.
              </p>
              <div className="case-file p-6 bg-muted/20 text-left space-y-3">
                <h3 className="font-display text-2xl text-primary mb-2">The Truth You Missed</h3>
                <p className="leading-relaxed">
                  The real killer was <span className="text-primary font-display text-xl">
                    {state.correctSuspect?.name}
                  </span>. The ambitious understudy had grown tired of living in Victoria Steele's shadow. 
                  She saw her chance during the opening night intermission.
                </p>
                <p className="leading-relaxed">
                  With access to Victoria's dressing room and knowledge of her routine, she slipped 
                  cyanide into the champagne glass. The motive was clear: jealousy and ambition. 
                  The starring role was now hers, and without enough evidence, she walked free.
                </p>
                <p className="leading-relaxed text-muted-foreground italic">
                  Perhaps with different questions, you might have uncovered the truth...
                </p>
              </div>
            </div>
          </>
        )}

        <div className="pt-6 space-y-3">
          <Button
            size="lg"
            onClick={handlePlayAgain}
            className="w-full bg-primary hover:bg-primary/90 font-display text-xl noir-glow"
          >
            Start New Investigation
          </Button>
          <p className="text-xs text-muted-foreground">
            Thank you for playing The Detective
          </p>
        </div>
      </div>
    </div>
  );
};

export default Outcome;