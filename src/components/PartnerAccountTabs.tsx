import { useState } from 'react';
import { User, ArrowDownLeft, ArrowUpRight, CheckCircle2, Trash2, Calendar, HandCoins, ArrowRight } from 'lucide-react';
import { Roommate, Expense, RoommateSummary, Settlement } from '../types';
import { formatCurrency } from '../utils/calculator';

interface PartnerAccountTabsProps {
  roommates: Roommate[];
  expenses: Expense[];
  summaries: RoommateSummary[];
  settlements: Settlement[];
  totalAmount: number;
  equalShare: number;
  activeTab: string; // 'rohit' | 'nitish' | 'arpit' | 'all'
  onSelectTab: (tabId: string) => void;
  onDeleteExpense: (id: string) => void;
  onRecordSettlement: (settlement: Settlement) => void;
}

export function PartnerAccountTabs({
  roommates,
  expenses,
  summaries,
  settlements,
  totalAmount,
  equalShare,
  activeTab,
  onSelectTab,
  onDeleteExpense,
  onRecordSettlement,
}: PartnerAccountTabsProps) {
  const selectedPartner = roommates.find((r) => r.id === activeTab);
  const selectedSummary = summaries.find((s) => s.id === activeTab);
  const partnerExpenses = expenses.filter((e) => e.paidById === activeTab);

  const getPartnerName = (id: string) => roommates.find((r) => r.id === id)?.name || id;

  const isCreditor = (selectedSummary?.netBalance ?? 0) > 0.01;
  const isDebtor = (selectedSummary?.netBalance ?? 0) < -0.01;
  const isSettled = !isCreditor && !isDebtor;

  return (
    <div id="partner-accounts-container" className="space-y-4">
      {/* 1. Niche Diye Gaye Naam (Rohit, Nitish, Arpit & All) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-600" />
            Niche Diye Gaye Naam Par Click Karein (Account Dekhne Ke Liye):
          </span>
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Click to view full account
          </span>
        </div>

        {/* 3 Name Tabs + Summary Tab */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {roommates.map((partner) => {
            const summary = summaries.find((s) => s.id === partner.id);
            const count = expenses.filter((e) => e.paidById === partner.id).length;
            const isSelected = activeTab === partner.id;

            return (
              <button
                key={partner.id}
                id={`tab-btn-${partner.id}`}
                onClick={() => onSelectTab(partner.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                    : 'bg-white text-stone-900 border-stone-200 hover:border-emerald-300 hover:bg-stone-50 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center ${
                        isSelected ? 'bg-white text-emerald-800' : partner.avatarBg
                      }`}
                    >
                      {partner.name.charAt(0)}
                    </span>
                    <span className="font-extrabold text-sm sm:text-base">
                      {partner.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {count} saman
                  </span>
                </div>

                <div className="mt-1">
                  <span className={`text-[11px] block ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                    Kul Diye:
                  </span>
                  <span className="text-base sm:text-lg font-black">
                    {formatCurrency(summary?.totalPaid || 0)}
                  </span>
                </div>
              </button>
            );
          })}

          {/* 4th Tab: Teeno Ka Final Hisaab */}
          <button
            id="tab-btn-all-settlement"
            onClick={() => onSelectTab('all')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              activeTab === 'all'
                ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-[1.02]'
                : 'bg-white text-stone-900 border-stone-200 hover:border-stone-400 hover:bg-stone-50 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <HandCoins className={`w-4 h-4 ${activeTab === 'all' ? 'text-emerald-400' : 'text-stone-700'}`} />
              <span className="font-extrabold text-sm">Final Hisaab</span>
            </div>
            <div>
              <span className={`text-[11px] block ${activeTab === 'all' ? 'text-stone-300' : 'text-stone-500'}`}>
                Kaun Kisko Dega
              </span>
              <span className="text-xs font-bold">
                {settlements.length === 0 ? 'Sab Barabar' : `${settlements.length} Payment Pending`}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Pura Account Detail Box (Shown for the active selected partner) */}
      {selectedPartner && selectedSummary && activeTab !== 'all' && (
        <div
          id={`account-detail-card-${selectedPartner.id}`}
          className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-6 transition-all"
        >
          {/* Account Title & Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg ${selectedPartner.avatarBg} border ${selectedPartner.borderColor}`}
              >
                {selectedPartner.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-900 leading-tight">
                  {selectedPartner.name} Ka Pura Account
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedPartner.name} ne room ke liye khareeda gaya saman aur hisaab
                </p>
              </div>
            </div>

            {/* Status Pill */}
            {isCreditor && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold self-start sm:self-auto">
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>{selectedPartner.name} Ko Wapas Milenge: +{formatCurrency(selectedSummary.netBalance)}</span>
              </div>
            )}
            {isDebtor && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-950 text-xs font-extrabold self-start sm:self-auto">
                <ArrowUpRight className="w-4 h-4 text-amber-600" />
                <span>{selectedPartner.name} Ko Room Me Dene Honge: -{formatCurrency(Math.abs(selectedSummary.netBalance))}</span>
              </div>
            )}
            {isSettled && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hisaab Barabar Hai (No pending amount)</span>
              </div>
            )}
          </div>

          {/* Three Key Figures */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="text-stone-500 block text-[11px] font-bold uppercase">
                Kul Diye (Total Paid)
              </span>
              <span className="text-xl font-black text-stone-900">
                {formatCurrency(selectedSummary.totalPaid)}
              </span>
              <p className="text-[10px] text-stone-500 mt-0.5">
                {selectedPartner.name} dwara khareede sabhi saman ka jod
              </p>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="text-stone-500 block text-[11px] font-bold uppercase">
                1/3 Barabar Hissa (Fair Share)
              </span>
              <span className="text-xl font-black text-stone-700">
                {formatCurrency(equalShare)}
              </span>
              <p className="text-[10px] text-stone-500 mt-0.5">
                Total {formatCurrency(totalAmount)} &divide; 3 log
              </p>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                isCreditor
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : isDebtor
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-stone-50 border-stone-200 text-stone-900'
              }`}
            >
              <span className="block text-[11px] font-bold uppercase opacity-80">
                Net Balance (Hisaab)
              </span>
              <span className="text-xl font-black">
                {selectedSummary.netBalance >= 0 ? '+' : ''}
                {formatCurrency(selectedSummary.netBalance)}
              </span>
              <p className="text-[10px] opacity-80 mt-0.5">
                {isCreditor
                  ? 'Isse room se wapas lena hai'
                  : isDebtor
                  ? 'Isse baki partners ko dena hai'
                  : 'Bilkul barabar'}
              </p>
            </div>
          </div>

          {/* List of Items Added by this Partner */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                {selectedPartner.name} Ke Kharide Saman Ki List ({partnerExpenses.length}):
              </h4>
              <span className="text-[11px] text-stone-400">
                Saman hatane ke liye delete icon dabayein
              </span>
            </div>

            {partnerExpenses.length === 0 ? (
              <div className="p-6 text-center text-stone-400 text-xs italic bg-stone-50 rounded-2xl border border-stone-100">
                {selectedPartner.name} ne abhi tak koi saman nahi joda. Upar form me saman bhar kar add karein!
              </div>
            ) : (
              <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl overflow-hidden">
                {partnerExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 bg-stone-50/60 hover:bg-stone-50 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">
                          {exp.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          {exp.date}
                        </span>
                        <span>&bull;</span>
                        <span>3-way split: {formatCurrency(exp.amount / 3)} / person</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-base font-black text-stone-900">
                        {formatCurrency(exp.amount)}
                      </span>
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hatao (Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Final Hisaab Tab View (When 'all' is selected) */}
      {activeTab === 'all' && (
        <div
          id="all-settlements-summary-card"
          className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-6"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
            <div>
              <h3 className="text-lg font-black text-stone-900 leading-tight flex items-center gap-2">
                <HandCoins className="w-5 h-5 text-emerald-600" />
                <span>Teeno Ka Final Hisaab (Kaun Kisko Dega)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Total {formatCurrency(totalAmount)} ko 3 se divide karne par har partner ka hissa {formatCurrency(equalShare)} banta hai.
              </p>
            </div>
          </div>

          {settlements.length === 0 ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-center text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Sabka hisaab barabar hai! Kisi ko kisi ko paise dene ki zaroorat nahi hai.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map((st, i) => {
                const debtor = getPartnerName(st.fromId);
                const creditor = getPartnerName(st.toId);

                return (
                  <div
                    key={`${st.fromId}-${st.toId}-${i}`}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm sm:text-base font-extrabold text-stone-900">
                        {debtor}
                      </span>
                      <div className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-lg border border-amber-300">
                        <span>dega</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                      <span className="text-sm sm:text-base font-extrabold text-stone-900">
                        {creditor} ko
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                      <span className="text-lg font-black text-stone-900">
                        {formatCurrency(st.amount)}
                      </span>
                      <button
                        onClick={() => onRecordSettlement(st)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                      >
                        Pay Kar Diya
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
