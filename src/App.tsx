import { AlertCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ConfigStudio } from './components/ConfigStudio.tsx';
import { Header } from './components/Header.tsx';
import { MarkdownOutputPanel } from './components/MarkdownOutputPanel.tsx';
import { SavedLibrary } from './components/SavedLibrary.tsx';
import { StoryDeck } from './components/StoryDeck.tsx';
import { generateDeckPlot, rerollDeckElement } from './lib/fictionFactoryDeck.ts';
import type {
  ComedyPlot,
  GeneratorMode,
  MediumId,
  SubgenreId,
} from './types/plot.ts';

const SAVED_STORAGE_KEY = 'folio_farce_saved_plots_v1';

function loadSavedPlots(): ComedyPlot[] {
  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ComedyPlot[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [characterCount, setCharacterCount] = useState<number>(3);
  const [medium, setMedium] = useState<MediumId>('screenplay');
  const [subgenre, setSubgenre] = useState<SubgenreId>('satire');
  const [secondarySubgenre, setSecondarySubgenre] = useState<SubgenreId | 'none'>('slapstick');
  const [premiseSeed, setPremiseSeed] = useState<string>('');
  const [generatorMode, setGeneratorMode] = useState<GeneratorMode>('ai');

  const [plot, setPlot] = useState<ComedyPlot>(() =>
    generateDeckPlot({
      characterCount: 3,
      medium: 'screenplay',
      subgenre: 'satire',
      secondarySubgenre: 'slapstick',
      premiseSeed: '',
    }),
  );

  const [savedPlots, setSavedPlots] = useState<ComedyPlot[]>(() => loadSavedPlots());
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [rerollingTarget, setRerollingTarget] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedPlots));
    } catch {
      // Ignore storage quota issues silently
    }
  }, [savedPlots]);

  const lockedCount = useMemo(() => {
    let count = 0;
    if (plot.titleLocked) count += 1;
    if (plot.settingLocked) count += 1;
    count += plot.characters.filter((c) => c.locked).length;
    count += plot.beats.filter((b) => b.locked).length;
    count += plot.runningGags.filter((g) => g.locked).length;
    return count;
  }, [plot]);

  const handleGenerate = async (ignoreLocks = false) => {
    setErrorMessage(null);
    const existingPlot = ignoreLocks ? undefined : plot;

    if (generatorMode === 'deck') {
      const next = generateDeckPlot({
        characterCount,
        medium,
        subgenre,
        secondarySubgenre,
        premiseSeed,
        existingPlot,
      });
      setPlot(next);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-plot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterCount,
          medium,
          subgenre,
          secondarySubgenre,
          premiseSeed,
          existingPlot,
        }),
      });
      const data = (await response.json()) as { plot?: ComedyPlot; error?: string };
      if (!response.ok || !data.plot) {
        throw new Error(data.error || 'Failed to generate plot from Writer’s Room AI.');
      }
      setPlot(data.plot);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to reach Writer’s Room AI. You can retry or switch to Fiction Factory Deck.',
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRerollElement = async (
    elementType: 'premise' | 'setting' | 'character' | 'beat' | 'gag',
    targetId?: string,
  ) => {
    setErrorMessage(null);

    if (generatorMode === 'deck') {
      const next = rerollDeckElement({ elementType, targetId, plot });
      setPlot(next);
      return;
    }

    const activeKey = targetId ?? elementType;
    setRerollingTarget(activeKey);
    try {
      const response = await fetch('/api/reroll-element', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elementType, targetId, plot }),
      });
      const data = (await response.json()) as { plot?: ComedyPlot; error?: string };
      if (!response.ok || !data.plot) {
        throw new Error(data.error || 'Failed to reroll card.');
      }
      setPlot(data.plot);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to reroll element via Writer’s Room AI.',
      );
    } finally {
      setRerollingTarget(null);
    }
  };

  const handleUnlockAll = () => {
    setPlot((prev) => ({
      ...prev,
      titleLocked: false,
      settingLocked: false,
      characters: prev.characters.map((c) => ({ ...c, locked: false })),
      beats: prev.beats.map((b) => ({ ...b, locked: false })),
      runningGags: prev.runningGags.map((g) => ({ ...g, locked: false })),
    }));
  };

  const isSaved = useMemo(
    () => savedPlots.some((item) => item.id === plot.id),
    [savedPlots, plot.id],
  );

  const handleSaveToLibrary = () => {
    setSavedPlots((prev) => {
      const exists = prev.some((item) => item.id === plot.id);
      if (exists) {
        return prev.map((item) => (item.id === plot.id ? plot : item));
      }
      return [plot, ...prev];
    });
  };

  const handleLoadSavedPlot = (saved: ComedyPlot) => {
    setPlot(saved);
    setCharacterCount(saved.characterCount);
    setMedium(saved.medium);
    setSubgenre(saved.subgenre);
    setSecondarySubgenre(saved.secondarySubgenre);
    setPremiseSeed(saved.premiseSeed);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSavedPlot = (id: string) => {
    setSavedPlots((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#161615]">
      <Header onNewPlot={() => handleGenerate(true)} savedCount={savedPlots.length} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6">
        <ConfigStudio
          characterCount={characterCount}
          onCharacterCountChange={setCharacterCount}
          medium={medium}
          onMediumChange={setMedium}
          subgenre={subgenre}
          onSubgenreChange={setSubgenre}
          secondarySubgenre={secondarySubgenre}
          onSecondarySubgenreChange={setSecondarySubgenre}
          premiseSeed={premiseSeed}
          onPremiseSeedChange={setPremiseSeed}
          generatorMode={generatorMode}
          onGeneratorModeChange={(mode) => {
            setGeneratorMode(mode);
            setErrorMessage(null);
          }}
          lockedCount={lockedCount}
          isGenerating={isGenerating}
          onGenerate={() => handleGenerate(false)}
          onUnlockAll={handleUnlockAll}
        />

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#991B1B]"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleGenerate(false)}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-[#FECACA] rounded-md hover:bg-[#FEE2E2] cursor-pointer whitespace-nowrap"
              >
                Retry AI
              </button>
              <button
                type="button"
                onClick={() => {
                  setGeneratorMode('deck');
                  setErrorMessage(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-[#991B1B] text-white rounded-md hover:bg-[#7F1D1D] cursor-pointer whitespace-nowrap"
              >
                Use Deck Mode
              </button>
            </div>
          </div>
        )}

        <StoryDeck
          plot={plot}
          rerollingTarget={rerollingTarget}
          onUpdatePlot={setPlot}
          onRerollElement={handleRerollElement}
        />

        <MarkdownOutputPanel
          plot={plot}
          isSaved={isSaved}
          onSaveToLibrary={handleSaveToLibrary}
        />

        <SavedLibrary
          savedPlots={savedPlots}
          activePlotId={plot.id}
          onLoadPlot={handleLoadSavedPlot}
          onDeletePlot={handleDeleteSavedPlot}
        />
      </main>

      <footer className="border-t border-[#E5E2DC] py-6 mt-8">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#57534E]">
          <span>Folio &amp; Farce — Comedy Plot &amp; Markdown Outline Studio</span>
          <span>Lock story beats, remix characters, and export Markdown outlines.</span>
        </div>
      </footer>
    </div>
  );
}
