export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'debit' | 'credit';
}

export interface GroupedTransactions {
  title: string;
  data: Transaction[];
}
