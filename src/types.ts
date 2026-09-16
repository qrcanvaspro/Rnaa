export interface Roommate {
  id: string;
  name: string;
  avatarBg: string;
  textColor: string;
  borderColor: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidById: string;
  date: string;
  category: string;
  receiptUrl?: string;
  receiptFileName?: string;
  notes?: string;
}

export interface Settlement {
  fromId: string;
  toId: string;
  amount: number;
}

export interface RoommateSummary {
  id: string;
  name: string;
  totalPaid: number;
  fairShare: number;
  netBalance: number;
  avatarBg: string;
  textColor: string;
  borderColor: string;
}

export interface SplitCalculationResult {
  totalAmount: number;
  equalShare: number;
  summaries: RoommateSummary[];
  settlements: Settlement[];
}
