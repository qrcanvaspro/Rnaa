import { useState, useEffect, type FormEvent } from 'react';
import { Lock, AlertCircle, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/calculator';

interface DeletePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expense: Expense | null;
}

const REQUIRED_PASSWORD = '123225';

export function DeletePasswordModal({
  isOpen,
  onClose,
  onConfirm,
  expense,
}: DeletePasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen || !expense) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === REQUIRED_PASSWORD) {
      setError(false);
      onConfirm();
    } else {
      setError(true);
    }
  };

  return (
    <div
      id="delete-password-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 text-zinc-100 animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">
              Password Required
            </h3>
            <p className="text-xs text-zinc-400">
              Enter password to delete this expense
            </p>
          </div>
        </div>

        {/* Expense Info Card */}
        <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800/80 mb-4">
          <div className="text-xs text-zinc-400">Item to Delete:</div>
          <div className="text-sm font-bold text-zinc-200 mt-0.5 truncate">
            {expense.title}
          </div>
          <div className="text-base font-black text-rose-400 mt-0.5">
            {formatCurrency(expense.amount)}
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="delete-password-input"
              className="block text-xs font-medium text-zinc-300 mb-1"
            >
              Enter Password
            </label>
            <div className="relative">
              <input
                id="delete-password-input"
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••••"
                className={`w-full px-3.5 py-2.5 bg-zinc-950 border rounded-xl text-sm font-semibold tracking-wider text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all ${
                  error
                    ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500'
                    : 'border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Incorrect password. Please try again.</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-delete-btn"
              className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
