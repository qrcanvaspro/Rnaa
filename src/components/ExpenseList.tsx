import { useState, useMemo } from 'react';
import { Search, Filter, Trash2, Edit3, Image as ImageIcon, Calendar, Tag, User } from 'lucide-react';
import { Expense, Roommate } from '../types';
import { EXPENSE_CATEGORIES, formatCurrency } from '../utils/calculator';

interface ExpenseListProps {
  expenses: Expense[];
  roommates: Roommate[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  onViewReceipt: (expense: Expense) => void;
}

export function ExpenseList({
  expenses,
  roommates,
  onDeleteExpense,
  onEditExpense,
  onViewReceipt,
}: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayer, setSelectedPayer] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getRoommate = (id: string) => roommates.find((r) => r.id === id);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPayer =
        selectedPayer === 'all' || exp.paidById === selectedPayer;
      const matchesCategory =
        selectedCategory === 'all' || exp.category === selectedCategory;
      return matchesSearch && matchesPayer && matchesCategory;
    });
  }, [expenses, searchTerm, selectedPayer, selectedCategory]);

  return (
    <div
      id="expenses-history-card"
      className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden"
    >
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-stone-200/80 bg-stone-50/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Uploaded Room Expenses ({expenses.length})
            </h2>
            <p className="text-xs text-stone-600">
              Detailed list of itemized expenses split between all 3 partners
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-600">
              Showing: {filteredExpenses.length} of {expenses.length}
            </span>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Filter by Payer */}
          <div className="relative">
            <select
              value={selectedPayer}
              onChange={(e) => setSelectedPayer(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-stone-700"
            >
              <option value="all">All Roommates (Paid By)</option>
              {roommates.map((r) => (
                <option key={r.id} value={r.id}>
                  Paid by {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Category */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-stone-700"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <div className="py-12 text-center text-stone-500">
          <p className="text-sm font-semibold">No expenses found</p>
          <p className="text-xs text-stone-400 mt-1">
            {expenses.length === 0
              ? 'Add your first room expense using the form above.'
              : 'Try clearing your filters or search terms.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {filteredExpenses.map((exp) => {
            const payer = getRoommate(exp.paidById);
            const perPerson = exp.amount / 3;

            return (
              <div
                key={exp.id}
                id={`expense-item-${exp.id}`}
                className="p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors"
              >
                {/* Left: Info & Meta */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-stone-900">
                      {exp.title}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                      <Tag className="w-3 h-3 text-stone-400" />
                      {exp.category}
                    </span>
                    {exp.receiptUrl && (
                      <button
                        onClick={() => onViewReceipt(exp)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                        title="Click to view uploaded bill receipt"
                      >
                        <ImageIcon className="w-3 h-3 text-emerald-600" />
                        <span>Bill Attached</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-600 flex-wrap">
                    {/* Paid by indicator */}
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          payer?.avatarBg || 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {payer?.name.charAt(0) || 'P'}
                      </span>
                      <span>
                        Paid by <strong className="text-stone-800">{payer?.name || 'Unknown'}</strong>
                      </span>
                    </span>

                    <span>&bull;</span>

                    {/* Date */}
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{exp.date}</span>
                    </span>

                    <span>&bull;</span>

                    {/* 3-way split formula */}
                    <span className="text-emerald-700 font-medium">
                      Split: {formatCurrency(perPerson)} / person
                    </span>
                  </div>

                  {exp.notes && (
                    <p className="text-xs text-stone-500 italic">
                      "{exp.notes}"
                    </p>
                  )}
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-stone-900 block">
                      {formatCurrency(exp.amount)}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Total bill
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      id={`edit-expense-${exp.id}`}
                      onClick={() => onEditExpense(exp)}
                      className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit expense"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      id={`delete-expense-${exp.id}`}
                      onClick={() => onDeleteExpense(exp.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
