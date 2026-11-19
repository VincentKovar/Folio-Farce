import { ArrowUpRight, Check, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getMediumById, getSubgenreById } from '../lib/comedyCatalog.ts';
import { formatPlotAsMarkdown } from '../lib/markdownExporter.ts';
import type { ComedyPlot } from '../types/plot.ts';

interface SavedLibraryProps {
  savedPlots: ComedyPlot[];
  activePlotId: string;
  onLoadPlot: (plot: ComedyPlot) => void;
  onDeletePlot: (id: string) => void;
}

export function SavedLibrary({
  savedPlots,
  activePlotId,
  onLoadPlot,
  onDeletePlot,
}: SavedLibraryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySaved = async (plot: ComedyPlot) => {
    const md = formatPlotAsMarkdown(plot);
    try {
      await navigator.clipboard.writeText(md);
    } catch {
      const el = document.createElement('textarea');
      el.value = md;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopiedId(plot.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="saved-library" className="py-10 space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-editorial text-2xl font-semibold text-[#161615]">
            Saved Outlines
          </h2>
          <p className="mt-1 text-sm text-[#57534E]">
            Outlines bookmarked locally in your browser so you can remix or export them anytime.
          </p>
        </div>
        <span className="text-xs font-mono text-[#57534E] tabular-nums">
          {savedPlots.length} {savedPlots.length === 1 ? 'outline' : 'outlines'} stored
        </span>
      </div>

      {savedPlots.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-xl p-8 text-center">
          <p className="font-editorial text-lg text-[#161615]">No saved outlines yet</p>
          <p className="mt-1 text-sm text-[#57534E]">
            Use “Save Outline” below the Markdown output area to keep plots you want to revisit.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedPlots.map((saved) => {
            const mediumDef = getMediumById(saved.medium);
            const subDef = getSubgenreById(saved.subgenre);
            const isCurrent = saved.id === activePlotId;
            return (
              <article
                key={saved.id}
                className={`bg-white border rounded-xl p-5 flex flex-col justify-between gap-4 ${
                  isCurrent ? 'border-[#1D4ED8]' : 'border-[#E5E2DC]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#57534E]">
                    <span>{mediumDef.shortName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{subDef.name}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{saved.characterCount} chars</span>
                  </div>
                  <h3 className="font-editorial text-lg font-semibold text-[#161615]">
                    {saved.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#57534E] line-clamp-3">
                    {saved.logline}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EDE6] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onLoadPlot(saved)}
                    className="px-3 py-1.5 text-xs font-medium text-[#161615] hover:text-[#1D4ED8] bg-[#FAF9F6] border border-[#E5E2DC] rounded-md inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>Load into Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopySaved(saved)}
                      aria-label={`Copy Markdown for ${saved.title}`}
                      className="h-8 px-2.5 text-xs font-medium text-[#57534E] hover:text-[#161615] hover:bg-[#FAF9F6] rounded-md inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === saved.id ? (
                        <Check className="w-3.5 h-3.5 text-[#15803D]" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeletePlot(saved.id)}
                      aria-label={`Delete ${saved.title}`}
                      className="h-8 px-2.5 text-xs font-medium text-[#57534E] hover:text-[#DC2626] hover:bg-[#FAF9F6] rounded-md inline-flex items-center cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
