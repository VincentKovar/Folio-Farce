import { Dices, RefreshCw, Sparkles, Unlock } from 'lucide-react';
import { MEDIUMS, RANDOM_PREMISE_SEEDS, SUBGENRES } from '../lib/comedyCatalog.ts';
import type { GeneratorMode, MediumId, SubgenreId } from '../types/plot.ts';

interface ConfigStudioProps {
  characterCount: number;
  onCharacterCountChange: (count: number) => void;
  medium: MediumId;
  onMediumChange: (medium: MediumId) => void;
  subgenre: SubgenreId;
  onSubgenreChange: (subgenre: SubgenreId) => void;
  secondarySubgenre: SubgenreId | 'none';
  onSecondarySubgenreChange: (subgenre: SubgenreId | 'none') => void;
  premiseSeed: string;
  onPremiseSeedChange: (seed: string) => void;
  generatorMode: GeneratorMode;
  onGeneratorModeChange: (mode: GeneratorMode) => void;
  lockedCount: number;
  isGenerating: boolean;
  onGenerate: () => void;
  onUnlockAll: () => void;
}

const CAST_LABELS: Record<number, string> = {
  1: 'Solo Showcase',
  2: 'Two-Hander',
  3: 'Comedy Trio',
  4: 'Quartet',
  5: 'Five-Piece Cast',
  6: 'Six-Cast Farce',
};

export function ConfigStudio({
  characterCount,
  onCharacterCountChange,
  medium,
  onMediumChange,
  subgenre,
  onSubgenreChange,
  secondarySubgenre,
  onSecondarySubgenreChange,
  premiseSeed,
  onPremiseSeedChange,
  generatorMode,
  onGeneratorModeChange,
  lockedCount,
  isGenerating,
  onGenerate,
  onUnlockAll,
}: ConfigStudioProps) {
  const activeMedium = MEDIUMS.find((m) => m.id === medium) ?? MEDIUMS[0];
  const activeSubgenre = SUBGENRES.find((s) => s.id === subgenre) ?? SUBGENRES[0];

  const handleRandomSeed = () => {
    const candidates = RANDOM_PREMISE_SEEDS.filter((s) => s !== premiseSeed);
    const next = candidates[Math.floor(Math.random() * candidates.length)] ?? RANDOM_PREMISE_SEEDS[0];
    onPremiseSeedChange(next);
  };

  return (
    <section id="generator" className="pt-10 pb-8 border-b border-[#E5E2DC]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#57534E] mb-2">
            Comedy Plot Studio · Card-Locking &amp; Markdown Outliner
          </p>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-[#161615] text-balance leading-[1.12]">
            Build a comedy plot from cast size, medium, and subgenre.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#57534E]">
            Generate structured premises, flawed ensembles, and medium-tailored story beats. Lock any card you want to keep, reroll the rest, and export a clean Markdown outline.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#EFEDE8] border border-[#E5E2DC] rounded-lg self-start lg:self-end shrink-0">
          <button
            type="button"
            onClick={() => onGeneratorModeChange('ai')}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              generatorMode === 'ai'
                ? 'bg-white text-[#161615] shadow-xs'
                : 'text-[#57534E] hover:text-[#161615]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Writer’s Room AI</span>
          </button>
          <button
            type="button"
            onClick={() => onGeneratorModeChange('deck')}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              generatorMode === 'deck'
                ? 'bg-white text-[#161615] shadow-xs'
                : 'text-[#57534E] hover:text-[#161615]'
            }`}
          >
            <Dices className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Fiction Factory Deck</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E2DC] rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Number of Characters */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <label className="text-sm font-semibold text-[#161615]">
                Number of Characters
              </label>
              <span className="text-xs text-[#57534E] tabular-nums">
                {CAST_LABELS[characterCount]}
              </span>
            </div>
            <div
              role="group"
              aria-label="Number of characters"
              className="grid grid-cols-6 gap-1.5"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onCharacterCountChange(num)}
                  className={`h-11 rounded-lg text-sm font-semibold tabular-nums border transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                    characterCount === num
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                      : 'bg-[#FAF9F6] text-[#161615] border-[#E5E2DC] hover:border-[#C7C2B8]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#57534E]">
              Each character receives a distinct comedic flaw and conflicting goal.
            </p>
          </div>

          {/* Storytelling Medium */}
          <div className="lg:col-span-8 space-y-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <label className="text-sm font-semibold text-[#161615]">
                Storytelling Medium
              </label>
              <span className="text-xs text-[#57534E] truncate">
                {activeMedium.outlineHeader}
              </span>
            </div>
            <div
              role="group"
              aria-label="Storytelling medium"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
            >
              {MEDIUMS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onMediumChange(m.id)}
                  className={`h-11 px-3 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                    medium === m.id
                      ? 'bg-[#161615] text-white border-[#161615]'
                      : 'bg-[#FAF9F6] text-[#161615] border-[#E5E2DC] hover:border-[#C7C2B8]'
                  }`}
                  title={m.name}
                >
                  {m.shortName}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#57534E]">{activeMedium.formatNote}</p>
          </div>
        </div>

        <div className="border-t border-[#E5E2DC] pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Primary & Secondary Comedic Subgenre */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label className="text-sm font-semibold text-[#161615]">
                Comedic Subgenre
              </label>
              <span className="text-xs text-[#57534E]">
                {activeSubgenre.toneCue}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SUBGENRES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSubgenreChange(s.id)}
                  className={`min-h-[40px] px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
                    subgenre === s.id
                      ? 'bg-[#1D4ED8]/10 text-[#1D4ED8] border-[#1D4ED8]'
                      : 'bg-[#FAF9F6] text-[#161615] border-[#E5E2DC] hover:border-[#C7C2B8]'
                  }`}
                  title={s.name}
                >
                  {s.name.split(' ')[0]}
                  {s.name.includes('of') ? ' of Manners' : s.name.includes('Out') ? '-Out-of-Water' : ''}
                </button>
              ))}
            </div>

            <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
              <label
                htmlFor="secondary-subgenre"
                className="text-xs font-medium text-[#57534E] whitespace-nowrap"
              >
                Optional Secondary Twist:
              </label>
              <select
                id="secondary-subgenre"
                value={secondarySubgenre}
                onChange={(e) => onSecondarySubgenreChange(e.target.value as SubgenreId | 'none')}
                className="h-10 px-3 text-xs font-medium bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg text-[#161615] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              >
                <option value="none">Pure {activeSubgenre.name} (No Blend)</option>
                {SUBGENRES.filter((s) => s.id !== subgenre).map((s) => (
                  <option key={s.id} value={s.id}>
                    Blend with {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Premise Seed & Generate CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="premise-seed" className="text-sm font-semibold text-[#161615]">
                  Premise Seed or Constraint (Optional)
                </label>
                <button
                  type="button"
                  onClick={handleRandomSeed}
                  className="text-xs font-medium text-[#1D4ED8] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                >
                  Try random seed
                </button>
              </div>
              <input
                id="premise-seed"
                type="text"
                value={premiseSeed}
                onChange={(e) => onPremiseSeedChange(e.target.value)}
                placeholder="e.g., A competitive cheese-rolling festival goes corporate..."
                className="w-full h-11 px-3.5 text-sm bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg text-[#161615] placeholder:text-[#8C877E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3 text-xs text-[#57534E] tabular-nums">
                {lockedCount > 0 ? (
                  <>
                    <span>{lockedCount} locked</span>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={onUnlockAll}
                      className="inline-flex items-center gap-1 text-[#161615] hover:text-[#1D4ED8] font-medium cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Unlock all</span>
                    </button>
                  </>
                ) : (
                  <span>All story cards unlocked</span>
                )}
              </div>

              <button
                type="button"
                onClick={onGenerate}
                disabled={isGenerating}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>
                  {isGenerating
                    ? 'Drafting Plot...'
                    : lockedCount > 0
                      ? 'Reroll Unlocked Cards'
                      : 'Generate Comedy Plot'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
