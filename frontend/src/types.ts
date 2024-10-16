// src/types.ts

export interface TransactionFormInputs {
    description: string;
    amount: number;
    date: string;
    category: 'income' | 'expense';
    subCategory: string;
    type: string;
    source: string;
    isParcelado: boolean;
    parcelas?: number;
    notes?: string;
  }
  