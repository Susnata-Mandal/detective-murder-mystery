import { CaseData } from '@/types/game';

export const mysteryCase: CaseData = {
  title: "The Case of the Silent Starlet",
  description: "Hollywood actress Victoria Steele was found dead in her dressing room at the Majestic Theatre. The time of death was determined to be approximately 9:30 PM, during the intermission of opening night. She had been poisoned with cyanide, slipped into her champagne glass. Three suspects had access to her dressing room that evening. Your job is to interrogate each suspect and uncover the truth.",
  suspects: [
    {
      id: "suspect1",
      name: "Marcus Sterling",
      role: "Business Partner",
      bio: "Victoria's business partner and co-producer of the show. They had a complicated financial relationship.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      questionsRemaining: 3
    },
    {
      id: "suspect2",
      name: "Diana Frost",
      role: "Understudy",
      bio: "The ambitious understudy who would inherit Victoria's starring role. Known to be jealous of Victoria's success.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      questionsRemaining: 3
    },
    {
      id: "suspect3",
      name: "Vincent Kane",
      role: "Ex-Husband",
      bio: "Victoria's ex-husband, a theatrical director. Their divorce was messy and involved a bitter custody battle.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      questionsRemaining: 3
    }
  ],
  correctSuspect: "suspect2" // Diana Frost is the killer
};