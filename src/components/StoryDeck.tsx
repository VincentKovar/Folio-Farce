import { Check, Lock, Pencil, RefreshCw, Unlock } from 'lucide-react';
import { useState } from 'react';
import { getMediumById, getSubgenreById } from '../lib/comedyCatalog.ts';
import type { CharacterProfile, ComedyPlot, RunningGag, StoryBeat } from '../types/plot.ts';

interface StoryDeckProps {
  plot: ComedyPlot;
  rerollingTarget: string | null;
  onUpdatePlot: (updated: ComedyPlot) => void;
  onRerollElement: (
    elementType: 'premise' | 'setting' | 'character' | 'beat' | 'gag',
    targetId?: string,
  ) => void;
}

export function StoryDeck({
  plot,
  rerollingTarget,
  onUpdatePlot,
  onRerollElement,
}: StoryDeckProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const mediumDef = getMediumById(plot.medium);
  const primarySub = getSubgenreById(plot.subgenre);
  const secondarySub =
    plot.secondarySubgenre !== 'none' ? getSubgenreById(plot.secondarySubgenre) : null;

  const toggleTitleLock = () =>
    onUpdatePlot({ ...plot, titleLocked: !plot.titleLocked });

  const toggleSettingLock = () =>
    onUpdatePlot({ ...plot, settingLocked: !plot.settingLocked });

  const toggleCharacterLock = (id: string) => {
    onUpdatePlot({
      ...plot,
      characters: plot.characters.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c)),
    });
  };

  const updateCharacter = (id: string, patch: Partial<CharacterProfile>) => {
    onUpdatePlot({
      ...plot,
      characters: plot.characters.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  };

  const toggleBeatLock = (id: string) => {
    onUpdatePlot({
      ...plot,
      beats: plot.beats.map((b) => (b.id === id ? { ...b, locked: !b.locked } : b)),
    });
  };

  const updateBeat = (id: string, patch: Partial<StoryBeat>) => {
    onUpdatePlot({
      ...plot,
      beats: plot.beats.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    });
  };

  const toggleGagLock = (id: string) => {
    onUpdatePlot({
      ...plot,
      runningGags: plot.runningGags.map((g) => (g.id === id ? { ...g, locked: !g.locked } : g)),
    });
  };

  const updateGag = (id: string, patch: Partial<RunningGag>) => {
    onUpdatePlot({
      ...plot,
      runningGags: plot.runningGags.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    });
  };

  return (
    <section id="story-deck" className="py-10 space-y-10 border-b border-[#E5E2DC]">
      {/* Premise & Setting Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Title & Logline Card */}
        <article
          className={`lg:col-span-7 bg-white border rounded-xl p-6 flex flex-col justify-between transition-colors ${
            plot.titleLocked ? 'border-[#1D4ED8]' : 'border-[#E5E2DC]'
          }`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                <span>{mediumDef.name}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {primarySub.name}
                  {secondarySub ? ` × ${secondarySub.name}` : ''}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {plot.characterCount} {plot.characterCount === 1 ? 'Character' : 'Characters'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === 'premise' ? null : 'premise')}
                  className="h-8 px-2.5 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] rounded-md inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  {editingId === 'premise' ? (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Done</span>
                    </>
                  ) : (
                    <>
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Edit</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleTitleLock}
                  aria-pressed={plot.titleLocked}
                  className={`h-8 px-2.5 text-xs font-medium rounded-md inline-flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
                    plot.titleLocked
                      ? 'bg-[#1D4ED8]/10 text-[#1D4ED8]'
                      : 'text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {plot.titleLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Lock</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={plot.titleLocked || rerollingTarget === 'premise'}
                  onClick={() => onRerollElement('premise')}
                  className="h-8 px-2.5 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] disabled:opacity-40 rounded-md inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${rerollingTarget === 'premise' ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span>Reroll</span>
                </button>
              </div>
            </div>

            {editingId === 'premise' ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={plot.title}
                  onChange={(e) => onUpdatePlot({ ...plot, title: e.target.value })}
                  className="w-full px-3 py-2 font-editorial text-2xl font-semibold bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg"
                />
                <textarea
                  rows={3}
                  value={plot.logline}
                  onChange={(e) => onUpdatePlot({ ...plot, logline: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg leading-relaxed"
                />
              </div>
            ) : (
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#161615] text-balance">
                  {plot.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[#383633]">
                  {plot.logline}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E2DC] text-xs text-[#57534E] leading-relaxed">
            <span className="font-semibold text-[#161615]">Comedic Engine: </span>
            {plot.comedicEngine}
          </div>
        </article>

        {/* Setting Card */}
        <article
          className={`lg:col-span-5 bg-white border rounded-xl p-6 flex flex-col justify-between transition-colors ${
            plot.settingLocked ? 'border-[#1D4ED8]' : 'border-[#E5E2DC]'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#57534E]">
                Primary Setting &amp; Arena
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditingId(editingId === 'setting' ? null : 'setting')}
                  className="h-8 px-2.5 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] rounded-md inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  {editingId === 'setting' ? (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Done</span>
                    </>
                  ) : (
                    <>
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Edit</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleSettingLock}
                  aria-pressed={plot.settingLocked}
                  className={`h-8 px-2.5 text-xs font-medium rounded-md inline-flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
                    plot.settingLocked
                      ? 'bg-[#1D4ED8]/10 text-[#1D4ED8]'
                      : 'text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {plot.settingLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Lock</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={plot.settingLocked || rerollingTarget === 'setting'}
                  onClick={() => onRerollElement('setting')}
                  className="h-8 px-2.5 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] disabled:opacity-40 rounded-md inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${rerollingTarget === 'setting' ? 'animate-spin' : ''}`}
                    aria-hidden="true"
                  />
                  <span>Reroll</span>
                </button>
              </div>
            </div>

            {editingId === 'setting' ? (
              <textarea
                rows={4}
                value={plot.setting}
                onChange={(e) => onUpdatePlot({ ...plot, setting: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg leading-relaxed"
              />
            ) : (
              <p className="font-editorial text-lg leading-relaxed text-[#161615]">
                {plot.setting}
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E2DC] text-xs text-[#57534E] leading-relaxed">
            <span className="font-semibold text-[#161615]">Medium Framing: </span>
            {mediumDef.draftScaffoldHint}
          </div>
        </article>
      </div>

      {/* Cast Roster */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-editorial text-xl font-semibold text-[#161615]">
            Cast Roster ({plot.characters.length})
          </h3>
          <p className="text-xs text-[#57534E]">
            Lock characters you love before rerolling the remaining ensemble.
          </p>
        </div>

        <div
          className={`grid gap-5 ${
            plot.characters.length === 1
              ? 'grid-cols-1 max-w-2xl'
              : plot.characters.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {plot.characters.map((char, idx) => {
            const isEditing = editingId === char.id;
            const isRerolling = rerollingTarget === char.id;
            return (
              <article
                key={char.id}
                className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-colors ${
                  char.locked ? 'border-[#1D4ED8]' : 'border-[#E5E2DC]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[#57534E] tabular-nums">
                      0{idx + 1}. Character
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(isEditing ? null : char.id)}
                        className="h-7 px-2 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        {isEditing ? (
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCharacterLock(char.id)}
                        aria-pressed={char.locked}
                        aria-label={char.locked ? `Unlock ${char.name}` : `Lock ${char.name}`}
                        className={`h-7 px-2 text-xs font-medium rounded inline-flex items-center gap-1 cursor-pointer ${
                          char.locked
                            ? 'bg-[#1D4ED8]/10 text-[#1D4ED8]'
                            : 'text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        {char.locked ? (
                          <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={char.locked || isRerolling}
                        onClick={() => onRerollElement('character', char.id)}
                        aria-label={`Reroll ${char.name}`}
                        className="h-7 px-2 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] disabled:opacity-40 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isRerolling ? 'animate-spin' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2.5 text-sm">
                      <input
                        type="text"
                        value={char.name}
                        onChange={(e) => updateCharacter(char.id, { name: e.target.value })}
                        className="w-full px-2.5 py-1.5 font-semibold bg-[#FAF9F6] border border-[#E5E2DC] rounded"
                      />
                      <input
                        type="text"
                        value={char.archetype}
                        onChange={(e) => updateCharacter(char.id, { archetype: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E2DC] rounded"
                      />
                      <textarea
                        rows={2}
                        value={char.comedicFlaw}
                        onChange={(e) => updateCharacter(char.id, { comedicFlaw: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E2DC] rounded"
                      />
                      <textarea
                        rows={2}
                        value={char.secretGoal}
                        onChange={(e) => updateCharacter(char.id, { secretGoal: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E2DC] rounded"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-editorial text-lg font-semibold text-[#161615]">
                          {char.name}
                        </h4>
                        <p className="text-xs font-medium text-[#1D4ED8] mt-0.5">
                          {char.archetype}
                        </p>
                      </div>
                      <dl className="space-y-2 text-[13px] leading-relaxed pt-1">
                        <div>
                          <dt className="font-semibold text-[#161615]">Comedic Flaw</dt>
                          <dd className="text-[#57534E]">{char.comedicFlaw}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-[#161615]">Secret Goal</dt>
                          <dd className="text-[#57534E]">{char.secretGoal}</dd>
                        </div>
                      </dl>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Medium-Tailored Story Beats */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-editorial text-xl font-semibold text-[#161615]">
            {mediumDef.outlineHeader} ({plot.beats.length} Beats)
          </h3>
          <p className="text-xs text-[#57534E]">
            Structured specifically for {mediumDef.name} pacing and cues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plot.beats.map((beat) => {
            const isEditing = editingId === beat.id;
            const isRerolling = rerollingTarget === beat.id;
            return (
              <article
                key={beat.id}
                className={`bg-white border rounded-xl p-5 flex flex-col justify-between transition-colors ${
                  beat.locked ? 'border-[#1D4ED8]' : 'border-[#E5E2DC]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E] font-mono tabular-nums">
                        <span>Beat 0{beat.beatNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{beat.mediumCue}</span>
                      </div>
                      <h4 className="font-editorial text-lg font-semibold text-[#161615] mt-1">
                        {beat.label}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingId(isEditing ? null : beat.id)}
                        className="h-7 px-2 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] rounded inline-flex items-center gap-1 cursor-pointer"
                        aria-label={`Edit ${beat.label}`}
                      >
                        {isEditing ? (
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleBeatLock(beat.id)}
                        aria-pressed={beat.locked}
                        aria-label={beat.locked ? `Unlock ${beat.label}` : `Lock ${beat.label}`}
                        className={`h-7 px-2 text-xs font-medium rounded inline-flex items-center gap-1 cursor-pointer ${
                          beat.locked
                            ? 'bg-[#1D4ED8]/10 text-[#1D4ED8]'
                            : 'text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        {beat.locked ? (
                          <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={beat.locked || isRerolling}
                        onClick={() => onRerollElement('beat', beat.id)}
                        aria-label={`Reroll ${beat.label}`}
                        className="h-7 px-2 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] disabled:opacity-40 rounded inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isRerolling ? 'animate-spin' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2.5 text-sm">
                      <textarea
                        rows={3}
                        value={beat.summary}
                        onChange={(e) => updateBeat(beat.id, { summary: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg"
                      />
                      <textarea
                        rows={2}
                        value={beat.comedicEscalation}
                        onChange={(e) =>
                          updateBeat(beat.id, { comedicEscalation: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-sm leading-relaxed">
                      <p className="text-[#161615]">{beat.summary}</p>
                      <p className="text-xs text-[#57534E] pt-2 border-t border-[#F0EDE6]">
                        <span className="font-semibold text-[#161615]">Escalation Twist: </span>
                        {beat.comedicEscalation}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Running Gags & Callbacks */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-editorial text-xl font-semibold text-[#161615]">
            Running Gags &amp; Callbacks
          </h3>
          <p className="text-xs text-[#57534E]">
            Recurring motifs planted early to pay off in the finale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {plot.runningGags.map((gag, idx) => {
            const isEditing = editingId === gag.id;
            const isRerolling = rerollingTarget === gag.id;
            return (
              <article
                key={gag.id}
                className={`bg-white border rounded-xl p-5 space-y-3 transition-colors ${
                  gag.locked ? 'border-[#1D4ED8]' : 'border-[#E5E2DC]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[#57534E] tabular-nums">
                    Callback 0{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : gag.id)}
                      className="h-7 px-2 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] rounded inline-flex items-center gap-1 cursor-pointer"
                      aria-label={`Edit callback ${idx + 1}`}
                    >
                      {isEditing ? (
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleGagLock(gag.id)}
                      aria-pressed={gag.locked}
                      aria-label={gag.locked ? `Unlock callback ${idx + 1}` : `Lock callback ${idx + 1}`}
                      className={`h-7 px-2 text-xs font-medium rounded inline-flex items-center gap-1 cursor-pointer ${
                        gag.locked
                          ? 'bg-[#1D4ED8]/10 text-[#1D4ED8]'
                          : 'text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      {gag.locked ? (
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={gag.locked || isRerolling}
                      onClick={() => onRerollElement('gag', gag.id)}
                      aria-label={`Reroll callback ${idx + 1}`}
                      className="h-7 px-2 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] disabled:opacity-40 rounded inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isRerolling ? 'animate-spin' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={gag.setup}
                      onChange={(e) => updateGag(gag.id, { setup: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E2DC] rounded"
                    />
                    <textarea
                      rows={2}
                      value={gag.payoff}
                      onChange={(e) => updateGag(gag.id, { payoff: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FAF9F6] border border-[#E5E2DC] rounded"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 text-[13px] leading-relaxed">
                    <p className="text-[#161615]">
                      <span className="font-semibold">Setup: </span>
                      {gag.setup}
                    </p>
                    <p className="text-[#57534E]">
                      <span className="font-semibold text-[#161615]">Payoff: </span>
                      {gag.payoff}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
