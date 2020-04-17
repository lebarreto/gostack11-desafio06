import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const findTransaction = await transactionsRepository.findOne({
      where: {
        id: id
      }
    });

    if (!findTransaction) {
      throw new AppError('There is no transaction with this ID');
    }

    await transactionsRepository.remove(findTransaction);
  }
}

export default DeleteTransactionService;
