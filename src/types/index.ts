export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  guideIcon?: 'plane' | 'leaf' | 'feather' | 'sparkles' | 'custom';
  guideImage?: string;
}

export interface HeroConfig {
  title: string;
  groomName: string;
  brideName: string;
  date: string;
  backgroundImage: string;
}

export interface QuoteConfig {
  text: string;
  source: string;
}

export interface ParentConfig {
  fullName: string;
  father: string;
  mother: string;
  instagram: string;
  photo: string;
}

export interface EventConfig {
  id: string;
  title: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  mapLink: string;
}

export interface LoveStoryConfig {
  year: string;
  title: string;
  description: string;
}

export interface BankConfig {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface ContentData {
  theme: ThemeConfig;
  hero: HeroConfig;
  quote: QuoteConfig;
  couple: {
    groom: ParentConfig;
    bride: ParentConfig;
  };
  events: EventConfig[];
  gallery: string[];
  loveStory: LoveStoryConfig[];
  banking: BankConfig[];
  music: string;
}
