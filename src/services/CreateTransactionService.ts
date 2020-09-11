import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    let categoryExits = await categoryRepository.findOne({
      where: { title: category },
    });

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome') {
      if (balance.total - value <= 0) {
        throw new AppError('You dot not have money enough');
      }
    }

    if (title === '') {
      throw new AppError('Title vazio!');
    }

    if (!categoryExits) {
      const newCategory = categoryRepository.create({
        title: category,
      });
      categoryExits = newCategory;
      await categoryRepository.save(newCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryExits,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
