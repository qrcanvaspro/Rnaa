import { CheckCircle, X, Divide, Calendar, User, ArrowRight } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/calculator';

interface AddSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  payerName: string;
}

export function AddSuccessModal({
  isOpen,
  onClose,
  expense,
  payerName,
}: AddSuccessModalProps) {
  if (!isOpen || !expense) return null;

  const equalThird = expense.amount / 3;

  return (
    <div
      id="add-success-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-100 animate-in zoom-in-95 duration-150 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-emerald-950/50">
          <CheckCircle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-white tracking-tight">
          Expense Added!
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Successfully added to {payerName}'s account
        </p>

        {/* Expense Details Card */}
        <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800/80 my-4 text-left space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Item:</span>
            <span className="text-sm font-bold text-white truncate max-w-[180px]">
              {expense.title}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Total Price:</span>
            <span className="text-base font-black text-emerald-400">
              {formatCurrency(expense.amount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-zinc-800/60">
            <span className="text-zinc-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              Paid by:
            </span>
            <span className="font-semibold text-zinc-200">{payerName}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              Date:
            </span>
            <span className="font-medium text-zinc-300">{expense.date}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-zinc-800/60 bg-emerald-950/20 -mx-3.5 -mb-3.5 p-2.5 rounded-b-xl">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Divide className="w-3.5 h-3.5" />
              1/3 Equal Share:
            </span>
            <span className="font-bold text-emerald-300">
              {formatCurrency(equalThird)} / person
            </span>
          </div>
        </div>

        {/* Done / OK Button */}
        <button
          onClick={onClose}
          id="close-success-popup-btn"
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
        >
          <span>Done</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
