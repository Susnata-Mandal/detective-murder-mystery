import { CaseData } from '@/types/game';
import rajSharmaImg from '@/assets/raj-sharma.jpg';
import sitaSharmaImg from '@/assets/sita-sharma.jpg';
import vikSharmaImg from '@/assets/vik-sharma.jpg';
import mohanSharmaImg from '@/assets/mohan-sharma.jpg';

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

export const househelpCase: CaseData = {
  title: "The Househelp Murderer",
  description: "Wealthy businessman Ashwin Kapoor was found dead in his study at midnight, with signs of struggle and a mysterious journal missing from his desk. The cursed artifact he possessed has vanished. Four individuals with deep connections to the victim remain in the mansion. Each harbors dark secrets and powerful motives. Uncover who struck the fatal blow.",
  suspects: [
    {
      id: "suspect1",
      name: "Anjali Sinha",
      role: "Volatile Fiancée",
      bio: "Set to inherit a fortune but lived in constant fear. Desperate to escape Ashwin's psychological control and the dark artifact he possessed.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      questionsRemaining: 3
    },
    {
      id: "suspect2",
      name: "Rohan Varma",
      role: "Struggling Artist",
      bio: "Driven by vengeance after Ashwin ruined his career by stealing his art. Believes a cursed artwork is responsible for his misfortunes.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      questionsRemaining: 3
    },
    {
      id: "suspect3",
      name: "Arjun Mehra",
      role: "Duplicitous Partner",
      bio: "Business partner on the brink of ruin. Ashwin was about to expose his massive financial fraud and ties to a secret society.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      questionsRemaining: 3
    },
    {
      id: "suspect4",
      name: "Priya Deshpande",
      role: "Secretive Housekeeper",
      bio: "Has intimate knowledge of the house and its secrets. Years of blackmail by Ashwin over a tragic secret kept her enslaved.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      questionsRemaining: 3
    }
  ],
  correctSuspect: "suspect4" // Priya Deshpande is the killer
};

export const shivpurCase: CaseData = {
  title: "The Shivpur Mystery",
  description: "It was a humid morning in Shivpur when seven members of the same household were found dead in a ritual-like arrangement. The investigation revealed a darker manipulation beneath the surface. Four central figures emerge as key to understanding this tragedy: the deceased patriarch whose authority still haunts the family, the matriarch who sensed danger, the younger son who claimed to channel messages, and the resentful brother with financial motives.",
  suspects: [
    {
      id: "suspect1",
      name: "Raj Sharma",
      role: "Deceased Patriarch",
      bio: "The unquestioned head of household before his death years ago. His rules and expectations continued to shape the family even after death, creating a psychological framework of control.",
      image: rajSharmaImg,
      questionsRemaining: 3
    },
    {
      id: "suspect2",
      name: "Sita Sharma",
      role: "Matriarch",
      bio: "The elder woman who upheld family traditions. Among the deceased, she had expressed unease about recent intense practices but her faith in family order kept her from resisting.",
      image: sitaSharmaImg,
      questionsRemaining: 3
    },
    {
      id: "suspect3",
      name: "Vik Sharma",
      role: "Younger Son",
      bio: "Took on family leadership after Raj's death. Claims to receive messages from his late father, organizing increasingly intense rituals he insisted would 'protect' the family.",
      image: vikSharmaImg,
      questionsRemaining: 3
    },
    {
      id: "suspect4",
      name: "Mohan Sharma",
      role: "Resentful Brother",
      bio: "Raj's brother who resented the family. Recent financial troubles and a life insurance policy gave him motive. Admitted to slipping mild poison into fruit, but forensics show it was sub-lethal.",
      image: mohanSharmaImg,
      questionsRemaining: 3
    }
  ],
  correctSuspect: "suspect3" // Vik Sharma is the killer
};

export const allCases = [mysteryCase, househelpCase, shivpurCase];