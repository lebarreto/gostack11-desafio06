import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepo = getRepository(Category);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('You dont have enough money to make this transaction.')
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type
    });

    const checkCategory = await categoryRepo.findOne({
      where: {
        title: category
      }
    });

    if (checkCategory) {
      transaction.category_id = checkCategory.id;
      transaction.category = checkCategory;
    } else {
      const createCategory = categoryRepo.create({
        title: category
      });

      await categoryRepo.save(createCategory);

      transaction.category_id = createCategory.id;
      transaction.category = createCategory;
    }

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
