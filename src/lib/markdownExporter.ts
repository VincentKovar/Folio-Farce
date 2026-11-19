import { getMediumById, getSubgenreById } from './comedyCatalog.ts';
import type { ComedyPlot } from '../types/plot.ts';

export function formatPlotAsMarkdown(plot: ComedyPlot): string {
  const mediumDef = getMediumById(plot.medium);
  const primarySub = getSubgenreById(plot.subgenre);
  const secondarySub =
    plot.secondarySubgenre !== 'none' ? getSubgenreById(plot.secondarySubgenre) : null;

  const subgenreText = secondarySub
    ? `${primarySub.name} × ${secondarySub.name}`
    : primarySub.name;

  const lines: string[] = [];

  lines.push(`# ${plot.title}`);
  lines.push('');
  lines.push(
    `**Medium:** ${mediumDef.name} | **Subgenre:** ${subgenreText} | **Cast Size:** ${plot.characterCount} ${
      plot.characterCount === 1 ? 'Character' : 'Characters'
    }`,
  );
  if (plot.premiseSeed.trim()) {
    lines.push(`**Premise Seed:** ${plot.premiseSeed.trim()}`);
  }
  lines.push('');
  lines.push(`> **Logline:** ${plot.logline}`);
  lines.push('');
  lines.push('## Setting & Comedic Engine');
  lines.push('');
  lines.push(`- **Primary Setting:** ${plot.setting}`);
  lines.push(`- **Comedic Engine:** ${plot.comedicEngine}`);
  lines.push(`- **Format Guidance:** ${mediumDef.formatNote}`);
  lines.push('');
  lines.push('## Cast & Character Flaws');
  lines.push('');

  plot.characters.forEach((char, idx) => {
    lines.push(`### ${idx + 1}. ${char.name} — *${char.archetype}*`);
    lines.push(`- **Comedic Flaw:** ${char.comedicFlaw}`);
    lines.push(`- **Secret Goal / Stakes:** ${char.secretGoal}`);
    lines.push(`- **Voice & Mannerisms:** _[Add signature catchphrases, rhythm, or physical tics]_`);
    lines.push('');
  });

  lines.push(`## ${mediumDef.outlineHeader}`);
  lines.push('');

  plot.beats.forEach((beat) => {
    lines.push(`### Beat ${beat.beatNumber}: ${beat.label}`);
    lines.push(`*${beat.mediumCue}*`);
    lines.push('');
    lines.push(`- **Action & Plot Turn:** ${beat.summary}`);
    lines.push(`- **Comedic Escalation:** ${beat.comedicEscalation}`);
    lines.push(`- **Drafting Notes:** _[Expand scene jokes, dialogue beats, or blocking here]_`);
    lines.push('');
  });

  lines.push('## Running Gags & Callbacks');
  lines.push('');
  plot.runningGags.forEach((gag, idx) => {
    lines.push(`${idx + 1}. **Setup:** ${gag.setup}`);
    lines.push(`   - **Payoff:** ${gag.payoff}`);
  });
  lines.push('');

  lines.push(`## ${mediumDef.draftScaffoldTitle}`);
  lines.push('');
  lines.push(`*Writer Prompt:* ${mediumDef.draftScaffoldHint}`);
  lines.push('');

  if (plot.medium === 'screenplay' || plot.medium === 'sitcom') {
    lines.push('```text');
    lines.push(`INT. ${plot.setting.toUpperCase().slice(0, 48)} - DAY`);
    lines.push('');
    lines.push(`[Opening action introducing ${plot.characters[0]?.name ?? 'PROTAGONIST'}...]`);
    lines.push('');
    lines.push(`                    ${(plot.characters[0]?.name ?? 'PROTAGONIST').toUpperCase()}`);
    lines.push('          [Opening line establishing the comedic delusion]');
    lines.push('```');
  } else if (plot.medium === 'stage_play') {
    lines.push('```text');
    lines.push('ACT I, SCENE 1');
    lines.push(`SETTING: ${plot.setting}`);
    lines.push('');
    lines.push(`AT RISE: ${plot.characters[0]?.name ?? 'CHARACTER 1'} enters holding a questionable prop.`);
    lines.push('```');
  } else if (plot.medium === 'podcast') {
    lines.push('```text');
    lines.push('[SFX: THEME STING FADES UNDER ROOM TONE]');
    lines.push('');
    lines.push(`${(plot.characters[0]?.name ?? 'HOST').toUpperCase()}: Welcome back—before anyone asks, yes, the fire department cleared us.`);
    lines.push('');
    lines.push('[SFX: DISTANT CRASH FOLLOWED BY POLITE COUGH]');
    lines.push('```');
  } else {
    lines.push('### Scene Draft Workspace');
    lines.push('');
    lines.push('- **Opening Line:** ');
    lines.push('- **First Escalation Beat:** ');
    lines.push('- **Button / Chapter Closer:** ');
  }

  lines.push('');
  return lines.join('\n');
}

export function slugifyTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'comedy-plot-outline'
  );
}
