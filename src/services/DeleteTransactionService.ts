import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
// import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    // try {
    //   const transaction = await transactionRepository.find(id);
    //   await transactionRepository.remove(transaction);
    // } catch (error) {
    //   throw new AppError("Don't exists this ID");
    // }

    const transaction = await transactionRepository.findOne(id);
    if (!transaction) {
      throw new AppError("Don't exists this transaction");
    }
    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
