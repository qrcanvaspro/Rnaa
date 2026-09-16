import { ArrowRight, CheckCircle2, AlertCircle, HelpCircle, HandCoins } from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { Roommate, Settlement } from '../types';

interface SettlementCardProps {
  settlements: Settlement[];
  roommates: Roommate[];
  totalAmount: number;
  equalShare: number;
  onRecordSettlement?: (settlement: Settlement) => void;
}

export function SettlementCard({
  settlements,
  roommates,
  totalAmount,
  equalShare,
  onRecordSettlement,
}: SettlementCardProps) {
  const getRoommate = (id: string) => roommates.find((r) => r.id === id);

  return (
    <div
      id="settlement-plan-container"
      className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Final Hisaab: Kaun Kisko Kitna Dega?
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              3-Way Balance
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Total {formatCurrency(totalAmount)} ka 3 se divide karne par har ek ka hissa {formatCurrency(equalShare)} banta hai.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 self-start sm:self-auto font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
          <span>Rohit, Nitish & Arpit Equal Split</span>
        </div>
      </div>

      {settlements.length === 0 ? (
        <div
          id="settlement-all-clear"
          className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-sm">Sabka Hisaab Barabar Hai!</span>
            Rohit, Nitish aur Arpit me se kisi ko kisi ko paise dene ki zaroorat nahi hai. Sabka 1/3 share balanced hai.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((st, idx) => {
            const debtor = getRoommate(st.fromId);
            const creditor = getRoommate(st.toId);

            return (
              <div
                key={`${st.fromId}-${st.toId}-${idx}`}
                id={`settlement-row-${idx}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100/70 transition-colors"
              >
                {/* Visual Flow: From -> To */}
                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                  {/* Debtor */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                        debtor?.avatarBg || 'bg-stone-200 text-stone-700'
                      } border border-stone-300`}
                    >
                      {debtor?.name.charAt(0) || 'P'}
                    </span>
                    <span className="text-sm font-extrabold text-stone-900">
                      {debtor?.name}
                    </span>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                    <span>dega</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  {/* Creditor */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                        creditor?.avatarBg || 'bg-stone-200 text-stone-700'
                      } border border-stone-300`}
                    >
                      {creditor?.name.charAt(0) || 'P'}
                    </span>
                    <span className="text-sm font-extrabold text-stone-900">
                      {creditor?.name} ko
                    </span>
                  </div>
                </div>

                {/* Amount and Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                  <div className="text-right">
                    <span className="text-lg font-black text-stone-900 block">
                      {formatCurrency(st.amount)}
                    </span>
                    <span className="text-[10px] text-stone-600 font-medium">
                      Net settlement
                    </span>
                  </div>

                  {onRecordSettlement && (
                    <button
                      id={`settle-btn-${idx}`}
                      onClick={() => onRecordSettlement(st)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      title="Paise de diye toh yahan click karein"
                    >
                      Pay Kar Diya
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-2 mt-2 pt-2 text-xs text-stone-600">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              In payments ke baad Rohit, Nitish aur Arpit teeno ka kul kharcha theek <strong>1/3 barabar</strong> ho jayega.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
