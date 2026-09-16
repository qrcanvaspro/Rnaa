import { useState, type FormEvent } from 'react';
import { PlusCircle, Calendar, Tag, Check, Sparkles } from 'lucide-react';
import { Roommate, Expense } from '../types';
import { formatCurrency } from '../utils/calculator';

interface SimpleExpenseFormProps {
  roommates: Roommate[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  selectedPayerId: string;
  onSelectPayer: (id: string) => void;
}

const COMMON_ITEMS = [
  'Ration / Groceries',
  'Sabji & Fruits',
  'Milk & Bread',
  'WiFi Bill',
  'Bijli Bill',
  'Water Can',
  'Gas Cylinder',
];

export function SimpleExpenseForm({
  roommates,
  onAddExpense,
  selectedPayerId,
  onSelectPayer,
}: SimpleExpenseFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;
  const equalShareLive = isValidAmount ? parsedAmount / 3 : 0;

  const currentPayer = roommates.find((r) => r.id === selectedPayerId) || roommates[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !isValidAmount) return;

    onAddExpense({
      title: title.trim(),
      amount: parsedAmount,
      paidById: selectedPayerId,
      date,
      category: 'General Expense',
    });

    setTitle('');
    setAmount('');
  };

  return (
    <div
      id="simple-expense-card"
      className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm mb-6"
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
              Kharcha Add Karein (Enter Details)
            </h2>
            <p className="text-xs text-stone-500">
              Saman, price aur date dalein — automatic uske account me jud jayega
            </p>
          </div>
        </div>

        {isValidAmount && (
          <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            3 Se Divide: {formatCurrency(equalShareLive)} / person
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 text-[11px] font-semibold whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Quick:
          </span>
          {COMMON_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTitle(item)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-stone-600 rounded-lg text-xs transition-all border border-stone-200/80 whitespace-nowrap"
            >
              {item}
            </button>
          ))}
        </div>

        {/* 1. Saman Ka Naam & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label
              htmlFor="saman-naam-input"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1"
            >
              1. Saman Ka Naam *
            </label>
            <input
              id="saman-naam-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Jaise: Ration, Sabji, WiFi bill..."
              className="w-full px-3.5 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="saman-price-input"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1"
            >
              2. Price / Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-stone-500">
                ₹
              </span>
              <input
                id="saman-price-input"
                type="number"
                step="any"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3.5 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-base font-extrabold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* 2. Kisne Pay Kiya? (Select Rohit, Nitish, Arpit) */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
            3. Kiske Account Me Add Karein? (Select Name) *
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {roommates.map((r) => {
              const isSelected = selectedPayerId === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  id={`select-payer-btn-${r.id}`}
                  onClick={() => onSelectPayer(r.id)}
                  className={`py-3 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 font-bold shadow-xs scale-[1.02]'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${r.avatarBg}`}
                    >
                      {r.name.charAt(0)}
                    </span>
                    <span className="text-sm sm:text-base">{r.name}</span>
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {isSelected ? '✓ Selected' : 'Tap to select'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Date Select Karein */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
          <div>
            <label
              htmlFor="saman-date-input"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1 flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>4. Date (Tarikh) *</span>
            </label>
            <input
              id="saman-date-input"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <button
              type="submit"
              id="add-to-account-btn"
              className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Check className="w-5 h-5" />
              <span>{currentPayer.name} Ke Account Me Jodein</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
