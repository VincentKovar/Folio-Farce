interface HeaderProps {
  onNewPlot: () => void;
  savedCount: number;
}

export function Header({ onNewPlot, savedCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E2DC]">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <a
          href="#generator"
          className="font-editorial text-xl font-semibold tracking-tight text-[#161615] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
        >
          Folio &amp; Farce
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
          <a
            href="#generator"
            className="hover:text-[#161615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Generator
          </a>
          <a
            href="#story-deck"
            className="hover:text-[#161615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Story Deck
          </a>
          <a
            href="#markdown-export"
            className="hover:text-[#161615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Markdown Export
          </a>
          <a
            href="#saved-library"
            className="hover:text-[#161615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 tabular-nums"
          >
            Saved Outlines ({savedCount})
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onNewPlot}
            className="px-4 py-2 text-sm font-medium text-white bg-[#161615] hover:bg-[#292927] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2"
          >
            New Plot
          </button>
        </div>
      </div>
    </header>
  );
}
