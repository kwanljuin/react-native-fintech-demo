import { transactionsData } from '@/testData/transactions';
import { Transaction } from '@/models/Transaction';

export async function getTransactions(): Promise<Transaction[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(transactionsData), 1000);
  });
}

export async function getTransactionById(
  id: string,
): Promise<Transaction | null> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = transactionsData.find((t) => t.id === id);
      resolve(transaction || null);
    }, 500);
  });
}
