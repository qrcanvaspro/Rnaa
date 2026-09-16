import { useState, type FormEvent } from 'react';
import { X, Users, Check } from 'lucide-react';
import { Roommate } from '../types';

interface EditRoommatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  roommates: Roommate[];
  onSave: (updatedRoommates: Roommate[]) => void;
}

export function EditRoommatesModal({
  isOpen,
  onClose,
  roommates,
  onSave,
}: EditRoommatesModalProps) {
  const [names, setNames] = useState<string[]>(roommates.map((r) => r.name));

  if (!isOpen) return null;

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const updated = roommates.map((r, idx) => ({
      ...r,
      name: names[idx]?.trim() || `Partner ${idx + 1}`,
    }));
    onSave(updated);
    onClose();
  };

  return (
    <div
      id="edit-roommates-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        id="edit-roommates-modal-container"
        className="relative max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold text-sm">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">Room Partners (3 People)</h3>
              <p className="text-xs text-stone-500">Edit your roommates' names</p>
            </div>
          </div>
          <button
            id="close-roommates-modal-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <p className="text-xs text-stone-600">
            Total expenses are automatically divided equally (1/3 each) among these three room partners:
          </p>

          {roommates.map((r, idx) => (
            <div key={r.id} className="space-y-1.5">
              <label
                htmlFor={`roommate-input-${r.id}`}
                className="block text-xs font-semibold text-stone-700 uppercase tracking-wide"
              >
                Room Partner {idx + 1}
              </label>
              <div className="relative flex items-center">
                <span className={`absolute left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${r.avatarBg} border ${r.borderColor}`}>
                  {idx + 1}
                </span>
                <input
                  id={`roommate-input-${r.id}`}
                  type="text"
                  required
                  value={names[idx] || ''}
                  onChange={(e) => {
                    const next = [...names];
                    next[idx] = e.target.value;
                    setNames(next);
                  }}
                  className="w-full pl-11 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  placeholder={`Partner ${idx + 1} name`}
                />
              </div>
            </div>
          ))}

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-roommates-btn"
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Names
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
