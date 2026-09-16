import { useState } from 'react';
import { User, ArrowDownLeft, ArrowUpRight, CheckCircle2, ChevronDown, ChevronUp, Calendar, Tag, Plus } from 'lucide-react';
import { Roommate, Expense, RoommateSummary } from '../types';
import { formatCurrency } from '../utils/calculator';

interface PartnerAccountsLedgerProps {
  roommates: Roommate[];
  expenses: Expense[];
  summaries: RoommateSummary[];
  totalAmount: number;
  equalShare: number;
  onQuickAddForPartner: (partnerId: string) => void;
  onDeleteExpense: (id: string) => void;
  onViewReceipt: (exp: Expense) => void;
}

export function PartnerAccountsLedger({
  roommates,
  expenses,
  summaries,
  equalShare,
  onQuickAddForPartner,
  onDeleteExpense,
  onViewReceipt,
}: PartnerAccountsLedgerProps) {
  // Track open/collapsed list of items for each partner account
  const [expandedAccount, setExpandedAccount] = useState<Record<string, boolean>>({
    rohit: true,
    nitish: true,
    arpit: true,
  });

  const toggleAccount = (id: string) => {
    setExpandedAccount((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="partner-accounts-section" className="mb-6">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Rohit, Nitish & Arpit Ke Personal Accounts (Khata)</span>
          </h2>
          <p className="text-xs text-stone-600">
            Jab bhi aap saman add karte hain, woh direct yahan partner ke account me jud jata hai
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {roommates.map((partner, idx) => {
          const summary = summaries.find((s) => s.id === partner.id);
          const partnerExpenses = expenses.filter((e) => e.paidById === partner.id);
          const isExpanded = expandedAccount[partner.id] ?? true;

          const isCreditor = (summary?.netBalance ?? 0) > 0.01;
          const isDebtor = (summary?.netBalance ?? 0) < -0.01;
          const isSettled = !isCreditor && !isDebtor;

          return (
            <div
              key={partner.id}
              id={`partner-account-card-${partner.id}`}
              className={`bg-white rounded-2xl border transition-all flex flex-col ${
                isCreditor
                  ? 'border-emerald-300 shadow-xs'
                  : isDebtor
                  ? 'border-amber-300 shadow-xs'
                  : 'border-stone-200 shadow-xs'
              }`}
            >
              {/* Account Header */}
              <div className="p-4 border-b border-stone-100 bg-stone-50/70 rounded-t-2xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${partner.avatarBg} border ${partner.borderColor}`}
                    >
                      {partner.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 leading-tight">
                        {partner.name} Ka Account
                      </h3>
                      <p className="text-[11px] text-stone-600 font-medium">
                        Partner {idx + 1} &bull; {partnerExpenses.length} Saman Added
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onQuickAddForPartner(partner.id)}
                    className="p-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    title={`Add new expense paid by ${partner.name}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>

                {/* Balance Status Banner */}
                <div className="mt-3 pt-3 border-t border-stone-200/60">
                  {isCreditor && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <span className="flex items-center gap-1 font-bold text-emerald-800">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        Wapas Milenge:
                      </span>
                      <span className="font-extrabold text-emerald-900 text-sm">
                        +{formatCurrency(summary?.netBalance || 0)}
                      </span>
                    </div>
                  )}

                  {isDebtor && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                      <span className="flex items-center gap-1 font-bold text-amber-900">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Room Me Dene Honge:
                      </span>
                      <span className="font-extrabold text-amber-950 text-sm">
                        -{formatCurrency(Math.abs(summary?.netBalance || 0))}
                      </span>
                    </div>
                  )}

                  {isSettled && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
                        Hisaab Barabar:
                      </span>
                      <span>₹0.00</span>
                    </div>
                  )}
                </div>

                {/* Numbers Summary */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 text-xs">
                  <div className="bg-white p-2 rounded-xl border border-stone-100">
                    <span className="text-stone-600 block text-[10px] font-bold uppercase">
                      Kul Diye (Paid)
                    </span>
                    <span className="font-extrabold text-stone-900 text-sm">
                      {formatCurrency(summary?.totalPaid || 0)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-stone-100">
                    <span className="text-stone-600 block text-[10px] font-bold uppercase">
                      1/3 Hissa (Share)
                    </span>
                    <span className="font-bold text-stone-700 text-sm">
                      {formatCurrency(equalShare)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items in this Account */}
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => toggleAccount(partner.id)}
                    className="flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900"
                  >
                    <span>{partner.name} Ke Kharide Saman ({partnerExpenses.length})</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-stone-500" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {partnerExpenses.length === 0 ? (
                      <div className="py-6 text-center text-stone-400 text-xs italic bg-stone-50 rounded-xl">
                        {partner.name} ne abhi tak koi saman nahi joda.
                      </div>
                    ) : (
                      partnerExpenses.map((exp) => (
                        <div
                          key={exp.id}
                          className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between gap-2 hover:bg-stone-100/70 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-900 truncate">
                                {exp.title}
                              </span>
                              {exp.receiptUrl && (
                                <button
                                  onClick={() => onViewReceipt(exp)}
                                  className="text-[10px] text-emerald-600 font-semibold underline shrink-0"
                                >
                                  Bill
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-stone-600 mt-0.5">
                              <span className="flex items-center gap-0.5">
                                <Calendar className="w-2.5 h-2.5 text-stone-400" />
                                {exp.date}
                              </span>
                              <span>&bull;</span>
                              <span>{exp.category}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-extrabold text-stone-900">
                              {formatCurrency(exp.amount)}
                            </span>
                            <button
                              onClick={() => onDeleteExpense(exp.id)}
                              className="text-stone-400 hover:text-rose-600 p-1 rounded-md text-[11px]"
                              title="Delete this item"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
