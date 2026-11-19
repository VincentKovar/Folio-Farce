import type { MediumId, SubgenreId } from '../types/plot.ts';

export interface BeatTemplate {
  label: string;
  defaultCue: string;
  guidance: string;
}

export interface MediumDefinition {
  id: MediumId;
  name: string;
  shortName: string;
  formatNote: string;
  outlineHeader: string;
  draftScaffoldTitle: string;
  draftScaffoldHint: string;
  beatTemplates: BeatTemplate[];
}

export interface SubgenreDefinition {
  id: SubgenreId;
  name: string;
  coreMechanism: string;
  toneCue: string;
}

export const MEDIUMS: MediumDefinition[] = [
  {
    id: 'book',
    name: 'Novel / Book',
    shortName: 'Book',
    formatNote: 'Chapter-driven prose arc with internal monologue and escalating narrative irony.',
    outlineHeader: 'Part & Chapter Outline',
    draftScaffoldTitle: 'Chapter One Opening Notes',
    draftScaffoldHint: 'Establish the protagonist’s flawed worldview in the first three paragraphs before puncturing it.',
    beatTemplates: [
      {
        label: 'Chapter 1: Status Quo & Delusion',
        defaultCue: 'POV Setup · ~2,500 words',
        guidance: 'Show the cast operating under a confident, completely wrong assumption.',
      },
      {
        label: 'Chapters 2–4: The Inciting Absurdity',
        defaultCue: 'Inciting Incident · ~5,000 words',
        guidance: 'An external disruption forces an impossible promise or reckless cover-up.',
      },
      {
        label: 'Chapters 5–8: The Tangled Escalation',
        defaultCue: 'Act II Rise · ~8,000 words',
        guidance: 'Each character tries a self-serving shortcut that collides with the others.',
      },
      {
        label: 'Chapters 9–11: Midpoint Calamity',
        defaultCue: 'Midpoint Reversal · ~6,000 words',
        guidance: 'The original scheme appears to succeed—only to trigger a far worse obligation.',
      },
      {
        label: 'Chapters 12–14: Total Farce Collapse',
        defaultCue: 'All Is Lost · ~6,000 words',
        guidance: 'Every lie, prop, and secret agenda surfaces in the same room.',
      },
      {
        label: 'Chapter 15–16: Climax & Ironic Epilogue',
        defaultCue: 'Resolution · ~4,000 words',
        guidance: 'Characters survive by embracing the chaos, ending on a crisp final callback.',
      },
    ],
  },
  {
    id: 'screenplay',
    name: 'Feature Screenplay',
    shortName: 'Screenplay',
    formatNote: 'Visual storytelling with Cold Open, Act breaks, slugline cues, and set-piece payoffs.',
    outlineHeader: 'Feature Beat Sheet',
    draftScaffoldTitle: 'Cold Open & Slugline Starter',
    draftScaffoldHint: 'Open mid-action on a visual irony before cutting to the main title card.',
    beatTemplates: [
      {
        label: 'Cold Open: The Visual Hook',
        defaultCue: 'EXT./INT. · Pages 1–5',
        guidance: 'Drop the audience into a hilarious misunderstanding that defines the movie’s tone.',
      },
      {
        label: 'Act I: Catalyst & Bad Decision',
        defaultCue: 'INT. PRIMARY LOCATION · Pages 6–25',
        guidance: 'The inciting event forces the cast onto an ill-advised mission.',
      },
      {
        label: 'Act II-A: Fun & Games Escalation',
        defaultCue: 'MONTAGE / SEQUENCE · Pages 26–52',
        guidance: 'Deliver the promise of the premise through escalating comic set pieces.',
      },
      {
        label: 'Midpoint: The Public Disaster',
        defaultCue: 'EXT. SET PIECE · Pages 53–62',
        guidance: 'Stakes double when an authority figure, rival, or camera witnesses the mess.',
      },
      {
        label: 'Act II-B: The Mutual Betrayal',
        defaultCue: 'INT. LOW POINT · Pages 63–85',
        guidance: 'Partners turn on each other as every backup plan backfires simultaneously.',
      },
      {
        label: 'Act III: Climax & Credits Tag',
        defaultCue: 'FINAL SEQUENCE · Pages 86–105',
        guidance: 'A chaotic physical or verbal showdown resolves the core flaw with a killer final tag.',
      },
    ],
  },
  {
    id: 'stage_play',
    name: 'Stage Play',
    shortName: 'Stage Play',
    formatNote: 'Live theatrical pacing built around entrances, exits, props, and confined drawing-room tension.',
    outlineHeader: 'Two-Act Theatrical Breakdown',
    draftScaffoldTitle: 'Stage Set & Prop Checklist',
    draftScaffoldHint: 'Keep all action grounded in a single unified set with at least three practical doors or hiding spots.',
    beatTemplates: [
      {
        label: 'Act I, Scene 1: The Loaded Room',
        defaultCue: 'LIGHTS UP · Downstage Center',
        guidance: 'Establish the physical space, a crucial misplaced prop, and an imminent arrival.',
      },
      {
        label: 'Act I, Scene 2: Overlapping Entrances',
        defaultCue: 'STAGE RIGHT / LEFT DOORS',
        guidance: 'Two incompatible guests arrive at once, forcing absurd improvisation.',
      },
      {
        label: 'Act I Finale: The Curtain Cliffhanger',
        defaultCue: 'BLACKOUT ON REVEAL',
        guidance: 'A character says the exact wrong line just as the worst possible witness enters.',
      },
      {
        label: 'Act II, Scene 1: Alibis & Disguises',
        defaultCue: 'PROPS & QUICK CHANGES',
        guidance: 'Characters juggle fake identities and physical business to keep Act I secrets intact.',
      },
      {
        label: 'Act II, Scene 2: The Farce Collision',
        defaultCue: 'FULL ENSEMBLE ON STAGE',
        guidance: 'Rapid-fire dialogue and doorway chaos bring every subplot to a boil.',
      },
      {
        label: 'Act II Finale: Curtain Call Resolution',
        defaultCue: 'FINAL LINE & CURTAIN',
        guidance: 'A clever reversal restores order in an unexpected way, leaving one last laugh.',
      },
    ],
  },
  {
    id: 'podcast',
    name: 'Fiction Podcast',
    shortName: 'Podcast',
    formatNote: 'Audio-first comedy driven by voice contrast, foley gags, narrator unreliability, and sound cues.',
    outlineHeader: 'Audio Drama Episode Outline',
    draftScaffoldTitle: 'Soundscape & Foley Palette',
    draftScaffoldHint: 'Every visual joke must translate into distinct dialogue rhythm, room tone, or comedic sound effects.',
    beatTemplates: [
      {
        label: 'Cold Open: Mic Check & Hook',
        defaultCue: '[SFX: STATIC / TAPE CLICK] · 00:00–02:30',
        guidance: 'An unreliable host or frantic voicemail plunges listeners straight into the predicament.',
      },
      {
        label: 'Segment 1: The Dubious Investigation',
        defaultCue: '[AMBIENCE: LIVE FIELD RECORDING] · 02:30–08:00',
        guidance: 'Characters attempt a routine interview or task that goes audibly off the rails.',
      },
      {
        label: 'Mid-Roll Turn: The Hot-Mic Confession',
        defaultCue: '[SFX: MIC DROP / MUFFLED WHISPER] · 08:00–14:00',
        guidance: 'Someone forgets they are being recorded, exposing the real stakes.',
      },
      {
        label: 'Segment 2: Acoustic Escalation',
        defaultCue: '[SFX: OVERLAPPING VOICES / FOLEY CHAOS] · 14:00–21:00',
        guidance: 'Multiple calls, alarms, or background catastrophes collide in real time.',
      },
      {
        label: 'Climax & Post-Credits Voicemail',
        defaultCue: '[SFX: BEEP / OUTRO STING] · 21:00–26:00',
        guidance: 'Resolve the main problem on-air, followed by a deadpan post-credits stinger.',
      },
    ],
  },
  {
    id: 'sitcom',
    name: 'TV Sitcom Pilot',
    shortName: 'Sitcom',
    formatNote: 'Half-hour A-plot / B-plot engine designed for character chemistry and recurring series potential.',
    outlineHeader: 'Half-Hour Pilot Beat Sheet',
    draftScaffoldTitle: 'Series Engine & Runner Notes',
    draftScaffoldHint: 'Make sure the characters’ flaws trap them together again by the end of the episode.',
    beatTemplates: [
      {
        label: 'Cold Open: Character Thesis Joke',
        defaultCue: 'TEASER · 2 mins',
        guidance: 'A punchy 2-minute runner showcasing the ensemble’s core comedic dynamic.',
      },
      {
        label: 'Act I: A-Plot Goal & B-Plot Petty Dispute',
        defaultCue: 'ACT ONE · 7 mins',
        guidance: 'Launch the main episode problem alongside an absurdly petty secondary conflict.',
      },
      {
        label: 'Act II: Raising the Petty Stakes',
        defaultCue: 'ACT TWO · 9 mins',
        guidance: 'Both A-plot and B-plot spiral because nobody will apologize or back down.',
      },
      {
        label: 'Act III: Convergence & Status Quo Reset',
        defaultCue: 'ACT THREE · 6 mins',
        guidance: 'The A-plot and B-plot collide in public, forcing a pyrrhic victory.',
      },
      {
        label: 'End Tag: Final Runner Callback',
        defaultCue: 'TAG · 1 min',
        guidance: 'A quick comedic button proving the characters learned absolutely nothing.',
      },
    ],
  },
  {
    id: 'sketch',
    name: 'Short Sketch',
    shortName: 'Sketch',
    formatNote: 'Tight 3–5 page premise built around one "Unusual Thing" heightened three times to a blackout.',
    outlineHeader: 'Game-of-the-Scene Sketch Blueprint',
    draftScaffoldTitle: 'The "Game" Statement',
    draftScaffoldHint: 'Keep the base reality grounded so the single unusual behavior pops immediately.',
    beatTemplates: [
      {
        label: 'Base Reality Setup',
        defaultCue: '0:00–0:45 · Establish Normalcy',
        guidance: 'Set a recognizable everyday scenario with clear stakes and straight-man framing.',
      },
      {
        label: 'The Unusual Thing (Initiation)',
        defaultCue: '0:45–1:30 · First Laugh',
        guidance: 'Introduce the bizarre rule, flaw, or premise that breaks the normal scene.',
      },
      {
        label: 'Heightening Beat 1: Explore & Double Down',
        defaultCue: '1:30–2:30 · Raise Stakes',
        guidance: 'Apply the same absurd logic to a bigger or more inappropriate detail.',
      },
      {
        label: 'Heightening Beat 2: Full Commitment',
        defaultCue: '2:30–3:30 · Peak Absurdity',
        guidance: 'Flip expectations or pull an unwitting bystander completely into the madness.',
      },
      {
        label: 'Blackout Button Line',
        defaultCue: '3:30–4:00 · Snap Blackout',
        guidance: 'End on the sharpest punchline or visual reversal—never fade out politely.',
      },
    ],
  },
];

export const SUBGENRES: SubgenreDefinition[] = [
  {
    id: 'satire',
    name: 'Satire',
    coreMechanism: 'Exaggerates institutional hypocrisy, bureaucracy, tech/corporate jargon, or social prestige until it collapses under its own logic.',
    toneCue: 'Sharp, observant, bitingly earnest characters defending ridiculous systems.',
  },
  {
    id: 'slapstick',
    name: 'Slapstick & Physical Farce',
    coreMechanism: 'Escalating physical mishaps, Rube Goldberg chain reactions, fragile props, and frantic attempts to look dignified while everything breaks.',
    toneCue: 'Kinetic, breathless, precision-timed physical escalation.',
  },
  {
    id: 'screwball',
    name: 'Screwball Comedy',
    coreMechanism: 'Rapid-fire verbal sparring, mismatched personalities forced into high-stakes cooperation, and romantic or professional chaos.',
    toneCue: 'Witty, fast-talking, electric banter with stubborn rivals.',
  },
  {
    id: 'dark_comedy',
    name: 'Dark / Black Comedy',
    coreMechanism: 'Treats grim, taboo, or life-or-death predicaments with mundane bureaucratic politeness and petty interpersonal grievances.',
    toneCue: 'Deadpan, mordant, delightfully inappropriate calm in crisis.',
  },
  {
    id: 'mockumentary',
    name: 'Mockumentary',
    coreMechanism: 'Confessional talking-head interviews that instantly contradict the disastrous reality happening on camera.',
    toneCue: 'Awkward pauses, unearned confidence, painful self-delusion.',
  },
  {
    id: 'absurdist',
    name: 'Absurdist / Surreal',
    coreMechanism: 'Accepts a completely impossible or nonsensical rule as mundane everyday policy and follows its consequences dead seriously.',
    toneCue: 'Deadpan surrealism, strange bureaucracy, whimsical non-sequiturs.',
  },
  {
    id: 'fish_out_of_water',
    name: 'Fish-Out-of-Water',
    coreMechanism: 'Drops an ultra-specialized or wildly sheltered character into a subculture whose unspoken rules they constantly misread.',
    toneCue: 'Culture clash, earnest overcorrection, mounting social panic.',
  },
  {
    id: 'comedy_of_manners',
    name: 'Comedy of Manners',
    coreMechanism: 'Weaponized politeness, status anxiety, coded insults, and desperate attempts to save face during social gatherings.',
    toneCue: 'Wry, articulate, passive-aggressive etiquette warfare.',
  },
  {
    id: 'parody',
    name: 'Genre Parody / Spoof',
    coreMechanism: 'Takes familiar dramatic tropes (heists, noir, sci-fi, prestige drama) and literalizes every cliché until the genre breaks.',
    toneCue: 'Self-aware, over-dramatic delivery punctured by mundane reality.',
  },
  {
    id: 'buddy_road',
    name: 'Buddy / Road Chaos',
    coreMechanism: 'Traps two or more incompatible allies on an urgent journey where every pit stop creates a fresh detour.',
    toneCue: 'Friction-filled camaraderie, claustrophobic bickering, reluctant loyalty.',
  },
];

export const RANDOM_PREMISE_SEEDS: string[] = [
  'A neighborhood HOA board attempts to cover up a sinkhole before a luxury magazine photoshoot.',
  'An underfunded museum hires a washed-up magician to fake a priceless artifact’s recovery.',
  'Two rival wedding planners accidentally book the exact same haunted lighthouse on the same afternoon.',
  'A tech startup launches an AI toaster that immediately becomes the office’s most respected manager.',
  'A small-town theater troupe tries to stage a serious historical tragedy despite losing every prop.',
  'A true-crime podcaster realizes the boring municipal clerk they hired is actually the mastermind.',
  'A prestigious culinary retreat runs out of food on Day 1 and tries to pass off foraging as avant-garde.',
  'An estranged family must assemble an heirloom flat-pack gazebo in under three hours to claim an inheritance.',
  'A medieval monastery enters a regional bake-off to pay off an overdue bell-tower tax.',
  'A disgraced astronaut is assigned to run orientation for corporate wellness influencers in a fake Mars dome.',
];

export function getMediumById(id: MediumId): MediumDefinition {
  return MEDIUMS.find((m) => m.id === id) ?? MEDIUMS[0];
}

export function getSubgenreById(id: SubgenreId): SubgenreDefinition {
  return SUBGENRES.find((s) => s.id === id) ?? SUBGENRES[0];
}
