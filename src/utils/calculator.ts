import { Expense, Roommate, RoommateSummary, Settlement, SplitCalculationResult } from '../types';

export const DEFAULT_ROOMMATES: Roommate[] = [
  {
    id: 'rohit',
    name: 'Rohit',
    avatarBg: 'bg-emerald-100 text-emerald-800',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-300',
  },
  {
    id: 'nitish',
    name: 'Nitish',
    avatarBg: 'bg-blue-100 text-blue-800',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  {
    id: 'arpit',
    name: 'Arpit',
    avatarBg: 'bg-purple-100 text-purple-800',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Ration & Groceries (Aata, Dal, Oil)',
    amount: 3600,
    paidById: 'rohit',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'Groceries',
    notes: 'Supermarket monthly ration',
  },
  {
    id: 'exp-2',
    title: 'Room WiFi Internet Bill',
    amount: 1200,
    paidById: 'nitish',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'Internet / WiFi',
    notes: 'Monthly high-speed fiber recharge',
  },
  {
    id: 'exp-3',
    title: 'Bijli Bill (Electricity)',
    amount: 1800,
    paidById: 'arpit',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'Utilities',
    notes: 'State electricity board room bill',
  },
];

export const EXPENSE_CATEGORIES = [
  'Groceries (Ration)',
  'Vegetables & Fruits',
  'Internet / WiFi',
  'Bijli / Electricity',
  'Gas Cylinder',
  'Cook / Maid Salary',
  'Drinking Water Can',
  'Food / Snacks',
  'Room Cleaning / Essentials',
  'Other Expense',
] as const;

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function calculateSplits(roommates: Roommate[], expenses: Expense[]): SplitCalculationResult {
  const count = 3; // Fixed 3 room partners: Rohit, Nitish, Arpit
  const totalAmount = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const equalShare = totalAmount / count;

  // Calculate total paid per roommate
  const paidMap = new Map<string, number>();
  roommates.forEach((r) => paidMap.set(r.id, 0));

  expenses.forEach((exp) => {
    const current = paidMap.get(exp.paidById) ?? 0;
    paidMap.set(exp.paidById, current + (Number(exp.amount) || 0));
  });

  const summaries: RoommateSummary[] = roommates.map((r) => {
    const totalPaid = paidMap.get(r.id) ?? 0;
    const netBalance = Math.round((totalPaid - equalShare) * 100) / 100;
    return {
      id: r.id,
      name: r.name,
      totalPaid,
      fairShare: Math.round(equalShare * 100) / 100,
      netBalance,
      avatarBg: r.avatarBg,
      textColor: r.textColor,
      borderColor: r.borderColor,
    };
  });

  // Calculate debt settlements between Rohit, Nitish, Arpit
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  summaries.forEach((s) => {
    if (s.netBalance < -0.01) {
      debtors.push({ id: s.id, amount: Math.abs(s.netBalance) });
    } else if (s.netBalance > 0.01) {
      creditors.push({ id: s.id, amount: s.netBalance });
    }
  });

  const settlements: Settlement[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const settleAmt = Math.min(debtor.amount, creditor.amount);

    if (settleAmt > 0.01) {
      settlements.push({
        fromId: debtor.id,
        toId: creditor.id,
        amount: Math.round(settleAmt * 100) / 100,
      });
    }

    debtor.amount -= settleAmt;
    creditor.amount -= settleAmt;

    if (debtor.amount <= 0.01) dIdx++;
    if (creditor.amount <= 0.01) cIdx++;
  }

  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    equalShare: Math.round(equalShare * 100) / 100,
    summaries,
    settlements,
  };
}

export function generateWhatsAppSummary(
  roommates: Roommate[],
  expenses: Expense[],
  result: SplitCalculationResult
): string {
  const getRoommateName = (id: string) => roommates.find((r) => r.id === id)?.name || id;

  let text = `🏠 *RNA Room Expenses Summary (Rohit, Nitish, Arpit)*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *Total Expenses:* ${formatCurrency(result.totalAmount)}\n`;
  text += `⚖️ *1/3 Equal Share per Person:* ${formatCurrency(result.equalShare)}\n\n`;

  text += `📋 *Individual Accounts:*\n`;
  result.summaries.forEach((s) => {
    text += `• *${s.name}*: Paid ${formatCurrency(s.totalPaid)} | Share: ${formatCurrency(result.equalShare)}\n`;
  });

  text += `\n📝 *Recent Expenses:*\n`;
  expenses.slice(0, 6).forEach((e) => {
    text += `- ${e.title}: ${formatCurrency(e.amount)} (Paid by ${getRoommateName(e.paidById)})\n`;
  });
  if (expenses.length > 6) {
    text += `...and ${expenses.length - 6} more items.\n`;
  }

  return text;
}
