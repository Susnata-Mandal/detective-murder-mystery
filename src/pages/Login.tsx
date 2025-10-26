import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import detectiveDeskImage from '@/assets/detective-desk.jpg';

const Login = () => {
  const [detectiveName, setDetectiveName] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (detectiveName.trim()) {
      localStorage.setItem('detectiveName', detectiveName.trim());
      navigate('/case');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${detectiveDeskImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      
      {/* Content */}
      <div className="case-file max-w-2xl w-full p-12 relative z-10 animate-fade-in">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="font-display text-6xl text-primary mb-4 tracking-tight">
              The Detective
            </h1>
            <div className="stamp inline-block text-xl animate-stamp">
              Confidential Case File
            </div>
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
            A murder mystery awaits your keen eye. Enter your name to begin your investigation.
          </p>

          <div className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-accent text-sm uppercase tracking-wider block">
                Detective Name
              </label>
              <Input
                type="text"
                value={detectiveName}
                onChange={(e) => setDetectiveName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder="Enter your name..."
                className="text-center text-lg h-12 bg-input border-primary/30 focus:border-primary"
              />
            </div>

            <Button
              onClick={handleStart}
              disabled={!detectiveName.trim()}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display text-xl noir-glow"
            >
              Begin Investigation
            </Button>
          </div>

          <div className="pt-8 text-xs text-muted-foreground space-y-1">
            <p>⚠️ Warning: This case contains themes of murder and deception</p>
            <p>🕵️ Use your detective skills wisely - you have limited questions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;