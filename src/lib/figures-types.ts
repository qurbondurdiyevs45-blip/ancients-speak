export type FigureCategory =
  | "uzbek"
  | "science"
  | "philosophy"
  | "ruler"
  | "writer"
  | "artist"
  | "inventor"
  | "modern"
  | "explorer"
  | "spiritual";

export type Figure = {
  id: string;
  name: string;
  era: string;
  role: string;
  bio: string;
  category: FigureCategory;
  image?: string;
  voiceHint: string;
  featured?: boolean;
};
