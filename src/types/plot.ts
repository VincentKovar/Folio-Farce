export type MediumId =
  | 'book'
  | 'screenplay'
  | 'stage_play'
  | 'podcast'
  | 'sitcom'
  | 'sketch';

export type SubgenreId =
  | 'satire'
  | 'slapstick'
  | 'screwball'
  | 'dark_comedy'
  | 'mockumentary'
  | 'absurdist'
  | 'fish_out_of_water'
  | 'comedy_of_manners'
  | 'parody'
  | 'buddy_road';

export type GeneratorMode = 'ai' | 'deck';

export interface CharacterProfile {
  id: string;
  name: string;
  archetype: string;
  comedicFlaw: string;
  secretGoal: string;
  locked: boolean;
}

export interface StoryBeat {
  id: string;
  beatNumber: number;
  label: string;
  mediumCue: string;
  summary: string;
  comedicEscalation: string;
  locked: boolean;
}

export interface RunningGag {
  id: string;
  setup: string;
  payoff: string;
  locked: boolean;
}

export interface ComedyPlot {
  id: string;
  createdAt: string;
  title: string;
  titleLocked: boolean;
  logline: string;
  setting: string;
  settingLocked: boolean;
  comedicEngine: string;
  medium: MediumId;
  subgenre: SubgenreId;
  secondarySubgenre: SubgenreId | 'none';
  characterCount: number;
  premiseSeed: string;
  characters: CharacterProfile[];
  beats: StoryBeat[];
  runningGags: RunningGag[];
}

export interface PlotGenerationRequest {
  characterCount: number;
  medium: MediumId;
  subgenre: SubgenreId;
  secondarySubgenre: SubgenreId | 'none';
  premiseSeed: string;
  existingPlot?: ComedyPlot;
}

export interface RerollElementRequest {
  elementType: 'premise' | 'setting' | 'character' | 'beat' | 'gag';
  targetId?: string;
  plot: ComedyPlot;
}
