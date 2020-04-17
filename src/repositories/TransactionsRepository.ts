import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findIncome = await this.find({
      where: {
        type: 'income'
      }
    });

    const findOutcome = await this.find({
      where: {
        type: 'outcome'
      }
    });

    const income = findIncome.reduce((total, transaction) =>
      total + transaction.value,
      0
    );

    const outcome = findOutcome.reduce((total, transaction) =>
      total + transaction.value,
      0
    );

    const total = income - outcome;
    const balance = { income, outcome, total };

    return balance;
  }
}

export default TransactionsRepository;
