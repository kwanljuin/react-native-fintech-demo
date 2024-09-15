import { transactionsData } from '@/testData/transactions';
import { Transaction } from '@/models/Transaction';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    // Example:
    // const response = await fetch('https://api.example.com/transactions');
    // if (!response.ok) {
    //   throw new Error(`Error: ${response.status}`);
    // }
    // return await response.json();

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(transactionsData), 1000);
    });
  } catch (error) {
    throw new Error('Failed to fetch transactions');
  }
}

export async function getTransactionById(
  id: string,
): Promise<Transaction | null> {
  try {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction = transactionsData.find((t) => t.id === id);
        resolve(transaction || null);
      }, 500);
    });
  } catch (error) {
    throw new Error('Failed to fetch transaction by id');
  }
}
