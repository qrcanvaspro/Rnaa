import { useState } from 'react';
import { Users, Share2, Check, RotateCcw, Trash2 } from 'lucide-react';
import { Roommate } from '../types';

interface NavbarProps {
  roommates: Roommate[];
  onOpenEditRoommates: () => void;
  onCopyReport: () => void;
  onResetDemo: () => void;
  onClearAll: () => void;
  expenseCount: number;
}

export function Navbar({
  roommates,
  onOpenEditRoommates,
  onCopyReport,
  onResetDemo,
  onClearAll,
  expenseCount,
}: NavbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyReport();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
            <span className="text-lg">3</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-tight">
                Rohit &bull; Nitish &bull; Arpit
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                1/3 Equal Split
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium hidden md:block">
              Room Expenses & Equal 3-Way Hisaab-Kitaab
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="copy-whatsapp-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all shadow-xs active:scale-95"
            title="Copy WhatsApp message for room group"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">WhatsApp Pe Bhejein</span>
                <span className="sm:hidden">Share</span>
              </>
            )}
          </button>

          <button
            id="open-edit-roommates-btn"
            onClick={onOpenEditRoommates}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            title="Roommates settings"
          >
            <Users className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Names</span>
          </button>

          <div className="flex items-center gap-1 pl-1 border-l border-stone-200">
            <button
              id="reset-demo-btn"
              onClick={onResetDemo}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              title="Reset sample data for Rohit, Nitish, Arpit"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {expenseCount > 0 && (
              <button
                id="clear-all-btn"
                onClick={onClearAll}
                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
