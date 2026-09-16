import { Wallet, Divide, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { SplitCalculationResult } from '../types';

interface StatsBannerProps {
  calc: SplitCalculationResult;
  expenseCount: number;
}

export function StatsBanner({ calc }: StatsBannerProps) {
  const rohitSummary = calc.summaries.find((s) => s.id === 'rohit');
  const nitishSummary = calc.summaries.find((s) => s.id === 'nitish');
  const arpitSummary = calc.summaries.find((s) => s.id === 'arpit');

  return (
    <div id="stats-banner-container" className="space-y-4 mb-6">
      {/* Big Highlight: Total Amount & 3 Se Divide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Amount Card */}
        <div
          id="stat-total-amount"
          className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs relative overflow-hidden"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                Kul Kharcha (Total Amount)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">
                {formatCurrency(calc.totalAmount)}
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Rohit, Nitish aur Arpit teeno ka milakar total kharcha
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Quick breakdown of who paid how much */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 gap-1 flex-wrap">
            <span>
              <strong>Rohit:</strong> {formatCurrency(rohitSummary?.totalPaid || 0)}
            </span>
            <span className="text-stone-300">&bull;</span>
            <span>
              <strong>Nitish:</strong> {formatCurrency(nitishSummary?.totalPaid || 0)}
            </span>
            <span className="text-stone-300">&bull;</span>
            <span>
              <strong>Arpit:</strong> {formatCurrency(arpitSummary?.totalPaid || 0)}
            </span>
          </div>
        </div>

        {/* Total ÷ 3 (Equal Split) Card */}
        <div
          id="stat-divide-by-three"
          className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-xs relative overflow-hidden"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wide uppercase">
                <Divide className="w-3.5 h-3.5" />
                Total Ka 3 Se Divide
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
                {formatCurrency(calc.equalShare)}
                <span className="text-sm font-semibold text-emerald-100 ml-2">/ person</span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 font-medium">
                Formula: {formatCurrency(calc.totalAmount)} &divide; 3 log = {formatCurrency(calc.equalShare)} har ek ka hissa
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 border border-white/20">
              <span className="text-xl font-extrabold">&divide;3</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
            <span>Rohit ka hissa: 1/3</span>
            <span className="text-emerald-300/60">&bull;</span>
            <span>Nitish ka hissa: 1/3</span>
            <span className="text-emerald-300/60">&bull;</span>
            <span>Arpit ka hissa: 1/3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
