import { ArrowUpRight, ArrowDownLeft, CheckCircle2, UserCheck } from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { RoommateSummary } from '../types';

interface RoommatesSummaryGridProps {
  summaries: RoommateSummary[];
  totalAmount: number;
  onEditRoommates: () => void;
}

export function RoommatesSummaryGrid({
  summaries,
  totalAmount,
  onEditRoommates,
}: RoommatesSummaryGridProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>3 Room Partners Breakdown</span>
        </h2>
        <button
          onClick={onEditRoommates}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Change Names
        </button>
      </div>

      <div
        id="roommates-summary-grid"
        className="grid grid-cols-1 md:grid-cols-3 gap-3.5"
      >
        {summaries.map((s, idx) => {
          const sharePercent =
            totalAmount > 0
              ? Math.min(100, Math.round((s.totalPaid / totalAmount) * 100))
              : 33;
          const isCreditor = s.netBalance > 0.01;
          const isDebtor = s.netBalance < -0.01;
          const isSettled = !isCreditor && !isDebtor;

          return (
            <div
              key={s.id}
              id={`roommate-card-${s.id}`}
              className={`relative bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
                isCreditor
                  ? 'border-emerald-200/90 shadow-xs'
                  : isDebtor
                  ? 'border-amber-200/80 shadow-xs'
                  : 'border-stone-200/90 shadow-xs'
              }`}
            >
              {/* Header: Partner Name & Rank badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${s.avatarBg} border ${s.borderColor}`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 leading-tight">
                      {s.name}
                    </h3>
                    <p className="text-[11px] text-stone-600">Room Partner {idx + 1}</p>
                  </div>
                </div>

                {/* Status Pill */}
                {isCreditor && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    Gets {formatCurrency(s.netBalance)}
                  </span>
                )}
                {isDebtor && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Owes {formatCurrency(Math.abs(s.netBalance))}
                  </span>
                )}
                {isSettled && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
                    Settled
                  </span>
                )}
              </div>

              {/* Numbers breakdown */}
              <div className="grid grid-cols-2 gap-2 py-2.5 my-2 border-y border-stone-100 text-xs">
                <div>
                  <span className="text-stone-600 block text-[11px] font-medium">Total Paid</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {formatCurrency(s.totalPaid)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-600 block text-[11px] font-medium">Fair Share (1/3)</span>
                  <span className="font-semibold text-stone-700 text-sm">
                    {formatCurrency(s.fairShare)}
                  </span>
                </div>
              </div>

              {/* Contribution Bar */}
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-[11px] text-stone-600">
                  <span>Paid of Room Total</span>
                  <span className="font-semibold text-stone-700">{sharePercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCreditor
                        ? 'bg-emerald-500'
                        : isDebtor
                        ? 'bg-amber-500'
                        : 'bg-stone-400'
                    }`}
                    style={{ width: `${Math.max(4, sharePercent)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
