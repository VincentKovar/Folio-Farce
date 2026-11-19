import { BookmarkCheck, BookmarkPlus, Check, Copy, Download, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatPlotAsMarkdown, slugifyTitle } from '../lib/markdownExporter.ts';
import type { ComedyPlot } from '../types/plot.ts';

interface MarkdownOutputPanelProps {
  plot: ComedyPlot;
  isSaved: boolean;
  onSaveToLibrary: () => void;
}

export function MarkdownOutputPanel({
  plot,
  isSaved,
  onSaveToLibrary,
}: MarkdownOutputPanelProps) {
  const generatedMarkdown = formatPlotAsMarkdown(plot);
  const [markdownText, setMarkdownText] = useState<string>(generatedMarkdown);
  const [isCustomEdited, setIsCustomEdited] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'raw' | 'preview'>('raw');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setMarkdownText(formatPlotAsMarkdown(plot));
    setIsCustomEdited(false);
  }, [plot]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);
      setCopied(true);
    } catch {
      const fallbackArea = document.createElement('textarea');
      fallbackArea.value = markdownText;
      fallbackArea.setAttribute('readonly', '');
      fallbackArea.style.position = 'fixed';
      fallbackArea.style.opacity = '0';
      document.body.appendChild(fallbackArea);
      fallbackArea.select();
      document.execCommand('copy');
      document.body.removeChild(fallbackArea);
      setCopied(true);
    }
    window.setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slugifyTitle(plot.title)}-outline.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetTemplate = () => {
    setMarkdownText(generatedMarkdown);
    setIsCustomEdited(false);
  };

  const wordCount = markdownText.trim() ? markdownText.trim().split(/\s+/).length : 0;
  const lineCount = markdownText.split('\n').length;

  return (
    <section id="markdown-export" className="py-10 space-y-5 border-b border-[#E5E2DC]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-editorial text-2xl font-semibold text-[#161615]">
            Formatted Markdown Outline Template
          </h2>
          <p className="mt-1 text-sm text-[#57534E]">
            Ready-to-write scaffold synced to your locked cards and medium structure. Edit directly or export as Markdown.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-[#57534E] font-mono tabular-nums">
            {wordCount} words · {lineCount} lines
          </span>

          {isCustomEdited && (
            <button
              type="button"
              onClick={handleResetTemplate}
              className="px-3 py-1.5 text-xs font-medium text-[#57534E] hover:text-[#161615] bg-white border border-[#E5E2DC] rounded-lg inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sync with Cards</span>
            </button>
          )}

          <div className="flex items-center gap-1 p-1 bg-[#EFEDE8] border border-[#E5E2DC] rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'raw'
                  ? 'bg-white text-[#161615] shadow-xs'
                  : 'text-[#57534E] hover:text-[#161615]'
              }`}
            >
              Markdown Source
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'preview'
                  ? 'bg-white text-[#161615] shadow-xs'
                  : 'text-[#57534E] hover:text-[#161615]'
              }`}
            >
              Outline Preview
            </button>
          </div>
        </div>
      </div>

      {/* Generated Markdown Output Area */}
      <div className="bg-white border border-[#E5E2DC] rounded-xl overflow-hidden">
        {viewMode === 'raw' ? (
          <textarea
            aria-label="Generated markdown outline output"
            value={markdownText}
            onChange={(e) => {
              setMarkdownText(e.target.value);
              setIsCustomEdited(true);
            }}
            rows={20}
            spellCheck={false}
            className="w-full p-6 font-mono text-[13px] leading-relaxed text-[#161615] bg-[#FFFFFF] resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1D4ED8]"
          />
        ) : (
          <div className="p-6 sm:p-8 max-h-[540px] overflow-y-auto space-y-3 text-sm leading-relaxed text-[#161615]">
            {markdownText.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return (
                  <h3 key={i} className="font-editorial text-2xl font-semibold text-[#161615] pt-1">
                    {line.slice(2)}
                  </h3>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h4
                    key={i}
                    className="font-editorial text-lg font-semibold text-[#161615] pt-4 pb-1 border-b border-[#E5E2DC]"
                  >
                    {line.slice(3)}
                  </h4>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h5 key={i} className="font-semibold text-base text-[#161615] pt-3">
                    {line.slice(4)}
                  </h5>
                );
              }
              if (line.startsWith('> ')) {
                return (
                  <blockquote
                    key={i}
                    className="px-4 py-3 bg-[#FAF9F6] border border-[#E5E2DC] rounded-lg text-[#383633] italic"
                  >
                    {line.slice(2).replace(/\*\*/g, '')}
                  </blockquote>
                );
              }
              if (line.startsWith('```')) {
                return null;
              }
              if (line.startsWith('- ') || line.startsWith('   - ')) {
                return (
                  <p key={i} className="pl-4 text-[#383633]">
                    • {line.replace(/^\s*-\s*/, '').replace(/\*\*/g, '')}
                  </p>
                );
              }
              if (!line.trim()) {
                return <div key={i} className="h-1" />;
              }
              return (
                <p key={i} className="text-[#383633]">
                  {line.replace(/\*\*/g, '')}
                </p>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Bar Directly Below the Generated Markdown Output Area */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopyToClipboard}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 ${
              copied
                ? 'bg-[#15803D] text-white'
                : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="px-4 py-2.5 text-sm font-medium text-[#161615] bg-white hover:bg-[#F2F0EC] border border-[#E5E2DC] rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download .md</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onSaveToLibrary}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
            isSaved
              ? 'bg-[#FAF9F6] text-[#1D4ED8] border-[#1D4ED8]'
              : 'bg-white text-[#161615] hover:bg-[#F2F0EC] border-[#E5E2DC]'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4" aria-hidden="true" />
              <span>Saved to Outlines</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" aria-hidden="true" />
              <span>Save Outline</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
