import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { Expense, Roommate } from './types';
import {
  DEFAULT_ROOMMATES,
  INITIAL_EXPENSES,
  calculateSplits,
  generateWhatsAppSummary,
  formatCurrency,
} from './utils/calculator';
import {
  PlusCircle,
  Trash2,
  Share2,
  RotateCcw,
  Check,
  Divide,
  Wallet,
  Calendar,
  User,
  ShoppingBag,
} from 'lucide-react';
import { DeletePasswordModal } from './components/DeletePasswordModal';
import { AddSuccessModal } from './components/AddSuccessModal';

const STORAGE_EXPENSES_KEY = 'roommate_dark_expenses_v1';

export default function App() {
  const roommates = DEFAULT_ROOMMATES;

  // Expenses state
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_EXPENSES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_EXPENSES;
  });

  // Form input states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPayer, setSelectedPayer] = useState<string>('rohit');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Selected account tab for viewing details below
  const [activeAccount, setActiveAccount] = useState<string>('rohit');

  // Modals state
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [justAddedExpense, setJustAddedExpense] = useState<Expense | null>(null);

  // Feedback notification & share status
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync expenses to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
    } catch {
      // ignore
    }
  }, [expenses]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Calculations for total and 1/3 split
  const splitResult = useMemo(() => {
    return calculateSplits(roommates, expenses);
  }, [roommates, expenses]);

  // Add new expense
  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      amount: parsedAmount,
      paidById: selectedPayer,
      date: date || new Date().toISOString().split('T')[0],
      category: 'General',
    };

    setExpenses((prev) => [newExpense, ...prev]);

    // Automatically switch active account tab to the payer so user sees the addition immediately
    setActiveAccount(selectedPayer);

    // Trigger popup modal for added expense
    setJustAddedExpense(newExpense);

    const payer = roommates.find((r) => r.id === selectedPayer);
    showToast(`Added to ${payer?.name}'s account: ${formatCurrency(parsedAmount)}`);

    // Reset inputs
    setTitle('');
    setAmount('');
  };

  // Confirmed delete after password validation
  const handleConfirmDelete = () => {
    if (!expenseToDelete) return;
    const id = expenseToDelete.id;
    const itemTitle = expenseToDelete.title;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    setExpenseToDelete(null);
    showToast(`Removed "${itemTitle}"`);
  };

  // Reset to initial sample data
  const handleReset = () => {
    const entered = prompt('Enter password to reset expenses:');
    if (entered === '123225') {
      setExpenses(INITIAL_EXPENSES);
      setActiveAccount('rohit');
      showToast('Sample expenses reset');
    } else if (entered !== null) {
      showToast('Incorrect password! Reset cancelled.');
    }
  };

  // Copy WhatsApp summary report in English
  const handleCopySummary = () => {
    const summary = generateWhatsAppSummary(roommates, expenses, splitResult);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      showToast('Summary copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Active account information
  const currentPartner = roommates.find((r) => r.id === activeAccount) || roommates[0];
  const currentSummary = splitResult.summaries.find((s) => s.id === activeAccount);
  const currentItems = expenses.filter((e) => e.paidById === activeAccount);

  const netBalance = currentSummary?.netBalance ?? 0;
  const isPositive = netBalance > 0.01;
  const isNegative = netBalance < -0.01;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          id="toast-notification"
          className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-zinc-100 text-xs font-semibold px-4 py-3 rounded-xl border border-zinc-700 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between pb-5 mb-5 border-b border-zinc-800/80">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50"></span>
              RNA Room Expenses
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Rohit &bull; Nitish &bull; Arpit &bull; 1/3 Equal Split
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="share-whatsapp-btn"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors shadow-xs"
              title="Copy WhatsApp summary"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              id="reset-sample-btn"
              onClick={handleReset}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl border border-transparent hover:border-zinc-800 transition-colors"
              title="Reset Sample Expenses"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 1. Total Expenses & 1/3 Equal Split Metric Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Total Expenses */}
          <div
            id="total-expenses-card"
            className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-zinc-500" />
                Total Expenses
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-1.5">
              {formatCurrency(splitResult.totalAmount)}
            </div>
            <span className="text-[11px] text-zinc-500 mt-0.5 block">
              {expenses.length} items recorded
            </span>
          </div>

          {/* 1/3 Equal Split */}
          <div
            id="equal-share-card"
            className="bg-gradient-to-br from-emerald-950/50 to-zinc-900 rounded-2xl p-4 border border-emerald-800/40 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Divide className="w-3.5 h-3.5 text-emerald-400" />
                1/3 Share per Person
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1.5">
              {formatCurrency(splitResult.equalShare)}
            </div>
            <span className="text-[11px] text-zinc-400 mt-0.5 block">
              Total &divide; 3 roommates
            </span>
          </div>
        </div>

        {/* 2. Add New Expense Form */}
        <div
          id="add-expense-card"
          className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-sm mb-6"
        >
          <div className="flex items-center gap-2 mb-3.5">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Add Expense
            </h2>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-3.5">
            {/* Item Name & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="item-title-input"
                  className="block text-xs font-medium text-zinc-400 mb-1"
                >
                  Item Name
                </label>
                <input
                  id="item-title-input"
                  type="text"
                  required
                  placeholder="e.g. Groceries, WiFi, Milk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="item-price-input"
                  className="block text-xs font-medium text-zinc-400 mb-1"
                >
                  Price / Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">
                    ₹
                  </span>
                  <input
                    id="item-price-input"
                    type="number"
                    required
                    step="any"
                    min="1"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Paid By Selection (Rohit, Nitish, Arpit) */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Paid By (Select Account)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roommates.map((r) => {
                  const isSelected = selectedPayer === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      id={`payer-btn-${r.id}`}
                      onClick={() => setSelectedPayer(r.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500/30'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      {r.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Submit Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label
                  htmlFor="item-date-input"
                  className="block text-xs font-medium text-zinc-400 mb-1 flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Date</span>
                </label>
                <input
                  id="item-date-input"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-medium text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  id="submit-expense-btn"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 active:scale-[0.99]"
                >
                  <Check className="w-4 h-4" />
                  <span>Add to Account</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 3. Roommate Accounts (Click a name to view full account) */}
        <div id="roommate-accounts-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              Click Name to View Full Account
            </span>
          </div>

          {/* 3 Interactive Roommate Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {roommates.map((r) => {
              const summary = splitResult.summaries.find((s) => s.id === r.id);
              const isSelected = activeAccount === r.id;
              const count = expenses.filter((e) => e.paidById === r.id).length;

              return (
                <button
                  key={r.id}
                  id={`account-tab-${r.id}`}
                  onClick={() => setActiveAccount(r.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-zinc-800 border-zinc-600 text-white shadow-sm ring-1 ring-zinc-500'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{r.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-300 mt-1">
                    {formatCurrency(summary?.totalPaid || 0)}
                  </div>
                  <span className="text-[10px] text-zinc-500 block">paid total</span>
                </button>
              );
            })}
          </div>

          {/* Full Account Display Card for the Selected Roommate */}
          <div
            id={`active-account-card-${currentPartner.id}`}
            className="bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-sm p-4 sm:p-5"
          >
            {/* Account Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{currentPartner.name}'s Account</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Detailed breakdown of expenses paid by {currentPartner.name}
                </p>
              </div>

              {/* Status Pill */}
              <div>
                {isPositive && (
                  <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                    +{formatCurrency(netBalance)} Above Fair Share
                  </span>
                )}
                {isNegative && (
                  <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/60">
                    -{formatCurrency(Math.abs(netBalance))} Below Fair Share
                  </span>
                )}
                {!isPositive && !isNegative && (
                  <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-300">
                    Exact Fair Share
                  </span>
                )}
              </div>
            </div>

            {/* Two Account Statistics */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                  Total Paid
                </span>
                <span className="text-lg font-bold text-white mt-0.5 block">
                  {formatCurrency(currentSummary?.totalPaid || 0)}
                </span>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">
                  1/3 Share Target
                </span>
                <span className="text-lg font-bold text-zinc-300 mt-0.5 block">
                  {formatCurrency(splitResult.equalShare)}
                </span>
              </div>
            </div>

            {/* Itemized Expenses Paid by this Roommate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-zinc-500" />
                  Items Paid by {currentPartner.name} ({currentItems.length})
                </span>
              </div>

              {currentItems.length === 0 ? (
                <div className="text-xs text-zinc-500 py-6 text-center italic bg-zinc-950/60 rounded-xl border border-zinc-800/60">
                  No expenses added yet by {currentPartner.name}.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80 border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-950">
                  {currentItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 hover:bg-zinc-900/50 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-zinc-200 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {item.date}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-bold text-zinc-100">
                          {formatCurrency(item.amount)}
                        </span>
                        <button
                          onClick={() => setExpenseToDelete(item)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Password Security Modal */}
      <DeletePasswordModal
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleConfirmDelete}
        expense={expenseToDelete}
      />

      {/* Expense Added Success Popup Modal */}
      <AddSuccessModal
        isOpen={!!justAddedExpense}
        onClose={() => setJustAddedExpense(null)}
        expense={justAddedExpense}
        payerName={
          roommates.find((r) => r.id === justAddedExpense?.paidById)?.name || 'Roommate'
        }
      />
    </div>
  );
}
