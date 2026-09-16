import { X, ExternalLink, Download } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageUrl?: string;
  amount: string;
  paidBy: string;
}

export function ReceiptModal({
  isOpen,
  onClose,
  title,
  imageUrl,
  amount,
  paidBy,
}: ReceiptModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        id="receipt-modal-container"
        className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-base font-semibold text-stone-900">{title}</h3>
            <p className="text-xs text-stone-500">
              Paid by <span className="font-medium text-stone-700">{paidBy}</span> &bull; {amount}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download={`${title.replace(/\s+/g, '_')}_bill.png`}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg transition-colors"
              title="Download receipt"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              id="close-receipt-modal-btn"
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-stone-900/5 flex items-center justify-center max-h-[70vh] overflow-auto">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[60vh] w-auto max-w-full rounded-lg object-contain shadow-sm"
          />
        </div>

        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex justify-between items-center">
          <span>Uploaded Bill / Receipt for 3-way split</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
