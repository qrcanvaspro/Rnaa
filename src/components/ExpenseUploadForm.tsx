import { useState, useRef, useEffect, type FormEvent } from 'react';
import { PlusCircle, Upload, X, Sparkles, ReceiptText, Calendar, Tag, UserCheck, DollarSign } from 'lucide-react';
import { Roommate, Expense } from '../types';
import { EXPENSE_CATEGORIES, formatCurrency } from '../utils/calculator';

interface ExpenseUploadFormProps {
  roommates: Roommate[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  editingExpense?: Expense | null;
  onUpdateExpense?: (expense: Expense) => void;
  onCancelEdit?: () => void;
  defaultPayerId?: string;
}

const QUICK_PRESETS = [
  { label: 'Ration & Groceries', category: 'Groceries (Ration)' },
  { label: 'WiFi Bill', category: 'Internet / WiFi' },
  { label: 'Bijli Bill (Electricity)', category: 'Bijli / Electricity' },
  { label: 'Sabji & Fruits', category: 'Vegetables & Fruits' },
  { label: 'Milk & Bread', category: 'Groceries (Ration)' },
  { label: 'Drinking Water Can', category: 'Drinking Water Can' },
  { label: 'Gas Cylinder', category: 'Gas Cylinder' },
  { label: 'Cook / Maid Salary', category: 'Cook / Maid Salary' },
];

export function ExpenseUploadForm({
  roommates,
  onAddExpense,
  editingExpense,
  onUpdateExpense,
  onCancelEdit,
  defaultPayerId,
}: ExpenseUploadFormProps) {
  const [title, setTitle] = useState(editingExpense?.title || '');
  const [amount, setAmount] = useState<string>(
    editingExpense?.amount ? editingExpense.amount.toString() : ''
  );
  const [paidById, setPaidById] = useState<string>(
    editingExpense?.paidById || defaultPayerId || 'rohit'
  );
  const [category, setCategory] = useState<string>(
    editingExpense?.category || 'Groceries (Ration)'
  );
  const [date, setDate] = useState<string>(
    editingExpense?.date || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(editingExpense?.notes || '');
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>(
    editingExpense?.receiptUrl
  );
  const [receiptFileName, setReceiptFileName] = useState<string | undefined>(
    editingExpense?.receiptFileName
  );
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync default payer if requested from outside
  useEffect(() => {
    if (defaultPayerId && !editingExpense) {
      setPaidById(defaultPayerId);
    }
  }, [defaultPayerId, editingExpense]);

  const parsedAmount = parseFloat(amount);
  const validAmount = !isNaN(parsedAmount) && parsedAmount > 0;
  const equalShareLive = validAmount ? parsedAmount / 3 : 0;

  const selectedPartner = roommates.find((r) => r.id === paidById) || roommates[0];

  const handleFileChange = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or WebP) for the bill receipt.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptUrl(e.target?.result as string);
      setReceiptFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !validAmount) return;

    if (editingExpense && onUpdateExpense) {
      onUpdateExpense({
        ...editingExpense,
        title: title.trim(),
        amount: parsedAmount,
        paidById,
        date,
        category,
        receiptUrl,
        receiptFileName,
        notes: notes.trim() || undefined,
      });
    } else {
      onAddExpense({
        title: title.trim(),
        amount: parsedAmount,
        paidById,
        date,
        category,
        receiptUrl,
        receiptFileName,
        notes: notes.trim() || undefined,
      });

      // Reset form
      setTitle('');
      setAmount('');
      setNotes('');
      setReceiptUrl(undefined);
      setReceiptFileName(undefined);
    }
  };

  return (
    <div
      id="expense-upload-form-card"
      className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden mb-6"
    >
      {/* Card Header */}
      <div className="px-5 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-tight">
              {editingExpense ? 'Saman Edit Karein' : 'Naya Saman & Kharcha Jodein'}
            </h2>
            <p className="text-xs text-stone-600">
              Saman ka naam aur price dalein, Rohit / Nitish / Arpit me se name select karein, date dalein
            </p>
          </div>
        </div>

        {editingExpense && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 px-3 py-1 bg-stone-200 rounded-lg"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Quick Suggestion Chips */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Frequent Room Items (Click to auto-fill):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setTitle(preset.label);
                  setCategory(preset.category);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  title === preset.label
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields: Saman Ka Naam & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Saman Ka Naam */}
          <div>
            <label
              htmlFor="expense-title-input"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1"
            >
              1. Saman Ka Naam (Item Name) *
            </label>
            <input
              id="expense-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Jaise: Ration, Aata, Sabji, WiFi bill..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Price / Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="expense-amount-input"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wide"
              >
                2. Price / Amount (₹) *
              </label>
              {validAmount && (
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {formatCurrency(equalShareLive)} / person (1/3)
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-600">
                ₹
              </span>
              <input
                id="expense-amount-input"
                type="number"
                step="any"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-black text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* 3. Name Select Karein: Rohit, Nitish, Arpit */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>3. Name Select Karein (Kisne Pay Kiya?) *</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {roommates.map((r, idx) => {
              const isSelected = paidById === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  id={`select-payer-${r.id}`}
                  onClick={() => setPaidById(r.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${r.avatarBg} border ${r.borderColor} shrink-0`}
                  >
                    {r.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold text-stone-900 truncate">
                      {r.name}
                    </span>
                    <span className={`block text-[11px] font-semibold ${isSelected ? 'text-emerald-700' : 'text-stone-500'}`}>
                      {isSelected ? `✓ Selected (${r.name} ke account me jayega)` : `Partner ${idx + 1}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Date Select Karein & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date Picker */}
          <div>
            <label
              htmlFor="expense-date-input"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1 flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>4. Date Select Karein (Tarikh) *</span>
            </label>
            <input
              id="expense-date-input"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="expense-category-select"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1 flex items-center gap-1"
            >
              <Tag className="w-3.5 h-3.5 text-stone-500" />
              <span>Category / Kis Cheez Ka Kharcha</span>
            </label>
            <select
              id="expense-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Bill Upload */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
            Bill / Receipt Photo (Upload Optional)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />

          {receiptUrl ? (
            <div className="flex items-center justify-between p-3 bg-stone-50 border border-emerald-300 rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src={receiptUrl}
                  alt="Receipt Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                />
                <div className="text-xs">
                  <span className="font-bold text-stone-900 block truncate max-w-xs">
                    {receiptFileName || 'Uploaded Bill Slip'}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Photo attached
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReceiptUrl(undefined);
                  setReceiptFileName(undefined);
                }}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-xl p-3 text-center cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-center gap-2 text-stone-600 text-xs font-medium">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Agar bill ki photo ho toh yahan upload karein (Optional)</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100">
          <div className="text-xs text-stone-600">
            {validAmount ? (
              <span className="font-medium text-emerald-900">
                Yeh {formatCurrency(parsedAmount)} sidhe <strong>{selectedPartner?.name} ke account</strong> me judega aur 3 se divide ho jayega.
              </span>
            ) : (
              <span>Saman ka naam, price, aur date bhar kar add karein</span>
            )}
          </div>

          <button
            type="submit"
            id="submit-expense-btn"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <ReceiptText className="w-4 h-4" />
            <span>
              {editingExpense
                ? 'Update Karein'
                : `${selectedPartner?.name} Ke Account Me Add Karein`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
