import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';

import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';

import uploadConfig from '../config/upload';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const filePath = path.join(uploadConfig.directory, filename);
    const csvFile = await csv().fromFile(filePath);
    await fs.promises.unlink(filePath);

    const transactions: Transaction[] = [];

    for (const file of csvFile) {
      const { title, type, value, category } = file;

      const transaction = await createTransaction.execute({
        title,
        type,
        value: Number.parseFloat(value),
        category,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
