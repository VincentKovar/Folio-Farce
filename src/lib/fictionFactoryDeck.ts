import { getMediumById, getSubgenreById } from './comedyCatalog.ts';
import type {
  CharacterProfile,
  ComedyPlot,
  PlotGenerationRequest,
  RerollElementRequest,
  RunningGag,
  StoryBeat,
  SubgenreId,
} from '../types/plot.ts';

function pick<T>(items: T[], exclude?: T): T {
  const pool = exclude && items.length > 1 ? items.filter((i) => i !== exclude) : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const FIRST_NAMES = [
  'Barnaby', 'Clover', 'Desmond', 'Margo', 'Hector', 'Tamsin', 'Rupert', 'Nadine',
  'Gideon', 'Pippa', 'Soren', 'Beatrice', 'Lionel', 'Zelda', 'Wally', 'Priya',
  'Otis', 'Yolanda', 'Quentin', 'Clementine',
];

const LAST_NAMES = [
  'Pimblett', 'Vance', 'Crump', 'Sterling', 'Bramble', 'Halloway', 'Quirk', 'Kowalski',
  'Davenport', 'Merriweather', 'Spindle', 'Figg', 'Mercer', 'Crumpton', 'Gallagher', 'Oakhurst',
];

const ARCHETYPES = [
  'Overconfident Middle Manager',
  'Neurotic Perfectionist',
  'Disgraced Former Prodigy',
  'Cheerfully Clueless Heir',
  'Rule-Obsessed Bureaucrat',
  'Exhausted Straight-Man Fixer',
  'Self-Proclaimed Visionary',
  'Passive-Aggressive Rival',
  'Conspiracy-Minded Intern',
  'Dramatic Has-Been Performer',
];

const COMEDIC_FLAWS = [
  'Cannot admit not knowing what common acronyms mean',
  'Treats every minor inconvenience like an international diplomatic crisis',
  'Insists on keeping a color-coded binder for illegal shortcuts',
  'Compulsively overshares humiliating confessions whenever nervous',
  'Believes every stranger is secretly evaluating them for a promotion',
  'Physically incapable of whispering or keeping a poker face',
  'Refuses to read instructions on principle, even during emergencies',
  'Always tries to pivot serious arguments into personal branding tips',
  'Takes metaphorical idioms completely literally under pressure',
  'Holds decade-long grudges over trivial seating arrangements',
];

const SECRET_GOALS = [
  'Needs to retrieve an incriminating receipt before midnight',
  'Secretly auditioning to replace their boss without anyone noticing',
  'Trying to impress an estranged ex who happens to be on the committee',
  'Hoping to offload a catastrophically overpriced vanity purchase',
  'Desperate to get home in time for a niche competitive trivia league',
  'Trying to hide that they accidentally sold the venue’s prize possession',
  'Secretly writing a tell-all exposé on everyone else in the room',
  'Needs three witnesses to sign an absurdly specific insurance waiver',
];

const SETTINGS: Record<SubgenreId, string[]> = {
  satire: [
    'A glass-walled wellness startup headquarters during a mandatory "radical transparency" retreat',
    'The VIP lounge of an ultra-exclusive municipal arts grant awards banquet',
    'A failing heritage university rebranding itself as a "disruptive lifestyle campus"',
  ],
  slapstick: [
    'A freshly waxed historic hotel lobby with three swinging kitchen doors and a priceless chandelier',
    'A cramped artisanal bakery hosting a live local morning TV broadcast',
    'A rickety yacht anchored three yards from a crowded yacht-club dock',
  ],
  screwball: [
    'An overnight sleeper train trapped behind a herd of prize-winning goats',
    'A chaotic penthouse auction house thirty minutes before a billionaire’s estate sale',
    'A rain-soaked country manor turned last-minute wedding venue',
  ],
  dark_comedy: [
    'An overly cheerful lakeside funeral home running a two-for-one pre-planning seminar',
    'A remote corporate team-building cabin with zero cell signal and one malfunctioning espresso machine',
    'An upscale condo board meeting where the building superintendent just vanished',
  ],
  mockumentary: [
    'A regional competitive miniature-golf federation preparing for its first televised open',
    'A mid-tier public library branch filming a promotional documentary to avoid budget cuts',
    'An underfunded aquarium trying to convince investors its senior tortoise is a psychic',
  ],
  absurdist: [
    'The Department of Minor Unexplained Phenomena on the fourth floor of City Hall',
    'A polite suburban cul-de-sac where gravity mysteriously tilts east on Tuesdays',
    'A 24-hour laundromat that secretly serves as an embassy for a fictional micro-nation',
  ],
  fish_out_of_water: [
    'An elite ultra-marathon camp infiltrated by a lifelong luxury sofa critic',
    'A fiercely traditional highland sheepdog trial attended by a Manhattan PR fixer',
    'An off-grid medieval reenactment village welcoming an oblivious Silicon Valley auditor',
  ],
  comedy_of_manners: [
    'A silver-service charity brunch on a terrace overlooking a neighbor’s louder, better party',
    'An Ivy League alumni book club meeting where everyone lied about reading the novel',
    'A tightly curated gallery opening where the centerpiece sculpture is missing',
  ],
  parody: [
    'A gritty noir detective agency located directly above a cheerful smoothie franchise',
    'A budget deep-space cargo bridge where the ship AI only speaks in passive-aggressive HR memos',
    'An over-the-top high-stakes casino vault guarded by two bored temps',
  ],
  buddy_road: [
    'A rented 1998 minivan hauling an uncooperative mascot costume across three state lines',
    'A cross-country detour along the world’s worst-reviewed roadside tourist traps',
    'A narrow canal barge piloted by two ex-business partners who still share a bank account',
  ],
};

const TITLE_PATTERNS: Array<(adj: string, noun: string) => string> = [
  (adj, noun) => `The ${adj} ${noun}`,
  (adj, noun) => `No Good ${noun}`,
  (adj, noun) => `Strictly ${adj}`,
  (adj, noun) => `A Very ${adj} Arrangement`,
  (adj, noun) => `The ${noun} Incident`,
  (adj, noun) => `Too Many ${noun}s`,
  (adj, noun) => `Operation ${adj} ${noun}`,
];

const TITLE_ADJECTIVES = [
  'Polite', 'Unfortunate', 'Certified', 'Desperate', 'Mandatory',
  'Accidental', 'Questionable', 'Bespoke', 'Suspicious', 'Deluxe',
];

const TITLE_NOUNS = [
  'Alibi', 'Gala', 'Committee', 'Detour', 'Fiasco',
  'Heirloom', 'Audition', 'Waiver', 'Rehearsal', 'Veto',
];

const GAGS: Array<{ setup: string; payoff: string }> = [
  {
    setup: 'A character insists on pronouncing an ordinary French loanword with wildly inconsistent confidence.',
    payoff: 'During the climax, the rival uses the exact mispronunciation as the secret security passphrase.',
  },
  {
    setup: 'A suspiciously heavy velvet-draped cart is wheeled into every scene with zero explanation.',
    payoff: 'It tips over at the worst possible moment, revealing dozens of unpaid parking boots.',
  },
  {
    setup: 'Someone keeps receiving automated text updates from an unrelated slow-cooker competition.',
    payoff: 'The final tie-breaking clue arrives disguised as a chili recipe notification.',
  },
  {
    setup: 'An overly formal laminated name badge keeps getting swapped between characters.',
    payoff: 'Security escorts the actual VIP out because they ended up wearing the intern badge.',
  },
  {
    setup: 'A character promises "nobody will notice" before making a cosmetic fix that is painfully loud or bright.',
    payoff: 'The entire town spots it from three blocks away during the final reveal.',
  },
];

function buildCharacter(index: number, usedNames: Set<string>): CharacterProfile {
  let fullName = '';
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    if (!usedNames.has(candidate)) {
      fullName = candidate;
      usedNames.add(candidate);
      break;
    }
  }
  if (!fullName) {
    fullName = `Character ${index + 1}`;
  }

  return {
    id: makeId('char'),
    name: fullName,
    archetype: pick(ARCHETYPES),
    comedicFlaw: pick(COMEDIC_FLAWS),
    secretGoal: pick(SECRET_GOALS),
    locked: false,
  };
}

function buildBeatContent(
  beatIndex: number,
  totalBeats: number,
  label: string,
  guidance: string,
  characters: CharacterProfile[],
  setting: string,
  subgenreName: string,
  seedText: string,
): { summary: string; comedicEscalation: string } {
  const lead = characters[0];
  const foil = characters[1] ?? characters[0];
  const wildcard = characters[characters.length - 1] ?? characters[0];
  const seedClause = seedText.trim()
    ? ` Grounded in the seed ("${seedText.trim()}"),`
    : '';

  if (beatIndex === 0) {
    return {
      summary: `${lead.name} (${lead.archetype}) tries to keep order inside ${setting.toLowerCase()}, unaware that ${foil.name} is quietly pursuing a conflicting agenda.${seedClause} ${guidance}`,
      comedicEscalation: `${lead.name}'s signature flaw—"${lead.comedicFlaw.toLowerCase()}"—immediately turns a routine moment into a ${subgenreName.toLowerCase()} disaster.`,
    };
  }

  if (beatIndex === 1) {
    return {
      summary: `When the core complication hits, ${lead.name} drags ${characters.length > 1 ? `${foil.name} and the rest of the cast` : 'themselves'} into a wildly improvised cover story to protect "${lead.secretGoal.toLowerCase()}."`,
      comedicEscalation: `Instead of solving the problem, their first lie forces ${wildcard.name} to adopt an even flimsier fake expertise.`,
    };
  }

  if (beatIndex === totalBeats - 1) {
    return {
      summary: `Everything collides in front of the worst possible audience. Rather than fleeing, ${lead.name} and ${foil.name} weaponize their shared incompetence to flip the outcome and seal a chaotic truce.`,
      comedicEscalation: `Final button: every earlier excuse comes true in reverse, rewarding the cast for all the wrong reasons.`,
    };
  }

  if (beatIndex === Math.floor(totalBeats / 2)) {
    return {
      summary: `Midpoint twist: ${foil.name} thinks they have secured the win, only for ${wildcard.name}'s secret goal ("${wildcard.secretGoal.toLowerCase()}") to detonate the plan mid-celebration.`,
      comedicEscalation: `Stakes double as an outsider takes notes, forcing ${lead.name} to double down with zero preparation.`,
    };
  }

  return {
    summary: `Attempting damage control, ${characters[beatIndex % characters.length].name} launches a side scheme that clashes head-on with ${foil.name}'s cover story. ${guidance}`,
    comedicEscalation: `The misunderstanding compounds across ${subgenreName.toLowerCase()} beats as everyone answers different questions in the same conversation.`,
  };
}

export function generateDeckPlot(req: PlotGenerationRequest): ComedyPlot {
  const existing = req.existingPlot;
  const mediumDef = getMediumById(req.medium);
  const primarySub = getSubgenreById(req.subgenre);
  const secondarySub = req.secondarySubgenre !== 'none' ? getSubgenreById(req.secondarySubgenre) : null;

  const subgenreLabel = secondarySub
    ? `${primarySub.name} + ${secondarySub.name}`
    : primarySub.name;

  // Title & Premise
  const titleLocked = existing?.titleLocked ?? false;
  const title = titleLocked && existing
    ? existing.title
    : pick(TITLE_PATTERNS)(pick(TITLE_ADJECTIVES), pick(TITLE_NOUNS));

  // Setting
  const settingLocked = existing?.settingLocked ?? false;
  const setting = settingLocked && existing
    ? existing.setting
    : pick(SETTINGS[req.subgenre] ?? SETTINGS.satire);

  // Characters (preserve locked characters up to requested count)
  const usedNames = new Set<string>();
  const characters: CharacterProfile[] = [];
  for (let i = 0; i < req.characterCount; i++) {
    const prevChar = existing?.characters[i];
    if (prevChar?.locked) {
      usedNames.add(prevChar.name);
      characters.push(prevChar);
    } else {
      characters.push(buildCharacter(i, usedNames));
    }
  }

  const lead = characters[0];
  const foil = characters[1];
  const seedPart = req.premiseSeed.trim()
    ? `Sparked by "${req.premiseSeed.trim()}", `
    : '';

  const logline = titleLocked && existing
    ? existing.logline
    : `${seedPart}${lead.name}, an ${lead.archetype.toLowerCase()}, collides with ${
        foil ? `${foil.name} (${foil.archetype.toLowerCase()})` : 'their own terrible instincts'
      } inside ${setting.toLowerCase()}—turning a small vanity crisis into a full-blown ${subgenreLabel.toLowerCase()} catastrophe.`;

  const comedicEngine = titleLocked && existing
    ? existing.comedicEngine
    : `${primarySub.coreMechanism}${secondarySub ? ` Blended with ${secondarySub.name}: ${secondarySub.toneCue}` : ''}`;

  // Beats (preserve locked beats matching index, adapt to medium)
  const beats: StoryBeat[] = mediumDef.beatTemplates.map((tpl, idx) => {
    const prevBeat = existing?.beats[idx];
    if (prevBeat?.locked && existing?.medium === req.medium) {
      return prevBeat;
    }
    const generated = buildBeatContent(
      idx,
      mediumDef.beatTemplates.length,
      tpl.label,
      tpl.guidance,
      characters,
      setting,
      subgenreLabel,
      req.premiseSeed,
    );
    return {
      id: makeId('beat'),
      beatNumber: idx + 1,
      label: tpl.label,
      mediumCue: tpl.defaultCue,
      summary: generated.summary,
      comedicEscalation: generated.comedicEscalation,
      locked: false,
    };
  });

  // Running Gags (3 slots)
  const usedGagSetups = new Set<string>();
  const runningGags: RunningGag[] = [0, 1, 2].map((idx) => {
    const prevGag = existing?.runningGags[idx];
    if (prevGag?.locked) {
      usedGagSetups.add(prevGag.setup);
      return prevGag;
    }
    const pool = GAGS.filter((g) => !usedGagSetups.has(g.setup));
    const chosen = pick(pool.length > 0 ? pool : GAGS);
    usedGagSetups.add(chosen.setup);
    return {
      id: makeId('gag'),
      setup: chosen.setup,
      payoff: chosen.payoff,
      locked: false,
    };
  });

  return {
    id: existing?.id ?? makeId('plot'),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    title,
    titleLocked,
    logline,
    setting,
    settingLocked,
    comedicEngine,
    medium: req.medium,
    subgenre: req.subgenre,
    secondarySubgenre: req.secondarySubgenre,
    characterCount: req.characterCount,
    premiseSeed: req.premiseSeed,
    characters,
    beats,
    runningGags,
  };
}

export function rerollDeckElement(req: RerollElementRequest): ComedyPlot {
  const { plot, elementType, targetId } = req;
  const primarySub = getSubgenreById(plot.subgenre);
  const mediumDef = getMediumById(plot.medium);

  if (elementType === 'premise') {
    const lead = plot.characters[0];
    const foil = plot.characters[1];
    const newTitle = pick(TITLE_PATTERNS, undefined)(pick(TITLE_ADJECTIVES), pick(TITLE_NOUNS));
    const seedPart = plot.premiseSeed.trim() ? `Centered on "${plot.premiseSeed.trim()}", ` : '';
    return {
      ...plot,
      title: newTitle,
      logline: `${seedPart}${lead.name} (${lead.archetype.toLowerCase()}) and ${
        foil ? foil.name : 'an escalating series of bad choices'
      } spiral out of control inside ${plot.setting.toLowerCase()}.`,
    };
  }

  if (elementType === 'setting') {
    const newSetting = pick(SETTINGS[plot.subgenre] ?? SETTINGS.satire, plot.setting);
    return { ...plot, setting: newSetting };
  }

  if (elementType === 'character') {
    const usedNames = new Set(plot.characters.map((c) => c.name));
    const nextChars = plot.characters.map((c, idx) =>
      c.id === targetId ? { ...buildCharacter(idx, usedNames), id: c.id, locked: c.locked } : c,
    );
    return { ...plot, characters: nextChars };
  }

  if (elementType === 'beat') {
    const nextBeats = plot.beats.map((b, idx) => {
      if (b.id !== targetId) return b;
      const tpl = mediumDef.beatTemplates[idx] ?? mediumDef.beatTemplates[0];
      const rotatedChars = [...plot.characters.slice(1), plot.characters[0]].filter(Boolean);
      const generated = buildBeatContent(
        idx,
        plot.beats.length,
        tpl.label,
        tpl.guidance,
        rotatedChars.length > 0 ? rotatedChars : plot.characters,
        plot.setting,
        primarySub.name,
        plot.premiseSeed,
      );
      return {
        ...b,
        summary: generated.summary,
        comedicEscalation: generated.comedicEscalation,
      };
    });
    return { ...plot, beats: nextBeats };
  }

  if (elementType === 'gag') {
    const usedSetups = new Set(plot.runningGags.map((g) => g.setup));
    const nextGags = plot.runningGags.map((g) => {
      if (g.id !== targetId) return g;
      const pool = GAGS.filter((candidate) => !usedSetups.has(candidate.setup));
      const chosen = pick(pool.length > 0 ? pool : GAGS);
      return {
        ...g,
        setup: chosen.setup,
        payoff: chosen.payoff,
      };
    });
    return { ...plot, runningGags: nextGags };
  }

  return plot;
}
